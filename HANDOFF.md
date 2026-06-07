# 交接文档：美团生活管家项目

> 生成时间：2026-06-05
> 项目路径：`/home/adkins/meituan-openclaw-butler/`
> GitHub：`wangqioo/meituan-openclaw-butler`

---

## 一、项目背景

这是美团黑客松项目，原名"饭点之外"（AfterHours），已经重构为"美团生活管家"。

**核心概念**：一站式生活编排器，不再是狭窄的"饭后组局"，而是涵盖行程规划、多人组局、随时灵感推荐三大场景。项目在美团内部开发，所有API、用户基础、支付能力都可直接调用。

详细的产品重定位方案在 `REPOSITIONING.md`（约19KB），包含完整的产品分析、功能规划、技术方案。

---

## 二、已完成的工作

### 1. Mock CLI 工具层（后端模拟）

**文件**：`mock-life-tools/bin/life.js`

在原有 `meet` 和 `feedback` 命令基础上，新增了以下命令：

```
trip.parse     — 解析用户行程意图，返回结构化参数
trip.generate  — 根据参数生成行程方案
trip.book      — 模拟预订
trip.status    — 查询行程状态
inspiration.get      — 根据场景获取灵感推荐
inspiration.feedback — 记录用户反馈
```

**数据文件**：
- `mock-life-tools/data/trip_templates.json` — 6个行程模板（杭州2日游、上海2日游、成都3日游等）
- `mock-life-tools/data/inspiration_templates.json` — 5个灵感场景（雨天室内、晴天户外、深夜、周末、节日）

**验证**：`npm run test:trip` 和 `npm run test:inspiration` 均已通过。

### 2. 前端 UI

**文件**：
- `web-demo/src/main.jsx` — React 主组件（约500行）
- `web-demo/src/styles.css` — 样式（约836行）
- `web-demo/index.html` — 入口HTML

**当前UI状态**：刚重写为手机APP风格。整体是一个 375x812px 的 iPhone 模拟框，包含：
- 顶部状态栏
- 底部四Tab导航（首页/行程/组局/灵感）
- 首页：搜索框 + 两个视频卡片（行程规划、多人组局）+ 横向滚动的灵感卡片 + 快捷标签
- 行程页：搜索 → 展示行程封面视频 + 预估费用 + 逐日时间轴
- 组局页：搜索 → 展示活动封面视频 + 餐厅信息 + 参与者列表 + 费用
- 灵感页：环境信息条 + 分类推荐列表（每项都是视频卡片）

**核心组件**：`VideoCard` — 视频作为卡片背景，上叠半透明渐变，文字浮在上面。

### 3. 文档

- `README.md` — 已更新为美团生活管家版本
- `REPOSITIONING.md` — 产品重定位完整方案（19KB）

---

## 三、当前问题

### 问题1：视频URL不可用

这是最主要的问题。

最初设计时想用 Pexels/Pixabay 的真实生活场景视频（海洋、都市航拍、美食等）作为卡片背景。但这些平台都有防盗链（Hotlink Protection），从 localhost 直接引用会返回 403。

**当前状态**：已解决 ✅

用户提供了4个本地视频素材，已复制到 `web-demo/public/videos/` 目录：
- 小溪.mp4 (6.6MB) - 用于行程规划卡片
- 湖泊.mp4 (28MB) - 用于首页大卡片/组局封面
- 自然风景森林.mp4 (52MB) - 用于灵感推荐卡片
- 餐厅.mp4 (6.6MB) - 用于多人组局卡片（美食场景）

已更新 `main.jsx` 中的 VIDEOS 对象，使用相对路径引用本地视频：
```javascript
const VIDEOS = {
  beach: "/videos/小溪.mp4",
  city: "/videos/湖泊.mp4",
  food: "/videos/餐厅.mp4",
  nature: "/videos/自然风景森林.mp4",
  friends: "/videos/湖泊.mp4",
  movie: "/videos/自然风景森林.mp4"
};
```

视频播放正常，所有视频都在自动播放（loop + muted + playsInline）。

### 问题2：UI 可能有视觉bug

用户最近一次反馈是"界面全乱了"，指的是之前不是手机APP风格的版本。当前版本刚重写，**已视觉验证**。

**当前状态**：已验证 ✅

已完成视觉验证：
- 首页：状态栏、标题栏、搜索框、视频卡片、灵感推荐、快速开始标签、底部导航
- 行程页面：返回按钮、标题、搜索框、行程标签
- 组局页面：返回按钮、标题、搜索框
- 灵感页面：返回按钮、标题、环境信息条、视频卡片推荐列表

所有页面布局正常，视频播放正常，底部导航切换正常。

---

## 四、如何接手

### 环境启动

```bash
cd /home/adkins/meituan-openclaw-butler
npm install          # 安装依赖（应该已完成）
npm run dev          # 启动 Vite 开发服务器，默认端口 5173
```

开发服务器启动后访问 `http://localhost:5173`。

### 关键文件

| 文件 | 说明 |
|------|------|
| `web-demo/src/main.jsx` | 前端主组件，所有页面逻辑 |
| `web-demo/src/styles.css` | 样式，手机APP框架+视频卡片+各页面 |
| `web-demo/index.html` | HTML入口 |
| `mock-life-tools/bin/life.js` | Mock CLI工具，模拟后端API |
| `mock-life-tools/data/trip_templates.json` | 行程模板数据 |
| `mock-life-tools/data/inspiration_templates.json` | 灵感场景数据 |
| `REPOSITIONING.md` | 产品重定位完整方案 |
| `README.md` | 项目说明 |

### 下一步应该做的事

1. **功能完善**：搜索逻辑目前是硬编码关键词匹配（包含"杭州"触发行程，包含"聚餐"触发组局），后续需要接入真实API或更智能的解析
2. **对接美团内部API**：Mock层设计与美团现有接口对齐，后续替换为真实调用
3. **视频素材优化**：当前只有4个视频，可以补充更多场景视频（城市夜景、美食特写、朋友聚会等）
4. **性能优化**：视频文件较大（总计约90MB），可以考虑压缩或使用更短的视频循环

### 开发注意事项

- 这是美团内部项目，不用考虑外部CDN、支付网关等问题
- 用户非常注重视觉设计质量，会仔细看UI效果
- 用户偏好视频背景，不要擅自替换成CSS动画或静态图片
- 如果要改用户偏好相关的配置/代码，先问再动手

---

## 五、技术栈

- **前端**：React 18 + Vite + Lucide Icons
- **样式**：纯CSS（无Tailwind），手机APP模拟框架
- **后端模拟**：Node.js CLI（commander.js）
- **构建**：Vite dev server
