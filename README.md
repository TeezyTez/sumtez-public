# Sumtez

Sumtez 的公开个人网站，包含首页、作品介绍、AI 工具箱与使用指南。

## 部署到 GitHub Pages

本目录是可直接发布的静态网站，无需安装依赖或运行构建命令。将这些文件放在仓库根目录，在仓库的 Pages 设置中选择从 `codex/production` 分支的 `/ (root)` 发布。`.nojekyll` 用于按原样提供静态文件。

页面、脚本、样式和图片使用相对路径，可用于默认项目地址 `/sumtez-public/`，也可部署在自定义域名根目录。规范链接与站点地图使用正式域名 `sumtez.com`；默认 Pages 地址可用于预览与验证。

保留 `tools.html`、`ainovel.html`、`guide.html` 入口。`tools/`、`ainovel/`、`guide/` 中的兼容页会跳转到对应 HTML 页面，并保留查询参数和锚点；禁用 JavaScript 时提供手动打开链接。


## 我的产品

| 展示名称 | 项目仓库 | 介绍页面 |
| --- | --- | --- |
| elselife · 人生复本 | [ainovel](https://github.com/TeezyTez/ainovel) | [产品介绍](ainovel.html) |
| MPCI 申报问答助手 | [DeclarationAssit](https://github.com/TeezyTez/DeclarationAssit) | [产品介绍](declaration.html) |
| 提单识别与 EDI 工作台 | [BL_RECO](https://github.com/TeezyTez/BL_RECO) | [产品介绍](bl-reco.html) |
| 企业字段映射助手 | [EDI-Agent](https://github.com/TeezyTez/EDI-Agent) | [产品介绍](edi-agent.html) |
| 智能体任务工作台 | [Cloud-Agent-Platform](https://github.com/TeezyTez/Cloud-Agent-Platform) | [产品介绍](cloud-agent.html) |
| 规约驱动代码生成 | [codegen-verify](https://github.com/TeezyTez/codegen-verify) | [产品介绍](codegen-verify.html) |

`content.js` 管理公开产品文案，首页从中读取卡片。修改后运行 `node scripts/build-product-pages.mjs`，同步生成其余 5 个静态介绍页与首页无脚本入口；ainovel 介绍页单独维护。运行生成器后提交生成的 HTML 文件，无需安装依赖。

资料于 2026-10-18 按 README 与关键代码核对；每项保留原型/MVP/研究阶段标签，提供源码入口。这里是产品展示网站，没有部署各产品后端，也未复制客户样本或环境配置。
