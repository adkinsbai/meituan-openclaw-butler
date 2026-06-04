# OpenClaw 本地生活全天候私人管家开发文档

## 0. 最终版项目规划总览

项目名：饭点之外

最终定位：

```text
饭点之外，是美团 App 内由平台大 Agent 和个人小 Agent 协作的本地生活主动发现与主动撮合系统。
它在用户没想到美团、没想好做什么、也没人一起玩的时候，主动发现附近机会，低成本撮合兴趣相近的人，并把兴趣变成平台内可预约、可支付、可履约的真实本地生活场景。
```

核心洞察：

- 用户最高频想到美团是在饭点点外卖。
- 其次是在商场、聚会、旅游、应急等场景偶尔使用美团。
- 但美团真实覆盖的服务远多于外卖，很多场景不是用户不需要，而是用户没有意识到“这件事也可以用美团解决”。
- 单人场景解决“我能做什么”，多人场景进一步解决“谁和我一起做”。
- 多人使用美团往往带来更高客单价和更完整的本地生活消费链路。

产品不做什么：

- 不做独立 App。
- 不做硬件助手。
- 不做单纯聊天机器人。
- 不做社交媒体发帖平台。
- 不做功能入口导航。

产品要做什么：

- 嵌入美团 App，作为场景感知智能层。
- 在用户不知道干什么时，推荐附近现在可做的事。
- 在用户一个人玩不起来时，主动帮用户组局。
- 让平台大 Agent 和个人小 Agent 协作，把人、兴趣、时间、地点、预算、商户资源组织成可履约活动。

## 0.1 三层产品能力

### 第一层：场景感知服务唤醒

用户不需要知道美团有哪些功能，只需要表达生活状态。

示例：

```text
我在商场逛着有点累，不知道接下来干嘛。
```

Agent 判断：

- 用户在商场。
- 当前还没到饭点。
- 外面下雨。
- 和朋友同行。
- 状态有点累。

Agent 推荐：

- 热饮，6 分钟可取。
- 17:20 电影，散场后刚好接晚饭。
- 甜品团购，可以坐下聊天。
- 晚饭排队/预订作为后续安排。

关键能力：

```text
场景识别 -> 服务唤醒 -> 解释推荐 -> 用户反馈
```

### 第二层：本地生活发现与可控破圈

用户入口：

```text
我不知道接下来干嘛。
附近有什么可以做的？
帮我找点新鲜但别太离谱的事。
```

Agent 不给功能列表，而是给三档行动建议：

- 稳妥：符合历史偏好。
- 轻破圈：和历史兴趣相邻，新鲜但不离谱。
- 大胆尝试：低风险、低成本、可取消的新体验。

破圈约束：

- 不推荐太远。
- 不推荐太贵。
- 不推荐时间明显不合适。
- 大胆选项必须低风险。
- 每次最多一个大胆选项。

反馈学习：

- 没兴趣：降低该品类权重。
- 下次再说：保留品类但降低当前场景触发频率。
- 收藏：提高相邻品类权重。
- 稳一点：降低探索度。
- 更大胆：提高探索度。

### 第三层：主动组局与服务驱动轻社交

多人场景不是简单的多人推荐，而是主动成局。

Agent 要解决：

- 谁一起去。
- 玩什么。
- 什么时候。
- 去哪里。
- 人均预算多少。
- 是否能预约、买券、AA。
- 是否安全可信。

示例：

```text
今晚一个人也不知道玩啥，有没有人一起玩点什么？
```

Agent 推荐：

```text
我建议组一个 4 人轻桌游局：
- 时间：19:30-21:30
- 地点：岛上桌游望京店
- 预算：人均 68 元
- 熟人优先邀请上次一起玩密室的朋友
- 不够 4 人时，补同商圈桌游兴趣用户
- 成局后可接夜宵团购，人均 88 元
```

核心表达：

```text
不是“发个帖子等人来”，而是“我帮你把今晚这个局成掉”。
```

## 0.2 Agent 架构

最终系统由两类 Agent 协作。

| Agent | 代表谁 | 知道什么 | 负责什么 | 不能做什么 |
| --- | --- | --- | --- | --- |
| 个人小 Agent | 用户主人 | 兴趣、预算、空闲倾向、安全边界、历史同行人 | 保护主人、匿名表达意向、判断活动是否值得推荐 | 不能泄露隐私，不能替主人确认消费 |
| 平台大 Agent | 美团平台 | 商圈资源、商户空位、活动套餐、哪些人可能成局 | 扫描资源、聚类需求、生成候选局、协调商户履约 | 不能绕过个人授权，不能强推高消费 |

关键原则：

```text
大 Agent 负责发现机会，小 Agent 负责保护主人并判断是否值得参与。
```

## 0.3 主动撮合完整流程

```text
平台大 Agent 扫描商圈活动和商户资源
  ↓
向相关个人小 Agent 询问匿名兴趣摘要
  ↓
个人小 Agent 返回授权范围内的偏好、空闲、预算、探索度
  ↓
平台大 Agent 聚类出潜在活动局
  ↓
平台大 Agent 匹配商户、时间、套餐、人数、预算
  ↓
平台大 Agent 生成候选局提案
  ↓
个人小 Agent 分别评估是否适合自己的主人
  ↓
接近成局时，小 Agent 向主人发起确认
  ↓
主人确认
  ↓
平台内完成预约、买券、AA、提醒和安全留痕
```

## 0.4 A2A 协商边界

Agent-to-Agent 可以交换：

- 兴趣标签。
- 商圈级位置。
- 可用时间窗口。
- 预算范围。
- 是否接受陌生兴趣局。
- 安全偏好。

Agent-to-Agent 不允许交换：

- 真实手机号。
- 精确实时位置。
- 家庭住址。
- 支付信息。
- 未授权日程详情。
- 未授权消费承诺。

最终原则：

```text
Agent 可以探索和协商，但最终确认必须由主人完成。
```

## 0.5 黑客松 Demo 主线

建议演示三段，保证既有产品惊喜，也有工程闭环。

### Demo A：个人发现

用户输入：

```text
我不知道接下来干嘛。
```

展示：

- 位置：朝阳大悦城。
- 时间：16:40。
- 天气：下雨。
- 状态：还没到饭点。
- 推荐：热饮、电影、手作香薰。
- 三档探索度：稳妥 / 轻破圈 / 大胆尝试。

### Demo B：平台主动撮合

后台状态：

- 周五 16:00。
- 望京商圈下雨。
- 3 家桌游店今晚有空位。
- 多个小 Agent 表示主人喜欢桌游/密室/轻社交。

平台大 Agent 生成：

```text
4 人轻策略桌游局，19:30-21:30，人均 68 元。
```

个人小 Agent 给用户确认：

```text
这个局适合你，因为你最近收藏过桌游店，距离 2km 内，预算匹配，已有 3 个 Agent 表达兴趣，活动地点是平台可核验商户。
```

### Demo C：成局履约

用户确认后展示：

- 发起邀请。
- 收集 RSVP。
- 锁定桌游店。
- AA 支付。
- 预约成功。
- 推荐后续夜宵团购。

## 0.6 Mock Tool Layer

黑客松阶段使用 Mock CLI 模拟美团服务能力。工具接口如下：

```text
life scene.detect
life service.suggest
life activity.discover
life preference.update
life broker.scan
life broker.poll-agents
life broker.propose-groups
life agent.explore
life a2a.propose
life a2a.negotiate
life group.plan
life group.match
life group.invite
life group.reserve
```

答辩表述：

```text
当前 Demo 使用 Mock Tool Layer，但 Agent 编排、撮合、确认、履约链路是真实可替换的。未来只需要把 Mock 工具替换成美团内部 API。
```

## 0.7 评委记忆点

最短表达：

```text
饭点之外，让美团从“用户搜索服务”升级为“Agent 主动撮合本地生活”。
```

更完整表达：

```text
过去用户只在饭点想到美团。饭点之外让平台大 Agent 主动发现商圈机会，让个人小 Agent 代表用户把关，最终把用户的兴趣、附近的人、商户资源和真实履约能力撮合成一个可确认、可支付、可预约的本地生活局。
```

## 0.8 技术开发计划

### 技术目标

黑客松阶段不追求真实接入美团交易系统，而是做出一个可信的 Agent 编排 Demo：

- 前端能展示美团 App 内嵌 Agent 的产品形态。
- OpenClaw 能调用 Mock Tool Layer。
- Mock Tool Layer 能返回结构化 JSON。
- Demo 能跑通“个人发现”和“平台主动撮合”两条主线。
- 所有关键消费动作都需要用户确认。

### 技术架构

```text
Web Demo
  - 场景卡片
  - 三档探索推荐
  - 平台大 Agent 面板
  - 个人小 Agent 确认卡
  - RSVP / 预约 / AA 状态
  - Tool Log
        |
        v
OpenClaw Agent Runtime
  - Orchestrator
  - Scene Agent
  - Discovery Agent
  - Broker Agent
  - Personal Agent
  - Guardian Agent
        |
        v
Mock Tool Layer CLI
  - life scene.detect
  - life activity.discover
  - life broker.scan
  - life broker.poll-agents
  - life broker.propose-groups
  - life group.reserve
        |
        v
Mock Data
  - user_profile.json
  - service_catalog.json
  - venues.json
  - agent_profiles.json
  - group_proposals.json
```

### 推荐技术栈

前端：

- React + Vite。
- CSS Modules 或普通 CSS。
- lucide-react 图标。
- 本地 mock API 或直接调用 Node CLI 包装接口。

Mock Tool Layer：

- Node.js CLI，命令名 `life`。
- 每个命令输出 JSON。
- 所有 mock 数据放在 `mock-life-tools/data/`。

OpenClaw 接入：

- 将 `life` CLI 注册为 OpenClaw Tools。
- Agent Prompt 中明确工具调用顺序和确认规则。
- 若 OpenClaw 接入时间不够，前端先调用本地 mock API，答辩时展示 Tool Log 和 CLI JSON，保留 OpenClaw 接入位。

### 目录结构

```text
meituan-openclaw-butler/
  DEV_DOC.md
  web-demo/
    package.json
    src/
      App.jsx
      main.jsx
      styles.css
      components/
        SceneCard.jsx
        DiscoveryCard.jsx
        BrokerPanel.jsx
        PersonalAgentCard.jsx
        GroupProposalCard.jsx
        ToolLog.jsx
        RSVPList.jsx
      mock/
        demoRunner.js
  mock-life-tools/
    package.json
    bin/
      life.js
    src/
      commands/
        sceneDetect.js
        activityDiscover.js
        brokerScan.js
        brokerPollAgents.js
        brokerProposeGroups.js
        groupReserve.js
      utils/
        readJson.js
        printJson.js
    data/
      context.json
      user_profile.json
      service_catalog.json
      activities.json
      venues.json
      agent_profiles.json
      group_proposals.json
      reservations.json
  openclaw/
    tools.json
    prompts/
      orchestrator.md
      guardian.md
```

### 开发模块拆分

| 模块 | 目标 | 必须完成 | 可选增强 |
| --- | --- | --- | --- |
| Web Demo | 展示最终产品形态 | 个人发现页、主动撮合页、Tool Log | 动效、移动端外观 |
| Mock CLI | 模拟美团服务能力 | 8 个核心命令输出 JSON | 参数过滤、状态持久化 |
| Agent 编排 | 展示 OpenClaw 调用能力 | 工具调用顺序、确认规则 | 多 Agent 拆分 |
| Mock 数据 | 支撑 Demo 可信度 | 用户画像、商户、活动、Agent 摘要 | 多商圈、多用户 |
| 安全边界 | 防止方案被质疑 | 隐私字段隐藏、确认后执行 | 举报/黑名单/爽约信用 |

### 核心命令优先级

第一优先级，必须实现：

```text
life scene.detect
life activity.discover
life broker.scan
life broker.poll-agents
life broker.propose-groups
life group.reserve
```

第二优先级，有时间再实现：

```text
life service.suggest
life preference.update
life a2a.propose
life a2a.negotiate
life group.invite
life group.match
```

第三优先级，用前端状态模拟即可：

```text
life group.plan
life agent.explore
```

### Demo 数据设计

用户画像：

```json
{
  "user_id": "user_001",
  "interests": ["桌游", "密室", "电影", "茶饮"],
  "negative_interests": ["高强度运动", "太吵的 KTV"],
  "budget_range": "50-100",
  "explore_level": "medium",
  "safety_policy": {
    "known_friends_first": true,
    "allow_interest_matches": true,
    "verified_venue_only": true,
    "hide_identity_until_confirmed": true
  }
}
```

商户资源：

```json
{
  "venue_id": "venue_001",
  "name": "岛上桌游 望京店",
  "type": "board_game",
  "business_area": "望京",
  "rating": 4.8,
  "available_slots": ["19:30-21:30"],
  "capacity": [4, 6],
  "price_per_person": 68
}
```

小 Agent 摘要：

```json
{
  "agent_id": "agent_user_102",
  "positive_tags": ["桌游", "电影"],
  "availability": "available",
  "time_window": "19:00-21:30",
  "budget_range": "50-100",
  "safety_policy": ["verified_venue_only"]
}
```

### 前端页面开发计划

页面 1：个人发现

- 输入：“我不知道接下来干嘛。”
- 展示当前场景：朝阳大悦城、16:40、下雨、还没到饭点。
- 展示三张推荐卡：
  - 稳妥：热饮。
  - 轻破圈：电影。
  - 大胆尝试：手作香薰。
- 展示推荐理由和工具调用链。

页面 2：主动撮合

- 左侧：平台大 Agent 面板。
- 右侧：个人小 Agent 面板。
- 中间：候选组局卡。
- 底部：Tool Log。
- 点击“给主人确认”后展示 RSVP。
- 点击“确认加入”后展示预约成功、AA、夜宵推荐。

页面 3：技术视图

- 展示完整工具调用 JSON。
- 展示隐私字段被隐藏。
- 展示哪些动作需要主人确认。

### OpenClaw Agent 设计

Orchestrator：

- 识别用户当前入口是个人发现还是主动组局。
- 决定调用哪些工具。
- 汇总工具结果生成前端展示结构。

Scene Agent：

- 调用 `scene.detect`。
- 输出场景、信号、需求。

Discovery Agent：

- 调用 `activity.discover`。
- 生成稳妥、轻破圈、大胆尝试三档推荐。

Broker Agent：

- 调用 `broker.scan`、`broker.poll-agents`、`broker.propose-groups`。
- 生成候选局。

Personal Agent：

- 判断候选局是否适合主人。
- 生成“为什么推荐给主人”。

Guardian Agent：

- 检查隐私边界。
- 检查消费确认。
- 检查陌生兴趣局安全规则。

### Guardian 规则

```text
任何预约、买券、支付、AA 动作必须用户确认。
兴趣局默认隐藏真实身份。
成局前只展示商圈级位置。
陌生兴趣局必须绑定平台可核验商户。
夜间偏僻地点不推荐陌生兴趣局。
预算超出用户范围时必须提示。
每次主动提醒必须有明确理由。
```

### 三天开发排期

Day 1：打底

- 搭建 `web-demo`。
- 搭建 `mock-life-tools`。
- 完成 mock 数据。
- 完成核心 CLI：
  - `scene.detect`
  - `activity.discover`
  - `broker.scan`
  - `broker.poll-agents`
  - `broker.propose-groups`
- 前端完成静态布局。

Day 2：闭环

- 前端接入 Mock Tool Layer 或 mock API。
- 完成个人发现流程。
- 完成主动撮合流程。
- 完成 RSVP 和预约成功状态。
- 完成 Tool Log。
- 编写 OpenClaw tool 配置和 Agent Prompt。

Day 3：打磨

- 接入或模拟 OpenClaw 调用链。
- 优化页面视觉。
- 增加隐私/安全边界展示。
- 准备 5 分钟答辩脚本。
- 录制备用 Demo 视频。
- 做一次全流程彩排。

### 最小可交付版本

必须完成：

- 一个可运行 Web Demo。
- 两条可演示流程：
  - 个人发现。
  - 平台主动撮合。
- 至少 6 个 Mock CLI 命令。
- Tool Log 展示 JSON。
- 用户确认后才预约。
- 隐私字段隐藏。

可以不完成：

- 真实美团 API。
- 真实支付。
- 真实用户通讯录。
- 真实消息发送。
- 完整多轮 Agent 记忆。

### 验收清单

- `npm run dev` 能启动前端。
- `life scene.detect` 能输出 JSON。
- `life activity.discover` 能输出三档推荐。
- `life broker.scan` 能输出商圈资源。
- `life broker.poll-agents` 能输出匿名小 Agent 摘要。
- `life broker.propose-groups` 能输出候选局。
- 前端能展示工具调用链。
- 前端能展示“给主人确认”。
- 前端能展示预约成功和 AA。
- 答辩能解释 Mock Tool Layer 可替换为美团内部 API。

## 1. 项目定位

项目名称：饭点之外 / Local Life Butler

一句话定位：

基于 OpenClaw 构建一个本地生活任务编排 Agent，让用户从“主动搜索服务”变成“由 Agent 主动托管生活”。

核心 Demo 场景：

用户加班到晚上 9 点，外面下雨且状态疲惫。用户只说一句“帮我安排一下回家后的事”，Agent 自动读取上下文和个人偏好，完成打车估算、晚餐推荐、早餐补货、按摩预约、睡前提醒，并在用户确认后模拟执行。

## 2. 获奖策略

本项目不做单纯聊天机器人，也不做泛泛的推荐助手，而是突出三个评委容易感知的差异点：

- Agentic：展示上下文获取、意图理解、任务拆解、工具调用、确认执行、状态追踪。
- Local Life：串起外卖、闪购、到店服务、出行估算、提醒等本地生活能力。
- Personal：使用用户画像和长期偏好，让结果体现“私人管家”而不是通用推荐。
- Service Awareness：用户不知道美团能做什么时，Agent 要知道。核心能力不是展示一堆入口，而是在合适场景主动唤醒合适服务。

Demo 必须让评委看到：

- Agent 为什么这样决策。
- Agent 调用了哪些工具。
- 用户确认前不会真实消费。
- 当环境变化时，Agent 能自动重排。

## 2.1 美团服务调研结论

公开资料显示，美团服务可以粗略归纳为以下能力池：

- 餐饮到家：外卖、下午茶、夜宵、品质外卖、拼好饭。
- 餐饮到店：团购、优惠买单、餐厅预订、排队、扫码点餐。
- 即时零售：美团闪购、超市便利、鲜花、宠物、数码、日用品、酒水。
- 医药健康：美团买药、药店、常用药、检测试纸、健康相关商品。
- 酒旅出行：酒店、民宿、景点门票、旅游、机票、火车票、打车。
- 休闲娱乐：电影、KTV、密室、桌游电玩、按摩足疗、美容美发、美甲、瑜伽舞蹈。
- 生活服务：洗车养车、家政维修、充电宝、跑腿帮买/帮送。
- 企业场景：工作餐、差旅、用车、福利发放。

产品洞察：

用户最高频使用的是外卖，其次是在商场、聚会、旅游、应急时偶尔使用到店/酒旅/娱乐等服务。大量服务不是用户不需要，而是用户没有意识到“这个场景也可以用美团解决”。因此本项目的关键不是做功能导航，而是做“场景识别 + 服务唤醒”。

## 2.2 核心产品命题

原始命题：

```text
用户主动打开美团，在一堆功能里找服务。
```

升级命题：

```text
Agent 识别用户当前生活场景，主动判断哪些美团服务可以介入，并只推荐当下最合适的 1-3 个服务。
```

一句话：

饭点之外，是一个能意识到“这件事也可以用美团解决”的本地生活 Agent。

最终产品形态：

饭点之外不是独立 App，也不是硬件助手，而是嵌入美团 App 的场景感知与本地生活发现 Agent。它在用户“不知道要干什么”的时候，根据位置、时间、天气、同行人、预算、历史兴趣和探索意愿，直接给出附近现在可以做的事情。

核心体验：

```text
我不知道接下来干嘛。

Agent：
你现在在朝阳大悦城，16:40，外面下雨，还没到饭点。
我给你 3 个选择：
1. 稳妥：你常去的茶饮，6 分钟可取，适合坐下休息。
2. 轻破圈：17:20 有一场口碑动画电影，你平时看喜剧，这个风格相近但更新鲜。
3. 大胆尝试：5 楼有一个手作香薰体验课，45 分钟，适合雨天室内活动。
```

产品价值：

- 用户不知道美团能做什么时，Agent 主动提出场景化建议。
- 用户不知道自己想做什么时，Agent 帮他把附近生活可能性展开。
- 推荐不只迎合历史偏好，还要用可控方式帮助用户破圈。
- 单人场景解决“我能做什么”，多人场景解决“谁和我一起做”。多人组局比单人消费更高，也更能带动到店、娱乐、餐饮组合消费。

## 2.3 服务唤醒矩阵

Agent 不应该问“你要用哪个功能”，而应该识别场景信号。

| 场景信号 | 用户可能没意识到的问题 | 可唤醒服务 | 推荐策略 |
| --- | --- | --- | --- |
| 加班、下雨、晚归 | 晚餐、通勤、明早早餐都会受影响 | 外卖、闪购、打车、提醒 | 先解决回家和晚餐，再补早餐 |
| 在商场逛街 | 可能有团购券、排队、电影、饮品、停车优惠 | 到店餐饮、电影、茶饮、停车/充电宝 | 根据同行人数和停留时间推荐 |
| 周末不知道去哪 | 用户有空但缺少本地活动方案 | 景点、密室、KTV、桌游、餐厅 | 组合成半日计划 |
| 感冒、肠胃不适 | 用户可能只想到休息，没想到买药/清淡餐 | 买药、外卖、闪购 | 只做低风险建议，避免医疗诊断 |
| 家里缺东西 | 用户可能想到电商，但即时需求更适合闪购 | 闪购、超市便利、跑腿 | 按时效和价格排序 |
| 朋友聚会 | 餐厅、KTV、电影、蛋糕鲜花可能串联 | 到店、KTV、电影、闪购 | 按人数、预算、位置规划 |
| 出差/旅行 | 机酒火、附近餐厅、景点门票、洗衣等分散 | 酒店、机票、火车票、到店、景点 | 按行程节点触发 |
| 车主场景 | 洗车、养车、停车、充电可能被忽略 | 洗车养车、停车、充电 | 结合天气和车辆状态 |

## 2.4 Agent 推荐原则

- 少即是多：每次只推荐 1-3 个高相关服务，不展示功能大全。
- 场景优先：推荐理由必须来自上下文，而不是泛泛“猜你喜欢”。
- 先解决刚需：吃饭、应急、通勤、时间冲突优先级高于娱乐。
- 弱打扰：不确定时只提示“可选”，不要强推。
- 可解释：每个推荐都要说明触发信号，例如“因为你在商场且电影 40 分钟后开场”。
- 可替换：所有服务都通过 Tool Layer 暴露，真实 API 和 Mock CLI 可以互换。
- 偏好 + 破圈：推荐不能只复制用户历史行为，必须保留一个“轻探索”选项。
- 可调探索度：用户可以选择“稳一点 / 新鲜一点 / 大胆一点”。

## 2.5 本地生活发现模式

这是最终项目最应该突出的能力。

用户入口：

```text
我不知道接下来干嘛。
附近有什么可以做的？
帮我找点新鲜但别太离谱的事。
现在这个时间适合去哪？
```

Agent 输出不是功能列表，而是 3 个有差异的行动建议：

```text
稳妥选项：最符合历史偏好，低风险。
轻破圈选项：和历史偏好相邻，但有一点新鲜感。
大胆尝试选项：明显跳出舒适区，但仍满足时间、位置、预算约束。
```

推荐示例：

```text
你现在在朝阳大悦城，16:40，外面下雨，不适合去户外。
我给你 3 个不同探索度的选择：

1. 稳妥：喜茶热饮，6 分钟可取。你最近常点热饮，适合先休息。
2. 轻破圈：17:20 动画电影。你常看喜剧，这部节奏轻松但题材更特别。
3. 大胆尝试：手作香薰体验课，45 分钟。你很少参加体验类活动，但它在商场内、时间短、评价高。
```

## 2.6 破圈推荐机制

破圈不是随机推荐冷门项目，而是在约束内探索。

输入信号：

- 历史偏好：常去品类、常消费价格、常活动时段。
- 当前场景：位置、时间、天气、同行人、疲劳程度。
- 可用服务：附近当前可预约、可购买、可到店的服务。
- 探索度：稳妥、新鲜、大胆。
- 反反馈：用户拒绝过什么、收藏过什么、临时不想做什么。

破圈策略：

| 探索度 | 推荐方式 | 示例 |
| --- | --- | --- |
| 稳妥 | 与历史行为高度相似 | 常喝茶饮，则推荐附近高分茶饮 |
| 轻破圈 | 相邻品类或新店 | 常看喜剧，则推荐轻松动画电影 |
| 大胆 | 新品类但低成本低风险 | 没做过手作课，但推荐 45 分钟体验 |

约束规则：

- 不能推荐距离太远的项目。
- 不能推荐时间明显不合适的项目。
- 不能推荐超出预算太多的项目。
- 大胆推荐必须低风险、可取消或低客单价。
- 每次最多一个大胆选项。

反馈学习：

```text
用户点击“没兴趣”：降低该品类权重。
用户点击“下次再说”：保留品类，但降低当前场景触发频率。
用户点击“收藏”：提高相邻品类权重。
用户点击“想更大胆”：提高探索度。
用户点击“稳一点”：降低探索度。
```

## 2.7 多人组局模式

这是项目的第二个高价值方向。

单人使用美团通常是点外卖、找店、买票。多人使用美团时，消费链路会被放大：

- 一个人喝咖啡，可能是 30 元。
- 三个人桌游 + 晚餐 + 奶茶，可能是 500 元。
- 六个人 KTV + 夜宵 + 打车，可能是 1000 元以上。

但现实问题是：很多局不是没有需求，而是没人发起、没人协调、没人定地点、没人处理预算、没人收集时间。用户往往要去微信群、小红书、朋友圈、豆瓣、Discord 等社媒上找人组局。美团如果只等用户自己成局，就错过了从“服务交易平台”变成“本地活动组织平台”的机会。

多人组局模式的核心命题：

```text
Agent 不只是推荐你去玩什么，而是帮你把人、时间、地点、预算和服务组织成一个可执行的局。
```

更进一步：

每个用户都有自己的本地生活 Agent。Agent 不只是被动等待主人提问，而是代表主人去探索附近活动、发现潜在同伴、判断是否值得推荐，并在必要时和其他用户的 Agent 先进行 A2A 协商。主人不需要在社媒上到处发帖、问人、凑局，而是由 Agent 先完成低成本探索和初步撮合。

```text
人的社交成本很高，Agent 的探索成本很低。
饭点之外要做的不是替人聊天，而是帮人建立更多充分、合适、低压力的本地社交机会。
```

两类组局：

| 类型 | 参与者 | 适用场景 | 风险控制 |
| --- | --- | --- | --- |
| 熟人局 | 通讯录、微信好友、同事、历史同行人 | 吃饭、KTV、电影、桌游、密室、运动 | 低风险，重点解决协调 |
| 兴趣局 | 相同兴趣、同城、同商圈、同时间空闲的人 | 桌游、羽毛球、剧本杀、徒步、手作课、探店 | 高风险，重点解决安全和信用 |

## 2.8 主动成局流程

用户入口：

```text
今晚有人一起打羽毛球吗？
周末想玩桌游，帮我组个局。
我想找人一起探店，但别太远。
今天下雨，找个室内活动组局。
```

Agent 流程：

```text
识别活动意图
  ↓
读取用户兴趣、预算、位置、可用时间
  ↓
搜索附近可组局活动和商户
  ↓
匹配潜在参与者
  ↓
生成组局方案
  ↓
发起邀请 / 发布兴趣局
  ↓
收集 RSVPs
  ↓
根据人数锁定商户套餐、场次或预约
  ↓
成局后提醒、导航、支付/AA
```

A2A 主动成局流程：

```text
用户 Agent 发现主人今晚可能有空
  ↓
扫描附近活动和可成局服务
  ↓
根据主人的兴趣、预算、安全偏好筛选候选局
  ↓
向其他用户 Agent 发出轻量询问
  ↓
其他 Agent 根据各自主人的偏好和空闲状态返回意向
  ↓
多个 Agent 协商活动、时间、地点、人数、预算
  ↓
达到成局阈值后，各自给主人展示“推荐参加”的理由
  ↓
主人确认
  ↓
平台内完成预约、买券、AA、提醒和安全留痕
```

组局方案示例：

```text
我发现你最近收藏了 3 家桌游店，也常在周五晚上有空。
今晚 19:30 朝阳大悦城附近有两家桌游店还有位。

我可以帮你发起一个 4 人局：
- 活动：轻策略桌游 2 小时
- 地点：岛上桌游 朝阳大悦城店
- 时间：19:30-21:30
- 预算：人均 68 元
- 可接晚餐：结束后 5 楼有日料团购，人均 92 元

可邀请：
1. 熟人：张三、李四，上次和你一起玩过密室。
2. 兴趣匹配：同商圈 3 位桌游兴趣用户，信用分正常，今晚可约。
```

## 2.9 兴趣局安全边界

陌生人组局必须做安全设计，否则很容易被评委质疑。

必要规则：

- 默认优先熟人局，兴趣局需要用户主动开启。
- 兴趣局只展示昵称、兴趣标签、信用/活跃状态，不展示真实手机号和详细住址。
- 成局前不暴露精确个人位置，只暴露商圈级位置。
- 仅推荐平台内可核验商户、可预约活动、可留痕订单。
- 支持女生局、同龄局、公司同事局、只熟人可见等安全模式。
- 支持举报、黑名单、爽约扣信用。
- 高风险场景不做陌生人局，例如夜间偏僻地点、非平台商户、私人住址。

兴趣局推荐话术要克制：

```text
我可以帮你发起兴趣局。默认只匹配同商圈、同兴趣、平台信用正常的用户，并且活动地点限定在平台可核验商户。
```

## 2.10 组局比推荐更适合美团

推荐只解决一个人的下一步，组局可以创造新的消费需求。

商业价值：

- 提高客单价：多人套餐、包间、电影连座、KTV、桌游、密室、运动场馆。
- 提高到店转化：Agent 不只是推荐店，而是把人凑齐。
- 拓展美团使用场景：从饭点外卖扩展到社交、娱乐、周末活动。
- 降低用户组织成本：不用在其他社媒反复拉人、问时间、问预算。
- 建立本地兴趣关系：美团可以成为同城轻社交的服务入口，但交易和安全仍留在平台内。

最适合黑客松展示的组局场景：

```text
周五 16:30，用户在公司附近，说“今晚不知道干嘛，有没有人一起玩点什么？”

Agent：
你今晚 19:00 后空闲，附近下雨，适合室内活动。
我给你组一个轻桌游局：
1. 熟人优先：邀请上次一起密室的 2 位朋友。
2. 不够 4 人时，补 1-2 位同商圈桌游兴趣用户。
3. 地点选择 2 公里内评分 4.8 的桌游店。
4. 成局后自动锁定 19:30-21:30 时段。
5. 可选接晚餐团购，人均 88 元。
```

边界定位：

饭点之外不是要把美团做成社交媒体，而是做“服务驱动的轻组局”。社媒的核心是内容和关系，美团的核心是本地服务和履约。Agent 负责在用户有兴趣但缺人、缺地点、缺组织成本时，把一个潜在活动变成平台内可预约、可支付、可履约的真实消费场景。

产品表达：

```text
不是“发个帖子等人来”，而是“我帮你把今晚这个局成掉”。
```

组局成功标准：

- 有明确活动。
- 有明确时间。
- 有明确地点。
- 有预算和人数上限。
- 有平台内可验证商户或服务。
- 有 RSVP 状态。
- 有成局后的预约/买券/订座/购票动作。

## 2.11 A2A 社交撮合机制

A2A 指 Agent-to-Agent。每个 Agent 代表自己的主人，先替主人完成低成本探索和初步沟通。

为什么需要 A2A：

- 人主动约人有心理成本，Agent 先问不会尴尬。
- 人很难同时协调多人时间，Agent 可以快速交换约束。
- 人不知道谁也想玩，Agent 可以根据兴趣和空闲状态发现潜在同伴。
- 平台可以把活动、商户、时间、人数、预算直接纳入协商。

Agent 可以交换的信息：

```json
{
  "intent": "looking_for_group_activity",
  "interest_tags": ["桌游", "轻策略", "密室"],
  "available_time": "19:30-22:00",
  "business_area": "望京",
  "budget_per_person": "50-100",
  "group_preference": {
    "known_friends_first": true,
    "allow_interest_matches": true,
    "max_group_size": 4
  },
  "safety_preference": {
    "verified_venue_only": true,
    "hide_exact_location": true,
    "hide_real_contact": true
  }
}
```

Agent 不允许交换的信息：

- 真实手机号。
- 精确实时位置。
- 家庭住址。
- 身份证、支付信息等敏感信息。
- 未经主人授权的日程详情。
- 未经主人授权的消费承诺。

A2A 协商结果示例：

```json
{
  "proposal_id": "proposal_board_game_001",
  "activity": "轻策略桌游",
  "venue": "岛上桌游 望京店",
  "time": "19:30-21:30",
  "group_size": 4,
  "matched_agents": ["agent_a", "agent_b", "agent_c"],
  "price_per_person": 68,
  "confidence": 0.84,
  "why_recommend_to_owner": [
    "你最近收藏过桌游店",
    "地点在 2km 内",
    "已有 2 人确认感兴趣",
    "预算符合你的历史消费区间",
    "活动在平台可核验商户内"
  ],
  "requires_owner_confirmation": true
}
```

A2A 权限原则：

- Agent 可以探索，不可以替主人最终承诺。
- Agent 可以表达匿名意向，不可以暴露真实身份。
- Agent 可以协商候选方案，不可以直接支付。
- Agent 可以给主人推荐成局机会，不可以强制打扰。
- 所有组局最终都必须由主人确认。

## 2.12 平台大 Agent 与个人小 Agent

最终系统不应该只有用户自己的 Agent，还应该有一个平台级大 Agent。

角色划分：

| 角色 | 代表谁 | 核心职责 | 不应该做什么 |
| --- | --- | --- | --- |
| 个人小 Agent | 用户主人 | 维护个人兴趣、预算、安全边界、空闲倾向，代表主人探索和表达匿名意向 | 不替主人最终承诺，不泄露隐私 |
| 平台大 Agent | 美团平台 | 汇总匿名兴趣需求、发现成局机会、协调商户资源、生成活动提案、向个人 Agent 发起询问 | 不绕过个人授权，不强推高消费 |

核心逻辑：

```text
个人小 Agent 知道“我的主人喜欢什么、什么时候可能有空、能接受什么预算”。
平台大 Agent 知道“这个城市/商圈有哪些人可能想玩、有哪些商户资源、哪些活动能成局”。

大 Agent 负责发现机会，小 Agent 负责保护主人并判断是否值得参与。
```

## 2.13 大 Agent 主动撮合流程

平台大 Agent 定期进行低打扰撮合，不等待用户主动发起。

```text
平台大 Agent 扫描商圈活动和商户资源
  ↓
向相关个人小 Agent 询问匿名兴趣摘要
  ↓
个人小 Agent 返回主人授权范围内的偏好、空闲、预算、探索度
  ↓
平台大 Agent 聚类出潜在活动局
  ↓
平台大 Agent 与商户资源匹配：场地、套餐、时段、人数
  ↓
平台大 Agent 生成候选局提案
  ↓
个人小 Agent 分别评估是否适合自己的主人
  ↓
达到最低成局人数后，各小 Agent 向主人发起确认
  ↓
主人确认后，平台完成预约、买券、AA、提醒、安全留痕
```

例子：

```text
周五 16:00，平台大 Agent 发现望京商圈：
- 下雨，户外活动不适合。
- 3 家桌游店 19:30-21:30 有空位。
- 2 家 KTV 有 4-6 人套餐。
- 12 个用户的小 Agent 表示主人近期对桌游/密室/轻社交感兴趣。

大 Agent 生成两个候选局：
1. 4 人轻策略桌游局，人均 68 元。
2. 6 人 KTV + 夜宵局，人均 128 元。

然后分别发给相关小 Agent 判断：
你的主人是否可能感兴趣？是否接受这个时间、预算、人数和活动类型？
```

## 2.14 大 Agent 询问小 Agent 的协议

平台大 Agent 不直接问用户隐私，只问小 Agent 的授权摘要。

请求示例：

```json
{
  "request_id": "broker_req_001",
  "business_area": "望京",
  "time_window": "19:00-22:00",
  "candidate_activity_types": ["board_game", "ktv", "movie", "badminton"],
  "budget_ranges": ["50-100", "100-150"],
  "group_sizes": [4, 6],
  "venue_policy": "verified_venue_only",
  "privacy_level": "anonymous_summary_only"
}
```

小 Agent 返回：

```json
{
  "agent_id": "agent_user_001",
  "owner_interest_summary": {
    "positive_tags": ["桌游", "密室", "轻社交"],
    "negative_tags": ["高强度运动", "太吵的 KTV"],
    "explore_level": "medium"
  },
  "availability_summary": {
    "status": "possibly_available",
    "time_window": "19:30-22:00"
  },
  "budget_summary": {
    "acceptable_range": "50-100"
  },
  "safety_policy": {
    "known_friends_first": true,
    "allow_interest_matches": true,
    "verified_venue_only": true,
    "hide_identity_until_owner_confirms": true
  },
  "response_type": "anonymous_interest"
}
```

注意：

- 小 Agent 返回的是“兴趣摘要”，不是完整用户画像。
- 小 Agent 可以拒绝响应。
- 大 Agent 只能生成候选提案，不能替用户确认。
- 主人确认前，其他人只看到匿名兴趣标签。

## 2.15 大 Agent 的撮合策略

撮合目标不是“尽量凑人”，而是“凑成体验质量高、风险低、履约稳定的局”。

评分维度：

| 维度 | 含义 |
| --- | --- |
| 兴趣匹配 | 参与者兴趣是否接近 |
| 时间匹配 | 是否都在同一时间窗口可参与 |
| 地理匹配 | 是否在同一商圈或合理距离内 |
| 预算匹配 | 人均价格是否在接受范围内 |
| 安全匹配 | 是否满足熟人优先、同性局、平台商户等安全条件 |
| 商户可履约 | 场地、套餐、票务、预约是否可用 |
| 体验互补 | 是否有人数结构、活动偏好、社交强度上的互补 |

成局阈值：

```text
兴趣匹配 >= 0.75
时间匹配 >= 0.8
地理距离 <= 3km
预算均在可接受范围
至少达到最低成局人数
商户资源可锁定
所有参与者主人最终确认
```

高价值高光：

```text
大 Agent 不是在做推荐，而是在做城市级本地生活资源调度：
把人、兴趣、商户、时间、预算和安全边界统一协调起来。
```

## 2.16 Agent 主动探索策略

Agent 不应只在用户输入时工作。它可以在低打扰模式下主动探索。

触发时机：

- 周五下午，用户晚上没有日程。
- 用户到达商场但停留超过 20 分钟。
- 用户收藏过某类活动但长期没有消费。
- 附近出现高匹配活动或临时优惠。
- 有其他 Agent 正在发起和用户兴趣匹配的局。

探索输出分级：

| 等级 | 行为 | 示例 |
| --- | --- | --- |
| 静默记录 | 不打扰用户，只更新候选机会 | 附近有桌游局，但匹配度一般 |
| 轻提示 | 首页卡片展示，不推送 | “今晚有 2 个室内活动适合你” |
| 主动提醒 | 高匹配且时效强时提醒 | “你收藏的羽毛球馆 19:30 缺 1 人” |
| 请求确认 | 已接近成局但需要用户授权 | “已有 3 人，是否加入并锁定场地？” |

主动探索的反打扰规则：

- 每天主动提醒不超过 1-2 次。
- 用户连续忽略后降低频率。
- 夜间不推陌生兴趣局。
- 不在用户明确忙碌时打扰。
- 推荐必须有明确理由和可立即执行动作。

## 3. 最小可赢版本

只实现一个完整闭环：

1. 用户输入：“我今天加班到 9 点，有点累，帮我安排一下回家后的事。”
2. Agent 调用 `context.get` 获取天气、时间、地点、日程。
3. Agent 调用 `profile.get` 获取口味、预算、家庭地址、健康状态。
4. Agent 调用多个本地生活 Mock Tools 搜索方案。
5. Agent 生成可解释计划。
6. 用户点击确认。
7. Agent 调用订单/预约/提醒工具模拟执行。
8. 模拟“晚餐配送延迟 20 分钟”，Agent 自动重排为更快送达的备选餐厅。

## 3.1 更有记忆点的 Demo 结构

主 Demo 仍然使用“加班下雨回家”，因为它最容易打穿闭环。但演示时要额外展示一个 30 秒的“饭点之外”高光场景，让评委理解这个项目不是外卖助手。

推荐高光场景：商场游逛服务唤醒。

用户说：

```text
我和朋友在商场逛着有点累，接下来不知道干嘛。
```

Agent 不应该只推荐餐厅，而是先识别上下文：

```json
{
  "location": "朝阳大悦城",
  "companions": 2,
  "time": "16:40",
  "state": ["in_mall", "tired", "no_next_plan"],
  "weather": "rain",
  "meal_state": "not_dinner_time"
}
```

Agent 推荐：

```text
现在还没到饭点，我不建议立刻安排正餐。我给你们找了 3 个更合适的选择：
1. 先买两杯热饮，附近 6 分钟可取。
2. 17:20 有一场电影，刚好休息 2 小时，散场后可以接晚饭。
3. 如果想聊天，5 楼有一家双人甜品团购，比现场买单便宜 18 元。
```

这个场景的意义：

- 体现“饭点之外”。
- 体现 Agent 知道美团不仅能点外卖。
- 体现 Agent 能按时间、位置、状态唤醒电影、茶饮、甜品团购。
- 比“功能列表”更像私人管家。

## 3.2 多场景 Demo 备选

如果时间足够，可以在前端准备 4 个快捷场景按钮，不一定全部接真实链路，但每个要展示服务唤醒逻辑。

### 场景 A：加班下雨回家

触发信号：

- 晚归
- 下雨
- 疲惫
- 明早有会

服务唤醒：

- 外卖
- 闪购
- 打车估算
- 到家按摩
- 睡前提醒

推荐话术：

```text
你现在需要的不是单独点一份饭，而是把回家后的生活链路托管掉。
```

### 场景 B：商场逛累了

触发信号：

- 用户在商场
- 还没到正餐时间
- 同行 2 人以上
- 下雨不适合出商场

服务唤醒：

- 茶饮
- 甜品团购
- 电影
- KTV/桌游
- 晚餐排队

推荐话术：

```text
现在不是饭点，我优先推荐休息和过渡活动，等到 18:30 再切换到晚餐方案。
```

### 场景 C：家里临时缺东西

用户说：

```text
明早要早起开会，家里好像没牛奶了。
```

服务唤醒：

- 闪购
- 超市便利
- 跑腿
- 早餐外卖预约

推荐话术：

```text
这个需求不适合等电商配送，我优先找 1 小时内能送到的闪购商品。
```

### 场景 D：轻微不舒服

用户说：

```text
今天有点感冒，不想出门，也不想吃太油。
```

服务唤醒：

- 美团买药
- 清淡外卖
- 闪购体温计/口罩

边界：

Agent 不能做诊断，只能提示：

```text
我不能判断病情，但可以帮你准备常用物品和清淡饮食。如症状严重，请及时就医。
```

### 场景 E：朋友突然来家里

用户说：

```text
朋友晚上突然来我家，帮我准备一下。
```

服务唤醒：

- 外卖多人套餐
- 酒水饮料闪购
- 桌游/零食
- 跑腿

推荐话术：

```text
我会按“先到先用”的顺序安排：饮料零食 30 分钟内到，正餐 18:50 前到。
```

## 4. 系统架构

```text
Frontend Demo
  - Chat Panel
  - Timeline Panel
  - Decision Panel
  - Execution Checklist
        |
        v
OpenClaw Agent
  - Context Agent
  - Intent Agent
  - Planner Agent
  - Tool Agent
  - Guardian Agent
        |
        v
Mock Tool Layer CLI
  - life scene.detect
  - life service.suggest
  - life activity.discover
  - life preference.update
  - life broker.scan
  - life broker.poll-agents
  - life broker.propose-groups
  - life agent.explore
  - life a2a.propose
  - life a2a.negotiate
  - life group.plan
  - life group.match
  - life group.invite
  - life group.reserve
  - life context.get
  - life profile.get
  - life ride.estimate
  - life food.search
  - life food.order
  - life grocery.search
  - life grocery.order
  - life service.search
  - life service.book
  - life reminder.create
        |
        v
Mock Data
  - context.json
  - profile.json
  - foods.json
  - groceries.json
  - services.json
  - orders.json
```

## 5. Agent 设计

### 5.1 Context Agent

职责：

- 获取当前时间、天气、位置、用户地址、明日会议。
- 判断场景状态：下雨、晚归、疲劳、明早有会。

输入：

```json
{
  "user_message": "我今天加班到 9 点，有点累，帮我安排一下回家后的事。"
}
```

调用工具：

```bash
life context.get
```

输出示例：

```json
{
  "time": "2026-06-04 21:00",
  "weather": "rain",
  "office": "望京 SOHO",
  "home": "朝阳区某小区",
  "next_calendar": "明早 09:00 产品评审会",
  "state": ["late_work", "rain", "tired", "early_meeting_tomorrow"]
}
```

### 5.2 Intent Agent

职责：

- 不把用户意图理解成“点外卖”。
- 将真实目标识别为“减少疲惫状态下的生活决策成本”。

输出示例：

```json
{
  "primary_goal": "托管回家后的生活安排",
  "constraints": ["省心", "准时", "清淡", "预算适中", "明早不能太晚睡"],
  "required_tasks": ["ride", "dinner", "breakfast", "reminder"],
  "optional_tasks": ["massage"]
}
```

### 5.3 Planner Agent

职责：

- 将目标拆解为可执行任务。
- 生成工具调用计划。
- 保证消费类动作进入确认流程。

规划示例：

```json
[
  {
    "task": "ride",
    "tool": "life ride.estimate",
    "reason": "下雨且晚归，打车优先"
  },
  {
    "task": "dinner",
    "tool": "life food.search",
    "reason": "用户疲惫，选择清淡且到家后能送达的晚餐"
  },
  {
    "task": "breakfast",
    "tool": "life grocery.search",
    "reason": "明早 9 点有会，提前补早餐"
  },
  {
    "task": "massage",
    "tool": "life service.search",
    "reason": "用户最近肩颈不适，提供可选放松服务"
  }
]
```

### 5.4 Tool Agent

职责：

- 执行 Mock CLI。
- 解析 JSON。
- 把工具结果交给 Planner 汇总。

### 5.5 Guardian Agent

职责：

- 所有涉及下单、预约、支付的动作必须用户确认。
- 检查预算上限。
- 检查是否包含用户忌口。
- 异常时触发重排。

规则：

```text
若工具为 *.order 或 *.book，必须等待用户确认。
晚餐价格不得超过 profile.budget_dinner。
餐品不得包含 profile.avoid 中的忌口项。
若配送 ETA 晚于用户到家后 20 分钟，重新搜索备选。
```

## 6. Mock CLI 设计

CLI 名称：`life`

建议用 Node.js 实现，输出统一为 JSON，便于 OpenClaw 解析。

目录结构：

```text
mock-life-tools/
  package.json
  bin/
    life.js
  data/
    service_catalog.json
    scene_rules.json
    activities.json
    agent_profiles.json
    a2a_proposals.json
    broker_requests.json
    group_proposals.json
    friends.json
    interest_users.json
    group_venues.json
    context.json
    profile.json
    foods.json
    groceries.json
    services.json
    orders.json
```

### 6.0 scene.detect

命令：

```bash
life scene.detect --text "我和朋友在商场逛着有点累，接下来不知道干嘛"
```

返回：

```json
{
  "scene": "mall_hangout",
  "confidence": 0.91,
  "signals": ["in_mall", "with_friends", "tired", "no_next_plan", "not_meal_time"],
  "needs": ["rest", "light_activity", "future_dinner_plan"]
}
```

### 6.0.1 service.suggest

命令：

```bash
life service.suggest --scene mall_hangout --location "朝阳大悦城" --time "16:40"
```

返回：

```json
[
  {
    "service": "tea_pickup",
    "title": "先买两杯热饮",
    "reason": "用户在商场逛累了，且还没到正餐时间，热饮是低成本休息方案",
    "tool": "life drink.search",
    "priority": 1
  },
  {
    "service": "movie",
    "title": "看一场 17:20 的电影",
    "reason": "电影可以承接 2 小时休息，散场后刚好进入晚餐时间",
    "tool": "life movie.search",
    "priority": 2
  },
  {
    "service": "dessert_coupon",
    "title": "找一家可坐下聊天的甜品团购",
    "reason": "适合同伴聊天，并且团购比现场买单更划算",
    "tool": "life deal.search",
    "priority": 3
  }
]
```

这两个工具是本项目的核心差异化。`scene.detect` 负责识别用户生活场景，`service.suggest` 负责把场景映射到美团能力池。后续的外卖、电影、团购、闪购等具体工具只是执行层。

### 6.0.2 activity.discover

用于“我不知道干嘛”场景。它不是搜索某个固定服务，而是返回附近当前可做事项。

命令：

```bash
life activity.discover --location "朝阳大悦城" --time "16:40" --weather rain --explore-level medium
```

返回：

```json
[
  {
    "activity_id": "act_001",
    "mode": "safe",
    "title": "喜茶热饮 6 分钟可取",
    "service": "tea_pickup",
    "price": 38,
    "duration_minutes": 20,
    "distance": "B1 层",
    "reason": "用户最近常点热饮，且当前在商场逛累了",
    "tool": "life drink.search"
  },
  {
    "activity_id": "act_002",
    "mode": "light_explore",
    "title": "17:20 动画电影",
    "service": "movie",
    "price": 96,
    "duration_minutes": 110,
    "distance": "6 楼影院",
    "reason": "用户常看喜剧，这部电影风格轻松但题材更新鲜",
    "tool": "life movie.search"
  },
  {
    "activity_id": "act_003",
    "mode": "bold_explore",
    "title": "手作香薰体验课",
    "service": "experience_course",
    "price": 79,
    "duration_minutes": 45,
    "distance": "5 楼",
    "reason": "用户很少参加体验类活动，但该项目时间短、室内、低风险",
    "tool": "life deal.search"
  }
]
```

### 6.0.3 preference.update

用于记录用户反馈，让破圈推荐逐步变准。

命令：

```bash
life preference.update --activity-id act_003 --feedback "interested"
```

返回：

```json
{
  "status": "updated",
  "changed_weights": [
    {
      "category": "experience_course",
      "delta": 0.12
    },
    {
      "category": "indoor_activity",
      "delta": 0.08
    }
  ],
  "next_explore_level": "medium"
}
```

### 6.0.4 broker.scan

平台大 Agent 扫描商圈资源和潜在活动机会。

命令：

```bash
life broker.scan --business-area "望京" --time-window "19:00-22:00" --weather rain
```

返回：

```json
{
  "business_area": "望京",
  "time_window": "19:00-22:00",
  "context": {
    "weather": "rain",
    "recommended_activity_type": "indoor"
  },
  "available_resources": [
    {
      "resource_id": "venue_001",
      "type": "board_game",
      "name": "岛上桌游 望京店",
      "available_slots": ["19:30-21:30"],
      "capacity": [4, 6],
      "price_per_person": 68,
      "rating": 4.8
    },
    {
      "resource_id": "venue_002",
      "type": "ktv",
      "name": "星聚会 KTV 望京店",
      "available_slots": ["20:00-23:00"],
      "capacity": [4, 8],
      "price_per_person": 128,
      "rating": 4.7
    }
  ],
  "suggested_poll": {
    "candidate_activity_types": ["board_game", "ktv", "movie"],
    "budget_ranges": ["50-100", "100-150"],
    "group_sizes": [4, 6]
  }
}
```

### 6.0.5 broker.poll-agents

平台大 Agent 向个人小 Agent 询问匿名兴趣摘要。

命令：

```bash
life broker.poll-agents --business-area "望京" --activity-types "board_game,ktv,movie" --time-window "19:00-22:00"
```

返回：

```json
{
  "request_id": "broker_req_001",
  "polled_agents": 12,
  "responses": [
    {
      "agent_id": "agent_user_001",
      "positive_tags": ["桌游", "密室", "轻社交"],
      "negative_tags": ["太吵的 KTV"],
      "availability": "possibly_available",
      "time_window": "19:30-22:00",
      "budget_range": "50-100",
      "safety_policy": ["verified_venue_only", "hide_identity_until_confirmed"]
    },
    {
      "agent_id": "agent_user_102",
      "positive_tags": ["桌游", "电影"],
      "availability": "available",
      "time_window": "19:00-21:30",
      "budget_range": "50-100",
      "safety_policy": ["verified_venue_only"]
    }
  ],
  "privacy": {
    "only_anonymous_summary": true,
    "exact_location_hidden": true,
    "real_contact_hidden": true
  }
}
```

### 6.0.6 broker.propose-groups

平台大 Agent 基于商户资源和小 Agent 兴趣摘要生成候选局。

命令：

```bash
life broker.propose-groups --request-id broker_req_001
```

返回：

```json
[
  {
    "proposal_id": "group_prop_001",
    "activity": "轻策略桌游",
    "venue_id": "venue_001",
    "venue_name": "岛上桌游 望京店",
    "time": "19:30-21:30",
    "target_size": 4,
    "candidate_agents": ["agent_user_001", "agent_user_102", "agent_user_203", "agent_user_316"],
    "price_per_person": 68,
    "match_score": 0.86,
    "why": [
      "4 个 Agent 对桌游或轻社交有正向兴趣",
      "时间窗口重合",
      "预算均在 50-100 元",
      "商户 19:30 有 4 人桌可锁定",
      "下雨天气适合室内活动"
    ],
    "requires_owner_confirmation": true
  },
  {
    "proposal_id": "group_prop_002",
    "activity": "KTV + 夜宵",
    "venue_id": "venue_002",
    "venue_name": "星聚会 KTV 望京店",
    "time": "20:00-23:00",
    "target_size": 6,
    "candidate_agents": ["agent_user_501", "agent_user_502", "agent_user_503"],
    "price_per_person": 128,
    "match_score": 0.71,
    "why": [
      "人数未达到最低成局阈值",
      "预算对部分用户偏高"
    ],
    "requires_owner_confirmation": true
  }
]
```

### 6.0.7 agent.explore

Agent 代表主人主动探索附近机会，不直接打扰用户。

命令：

```bash
life agent.explore --owner-id user_001 --location "望京 SOHO" --time "16:30" --mode low_interrupt
```

返回：

```json
{
  "owner_id": "user_001",
  "explore_mode": "low_interrupt",
  "opportunities": [
    {
      "opportunity_id": "opp_001",
      "type": "group_activity",
      "activity": "轻策略桌游",
      "business_area": "望京",
      "time": "19:30-21:30",
      "match_score": 0.86,
      "reason": "主人周五晚常空闲，收藏过桌游店，当前下雨适合室内活动",
      "suggested_action": "a2a_probe"
    },
    {
      "opportunity_id": "opp_002",
      "type": "solo_activity",
      "activity": "手作香薰体验",
      "business_area": "望京",
      "time": "18:00-18:45",
      "match_score": 0.68,
      "reason": "低风险新体验，但和主人历史兴趣距离较远",
      "suggested_action": "silent_record"
    }
  ]
}
```

### 6.0.8 a2a.propose

向其他用户 Agent 发起匿名意向询问。

命令：

```bash
life a2a.propose --from-agent agent_user_001 --activity board_game --business-area "望京" --time-window "19:30-21:30" --target-size 4
```

返回：

```json
{
  "proposal_id": "proposal_001",
  "status": "probing",
  "sent_to_agents": ["agent_user_102", "agent_user_203", "agent_user_316"],
  "shared_info": {
    "activity": "轻策略桌游",
    "business_area": "望京",
    "time_window": "19:30-21:30",
    "budget_per_person": "50-100",
    "verified_venue_only": true
  },
  "privacy": {
    "exact_location_hidden": true,
    "real_contact_hidden": true,
    "owner_identity_hidden_until_confirmed": true
  }
}
```

### 6.0.9 a2a.negotiate

收集其他 Agent 的意向并生成可给主人确认的成局提案。

命令：

```bash
life a2a.negotiate --proposal-id proposal_001
```

返回：

```json
{
  "proposal_id": "proposal_001",
  "status": "ready_for_owner_confirmation",
  "activity": "轻策略桌游",
  "venue": {
    "venue_id": "venue_001",
    "name": "岛上桌游 望京店",
    "rating": 4.8,
    "distance": "1.6km"
  },
  "time": "19:30-21:30",
  "group_size": 4,
  "confirmed_interest_count": 3,
  "price_per_person": 68,
  "matched_people_preview": [
    {
      "nickname": "北纬桌游玩家",
      "tags": ["桌游", "轻策略"],
      "credit_status": "normal"
    },
    {
      "nickname": "周五不想回家",
      "tags": ["桌游", "密室"],
      "credit_status": "normal"
    }
  ],
  "why_recommend_to_owner": [
    "你最近收藏过桌游店",
    "地点在 2km 内",
    "已有 3 人表达意向",
    "预算符合你的历史消费区间",
    "活动地点是平台可核验商户"
  ],
  "requires_owner_confirmation": true
}
```

### 6.0.10 group.plan

根据用户意图、位置、时间和兴趣生成组局方案。

命令：

```bash
life group.plan --text "今晚不知道干嘛，有没有人一起玩点什么" --location "望京 SOHO" --time "16:30"
```

返回：

```json
{
  "group_intent": "indoor_social_activity",
  "recommended_activity": "board_game",
  "reason": "今晚下雨，用户 19:00 后空闲，历史收藏过桌游和密室，适合室内低门槛社交",
  "target_size": 4,
  "time_window": "19:30-21:30",
  "budget_per_person": 80,
  "candidate_services": ["board_game", "dinner_deal", "drink_pickup"],
  "fallback_activity": "movie"
}
```

### 6.0.11 group.match

匹配熟人和兴趣用户。

命令：

```bash
life group.match --activity board_game --location "望京 SOHO" --time-window "19:30-21:30" --target-size 4 --mode mixed
```

返回：

```json
{
  "known_friends": [
    {
      "user_id": "friend_001",
      "name": "张三",
      "reason": "上次一起玩过密室，周五晚上常有空",
      "availability": "likely_available"
    },
    {
      "user_id": "friend_002",
      "name": "李四",
      "reason": "收藏过桌游店，和你有 3 次共同到店记录",
      "availability": "unknown"
    }
  ],
  "interest_matches": [
    {
      "user_id": "match_001",
      "nickname": "北纬桌游玩家",
      "tags": ["桌游", "轻策略", "望京"],
      "distance_area": "同商圈",
      "credit_status": "normal",
      "availability": "available"
    },
    {
      "user_id": "match_002",
      "nickname": "周五不想回家",
      "tags": ["桌游", "密室", "电影"],
      "distance_area": "2km 内",
      "credit_status": "normal",
      "availability": "available"
    }
  ],
  "safety": {
    "location_visibility": "business_area_only",
    "venue_required": true,
    "private_contact_hidden": true
  }
}
```

### 6.0.12 group.invite

发起邀请或发布兴趣局。

命令：

```bash
life group.invite --activity board_game --time "19:30" --venue-id venue_001 --invitees "friend_001,friend_002,match_001"
```

返回：

```json
{
  "group_id": "group_20260604_001",
  "status": "inviting",
  "activity": "board_game",
  "time": "19:30",
  "venue_id": "venue_001",
  "rsvp": [
    {
      "user_id": "friend_001",
      "status": "pending"
    },
    {
      "user_id": "friend_002",
      "status": "pending"
    },
    {
      "user_id": "match_001",
      "status": "pending"
    }
  ]
}
```

### 6.0.13 group.reserve

成局后锁定商户资源。

命令：

```bash
life group.reserve --group-id group_20260604_001 --venue-id venue_001 --package-id pkg_board_game_4p
```

返回：

```json
{
  "reservation_id": "reserve_20260604_001",
  "status": "reserved",
  "venue": "岛上桌游 望京店",
  "time": "19:30-21:30",
  "package": "4 人轻策略桌游套餐",
  "price_per_person": 68,
  "payment_mode": "AA",
  "next_suggestion": {
    "service": "dinner_deal",
    "title": "结束后可接 21:40 夜宵套餐，人均 88 元"
  }
}
```

### 6.1 context.get

命令：

```bash
life context.get
```

返回：

```json
{
  "time": "2026-06-04 21:00",
  "weather": "rain",
  "location": "望京 SOHO",
  "office": "望京 SOHO",
  "home": "朝阳区某小区",
  "next_calendar": "明早 09:00 产品评审会"
}
```

### 6.2 profile.get

命令：

```bash
life profile.get
```

返回：

```json
{
  "taste": ["清淡", "少油"],
  "avoid": ["辣"],
  "budget_dinner": 50,
  "budget_breakfast": 30,
  "favorite_food": ["粥", "轻食", "牛肉饭"],
  "breakfast_needed": true,
  "neck_pain_recently": true
}
```

### 6.3 ride.estimate

命令：

```bash
life ride.estimate --from "望京 SOHO" --to "朝阳区某小区"
```

返回：

```json
{
  "type": "taxi",
  "price": 31,
  "duration_minutes": 28,
  "reason": "当前下雨且用户晚归，打车优先"
}
```

### 6.4 food.search

命令：

```bash
life food.search --keyword "清淡晚餐" --budget 50 --arrive-before "21:40"
```

返回：

```json
[
  {
    "shop_id": "food_001",
    "shop_name": "和风牛肉饭",
    "item": "温泉蛋牛肉饭",
    "price": 36,
    "eta": "21:32",
    "rating": 4.8,
    "tags": ["清淡", "少油"]
  },
  {
    "shop_id": "food_002",
    "shop_name": "南城粥铺",
    "item": "山药鸡丝粥套餐",
    "price": 29,
    "eta": "21:38",
    "rating": 4.7,
    "tags": ["清淡", "热食"]
  }
]
```

### 6.5 food.order

命令：

```bash
life food.order --shop-id food_001 --item "温泉蛋牛肉饭"
```

返回：

```json
{
  "order_id": "order_food_20260604_001",
  "status": "created",
  "eta": "21:32",
  "price": 36
}
```

### 6.6 grocery.search

命令：

```bash
life grocery.search --keyword "早餐 牛奶" --budget 30
```

返回：

```json
[
  {
    "bundle_id": "grocery_001",
    "items": ["牛奶", "全麦三明治"],
    "price": 22,
    "eta": "22:05"
  }
]
```

### 6.7 grocery.order

命令：

```bash
life grocery.order --bundle-id grocery_001
```

返回：

```json
{
  "order_id": "order_grocery_20260604_001",
  "status": "created",
  "eta": "22:05",
  "price": 22
}
```

### 6.8 service.search

命令：

```bash
life service.search --type massage --nearby home --after "21:50"
```

返回：

```json
[
  {
    "service_id": "svc_001",
    "name": "肩颈放松 45 分钟",
    "store": "轻松到家理疗",
    "price": 98,
    "distance": "1.2km",
    "available_time": "22:00",
    "rating": 4.9
  }
]
```

### 6.9 service.book

命令：

```bash
life service.book --service-id svc_001 --time "22:00"
```

返回：

```json
{
  "booking_id": "booking_service_20260604_001",
  "status": "booked",
  "time": "22:00",
  "price": 98
}
```

### 6.10 reminder.create

命令：

```bash
life reminder.create --time "23:20" --text "明早 9 点产品评审，建议早点休息"
```

返回：

```json
{
  "reminder_id": "reminder_20260604_001",
  "status": "created",
  "time": "23:20"
}
```

### 6.11 event.delay

用于 Demo 自动重排。

命令：

```bash
life event.delay --order-id order_food_20260604_001 --minutes 20
```

返回：

```json
{
  "event": "delivery_delay",
  "order_id": "order_food_20260604_001",
  "delay_minutes": 20,
  "new_eta": "21:52",
  "requires_replan": true
}
```

## 7. 前端 Demo 设计

不要做营销首页，首屏就是模拟美团 App 内嵌的 Agent 模块。聊天不是主界面，主界面是“当前场景卡 + 附近可做事项 + 探索度控制”。

## 6.12 service_catalog.json 设计

服务目录不要按 App 首页频道展示，而要按“用户问题”展示。

```json
[
  {
    "service_id": "food_delivery",
    "name": "外卖",
    "solves": ["hungry", "late_work", "cannot_go_out", "group_meal"],
    "best_for": ["lunch", "dinner", "night_snack"],
    "risk": "paid_order",
    "default_confirmation": true
  },
  {
    "service_id": "instant_retail",
    "name": "闪购",
    "solves": ["missing_items", "urgent_need", "guest_coming", "breakfast_supply"],
    "best_for": ["within_1_hour_delivery"],
    "risk": "paid_order",
    "default_confirmation": true
  },
  {
    "service_id": "medicine",
    "name": "买药",
    "solves": ["common_medicine_need", "health_supplies"],
    "best_for": ["non_diagnostic_supply"],
    "risk": "health_sensitive",
    "default_confirmation": true
  },
  {
    "service_id": "in_store_deal",
    "name": "到店团购",
    "solves": ["mall_hangout", "date", "friends_meetup", "save_money"],
    "best_for": ["already_nearby", "in_mall", "planned_dining"],
    "risk": "paid_voucher",
    "default_confirmation": true
  },
  {
    "service_id": "movie",
    "name": "电影",
    "solves": ["mall_hangout", "rainy_day", "waiting_time", "date"],
    "best_for": ["2_hour_gap", "indoor_activity"],
    "risk": "ticket_purchase",
    "default_confirmation": true
  },
  {
    "service_id": "massage",
    "name": "按摩足疗",
    "solves": ["tired", "neck_pain", "after_work_relax"],
    "best_for": ["evening", "near_home"],
    "risk": "booking",
    "default_confirmation": true
  }
]
```

## 6.13 scene_rules.json 设计

场景规则用于让 Demo 看起来不是纯 Prompt 猜测，而是有可解释的服务触发逻辑。

```json
[
  {
    "scene": "mall_hangout",
    "required_signals": ["in_mall", "no_next_plan"],
    "optional_signals": ["with_friends", "tired", "rain", "not_meal_time"],
    "candidate_services": ["tea_pickup", "movie", "dessert_coupon", "restaurant_queue"],
    "recommendation_policy": "prefer_indoor_rest_and_transition_to_dinner"
  },
  {
    "scene": "late_work_rainy_home",
    "required_signals": ["late_work", "rain"],
    "optional_signals": ["tired", "early_meeting_tomorrow", "breakfast_needed"],
    "candidate_services": ["ride", "food_delivery", "instant_retail", "massage", "reminder"],
    "recommendation_policy": "solve_commute_and_food_first"
  },
  {
    "scene": "urgent_missing_items",
    "required_signals": ["missing_items", "urgent_need"],
    "optional_signals": ["early_meeting_tomorrow", "guest_coming"],
    "candidate_services": ["instant_retail", "errand", "scheduled_breakfast"],
    "recommendation_policy": "prefer_fast_delivery_over_lowest_price"
  }
]
```

## 6.14 服务唤醒链路

```text
用户自然语言
  ↓
scene.detect
  ↓
识别场景和信号
  ↓
service.suggest
  ↓
从服务目录中选择 1-3 个候选服务
  ↓
具体工具搜索
  ↓
生成解释型推荐
  ↓
用户确认后执行
```

示例：

```text
用户：我和朋友在商场逛着有点累，接下来不知道干嘛

Agent：
我判断你们现在不是“找饭吃”，而是在商场里需要一个低成本休息和过渡安排。
现在 16:40，还没到晚饭时间，我建议先做这三件事：
1. 买两杯热饮，6 分钟可取。
2. 看 17:20 的电影，散场后正好接晚餐。
3. 如果只想聊天，可以买 5 楼甜品团购，比现场买单便宜 18 元。
```

### 7.1 页面布局

```text
┌───────────────────────────────────────────────────────────┐
│ Header: 饭点之外 - 美团场景感知 Agent                    │
├───────────────┬───────────────────────┬───────────────────┤
│ Scene Card    │ Discovery Cards        │ Decision Panel    │
│               │                       │                   │
│ 朝阳大悦城     │ 稳妥: 热饮             │ 时间: 16:40        │
│ 16:40         │ 轻破圈: 电影           │ 天气: 下雨         │
│ 下雨           │ 大胆: 手作香薰         │ 同行: 朋友         │
│ 不知道干嘛     │                       │ 探索度: 新鲜一点   │
├───────────────┴───────────────────────┴───────────────────┤
│ Feedback + Tool Log                                        │
│ [没兴趣] [收藏] [稳一点] [更大胆]                          │
│ scene.detect -> activity.discover -> service.suggest        │
└───────────────────────────────────────────────────────────┘
```

### 7.2 必备交互

- 输入“我不知道接下来干嘛”后一键触发 Agent。
- 可切换探索度：稳一点 / 新鲜一点 / 大胆一点。
- 显示工具调用日志。
- 显示 Agent 决策依据。
- 每个推荐卡片都有行动按钮，例如“查看团购”“买票”“现在下单”“加入计划”。
- 每个推荐卡片都有反馈按钮，例如“没兴趣”“下次再说”“收藏”“更大胆”。
- 点击反馈后调用 `preference.update`，并刷新下一轮推荐。
- 加班下雨场景中仍保留“确认执行”和“模拟延迟”。

### 7.3 推荐页面组件

- SceneCard
- ExploreLevelSegment
- DiscoveryCard
- ReasonChips
- FeedbackBar
- BrokerPanel
- PersonalAgentCard
- GroupProposalCard
- RSVPList
- ChatWindow
- DecisionPanel
- ToolCallLog
- ExecutionChecklist
- ReplanBanner

### 7.4 主动撮合 Demo 页面

建议单独做一个“组局撮合”视图，用于展示大 Agent 和小 Agent 的分工。

```text
┌───────────────────────────────────────────────────────────┐
│ 饭点之外 - 主动撮合                                       │
├───────────────────────────┬───────────────────────────────┤
│ 平台大 Agent              │ 个人小 Agent                   │
│                           │                               │
│ 商圈: 望京                │ 主人偏好: 桌游/密室/轻社交     │
│ 天气: 下雨                │ 预算: 50-100                   │
│ 可用资源: 3 家桌游店       │ 安全: 平台商户/隐藏身份         │
│ 匹配 Agent: 12 个          │ 今晚状态: 可能有空             │
│ 候选局: 2 个              │                               │
├───────────────────────────┴───────────────────────────────┤
│ 推荐成局                                                   │
│ 轻策略桌游局 19:30-21:30 / 4 人 / 人均 68 元               │
│ 已有 3 个 Agent 表达匿名意向                               │
│ [给主人确认] [继续观望] [不感兴趣]                         │
├───────────────────────────────────────────────────────────┤
│ Tool Log                                                   │
│ broker.scan -> broker.poll-agents -> broker.propose-groups │
│ -> a2a.negotiate -> group.reserve                          │
└───────────────────────────────────────────────────────────┘
```

## 8. Demo 脚本

### 8.1 开场

现在的本地生活服务很丰富，但用户每天仍然需要做大量小决策。我们的项目不是再做一个推荐入口，而是基于 OpenClaw 做一个能主动理解上下文、调用工具并执行任务的本地生活私人管家。

升级后的核心表达：

```text
很多用户只在饭点想到美团，但美团其实能解决大量饭点之外的本地生活需求。我们的 Agent 做两件事：
第一，用户不知道干什么时，帮他发现附近现在可做的事。
第二，一个人玩不起来时，帮他把有相同兴趣的人组织成局。
```

### 8.2 操作步骤 A：个人发现

1. 展示用户输入：

```text
我不知道接下来干嘛。
```

2. 展示 Agent 调用工具：

```text
context.get
profile.get
scene.detect
activity.discover
service.suggest
```

3. 展示 Agent 计划：

```text
你现在在朝阳大悦城，16:40，外面下雨，还没到饭点。
我给你 3 个不同探索度的选择：
- 稳妥：热饮 6 分钟可取，适合坐下休息。
- 轻破圈：17:20 动画电影，散场后刚好接晚餐。
- 大胆尝试：手作香薰体验课，45 分钟，低风险新体验。
```

4. 用户点击“更大胆”或“收藏”，调用 `preference.update`。

### 8.3 操作步骤 B：主动组局

1. 展示用户输入：

```text
今晚一个人也不知道玩啥，有没有人一起玩点什么？
```

2. 展示平台大 Agent 已经在后台发现机会：

```text
周五 16:00，平台大 Agent 扫描望京商圈：
- 下雨，适合室内活动
- 3 家桌游店今晚有空位
- 12 个个人小 Agent 表示主人近期对桌游/密室/轻社交感兴趣
- 其中 4 个 Agent 的时间、预算、商圈都匹配
```

3. 展示 Agent 调用工具：

```text
broker.scan
broker.poll-agents
broker.propose-groups
agent.explore
a2a.propose
a2a.negotiate
group.plan
group.match
deal.search
group.invite
group.reserve
```

4. 展示 Agent 成局方案：

```text
我建议组一个 4 人轻桌游局：
- 时间：19:30-21:30
- 地点：岛上桌游 望京店，2km 内，评分 4.8
- 预算：人均 68 元
- 熟人优先：张三、李四，上次和你一起玩过密室
- 不够 4 人时，补 1-2 位同商圈桌游兴趣用户
- 成局后可接夜宵团购，人均 88 元
```

5. 点击“发起组局”。

6. 展示 RSVP 和预约状态：

```text
张三：已确认
李四：待确认
北纬桌游玩家：已确认

已达到 3 人最低成局条件。
已锁定 19:30 桌游套餐，支付方式 AA。
```

7. 展示 A2A 高光解释：

```text
这一步不是用户自己去群里喊人，而是平台大 Agent 先发现商圈里的成局机会，
再向每个人的小 Agent 询问低敏摘要：
- 是否对桌游感兴趣
- 今晚是否有空
- 预算是否匹配
- 是否接受同商圈平台商户

只有当局接近成立时，小 Agent 才把提案给主人确认。
```

### 8.4 可选步骤 C：加班下雨执行闭环

如果答辩时间允许，再展示原“加班下雨回家”场景，用来证明 Agent 不只推荐，也可以执行和重排。

### 8.5 结尾话术

这个 Demo 使用的是 Mock Tool Layer，但我们没有把逻辑写死在 Prompt 中。本地生活能力被抽象成标准工具，真实落地时可以替换为美团内部 API，Agent 的规划、确认、执行和重排流程保持不变。

## 9. 开发计划

### Day 1

- 完成 Mock CLI。
- 完成 mock data。
- 完成前端静态布局。
- 固化主场景脚本。

### Day 2

- 接入 OpenClaw 工具调用。
- 实现确认执行流程。
- 实现工具调用日志。
- 实现自动重排 Demo。

### Day 3

- 优化 UI。
- 准备答辩稿。
- 录制备用 Demo 视频。
- 准备异常兜底方案。

## 10. 评分风险与规避

### 风险 1：被认为只是聊天机器人

规避：

- 必须展示工具调用日志。
- 必须展示确认执行清单。
- 必须展示自动重排。

### 风险 2：Mock 数据显得不真实

规避：

- Mock 数据要包含评分、价格、ETA、距离、标签、预算等真实业务字段。
- 决策必须引用这些字段。

### 风险 3：功能过多但没有闭环

规避：

- 只打穿“加班下雨回家”一条链路。
- 其他场景只作为未来扩展，不在 Demo 中展开。

### 风险 4：OpenClaw 参与感不强

规避：

- 明确展示 OpenClaw 作为 Agent Gateway 负责工具编排。
- 工具接口以 CLI/JSON 方式暴露，便于 OpenClaw 调用。

## 11. 验收标准

项目最少满足以下条件即可上台：

- 用户输入主场景后，页面能生成完整生活计划。
- 至少展示 6 次工具调用。
- 每个工具调用都有 JSON 结果。
- 用户确认后生成至少 3 个模拟订单/预约/提醒。
- 可以模拟一次配送延迟。
- 延迟后可以生成新的替代方案。
- 答辩能在 5 分钟内讲完。
