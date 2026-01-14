import React, { useState, useEffect } from 'react';
import { ParticleField } from './components/ParticleField';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { ManifestoSection } from './components/ManifestoSection';
import { AboutSection } from './components/AboutSection';
import { Services } from './components/Services';
import { TechStack } from './components/TechStack';
import { ExperienceTimeline } from './components/ExperienceTimeline';
import { ProjectGallery } from './components/ProjectGallery';
import { ContactSection } from './components/ContactSection';
import { InteractiveFooter } from './components/InteractiveFooter';
import { BackToTop } from './components/BackToTop';
import { RippleDistortion } from './components/shaders/RippleDistortion';
import { Toaster, toast } from 'sonner'; // 确保 import 方式正确
// 1. 引入你创建的客户端
import { supabase } from './supabaseClient'; 

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [themeIndex, setThemeIndex] = useState(0);
  // 2. 准备存储数据的状态 (可选)
  const [dbStatus, setDbStatus] = useState(false);

  // --- 原有的粒子主题循环逻辑 ---
  useEffect(() => {
    setThemeIndex(Math.floor(Math.random() * 5));
    const interval = setInterval(() => {
      setThemeIndex(prev => {
        let next;
        do {
          next = Math.floor(Math.random() * 5);
        } while (next === prev);
        return next;
      });
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  // 3. 新增：静默初始化 Supabase 并在成功时弹出微弱提示
  useEffect(() => {
    async function checkConnection() {
      try {
        // 尝试读取 'posts' 表的第一条数据来验证连接
        const { data, error } = await supabase.from('posts').select('*').limit(1);
        
        if (!error) {
          setDbStatus(true);
          // 使用你已经有的 Toaster 弹出欢迎消息，增加科技感
          toast.success('System Online: Database Synced', {
            description: 'Real-time data stream established.',
            duration: 3000,
          });
        }
      } catch (err) {
        console.error('Supabase connection failed:', err);
      }
    }
    checkConnection();
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-hidden" style={{ background: 'linear-gradient(to bottom, #020C1B 0%, #0A192F 100%)' }}>
      {/* Particle Background */}
      <ParticleField themeIndex={themeIndex} />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Toast Notifications - 保持你精美的样式配置 */}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#0A192F',
            border: '2px solid #64FFDA', // 标志性的青色边框
            color: '#E6F1FF',
          },
        }}
      />
      
      {/* Main Content */}
      <div className="relative z-10">
        <section id="home">
          <Hero onExplore={() => setActiveSection('about')} />
        </section>
        
        <section id="about">
          <AboutSection />
        </section>

        <ManifestoSection />

        <section id="services">
          <Services />
        </section>

        <TechStack />

        <ExperienceTimeline />

        <section id="featured-projects">
          {/* 这里以后可以把 posts 数据传给 ProjectGallery 实现动态展示 */}
          <ProjectGallery />
        </section>

        <section id="contact">
          <ContactSection />
        </section>

        <InteractiveFooter />
        <BackToTop />
      </div>

      {/* 4. 视觉彩蛋：在左下角增加一个小绿点显示数据库连接状态 */}
      <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity">
        <div className={`w-2 h-2 rounded-full ${dbStatus ? 'bg-[#64FFDA] shadow-[0_0_8px_#64FFDA]' : 'bg-red-500'}`} />
        <span className="text-[10px] text-[#64FFDA] font-mono uppercase tracking-widest">
          {dbStatus ? 'DB_CONNECTED' : 'DB_OFFLINE'}
        </span>
      </div>
    </div>
  );
}