import type { ProjectContentMap } from "./types";

const zh: ProjectContentMap = {
  "8": {
    description:
      "一款以解谜推进的黑白视觉小说，通过宇宙恐惧氛围讨论身份与自我映照。",
    longDescription:
      "UNSELF 是一款以解谜推进的视觉小说，画面由颤动的黑白线条构成，像墨迹和阴影在缓慢呼吸。故事发生在带有宇宙恐惧色彩的世界里：主角每天醒来，都会在镜中看到一张不同的脸，于是不断进行微小的调整、遮掩与试探，想确认那个“真正的自己”是否存在。整部作品把重心放在氛围、反射、含混和持续的不安上，让视觉本身也成为叙事的一部分。\n\n亮点:\n- 视觉叙事优先：用颤动线条和“会呼吸”的黑暗传递情绪\n- 解谜 + VN 结构：轻量谜题推动剧情，也强化“映照”主题\n- 宇宙恐惧气质：依靠克制、仪式感和不安，而不是跳吓\n- Jam 交付：在较短时间内完成聚焦范围和整体打磨",
    tags: [
      "解谜 VN",
      "宇宙恐惧",
      "手绘",
      "叙事",
      "Game Jam",
      "独立游戏",
      "实验性",
    ],
    credits:
      "项目成员: Jiliang Ye, Ao Wang, Zhengyang Gu, Yuxi Guo, Hang Wan\n音频: Epidemic Sound（音乐与音效）\n字体: Estonia",
  },
  "9": {
    subtitle: "一款 2D 像素横版动作冒险游戏",
    description:
      "操控一只好奇的小鸡，在色彩明快的世界中探索、战斗并解锁新能力。",
    longDescription:
      "玩家将扮演一只好奇的小鸡，在充满敌人、秘密和新能力的世界里前进。随着关卡推进，你会逐步解锁新的移动与战斗能力，探索更多路径，并在旅途中救出被困的猪伙伴。",
    tags: ["2D", "像素风", "Aseprite", "动作冒险", "探索", "战斗"],
  },
  "7": {
    description:
      "一款 15 天完成的解谜游戏，采用夸张手绘风格和轻喜剧叙事。",
    longDescription:
      "这是一款在 15 天内完成的短篇叙事解谜游戏。作品以手绘、诙谐的视觉风格为基础，让玩家在紧凑的场景中探索、收集线索并解决小型逻辑谜题，推动故事向前。整体重点放在清晰交互、可读构图和节奏明确的喜剧表达上。",
    tags: ["Game Jam", "15 天开发", "2D", "解谜", "叙事", "喜剧", "手绘"],
  },
  "1": {
    subtitle: "个人 Shader 学习库与效果研究集",
    description:
      "一个用于研究渲染基础与实时美术方向的个人 Shader 学习库和效果实验集。",
    longDescription:
      "ShaderFactory 是我的个人 Shader 学习库，用来整理一系列围绕渲染基础和实时美术方向的小型实验。它包含多个可单独复用的效果练习，参数设计尽量直观，方便快速调参和 look-dev。我把它同时当作学习档案和未来项目的可复用工具箱。\n\n亮点:\n- 持续扩展的 Shader 练习与风格化效果集合\n- 面向艺术迭代的参数设计，默认值清晰易用\n- 记录实现思路、变体和踩坑过程，便于复盘和迁移",
    tags: ["Shader Graph", "HLSL", "Unity", "实时渲染"],
  },
  "3": {
    description:
      "基于 Compute Shader 实现的百万粒子模拟系统，支持碰撞和多种力场控制。",
    longDescription:
      "项目实现了一个基于 Compute Shader 的百万粒子模拟系统，包含碰撞检测、力场控制、粒子生成模式，并针对移动端做了实时性能优化。",
    tags: ["Compute Shader", "GPU", "VFX", "优化"],
  },
  "4": {
    description:
      "把 Houdini Digital Asset 工作流接入 Unity，实现可控且高效的程序化地形生成。",
    longDescription:
      "该项目把 Houdini Digital Asset 工作流整合进 Unity，用于快速、可控地生成六边形地形。关键参数通过清晰的界面暴露给使用者，便于在布局、密度和形状上快速迭代，同时保证结果稳定、可复现。\n\n关键特性:\n- 参数化生成：支持尺寸、噪声、衰减和分布的实时调节\n- 结果可复现：基于 seed 的输出保证跨会话稳定\n- 友好的 Unity 工作流：一键烘焙或导出 Mesh 供后续使用\n- 面向美术的控制：参数分组清晰、默认值合理，便于快速调优",
    tags: ["Houdini Engine", "HDA", "Unity", "程序化生成", "VEX"],
  },
  "6": {
    description:
      "一个支持体积雾和软阴影的实时 SDF 光线步进渲染器。",
    longDescription:
      "项目实现了一个基于 SDF 的实时光线步进渲染器，支持体积雾、软阴影和环境光遮蔽，并通过距离场缓存优化，让中端硬件也能接近 60 FPS 运行。",
    tags: ["GLSL", "Ray Marching", "SDF", "实时图形"],
  },
  "10": {
    description:
      "一个围绕现代引擎架构、核心系统实现和编辑器工具展开的个人引擎学习项目。",
    longDescription:
      "Hybrid Engine 是我用来研究现代引擎架构的个人项目，重点在于通过亲手实现去理解运行时系统如何协作、模块边界应该如何划分，以及编辑器工作流如何反向影响底层设计。\n\n关键特性:\n- 运行时基础：日志、事件、输入、窗口管理和主循环\n- OpenGL 渲染后端：基于 framebuffer 的渲染流程和 Scene / Game 双视口\n- 基于 EnTT 的 ECS 架构：支持场景序列化和层级数据\n- 编辑器工具：Docking UI、Hierarchy、Inspector、Scene View、Gizmo 交互与对象拾取\n- 资源管线基础：VFS、注册表、.meta 文件以及纹理、模型、材质、场景的导入流程\n- 基础光照：支持方向光和点光源\n- 初步物理：支持 AABB 碰撞和刚体迭代",
    tags: [
      "C++17",
      "OpenGL",
      "ECS",
      "CMake",
      "引擎开发",
      "编辑器",
      "资源管线",
      "物理",
    ],
  },
};

export default zh;
