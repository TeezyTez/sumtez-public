# Sumtez 网站设计研究与执行依据

研究日期：2026-10-23。范围：中文个人主页、6 个真实项目、32 款 AI 工具和 3 篇实践指南。

本研究读取了参考站的公开页面结构、可提取内容与作者文章，并核对框架和 skills 的官方资料；**不是逐站截图审查，也没有逐一操作参考站的动效**。下文的采用建议是结合 Sumtez 内容与现有源码形成的设计判断，不代表原站使用了相同配色、尺寸或实现。

## 十个原站参考

| 原站 | 本次可确认的结构或内容 | 可用于 Sumtez 的方法 |
| --- | --- | --- |
| [Paco Coursey](https://paco.me/) | 首页分为 Building、Projects、Writing、Now；[Redesign 2021](https://paco.me/writing/redesign-2021) 讨论简化、性能和维护 | 让作品、思考、当前探索各有位置；减少无助于阅读的功能 |
| [Rauno Freiberg](https://rauno.me/) | Craft、Projects、Field Notes 等清晰入口；首页强调速度、一致性和细节 | 将细节质量落实到焦点、点击反馈、对齐和状态一致性 |
| [Emil Kowalski](https://emilkowal.ski/) | Projects 与 Writing 分开；文章直接解释交互实现和取舍 | 项目讲成果，指南讲方法；动效必须有解释状态或反馈动作的目的 |
| [Brittany Chiang](https://brittanychiang.com/) | 个人定位、About、Experience 和项目内容形成可扫描的信息层级 | 让项目职责、阶段、技术与入口容易查找；保留跳到正文等基础能力 |
| [Lee Robinson](https://leerob.com/) | 简短个人介绍，Notes 与 Blogs 提供不同深度的阅读入口 | 简介简洁，短方法与长指南清楚区分，减少首页解释负担 |
| [Maggie Appleton](https://maggieappleton.com/) | Essays、Notes、Patterns 等分类；[数字花园文章](https://maggieappleton.com/garden-history) 强调关联与持续生长 | 项目、工具、指南彼此关联；明确原型与持续更新状态，不假装全部成熟 |
| [basement.studio](https://basement.studio/) | Featured Projects 与 Capabilities 分组，以案例说明能力 | 用代表作证明能力；本项目只取案例组织方式，不照搬工作室规模叙事 |
| [Lusion](https://lusion.co/) | 明确定位为 3D 叙事与交互工作室，展示精选案例与独立 Labs | 保留一个有记忆点的实验图形；沉浸式 3D 不作为工具目录的通行条件 |
| [Bruno Simon](https://bruno-simon.com/) | 作品集采用驾驶探索，公开列出操作、画质、复位等控制 | 趣味交互应有控制与退出方式；Sumtez 的内容入口始终直接可达 |
| [Linear](https://linear.app/) | 首屏产品界面与后续工作流介绍相互印证 | 优先展示真实产品和具体任务；不借用其商业指标或企业口吻 |

作者文章提供了更可靠的取舍依据：Paco 将简单结构与长期维护联系起来；Emil 的 [You Don’t Need Animations](https://emilkowal.ski/ui/you-dont-need-animations) 强调目的、使用频率与感知速度；其 [7 Practical Animation Tips](https://emilkowal.ski/ui/7-practical-animation-tips) 说明即时反馈、合理起点和运动方向。本文的具体数值预算由本项目制定。

## 方向与信息结构

比较轻量编辑式作品集、密集实验室界面、重沉浸式工作室后，选择**编辑式作品集，加入克制的实验图形**。中文内容和真实项目是主角，图形表达好奇心，手机上完整保留阅读与操作能力。

| 颜色角色 | 色值 | 用法 |
| --- | --- | --- |
| 暖纸 | `#f5f3ec` | 页面底色与阅读背景 |
| 墨色 | `#242b26` | 正文、标题、主要信息 |
| 森林绿 | `#29493d` | 主要操作、重点作品区域、链接 |
| 朱红 | `#c64b31` | 少量强调、轨道节点或状态提示 |

- 首屏保留“把好奇心，做成作品”的个人定位，以原创 SVG 轨道图形建立识别度；图形不得阻塞内容。
- 作品区突出真实 ainovel 截图；其他项目可用明确标注的流程概念图，不能伪装成产品截图。
- 首页工具默认展示 **6 款预览**；搜索或筛选作用于 **16 款精选**，完整目录保留 **32 款**。结果计数须说明当前范围，不能把隐藏预览误报成缺失数据。
- 产品页说明问题、用途、当前阶段与源码；工具页帮助选型；指南帮助完成一次任务，三者相互链接。
- 保留全部真实内容、阶段描述、原路由、仓库链接和浏览器存储键；不增加虚构客户、成绩、上线状态或付费入口。
- 收敛重复的英文小标签、非步骤内容编号、装饰箭头和同质卡片；用留白、图文比例与内容密度形成层级。

## 中文排版与响应式规范

- 主标题可用中文衬线，正文采用系统无衬线。建议衬线栈为 `"Songti SC", "Noto Serif CJK SC", serif`；正文为 `system-ui, "PingFang SC", "Microsoft YaHei", sans-serif`。不要为一个字重加载整套中文网络字体。
- 正文桌面约 17px、手机不低于 16px，行高 1.75–1.9；元信息约 13–14px。主标题约 42–96px，章节标题约 28–44px，通过 `clamp()` 连续缩放并实测换行。
- 桌面页面内容宽约 1184px；小屏左右边距 24px。长篇正文限制在约 36–42 个汉字的行宽；390px 手机自然缩为约 20–22 字，不强制两端对齐。
- 中文标题不套用英文大字距；英文缩写只在必要处使用。等宽字体仅服务于少量编号或数值，不用于整段中文。
- 使用中文标点；品牌名和短数值单位尽量不拆开。长网址允许折行，flex 子项设置 `min-width: 0`，避免长标题撑破布局。
- 标题使用有意义的层级；控制自然换行，不为桌面效果给每段文案硬加 `<br>`。按钮以“查看项目”“复制提示词”等明确动作命名。
- 桌面悬停只提供增强反馈，手机不依赖 hover 才能找到入口；键盘焦点清晰，固定导航不遮住锚点或焦点。

## 动效预算

以下为实施上限与目标，需通过本网站的实际页面验证；并非对参考站的测量结果。

| 场景 | 预算 | 行为约束 |
| --- | --- | --- |
| 按钮按压与收藏 | 100–160ms，缩放最低约 0.97 | 状态立即改变；不等待动画完成才响应 |
| 悬停与卡片强调 | 140–220ms，位移不超过 3px | 仅精细指针启用；不让整片网格持续跳动 |
| 弹窗与展开反馈 | 160–240ms，位移不超过 8px | 可中断，起点与触发位置有关系；键盘导航无延迟 |
| 首屏进入 | 至多一组 400–600ms，位移不超过 12px | 内容默认可见；脚本失效不能留下透明页面 |
| 指针响应图形 | 平移不超过 6px，旋转不超过 1° | 仅首屏与精细指针；移出后回归静止 |
| 轨道环境动画 | 仅一处，周期 36–60s | 提供暂停；离屏和页面后台停止；不驱动文字 |
| 搜索和筛选 | 结果立即更新；必要时淡入不超过 120ms | 不逐卡串行入场，不延迟连续输入 |

默认优先 `transform` 与 `opacity`，显式列出过渡属性；避免逐帧改宽高、无限粒子、滚动劫持和全页视差。`prefers-reduced-motion: reduce` 时关闭轨道、指针跟随和入场位移，保留即时状态反馈。长时间自动运动必须可暂停。性能依据见 [Motion 官方指南](https://motion.dev/docs/performance)，可访问性审查依据见下方 Vercel 规则。

## 框架与依赖选择

| 方案 | 收益 | 本轮决策 |
| --- | --- | --- |
| 现有 HTML/CSS/JS | 旧路径与部署简单；搜索、收藏、指南逻辑可复用 | 保留，直接优化结构、视觉与交互 |
| [Astro](https://github.com/withastro/astro) | 组件复用、静态输出、内容集合与 schema | 内容持续扩大后再评估；本轮迁移增加模板、构建和路由验证工作 |
| [Eleventy](https://www.11ty.dev/) | HTML/Markdown 模板与数据生成，适合减少页面重复 | 将来仅需轻量模板化时可选；仍须增加构建步骤并保持 permalink |

Astro 的 [静态优先与按需交互](https://docs.astro.build/en/concepts/why-astro/) 思路适合本项目；[内容集合](https://docs.astro.build/en/guides/content-collections/) 的校验价值主要体现在未来维护。Eleventy 支持 [HTML 输入](https://www.11ty.dev/docs/languages/html/) 与 [明确输出路径](https://www.11ty.dev/docs/permalinks/)。这些框架不会自动产生更好的视觉；现有功能不需要整站应用框架，本轮保留静态可把验证精力放在用户体验上。

动效优先使用 CSS 与原生 Web Animations API。[Motion JS](https://github.com/motiondivision/motion) 可用于普通 HTML，不要求 React；[官方接入文档](https://motion.dev/docs/quick-start) 可供未来复杂弹簧效果使用。[GSAP](https://github.com/greensock/GSAP) 适合确有需要的时间线或 SVG 编排；其 [matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/) 支持断点、减少动态效果与清理。本轮不因参考站使用复杂视觉而引入库。

## 官方 skills 的可应用规则

| 来源 | 提炼规则 | 本项目应用 |
| --- | --- | --- |
| [Anthropic frontend-design](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md) | 以真实主题形成设计，先明确视觉规则，把记忆点集中在一处，构建后截图自查 | 采用明确的暖纸、墨、绿、朱红体系；真实作品支撑内容；减少无意义装饰 |
| [Vercel web-design-guidelines](https://github.com/vercel-labs/agent-skills/blob/main/skills/web-design-guidelines/SKILL.md) | 每次审查获取最新规则，输出可以定位的具体问题 | 核对语义元素、标签、焦点、状态、图片尺寸、长内容和动效降级 |
| [Vercel 实际规则源](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md) | 动作用按钮、导航用链接；异步状态可感知；图片防布局跳动；筛选状态可分享 | 保留本地收藏；复制与搜索结果提供反馈；检查空状态与路径 |
| [GSAP 官方 skills](https://github.com/greensock/gsap-skills) | 时间线、作用域、清理与性能各有明确实现约束 | 作为将来复杂动效参考；当前不安装、不为使用 skill 而新增依赖 |

skills 是工作方法，不是视觉模板。React 专属检查不机械套用到原生页面；生成前明确目标，生成后用真实截图和交互结果检验。所选暖色与衬线组合是本项目已经确定的方向，需靠真实项目、中文排版和原创图形建立区别。

## 可复用原创提示词

以下模板是为 Sumtez 整理的原创执行提示词，可替换具体内容后复用。它把上下文、目标、约束和验收分开；方法依据见 [官方成功标准说明](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview) 与 [提示词原则](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)。

```text
<context>
优化 Sumtez 中文个人网站。访客要了解真实作品、找到适合当前任务的 AI 工具，
并跟着指南完成一次实践。先读取现有内容、页面结构与事件绑定。
</context>
<success>
清楚区分产品、工具箱、使用指南；真实代表作具有明确展示。
首页默认预览6款工具，搜索和筛选覆盖16款精选，完整目录保持32款。
手机与键盘均能完成搜索、收藏、详情查看和提示词复制。
</success>
<design>
使用暖纸#f5f3ec、墨#242b26、绿#29493d、朱红#c64b31。
中文衬线用于重点标题，系统无衬线用于正文；以留白、图文比例建立层级。
用一个原创图形形成记忆点，其他元素服务于阅读与操作。
先说明主要视觉选择如何支持用户任务，再实施。
</design>
<constraints>
保留现有HTML/CSS/JS、真实事实、项目阶段、路由、仓库链接和存储键。
概念图明确标注；不虚构截图、客户、成绩或上线状态。
反馈即时，常用UI动效控制在240ms以内；支持暂停和减少动态效果。
</constraints>
<verify>
检查390、768、1440像素布局、长标题、空结果、键盘焦点和控制台。
操作全部主要入口及收藏、筛选、复制；检查全部旧路由。
截图审查阅读层级、密度、对齐和可读性，修正后交付修改与验证证据。
</verify>
```

## 验收范围

实施后的视觉 QA 与本研究分开记录：桌面和 390px 手机截图、全部产品页、3 篇指南、工具搜索/筛选/收藏/详情/空状态、键盘操作、减少动态效果、脚本语法与站内链接。研究结论不代替这些实际验证，也不预先宣称性能评分或无障碍合规。
