# 美团生活管家

> 告诉我你想干嘛，美团帮你安排好

基于 OpenClaw 的美团本地生活智能助手，从"饭点之外"升级为"美团生活管家"。

## 核心功能

### 1. 行程规划器
- 用户说"周末去杭州玩2天"
- 系统生成完整行程（交通+住宿+餐饮+门票）
- 一键预订

### 2. 多人组局协调器
- 用户说"周末和朋友聚餐"
- 系统协调时间、推荐餐厅、AA算账
- 一键预订

### 3. 随时灵感推荐器
- 用户说"今天不知道干嘛"
- 系统根据天气、位置、时间推荐活动
- 一键参与

## 技术架构

```
美团生活管家
├── 意图理解引擎
│   └── 自然语言 → 结构化意图
├── 行程编排引擎
│   └── 意图 → 完整行程
├── 服务编排层
│   └── 统一调用美团各业务线API
└── 美团现有业务系统
    ├── 打车API
    ├── 外卖API
    ├── 酒店API
    ├── 门票API
    └── 支付API
```

## 快速开始

### 安装依赖
```bash
npm install
cd web-demo && npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 测试 Mock 工具
```bash
# 测试原有功能
npm run test:mock

# 测试行程规划
npm run test:trip

# 测试灵感推荐
npm run test:inspiration
```

## Mock 工具命令

### 原有命令
- `scene.detect` - 场景感知
- `activity.discover` - 活动发现
- `broker.scan` - 商圈扫描
- `broker.poll-agents` - Agent轮询
- `broker.propose-groups` - 组局提案
- `group.reserve` - 预订确认

### 新增命令
- `trip.parse` - 解析行程意图
- `trip.generate` - 生成行程
- `trip.book` - 预订服务
- `trip.status` - 查询行程状态
- `inspiration.get` - 获取灵感推荐
- `inspiration.feedback` - 灵感反馈

## 项目结构

```
meituan-life-butler/
├── web-demo/                  # 前端原型
│   ├── src/
│   │   ├── main.jsx          # 主应用
│   │   └── styles.css        # 样式
│   └── package.json
├── mock-life-tools/           # Mock工具层
│   ├── bin/life.js           # CLI入口
│   ├── data/                 # 数据文件
│   │   ├── trip_templates.json      # 行程模板
│   │   ├── inspiration_templates.json # 灵感模板
│   │   └── ...
│   └── package.json
├── openclaw/                  # OpenClaw配置
│   ├── tools.json
│   └── prompts/
├── REPOSITIONING.md          # 重新定位方案
├── DEV_DOC.md                # 开发文档
└── README.md                 # 本文件
```

## 商业价值

### 直接收入
1. **交易佣金**：用户通过管家下单，美团正常抽佣
2. **增值服务**：VIP行程规划（深度定制）收费

### 间接收入
1. **提升ARPU**：1次使用=N笔交易
2. **提升频次**：用户更频繁打开美团
3. **生态粘性**：用户更难离开美团

### 数据价值
1. **用户偏好**：更精准的用户画像
2. **消费预测**：预测用户下一步需求
3. **商家洞察**：哪些组合最受欢迎

## 竞争壁垒

| 壁垒 | 说明 |
|------|------|
| **数据壁垒** | 美团有最全的本地生活数据 |
| **服务壁垒** | 美团有最全的本地生活服务 |
| **用户壁垒** | 美团有最大的本地生活用户群 |
| **履约壁垒** | 美团有最强的履约能力 |

**抖音、饿了么、携程都做不了这个，只有美团能做。**

## 迭代计划

### Phase 1：MVP（1个月）
- 简单意图理解
- 预设行程模板
- 跳转预订

### Phase 2：智能规划（2个月）
- AI生成行程（非模板）
- 接入美团真实API
- 行程内直接预订

### Phase 3：多人协调（2个月）
- 多人时间协调
- AA算账
- 群组邀请

### Phase 4：实时调整（2个月）
- 行程中变化处理
- 天气/排队/交通变化
- 自动重新规划

### Phase 5：主动推荐（2个月）
- 用户画像学习
- 主动推送灵感
- 个性化推荐

## 文档

- [重新定位方案](./REPOSITIONING.md)
- [开发文档](./DEV_DOC.md)
- [开发指南](./DEVELOPMENT.md)

## 一句话总结

> **"告诉我你想干嘛，美团帮你安排好"**

---

*版本：v0.2.0*
*更新时间：2026-06-05*
