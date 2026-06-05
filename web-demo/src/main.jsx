import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BadgeCheck,
  Bot,
  CalendarClock,
  ChevronRight,
  CircleDollarSign,
  Coffee,
  Compass,
  EyeOff,
  Film,
  Handshake,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Ticket,
  Users
} from "lucide-react";
import "./styles.css";

const discoveryRecommendations = [
  {
    id: "act_001",
    mode: "稳妥",
    title: "喜茶热饮 6 分钟可取",
    icon: Coffee,
    price: "38 元",
    meta: "B1 层 · 20 分钟",
    reason: "你最近常点热饮，当前在商场逛累了，适合先坐下休息。",
    tone: "safe"
  },
  {
    id: "act_002",
    mode: "轻破圈",
    title: "17:20 轻松动画电影",
    icon: Film,
    price: "96 元/2人",
    meta: "6 楼影院 · 110 分钟",
    reason: "你常看喜剧，这部节奏轻松但题材更新鲜，散场后刚好接晚饭。",
    tone: "explore"
  },
  {
    id: "act_003",
    mode: "大胆尝试",
    title: "手作香薰体验课",
    icon: Sparkles,
    price: "79 元",
    meta: "5 楼 · 45 分钟",
    reason: "你很少参加体验类活动，但它在商场内、时间短、低风险。",
    tone: "bold"
  }
];

const toolLogDiscovery = [
  {
    tool: "life scene.detect",
    result: "mall_discovery · in_mall / rain / not_meal_time"
  },
  {
    tool: "life activity.discover",
    result: "3 recommendations · safe / light_explore / bold_explore"
  },
  {
    tool: "life preference.update",
    result: "feedback-ready · exploration can be adjusted"
  }
];

const toolLogBroker = [
  {
    tool: "life broker.scan",
    result: "望京 · 3 indoor venues · rain"
  },
  {
    tool: "life broker.poll-agents",
    result: "12 agents polled · anonymous summaries only"
  },
  {
    tool: "life broker.propose-groups",
    result: "轻策略桌游局 · match_score 0.86"
  },
  {
    tool: "life a2a.negotiate",
    result: "3 agents expressed interest · owner confirmation required"
  }
];

const matchedAgents = [
  { name: "你的个人小 Agent", state: "适合主人", tags: "桌游 / 密室 / 50-100" },
  { name: "北纬桌游玩家", state: "匿名意向", tags: "桌游 / 轻策略" },
  { name: "周五不想回家", state: "匿名意向", tags: "桌游 / 密室" },
  { name: "朋友张三", state: "熟人优先", tags: "上次一起密室" }
];

function App() {
  const [view, setView] = useState("discover");
  const [explore, setExplore] = useState("新鲜一点");
  const [reserved, setReserved] = useState(false);
  const activeToolLog = view === "discover" ? toolLogDiscovery : toolLogBroker;

  const stageLabel = useMemo(() => {
    if (view === "discover") return "个人发现";
    if (reserved) return "已成局";
    return "主动撮合";
  }, [view, reserved]);

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <div className="eyebrow">OpenClaw × 美团黑客松</div>
          <h1>饭点之外</h1>
          <p>本地生活全天候私人管家：从用户搜索服务，到 Agent 主动发现和撮合本地生活。</p>
        </div>
        <div className="status-pill">
          <Bot size={18} />
          {stageLabel}
        </div>
      </header>

      <nav className="segmented">
        <button className={view === "discover" ? "active" : ""} onClick={() => setView("discover")}>
          <Compass size={18} />
          个人发现
        </button>
        <button className={view === "broker" ? "active" : ""} onClick={() => setView("broker")}>
          <Handshake size={18} />
          主动组局
        </button>
      </nav>

      {view === "discover" ? (
        <DiscoveryView explore={explore} setExplore={setExplore} />
      ) : (
        <BrokerView reserved={reserved} setReserved={setReserved} />
      )}

      <section className="tool-panel">
        <div className="panel-title">
          <MessageSquare size={18} />
          Tool Log
        </div>
        <div className="tool-grid">
          {activeToolLog.map((item) => (
            <div className="tool-item" key={item.tool}>
              <code>{item.tool}</code>
              <span>{item.result}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function DiscoveryView({ explore, setExplore }) {
  return (
    <section className="main-grid">
      <aside className="scene-card">
        <div className="panel-title">
          <MapPin size={18} />
          当前场景
        </div>
        <h2>朝阳大悦城</h2>
        <div className="scene-facts">
          <span>16:40</span>
          <span>下雨</span>
          <span>还没到饭点</span>
          <span>有点累</span>
        </div>
        <div className="quote">“我不知道接下来干嘛。”</div>
        <p>
          Agent 判断你现在不是在找一个功能入口，而是在寻找一个低压力、能承接下一段时间的本地生活安排。
        </p>
        <div className="explore-control">
          {["稳一点", "新鲜一点", "大胆一点"].map((level) => (
            <button className={explore === level ? "active" : ""} key={level} onClick={() => setExplore(level)}>
              {level}
            </button>
          ))}
        </div>
      </aside>

      <div className="recommendation-stack">
        {discoveryRecommendations.map((item) => (
          <RecommendationCard item={item} key={item.id} />
        ))}
      </div>

      <aside className="decision-card">
        <div className="panel-title">
          <ShieldCheck size={18} />
          推荐原则
        </div>
        <ul>
          <li>每次只给 1-3 个高相关选择。</li>
          <li>大胆尝试必须低风险、低成本、可取消。</li>
          <li>推荐理由必须来自场景信号。</li>
          <li>用户反馈会调整个人小 Agent 的探索度。</li>
        </ul>
      </aside>
    </section>
  );
}

function RecommendationCard({ item }) {
  const Icon = item.icon;
  return (
    <article className={`recommendation-card ${item.tone}`}>
      <div className="card-icon">
        <Icon size={22} />
      </div>
      <div className="card-body">
        <div className="card-meta">
          <span>{item.mode}</span>
          <span>{item.price}</span>
        </div>
        <h3>{item.title}</h3>
        <p>{item.reason}</p>
        <div className="card-footer">
          <span>{item.meta}</span>
          <button>
            查看 <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}

function BrokerView({ reserved, setReserved }) {
  return (
    <section className="broker-layout">
      <div className="broker-panel">
        <div className="panel-title">
          <Bot size={18} />
          平台大 Agent
        </div>
        <h2>望京商圈机会扫描</h2>
        <div className="metric-grid">
          <Metric icon={CalendarClock} label="时间" value="周五 16:00" />
          <Metric icon={MapPin} label="商圈" value="望京" />
          <Metric icon={Ticket} label="可用资源" value="3 家室内商户" />
          <Metric icon={Users} label="匿名兴趣" value="12 个小 Agent" />
        </div>
        <p>
          下雨天气适合室内活动。平台大 Agent 发现桌游店 19:30 有空位，并聚类到多个用户对桌游、密室、轻社交感兴趣。
        </p>
      </div>

      <div className="group-card">
        <div className="panel-title">
          <Handshake size={18} />
          推荐成局
        </div>
        <h2>4 人轻策略桌游局</h2>
        <div className="group-facts">
          <span>19:30-21:30</span>
          <span>岛上桌游 望京店</span>
          <span>人均 68 元</span>
          <span>AA</span>
        </div>
        <p>
          这个局适合你：你最近收藏过桌游店，地点在 2km 内，预算匹配，已有 3 个 Agent 表达兴趣，活动地点是平台可核验商户。
        </p>
        <div className="privacy-row">
          <EyeOff size={16} />
          成局前仅展示昵称、兴趣标签和商圈级位置。
        </div>
        <button className="primary-action" onClick={() => setReserved(true)}>
          {reserved ? "已锁定商户" : "给主人确认并锁定"}
        </button>
      </div>

      <div className="personal-panel">
        <div className="panel-title">
          <BadgeCheck size={18} />
          个人小 Agent
        </div>
        <div className="agent-list">
          {matchedAgents.map((agent) => (
            <div className="agent-row" key={agent.name}>
              <div>
                <strong>{agent.name}</strong>
                <span>{agent.tags}</span>
              </div>
              <em>{agent.state}</em>
            </div>
          ))}
        </div>
        {reserved && (
          <div className="reservation-box">
            <strong>预约成功</strong>
            <span>桌游套餐已锁定，AA 待确认。结束后可接 21:40 夜宵团购，人均 88 元。</span>
          </div>
        )}
      </div>
    </section>
  );
}

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="metric">
      <Icon size={18} />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
