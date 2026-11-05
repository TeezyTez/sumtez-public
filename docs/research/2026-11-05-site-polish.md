# 全站细节打磨 · 2026-11-05

本轮延续已确认的浅灰、黑色排印、细线布局。保留首页扫描线、六个作品及详情页的内容和大标题，不引入新框架或鼠标效果。修改在本地完成，未部署或推送。

## 参考及取舍

- [Anthropic frontend-design skill](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md)：让排版与页面内容形成明确层级，尊重已经确认的设计方向。工具箱改为直接的页面标题，目录和笔记采用同一套字体与留白。
- [Vercel web-design-guidelines skill](https://github.com/vercel-labs/agent-skills/blob/main/skills/web-design-guidelines/SKILL.md) 与 [Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines/blob/main/command.md)：用于检查键盘焦点、控件尺寸、表单字号、响应式和 URL 状态。手机导航保留四个入口，主要控件至少 44px，表单使用 16px 字号。
- [Astro Islands](https://docs.astro.build/en/concepts/islands/)：借鉴静态内容配合局部交互的思路。现有原生 HTML/CSS/JS 足以承担站点功能，因此继续保留零依赖构建。
- [Radix Dialog](https://www.radix-ui.com/primitives/docs/components/dialog)：核对弹窗命名、初始焦点、键盘约束、Esc 关闭和触发器焦点恢复。站点继续使用原生 dialog，并完善边框、滚动范围及背景滚动锁定。
- [shadcn/ui Theming](https://ui.shadcn.com/docs/theming)：借鉴语义样式变量，统一页面、正文、次要文字、边框和交互背景色；没有复制组件或增加运行依赖。

上述资料于本轮通过官方页面及官方 GitHub 仓库读取。仅作为设计、实现和检查参考。

## 落实内容

- 新增 `site-polish.css` 作为最后一层共享样式，覆盖首页、六个项目页、完整工具箱和指南。工具箱及指南移除旧 `future*.css` 样式加载；各页主题色与品牌句点统一。
- 手机导航采用两行布局，所有页面保留“关于”。调整小字、触点、输入字号、悬停与焦点状态，统一工具目录、空结果、弹窗、文章与提示词区域。
- 工具箱支持 `q/category/sort/free/zh/favorites` URL 状态。默认值省略，分类及排序校验，保留未知参数和锚点，使用 replaceState 避免每次输入增加历史条目。首页精选筛选不读写 URL，收藏 ID 不写入链接。
- 处理中文输入法组合输入、返回恢复、快速离页及快捷筛选的锚点冲突；初次 pageshow 不覆盖页面加载期间已经输入的内容。
- 指南修改步骤前读取最新保存状态，并同步其他标签页和返回后的进度；保存失败时保留本页进度。首页进度标记随之同步。
- 首页滚动到页尾时正确高亮“关于”，并响应窗口尺寸及历史恢复。

## 实际验证

- 执行无依赖生成器、静态检查、修改脚本语法检查和 `git diff --check`。静态检查包含 13 个 HTML 页面、194 个本地资源/链接、6 个作品、32 个工具（16 个精选）。
- 浏览器确认 320px 下首页、六个项目页、工具箱和写作指南没有横向溢出，导航项均有 44px 高度。390px 检查工具箱与提示词表单；768px 检查首页、工具箱、原型指南和 Cloud Agent 页。桌面检查首页、目录和弹窗；其他两篇指南也已打开检查。
- 工具箱验证：快捷搜索与分类、复合筛选、刷新保持、非法分类/排序回退、保留未知参数与 hash、离页后返回、空结果重置、搜索焦点、收藏和取消收藏。首页搜索不会修改 URL。
- 弹窗验证：打开后聚焦关闭按钮，反向 Tab 仍在弹窗内，Esc 关闭后焦点回到详情按钮；打开时背景锁定滚动。
- 指南验证：两个标签页分别切换不同步骤，两页均呈现合并后的进度，首页标记同步；测试步骤已恢复原值。填写字段同步生成提示词，测试内容已清空。
- 首页页尾“关于”高亮正常。检查的工具箱、指南及首页浏览器日志没有 error/warn。

本轮验证基于本地浏览器和静态文件，未进行跨浏览器矩阵、性能基准或完整无障碍认证；未重新核实工具资料中的价格与更新日期。
