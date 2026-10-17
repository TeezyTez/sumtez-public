# Sumtez

Sumtez 的公开个人网站，包含首页、作品介绍、AI 工具箱与使用指南。

## 部署到 GitHub Pages

本目录是可直接发布的静态网站，无需安装依赖或运行构建命令。将这些文件放在仓库根目录，在仓库的 Pages 设置中选择从 `codex/production` 分支的 `/ (root)` 发布。`.nojekyll` 用于按原样提供静态文件。

页面、脚本、样式和图片使用相对路径，可用于默认项目地址 `/sumtez-public/`，也可部署在自定义域名根目录。规范链接与站点地图使用正式域名 `sumtez.com`；默认 Pages 地址可用于预览与验证。

保留 `tools.html`、`ainovel.html`、`guide.html` 入口。`tools/`、`ainovel/`、`guide/` 中的兼容页会跳转到对应 HTML 页面，并保留查询参数和锚点；禁用 JavaScript 时提供手动打开链接。
