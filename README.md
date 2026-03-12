# The Lyricis

这是一个基于 React + Vite 构建的个人主页 / GitHub Pages 项目，内容聚焦于 Technical Artist、Game Developer 和 Graphics 方向的作品展示。

## 技术栈

- React 18
- Vite 6
- `motion/react` 动画
- Radix UI 组件
- Figma 导出的静态资源
- GitHub Actions + GitHub Pages 部署

## 本地开发

```bash
npm install
npm run dev
```

默认开发端口在 `vite.config.ts` 中配置为 `3000`。

## 构建

```bash
npm run build
```

构建产物输出到 `build/` 目录。

## 自动部署

项目通过 `.github/workflows/deploy.yml` 自动部署：

- 推送到 `master` 分支后触发
- 执行 `npm install` 和 `npm run build`
- 上传 `build/` 产物到 GitHub Pages

## 目录结构

- `src/App.tsx`: 页面主入口
- `src/components/`: 首页各 section 与交互组件
- `src/assets/`: Figma 导出的图片资源
- `src/supabaseClient.ts`: Supabase 客户端初始化
- `vite.config.ts`: Vite 配置

## 后续可做

- 接入真实联系表单后端或 Supabase
- 压缩大图资源，优化 GitHub Pages 首屏加载
- 为项目详情补全独立页面或真实外链
