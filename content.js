// Public product facts; never store credentials or private contact information here.
window.SUMTEZ_CONTENT = {
  "brand": "Sumtez",
  "email": "",
  "wechat": "",
  "products": {
    "ainovel": {
      "title": "elselife · 人生复本",
      "category": "ai",
      "type": "AINOVEL / AI 互动小说",
      "sample": false,
      "summary": "走进一个世界，成为故事里的人。用自己的话行动，让选择长出下一段故事，也可以回到某个时刻，尝试另一种人生。",
      "description": "ainovel 是我正在研发的 AI 互动小说产品，界面名称为 elselife · 人生复本。它将阅读、自由行动与故事分支放在一起，让读者参与故事的走向。",
      "sections": [
        [
          "自由参与故事",
          "从预设世界或一句话想法出发，选择角色，写下行动，或继续阅读。"
        ],
        [
          "留下不同的可能",
          "保存当前进展，从历史节点创建分支，导出故事。"
        ],
        [
          "当前状态",
          "可本地运行的开发原型；自由生成需要连接模型，尚未提供公开在线服务或付费购买。"
        ]
      ],
      "detailUrl": "ainovel.html",
      "sourceUrl": "https://github.com/TeezyTez/ainovel",
      "image": "images/ainovel-preview.jpg",
      "demoUrl": "",
      "buyUrl": "",
      "price": "",
      "status": "开发中 · 可本地体验",
      "commit": "a3023dd7a40a8f91924367cb0e9c97025a6c7a3a"
    },
    "declaration": {
      "id": "declaration",
      "repo": "DeclarationAssit",
      "title": "MPCI 申报问答助手",
      "type": "物流知识 / AI 问答",
      "mark": "问",
      "tone": "sand",
      "summary": "把手册里的业务规则，变成可以直接提问的知识助手。用中文或英文梳理申报场景，少翻几次文档，多留一点时间给判断。",
      "flow": [
        "提出问题",
        "检索手册",
        "梳理回答"
      ],
      "status": "RAG 原型 · 自行部署",
      "headline": [
        "让业务问题，",
        "找到知识依据。"
      ],
      "intro": "面向 MPCI 业务的知识问答原型。把手册检索、主题识别与对话放在一起，帮助操作人员理解场景、找到下一步要核对的内容。",
      "audience": "货代、船代与申报操作人员",
      "stack": "Python · FastAPI · ChromaDB",
      "sections": [
        [
          "从业务主题切入",
          "识别提问涉及的业务主题，扩展查询并补齐相关章节，让检索围绕问题展开。"
        ],
        [
          "中英文都能提问",
          "按问题语言组织回答，并结合近期对话保持上下文；提供网页界面和问答 API。"
        ],
        [
          "让回答可以被检查",
          "配套检索与回答评估脚本，检查章节命中、语言和关键词，并生成评估报告。"
        ]
      ],
      "steps": [
        [
          "输入业务问题",
          "从实际遇到的申报场景出发，用中文或英文描述问题。"
        ],
        [
          "检索相关手册",
          "结合主题与向量检索，找到关联段落并补齐必要章节。"
        ],
        [
          "阅读并核对回答",
          "根据检索内容组织回答，再回到手册与当前业务要求进行确认。"
        ]
      ],
      "limits": "这是知识问答原型，不会代替你提交申报。知识来自项目所配置的手册，并非实时同步的官方规则；业务决策仍需核对最新要求。",
      "start": [
        [
          "准备知识与依赖",
          "按照仓库说明准备 Python 环境、手册资料和向量检索依赖。"
        ],
        [
          "配置并启动服务",
          "按需配置模型服务，建立知识索引，再启动本地 Web 界面。"
        ],
        [
          "用实际问题验证",
          "先运行示例与评估脚本，再检查自己的业务问题能否得到有依据的回答。"
        ]
      ],
      "commit": "22c79fa09234b08d58eb9da8fd1a3a76558088b8",
      "evidence": "mpci_qa/rag_engine.py",
      "category": "project",
      "sample": false,
      "detailUrl": "declaration.html",
      "sourceUrl": "https://github.com/TeezyTez/DeclarationAssit",
      "demoUrl": "",
      "buyUrl": "",
      "price": ""
    },
    "bl-reco": {
      "id": "bl-reco",
      "repo": "BL_RECO",
      "title": "提单识别与 EDI 工作台",
      "type": "物流单证 / 信息提取",
      "mark": "单",
      "tone": "blue",
      "summary": "从一张提单开始，把 PDF、图片和文本整理成结构化字段与 EDI 草稿，让重复录入变成可检查的处理流程。",
      "flow": [
        "导入提单",
        "抽取字段",
        "检查草稿"
      ],
      "status": "本地 MVP · 可选模型识别",
      "headline": [
        "把一张提单，",
        "变成可用的数据。"
      ],
      "intro": "给海运单证处理做的一张工作台。将多种格式的提单转成结构化信息，集中查看缺失字段、JSON 结果和报文草稿。",
      "audience": "海运货代、单证与系统对接人员",
      "stack": "Python · Flask · PDF / OCR",
      "sections": [
        [
          "接住不同格式的提单",
          "上传 PDF 或常见图片，也可以粘贴已有文本；图片 OCR 需要额外安装识别依赖。"
        ],
        [
          "规则与视觉识别配合",
          "提取提单号、相关方、船名航次、港口及箱封号等字段，可配置视觉模型辅助识别。"
        ],
        [
          "从字段走向报文草稿",
          "查看结构化 JSON、Flat EDI 与 IFTMCS 风格报文，并检查关键字段的完整程度。"
        ]
      ],
      "steps": [
        [
          "导入提单材料",
          "上传文件或粘贴文本，按需要启用已配置的视觉模型。"
        ],
        [
          "查看抽取结果",
          "检查识别出的字段以及缺失提示，判断哪些信息需要人工核对。"
        ],
        [
          "整理后续对接草稿",
          "查看 JSON 和 EDI 草稿，按目标系统的实际规范继续适配。"
        ]
      ],
      "limits": "EDI 输出是草稿，IFTMCS 风格报文为子集实现；当前没有船司或海关系统推送。字段完整度只表示字段是否存在，不代表识别准确率。",
      "start": [
        [
          "准备本地环境",
          "根据 README 安装 Python 依赖；如需图片 OCR，另行配置 Tesseract。"
        ],
        [
          "选择识别方式",
          "可先走文本与规则解析流程；需要视觉识别时，再配置相应模型服务。"
        ],
        [
          "用脱敏样本检查",
          "启动本地工作台，导入样本，逐项核对字段与报文草稿是否满足你的场景。"
        ]
      ],
      "commit": "a86bb1c1f45f985a33cf3722c7efe35da62f36b0",
      "evidence": "bl_parser.py",
      "category": "project",
      "sample": false,
      "detailUrl": "bl-reco.html",
      "sourceUrl": "https://github.com/TeezyTez/BL_RECO",
      "demoUrl": "",
      "buyUrl": "",
      "price": ""
    },
    "edi-agent": {
      "id": "edi-agent",
      "repo": "EDI-Agent",
      "title": "企业字段映射助手",
      "type": "企业集成 / 字段映射",
      "mark": "⇄",
      "tone": "",
      "summary": "把两套系统的字段说明放在一起，生成可审查的映射与转换产物。将人工确认积累成历史知识，让下一次对接有据可循。",
      "flow": [
        "导入说明",
        "匹配字段",
        "审查导出"
      ],
      "status": "MVP · 自行部署",
      "headline": [
        "让不同系统，",
        "对得上同一种意思。"
      ],
      "intro": "面向系统集成前的字段对齐工作。结合规则匹配与可选模型能力，把源字段、目标字段和人工审核组织成可复用的流程。",
      "audience": "系统集成、数据对接与业务实施人员",
      "stack": "Python · 字段匹配 · 可选模型增强",
      "sections": [
        [
          "从接口与字段说明开始",
          "处理源与目标字段说明，也支持围绕数据库和接口文档建立映射流程。"
        ],
        [
          "组合匹配与人工审查",
          "结合规则匹配，可选知识检索和模型增强；生成的候选映射仍可由人审查确认。"
        ],
        [
          "保存可继续使用的成果",
          "按工作流导出转换文件、Excel 审查表、接口模板或报告，并沉淀已确认的映射知识。"
        ]
      ],
      "steps": [
        [
          "导入源与目标说明",
          "准备两侧字段材料，选择文件转换或数据库与接口映射流程。"
        ],
        [
          "生成候选映射",
          "先完成字段匹配，再按需要加入历史知识与模型辅助。"
        ],
        [
          "审查并导出成果",
          "检查对应关系，下载当前流程的产物，并保存人工确认结果。"
        ]
      ],
      "limits": "这是字段映射与转换 MVP，并非完整的 EDIFACT / X12 处理平台。数据库与接口流程生成模板和报告，不会直接向目标系统推送；不同流程的导出产物有所区别。",
      "start": [
        [
          "准备项目环境",
          "先阅读仓库中的启动说明，安装所需依赖。"
        ],
        [
          "选择一种映射流程",
          "从少量已知字段开始，准备源端与目标端的说明材料；需要模型增强时再进行配置。"
        ],
        [
          "检查映射再导出",
          "核对字段语义与转换结果，保存确认过的映射，逐步扩大样本范围。"
        ]
      ],
      "evidence": "app/services/api_push_workflow.py",
      "category": "project",
      "sample": false,
      "detailUrl": "edi-agent.html",
      "sourceUrl": "https://github.com/TeezyTez/EDI-Agent",
      "demoUrl": "",
      "buyUrl": "",
      "price": "",
      "commit": "66f5acad0a79261b6ec2e92fef575fad1ca03fd6"
    },
    "cloud-agent": {
      "id": "cloud-agent",
      "repo": "Cloud-Agent-Platform",
      "title": "智能体任务工作台",
      "type": "AGENT / 任务编排",
      "mark": "↗",
      "tone": "blue",
      "summary": "把一句自然语言任务，组织成有状态、有过程的 AI 执行流程。连接任务调度、工具调用与运行事件，观察智能体如何推进工作。",
      "flow": [
        "提交任务",
        "调用工具",
        "跟踪过程"
      ],
      "status": "开发原型 · 本地开发",
      "headline": [
        "交给智能体的事，",
        "也看得见过程。"
      ],
      "intro": "一个围绕任务执行的 Agent 平台原型。探索从任务提交到工具调用，再到状态与事件追踪的完整链路，方便开发者观察和调试。",
      "audience": "Agent 开发者与自动化探索者",
      "stack": "Python · 任务调度 · WebSocket",
      "sections": [
        [
          "组织待执行的任务",
          "接收自然语言任务，并结合角色和优先级进入任务调度流程。"
        ],
        [
          "通过工具推进执行",
          "智能体可以调用终端与文件工具，把任务拆成具体的执行动作。"
        ],
        [
          "保留可观察的过程",
          "通过状态接口与 WebSocket 事件查看运行进展、输出和最终结果。"
        ]
      ],
      "steps": [
        [
          "提交任务",
          "给出任务描述，选择相应角色与优先级。"
        ],
        [
          "观察工具执行",
          "查看智能体如何使用本地工具处理任务，调试执行过程。"
        ],
        [
          "追踪状态与结果",
          "结合任务状态和运行事件，了解进展并检查最终输出。"
        ]
      ],
      "limits": "当前任务入口使用本地执行环境，队列与事件总线在内存中，网页搜索仍是占位实现。适合本机开发验证，尚不适合直接作为面向公众的多用户服务。",
      "start": [
        [
          "准备开发环境",
          "按仓库说明安装依赖，阅读任务与工具配置。"
        ],
        [
          "在本机启动验证",
          "配置模型与工具环境，先用可控的小任务检查后端和本地界面连接。"
        ],
        [
          "跟踪一次完整执行",
          "观察任务状态、工具调用与事件输出，确认结果后再扩大任务范围。"
        ]
      ],
      "evidence": "api/__init__.py",
      "category": "project",
      "sample": false,
      "detailUrl": "cloud-agent.html",
      "sourceUrl": "https://github.com/TeezyTez/Cloud-Agent-Platform",
      "demoUrl": "",
      "buyUrl": "",
      "price": "",
      "commit": "9df3ee5bda02b241e8f91554dab9c9840528fc5d"
    },
    "codegen-verify": {
      "id": "codegen-verify",
      "repo": "codegen-verify",
      "title": "规约驱动代码生成",
      "type": "开发研究 / 形式化验证",
      "mark": "✓",
      "tone": "plum",
      "summary": "生成代码之后，再问一句：它满足约束吗？把固定规约、Dafny 验证与反馈修复串成可追溯的实验流程，研究更可靠的 AI 编程方法。",
      "flow": [
        "固定规约",
        "生成与修复",
        "最终验证"
      ],
      "status": "研究原型 · 本地命令行",
      "headline": [
        "让生成的代码，",
        "接受规约的检验。"
      ],
      "intro": "围绕 AI 代码生成与形式化验证的研究项目。把任务约束、候选代码、验证反馈和实验记录放进同一条可追溯流程，研究代码如何在约束下生成与修复。",
      "audience": "AI 编程与形式化验证研究者",
      "stack": "Python · Dafny · 实验记录",
      "sections": [
        [
          "先固定契约与编辑边界",
          "单独生成方法体，检查固定任务资产、模板与受限语法，约束候选代码可修改的范围。"
        ],
        [
          "利用验证反馈继续修复",
          "记录验证诊断，整理反馈与修复目标；候选代码变化后，将旧证据标记为过期。"
        ],
        [
          "记录预算并重验最终文件",
          "保存提示、响应、候选与验证结果，记录调用、token 和时间；最终文件落盘后重新读取并验证。"
        ]
      ],
      "steps": [
        [
          "定义任务与固定契约",
          "先明确目标、模板与允许编辑的范围，保留任务依据。"
        ],
        [
          "生成候选并迭代修复",
          "检查编辑边界，使用 Dafny 诊断组织反馈，再生成新的候选。"
        ],
        [
          "重验最终产物",
          "重新读取最终文件并执行验证，保留完整工件和实验汇总。"
        ]
      ],
      "limits": "这是本地研究原型，尚不能概括为通用仓库生成器。PSM 转换器未实现，当前实验也不足以证明策略优于基线；验证结论受具体规约与任务范围约束。",
      "start": [
        [
          "准备研究环境",
          "按仓库要求准备 Python 3.11+、Dafny 4.11 和项目依赖。"
        ],
        [
          "先熟悉实验流程",
          "运行环境诊断与预检查，先用默认 mock 模式理解任务和工件结构。"
        ],
        [
          "带着预算运行单题",
          "明确模型配置与调用预算，运行单个任务，检查候选、验证日志和汇总。"
        ]
      ],
      "commit": "879ba9b3b79ef5a68d22e30fce1cac00f0ff06fb",
      "evidence": "generation/engine.py",
      "category": "project",
      "sample": false,
      "detailUrl": "codegen-verify.html",
      "sourceUrl": "https://github.com/TeezyTez/codegen-verify",
      "demoUrl": "",
      "buyUrl": "",
      "price": ""
    }
  }
};
