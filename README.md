#  The Lyricis - React + Vite 个人主页

本项目是一个基于 React 和 Vite 构建的现代化网页，通过 Figma 导出 UI，并利用 GitHub Actions 实现全自动构建与部署。

##  开发工作流 (Workflow)

为了保证设计与逻辑同步，遵循以下流程：

### 1. 设计与 UI 同步 (Figma Side)
* **视觉稿设计**：在 Figma 中进行视觉迭代。
* **代码导出**：Figma导出的组件移动至 `src/` 目录。
* **资源引用**：图片等资源通过 `vite.config.ts` 中的路径别名（Alias）进行管理。

### 2. 功能逻辑开发 (Local Side)
* **逻辑接入**：在本地编辑器（如 VS Code）中为 UI 组件挂载业务逻辑。
* **本地预览**：
  ```bash
  npm install
  npm run dev
  ```

### 3. 全自动化部署 (CI/CD)
* **自动触发**：代码推送到 `master` 分支时，GitHub Actions 会自动启动。
* **云端编译**：服务器自动运行 `npm run build`，产物输出至 `build/` 目录。
* **权限配置**：确保 GitHub Settings 中开启了 `Read and write permissions`。

---

##  核心目录结构

- **.github/workflows/deploy.yml**：GitHub Actions 自动化部署脚本。
- **src/assets/**：存放从 Figma 导出的图片资源。
- **vite.config.ts**：Vite 配置文件，定义了构建目标和输出目录。
- **index.html**：单页面应用的入口。

---


##  未来计划

- [ ] 接入 **Supabase** 后端服务以支持动态数据。


