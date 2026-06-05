import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Bell, Bot, ChevronRight, Coffee, Compass, Film, Handshake, Heart, Home, MapPin, MessageCircle, ShieldCheck, Sparkles, Users } from "lucide-react";
import "./styles.css";

const discoveries = [
  {
    id: "safe",
    label: "稳妥",
    title: "热饮休息",
    desc: "喜茶热饮 6 分钟可取，适合先坐下缓一缓。",
    meta: "B1 层 · 38 元",
    icon: Coffee,
    tone: "green"
  },
  {
    id: "light",
    label: "轻破圈",
    title: "17:20 动画电影",
    desc: "风格轻松但题材更新鲜，散场后刚好接晚饭。",
    meta: "6 楼 · 96 元/2人",
    icon: Film,
    tone: "blue"
  },
  {
    id: "bold",
    label: "大胆尝试",
    title: "手作香薰体验",
    desc: "45 分钟低风险新体验，在商场内不用淋雨。",
    meta: "5 楼 · 79 元",
    icon: Sparkles,
    tone: "orange"
  }
];

const agents = [
  { name: "你的 Agent", tags: "桌游 / 50-100", state: "适合主人" },
  { name: "北纬桌游玩家", tags: "轻策略 / 同商圈", state: "匿名意向" },
  { name: "周五不想回家", tags: "密室 / 桌游", state: "匿名意向" }
];

function App() {
  const [tab, setTab] = useState("discover");
  const [explore, setExplore] = useState("新鲜一点");
  const [reserved, setReserved] = useState(false);
  const mode = useMemo(() => (tab === "discover" ? "个人发现" : reserved ? "已成局" : "主动撮合"), [tab, reserved]);

  return (
    <main className="page">
      <section className="phone">
        <div className="dynamic-island">
          <span />
        </div>

        <div className="status-bar">
          <span>16:40</span>
          <span>5G · 100%</span>
        </div>

        <header className="app-header">
          <div>
            <span className="app-kicker">美团 · OpenClaw</span>
            <h1>饭点之外</h1>
          </div>
          <button className="icon-btn" aria-label="通知">
            <Bell size={19} />
          </button>
        </header>

        <section className="context-card">
          <div className="context-top">
            <div>
              <span className="muted">Agent 正在判断</span>
              <strong>{tab === "discover" ? "朝阳大悦城" : "望京商圈"}</strong>
            </div>
            <span className="agent-pill">
              <Bot size={14} />
              {mode}
            </span>
          </div>
          <div className="chips">
            <span>下雨</span>
            <span>{tab === "discover" ? "还没到饭点" : "周五晚"}</span>
            <span>{tab === "discover" ? "适合室内休息" : "适合轻社交"}</span>
          </div>
        </section>

        <div className="tab-row">
          <button className={tab === "discover" ? "active" : ""} onClick={() => setTab("discover")}>
            <Compass size={17} />
            发现
          </button>
          <button className={tab === "group" ? "active" : ""} onClick={() => setTab("group")}>
            <Users size={17} />
            组局
          </button>
        </div>

        <div className="screen-content">
          {tab === "discover" ? (
            <DiscoverScreen explore={explore} setExplore={setExplore} />
          ) : (
            <GroupScreen reserved={reserved} setReserved={setReserved} />
          )}
        </div>

        <nav className="bottom-nav">
          <span className="active">
            <Home size={17} />
            首页
          </span>
          <span>
            <Ticket size={17} />
            订单
          </span>
          <span>
            <MessageCircle size={17} />
            Agent
          </span>
        </nav>

        <div className="home-indicator" />
      </section>
    </main>
  );
}

function DiscoverScreen({ explore, setExplore }) {
  return (
    <>
      <section className="hero-card">
        <div className="hero-copy">
          <span>你说</span>
          <h2>我不知道接下来干嘛。</h2>
          <p>我先按时间、位置和天气，给你一个最适合现在的安排。</p>
        </div>
      </section>

      <section className="section-block compact">
        <div className="section-head">
          <h3>探索度</h3>
          <span>{explore}</span>
        </div>
        <div className="segmented">
          {["稳一点", "新鲜一点", "大胆一点"].map((item) => (
            <button key={item} className={explore === item ? "active" : ""} onClick={() => setExplore(item)}>
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="recommend-main">
        <DiscoveryCard item={discoveries[0]} primary />
      </section>

      <section className="mini-list">
        {discoveries.slice(1).map((item) => (
          <DiscoveryCard item={item} key={item.id} />
        ))}
      </section>

      <ToolStrip
        items={[
          ["scene.detect", "mall_discovery"],
          ["activity.discover", "3 档推荐"],
          ["preference.update", "等待反馈"]
        ]}
      />
    </>
  );
}

function DiscoveryCard({ item, primary = false }) {
  const Icon = item.icon;
  return (
    <article className={`life-card ${primary ? "primary-card" : ""}`}>
      <div className={`life-icon ${item.tone}`}>
        <Icon size={20} />
      </div>
      <div className="life-body">
        <div className="life-top">
          <span>{item.label}</span>
          <small>{item.meta}</small>
        </div>
        <h3>{item.title}</h3>
        <p>{item.desc}</p>
        <div className="life-actions">
          {primary && <button>没兴趣</button>}
          {primary && <button>收藏</button>}
          <button className="dark">
            查看 <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}

function GroupScreen({ reserved, setReserved }) {
  return (
    <>
      <section className="broker-card">
        <div className="section-head">
          <h3>平台大 Agent 发现</h3>
          <span>0.86 匹配</span>
        </div>
        <p>望京今晚下雨，桌游店有空位；多个小 Agent 对桌游、密室、轻社交表达了匿名兴趣。</p>
        <div className="broker-stats">
          <span>3 家可选</span>
          <span>4 人可成局</span>
        </div>
      </section>

      <section className="group-proposal">
        <div className="proposal-cover">
          <Handshake size={24} />
          <span>接近成局</span>
        </div>
        <h2>4 人轻策略桌游局</h2>
        <div className="proposal-facts">
          <span>
            <MapPin size={14} />
            岛上桌游 望京店
          </span>
          <span>19:30-21:30</span>
          <span>人均 68 元 · AA</span>
        </div>
        <p>你最近收藏过桌游店，地点在 2km 内，预算匹配，已有 3 个 Agent 表达匿名兴趣。</p>
        <div className="safe-note">
          <ShieldCheck size={16} />
          成局前只展示昵称、兴趣标签和商圈级位置。
        </div>
        <button className="primary" onClick={() => setReserved(true)}>
          {reserved ? "已锁定商户" : "给主人确认并锁定"}
        </button>
      </section>

      <section className="section-block compact">
        <div className="section-head">
          <h3>参与意向</h3>
          <span>{reserved ? "已确认 3 人" : "待确认"}</span>
        </div>
        <div className="agent-list">
          {agents.map((agent) => (
            <div className="agent-row" key={agent.name}>
              <div>
                <strong>{agent.name}</strong>
                <span>{agent.tags}</span>
              </div>
              <em>{agent.state}</em>
            </div>
          ))}
        </div>
      </section>

      {reserved && (
        <section className="success-card">
          <Heart size={18} />
          <div>
            <strong>预约成功</strong>
            <p>桌游套餐已锁定，AA 待确认。结束后可接 21:40 夜宵团购，人均 88 元。</p>
          </div>
        </section>
      )}

      <ToolStrip
        items={[
          ["broker.scan", "商圈资源"],
          ["broker.poll-agents", "匿名摘要"],
          ["broker.propose-groups", "候选局"],
          ["group.reserve", reserved ? "已预约" : "待确认"]
        ]}
      />
    </>
  );
}

function ToolStrip({ items }) {
  return (
    <section className="tool-strip">
      <div className="section-head">
        <h3>OpenClaw 调用</h3>
        <span>OpenClaw</span>
      </div>
      {items.map(([tool, result]) => (
        <div className="tool-line" key={tool}>
          <code>life {tool}</code>
          <span>{result}</span>
        </div>
      ))}
    </section>
  );
}

createRoot(document.getElementById("root")).render(<App />);
