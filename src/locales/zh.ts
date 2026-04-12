import type { Messages } from "./types";

const zh: Messages = {
  navigation: {
    home: "首页",
    about: "关于我",
    services: "个人服务",
    skills: "技术栈",
    projects: "项目展示",
    contact: "联系方式",
    resume: "获取简历",
  },
  hero: {
    viewProjects: "查看项目",
    contact: "联系我",
  },
  about: {
    intro: {
      prefix: "我是一名",
      technicalArtist: "技术美术",
      connector: "，也是",
      gameDeveloper: "游戏开发者",
      suffix: "，主要关注实时项目中的视觉质量、工具效率与性能稳定性。",
    },
    summary:
      "我擅长搭建系统和工作流，减少反复试错的成本，控制帧时间波动，帮助创意团队更稳地从原型走到最终落地。",
    highlights: {
      shaderDevelopment:
        "编写自定义 HLSL/GLSL Shader，建立清晰、可控的视觉风格。",
      gameplayEngineering:
        "搭建稳定的玩法与交互系统，让体验更清楚、更顺手。",
      graphicsResearch:
        "把论文中的图形技术做成可运行、可验证的实时实现。",
      performanceOptimization:
        "通过分析与优化，让项目在目标硬件上稳定运行在 60 FPS 以上。",
      vfxSystems:
        "设计粒子系统与特效方案，兼顾表现力、效率和可维护性。",
      toolAuthoring:
        "编写编辑器工具与辅助流程，缩短美术和技术之间的迭代链路。",
      proceduralGeneration:
        "用程序化方法生成关卡、场景和资源，提高内容生产效率。",
      pipelineArchitecture:
        "梳理并搭建从内容制作到引擎落地的流程，让接入、校验和交付更顺畅。",
    },
  },
  manifesto: {
    eyebrow: "不止是开发者",
    collapsedLead: "Engineering is the discipline;",
    collapsedAccent: "art keeps the curiosity alive.",
    paragraphs: [
      "以艺术滋养技术，用技术实现艺术。工作之外，以绘画、摄影、游戏与电影，打磨审美感知，让每一次观察都沉淀为创作的养分。",
      "摄影捕捉瞬间光影，为渲染注入温度；绘画拆解视觉逻辑，让技术承载美学；游戏与电影则将这份感知，延伸到虚拟世界的构建中。",
      "用技术搭建骨架，用艺术赋予灵魂，让每一份创意，都成为技术与艺术融合的作品。",
    ],
    collapse: "收起",
  },
  services: {
    subtitle: "用技术为创意赋能，让好想法稳定落地为高品质产品。",
    outputLabel: "交付:",
    capabilities: {
      shaderEngineering:
        "视觉渲染技术研发，打造统一、有辨识度的视觉风格与沉浸体验。",
      performanceOps:
        "全链路性能优化，保障产品在全设备上的流畅、稳定运行体验。",
      toolDevelopment:
        "定制化工具研发，提升全流程创作效率，降低试错成本。",
      proceduralTech:
        "程序化内容生成技术，高效构建丰富、高质量的数字内容与场景。",
      renderPipelines:
        "定制化渲染管线与视觉方案，适配产品专属需求，打造极致视觉效果。",
      assetPipelines:
        "端到端内容管线设计，打通创意、技术与生产全链路，保障内容稳定落地。",
    },
    pipeline: {
      discoveryScope: {
        desc: "先明确目标、约束和验收标准，在开发开始前定义帧时间、内存和画面预算。",
        output: "技术摘要 + 预算",
      },
      prototypeBenchmark: {
        desc: "用聚焦型原型验证方案是否可行，并尽早在目标硬件上做基准测试，把风险提前暴露出来。",
        output: "概念验证 + 基准报告",
      },
      implementation: {
        desc: "以模块化方式实现可投入生产的系统，保证接口清晰、易维护、可测试，也方便后续持续迭代。",
        output: "生产系统",
      },
      qualityPerformancePass: {
        desc: "围绕可读性、一致性和帧稳定性做最后一轮打磨，通过性能分析和视觉评审反复校正体验。",
        output: "质量验收版本",
      },
      deliveryHandoff: {
        desc: "交付前补齐文档、使用说明和交接信息，确保团队后续能顺利扩展、维护和排障。",
        output: "已交付功能 + 文档",
      },
    },
  },
  experience: {
    descriptions: {
      "future-3":
        "成长为团队中可靠的技术支点，带领技术美术团队，并参与下一代平台渲染流程的定义。",
      "future-2":
        "把学术训练逐步转化为成熟的工业实践，持续沉淀经得起项目验证的工具链和 Shader 优化经验。",
      "future-1":
        "通过高强度的游戏引擎与 Web 交互图形实习，拓宽行业视野，也补足工程经验。",
      chalmers:
        "攻读硕士学位，重点学习交互设计、游戏设计、游戏开发、高级计算机图形学与实时渲染系统。",
      "funplus-ft":
        "在中央引擎团队负责 Shader 系统与技术美术工具开发，并参与渲染流程优化和自动化建设。",
      "funplus-intern":
        "为手游项目制作特效系统和自定义 Shader，并参与性能分析与优化。",
      seasun:
        "参与 AAA 手游项目的玩法开发与技术实现，同时负责工具开发和系统优化。",
      jilin:
        "系统学习软件工程、计算机图形学、游戏开发与程序化生成等基础内容。",
    },
  },
  projects: {
    categoryLabels: {
      all: "All Projects",
      ta: "Technical Art",
      gamedev: "Game Dev",
      graphics: "Graphics",
    },
    searchPlaceholder: "搜索项目或技术关键词...",
    shuffleTitle: "换一组推荐",
    emptyState: "没有找到符合当前条件的项目。",
    clearFilters: "清空筛选",
    aboutProject: "项目介绍",
    projectCredits: "项目署名",
    technologies: "技术栈",
    sourceCode: "源码",
    liveDemo: "在线体验",
    projectPage: "项目页面",
  },
  contact: {
    title: "Let's Create Something Extraordinary",
    errors: {
      nameRequired: "请填写姓名",
      nameMin: "姓名至少需要 2 个字符",
      emailRequired: "请填写邮箱",
      emailInvalid: "请输入有效的邮箱地址",
      subjectRequired: "请填写主题",
      subjectMin: "主题至少需要 3 个字符",
      messageRequired: "请填写内容",
      messageMin: "内容至少需要 10 个字符",
    },
    toasts: {
      fixErrorsTitle: "请先修正表单错误",
      fixErrorsDescription: "检查所有字段后再试一次",
      openedTitle: "已打开邮件草稿",
      openedDescription: "如果没有自动打开，请直接使用下方邮箱地址。",
    },
    intro:
      "开放各类创意合作与技术交流，无论是项目共创、技术探讨，还是其他有意思的想法，都欢迎随时来信。",
    labels: {
      name: "姓名",
      email: "邮箱",
      subject: "主题",
      message: "内容",
      emailCard: "邮箱",
      location: "所在地",
      availability: "当前状态",
    },
    placeholders: {
      name: "你的名字",
      email: "your@email.com",
      subject: "想聊什么？",
      message: "介绍一下你的项目或需求...",
    },
      buttons: {
        openDraft: "打开邮件草稿",
        opening: "正在打开...",
        draftReady: "草稿已就绪",
        failed: "打开草稿失败",
      },
    meta: {
      responseTime: "一般会在 24 小时内回复",
      locationValue: "瑞典·哥德堡",
      locationAvailability: "可远程，也可现场",
      availableForNewProjects: "目前可接洽新机会",
      availabilityBody:
        "目前可接受自由职业项目和全职机会，尤其关注图形编程、技术美术，以及对实时表现要求较高的工作。",
    },
  },
  footer: {
    email: "邮箱",
    linkedin: "领英",
    copyright: "© 2026 Jiliang Ye · 技术美术 / 游戏开发者",
  },
};

export default zh;
