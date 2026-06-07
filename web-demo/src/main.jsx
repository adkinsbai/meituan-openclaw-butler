import React, { useState, useRef, useEffect, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { 
  Bell, Bot, ChevronRight, Compass, Film, Heart, Home, 
  MapPin, MessageCircle, Sparkles, Ticket, Users, 
  Plane, Train, Hotel, Utensils, Music, Calendar,
  Mic, Send, Check, Clock, DollarSign, Star, Zap,
  User, Share2, ChevronDown, ChevronUp, Play, Pause, Volume2, VolumeX,
  Search, ArrowRight, Plus, MessageSquare, ThumbsUp, Bookmark,
  Camera, Dumbbell, Trophy, ShoppingBag
} from "lucide-react";
import "./styles.css";

// ============================================
// 视频资源（本地视频文件）
// ============================================
const VIDEOS = {
  beach: "/videos/小溪.mp4",
  city: "/videos/湖泊.mp4",
  food: "/videos/餐厅.mp4",
  nature: "/videos/自然风景森林.mp4",
  friends: "/videos/湖泊.mp4",
  movie: "/videos/自然风景森林.mp4"
};

// ============================================
// 小团团组件 - AI宠物
// ============================================
function TuanTuan({ userState = "idle", onInteract }) {
  const [mood, setMood] = useState("happy"); // happy, excited, sleepy, eating
  const [isAnimating, setIsAnimating] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [clickCount, setClickCount] = useState(0);
  const audioRef = useRef(null);

  // 小团团的语音消息
  const cuteMessages = [
    "团团~团团~",
    "哼唧哼唧~",
    "主人拍拍我~",
    "团团好开心呀~",
    "团团饿饿~",
    "团团想陪你玩~",
    "团团最爱你啦~",
    "团团在这里哦~"
  ];

  // 根据用户状态改变小团团的状态
  useEffect(() => {
    switch(userState) {
      case "eating":
        setMood("eating");
        setMessage("团团也在吃饭~吧唧吧唧~");
        break;
      case "watching":
        setMood("excited");
        setMessage("团团也在看电影~好精彩~");
        break;
      case "studying":
        setMood("focused");
        setMessage("团团陪你一起学习~加油~");
        break;
      case "exercising":
        setMood("excited");
        setMessage("团团为你加油~冲鸭~");
        break;
      default:
        setMood("happy");
    }
  }, [userState]);

  // 播放可爱声音
  const playCuteSound = useCallback(() => {
    // 使用 Web Audio API 生成可爱的声音
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // 设置频率和音量
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
      oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch(e) {
      console.log("Audio not supported");
    }
  }, []);

  // 点击/拍打小团团
  const handleInteract = useCallback(() => {
    setClickCount(prev => prev + 1);
    setIsAnimating(true);
    playCuteSound();
    
    // 显示随机消息
    const randomMessage = cuteMessages[Math.floor(Math.random() * cuteMessages.length)];
    setMessage(randomMessage);
    setShowMessage(true);
    
    // 触发父组件回调
    if (onInteract) onInteract(clickCount + 1);
    
    // 动画结束后重置 (更快响应)
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
    setTimeout(() => {
      setShowMessage(false);
    }, 1500);
  }, [clickCount, onInteract, playCuteSound]);

  // 获取小团团的表情
  const getMoodEmoji = () => {
    switch(mood) {
      case "eating": return "😋";
      case "excited": return "🤩";
      case "sleepy": return "😴";
      case "focused": return "🤓";
      default: return "😊";
    }
  };

  return (
    <div className={`tuantuan-container ${isAnimating ? 'bounce' : ''}`}>
      {/* 消息气泡 */}
      {showMessage && (
        <div className="tuantuan-message">
          <span>{message}</span>
        </div>
      )}
      
      {/* 小团团主体 */}
      <div className="tuantuan-body" onClick={handleInteract}>
        <video
          src="/videos/tuantuan-new.mp4"
          className="tuantuan-video"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="tuantuan-mood">{getMoodEmoji()}</div>
      </div>
      
      {/* 状态指示器 */}
      <div className="tuantuan-status">
        {userState === "eating" && <span>🍽️ 吃饭中</span>}
        {userState === "watching" && <span>🎬 看电影</span>}
        {userState === "studying" && <span>📚 学习中</span>}
        {userState === "exercising" && <span>💪 健身中</span>}
        {userState === "idle" && <span>✨ 陪你玩</span>}
      </div>
    </div>
  );
}

// ============================================
// 个性化推荐卡片组件
// ============================================
function PersonalizedCard({ icon, title, desc, action, onClick }) {
  return (
    <div className="personalized-card" onClick={onClick}>
      <div className="personalized-icon">{icon}</div>
      <div className="personalized-info">
        <h4>{title}</h4>
        <p>{desc}</p>
      </div>
      <button className="personalized-action">{action}</button>
    </div>
  );
}

// ============================================
// 视频卡片组件
// ============================================
function VideoCard({ video, poster, children, className = "", onClick }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <div className={`video-card ${className}`} onClick={onClick}>
      <video
        ref={videoRef}
        src={video}
        poster={poster}
        loop
        muted
        playsInline
        className="video-card-bg"
      />
      <div className="video-card-overlay" />
      <div className="video-card-content">
        {children}
      </div>
    </div>
  );
}

// ============================================
// Mock 数据
// ============================================
const MOCK_TRIP = {
  destination: "杭州",
  duration: "2天",
  budget: 2000,
  people: 1,
  total_price: 1881,
  savings: 219,
  itinerary: [
    {
      day: 1,
      date: "6月7日 周六",
      activities: [
        { time: "09:00", type: "transport", name: "高铁出发", detail: "G1234 北京南→杭州东", price: 553 },
        { time: "12:00", type: "restaurant", name: "新白鹿餐厅", detail: "评分4.7 | 人均¥68", price: 68 },
        { time: "14:00", type: "ticket", name: "西湖游船", detail: "西湖游船票", price: 55 },
        { time: "19:00", type: "restaurant", name: "楼外楼", detail: "评分4.5 | 人均¥128", price: 128 },
        { time: "20:30", type: "hotel", name: "全季酒店", detail: "¥389/晚 | 含早", price: 389 }
      ]
    },
    {
      day: 2,
      date: "6月8日 周日",
      activities: [
        { time: "09:00", type: "ticket", name: "灵隐寺", detail: "门票 | 建议游玩2-3小时", price: 75 },
        { time: "12:00", type: "restaurant", name: "知味观", detail: "评分4.6 | 人均¥85", price: 85 },
        { time: "16:00", type: "transport", name: "返程", detail: "高铁杭州东→北京南", price: 553 }
      ]
    }
  ]
};

// 组局主题数据
const GROUP_THEMES = [
  { id: 1, name: "K歌", icon: "🎤", video: VIDEOS.food, desc: "释放你的歌喉" },
  { id: 2, name: "剧本杀", icon: "🎭", video: VIDEOS.city, desc: "沉浸式推理体验" },
  { id: 3, name: "密室", icon: "🔐", video: VIDEOS.nature, desc: "挑战你的脑洞" },
  { id: 4, name: "徒步", icon: "🥾", video: VIDEOS.beach, desc: "走进大自然" },
  { id: 5, name: "约球", icon: "⚽", video: VIDEOS.friends, desc: "运动交友两不误" },
  { id: 6, name: "健身", icon: "💪", video: VIDEOS.movie, desc: "一起燃烧卡路里" }
];

// 附近的人数据
const NEARBY_PEOPLE = [
  { id: 1, name: "小明", avatar: "👨", looking: "周末K歌，差2人", distance: "500m", time: "2小时前" },
  { id: 2, name: "小红", avatar: "👩", looking: "剧本杀拼车，目前3等1", distance: "1.2km", time: "1小时前" },
  { id: 3, name: "小李", avatar: "👨", looking: "周六徒步，新手友好", distance: "800m", time: "30分钟前" },
  { id: 4, name: "小王", avatar: "👩", looking: "周日约羽毛球", distance: "2km", time: "3小时前" }
];

// 正在拼人的活动
const ONGOING_ACTIVITIES = [
  { id: 1, title: "周六K歌局", theme: "K歌", time: "周六 14:00-18:00", location: "朝阳大悦城KTV", people: "4/6人", price: "¥88/人" },
  { id: 2, title: "密室逃脱新手局", theme: "密室", time: "周日 10:00-12:00", location: "望京密室逃脱", people: "2/4人", price: "¥128/人" },
  { id: 3, title: "周末徒步活动", theme: "徒步", time: "周六 08:00-16:00", location: "香山公园", people: "8/15人", price: "免费" }
];

// 大家在干嘛数据
const SHARED_ACTIVITIES = [
  { id: 1, user: "张三", avatar: "👨", content: "周末去杭州玩了2天，西湖真的太美了！", likes: 128, comments: 23, image: "🏖️" },
  { id: 2, user: "李四", avatar: "👩", content: "和朋友聚餐，海底捞的服务真的没话说", likes: 89, comments: 15, image: "🍜" },
  { id: 3, user: "王五", avatar: "👨", content: "周末徒步10公里，感觉整个人都精神了", likes: 256, comments: 42, image: "🥾" },
  { id: 4, user: "赵六", avatar: "👩", content: "看了《消失的她》，剧情反转太精彩了", likes: 67, comments: 8, image: "🎬" }
];

// 个性化推荐数据（根据用户画像）
const PERSONALIZED_RECOMMENDATIONS = {
  photographer: [
    { id: 1, icon: "📷", title: "798摄影展", desc: "当代艺术摄影展，本周末最后一天", action: "去看看" },
    { id: 2, icon: "🌅", title: "日出拍摄团", desc: "金山岭长城日出摄影，专业指导", action: "报名" },
    { id: 3, icon: "📸", title: "人像摄影课", desc: "零基础学人像，周六下午", action: "预约" }
  ],
  hackathon: [
    { id: 1, icon: "🏆", title: "AI Hackathon 2026", desc: "6月15-16日，奖金10万", action: "报名" },
    { id: 2, icon: "🚄", title: "一键安排出行", desc: "已为你预订高铁+酒店", action: "查看" },
    { id: 3, icon: "🍜", title: "当地美食推荐", desc: "杭州必吃：西湖醋鱼、东坡肉", action: "收藏" }
  ],
  fitness: [
    { id: 1, icon: "🥗", title: "健康餐推荐", desc: "轻食沙拉，低卡高蛋白", action: "点餐" },
    { id: 2, icon: "🏋️", title: "今日训练计划", desc: "胸部+三头，预计45分钟", action: "开始" },
    { id: 3, icon: "⚠️", title: "团团提醒", desc: "检测到你有点炸鸡的冲动...", action: "查看详情" }
  ]
};

// ============================================
// 主应用
// ============================================
function App() {
  const [screen, setScreen] = useState("home");
  const [inputText, setInputText] = useState("");
  const [tripResult, setTripResult] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [userState, setUserState] = useState("idle");
  const [userProfile, setUserProfile] = useState("photographer"); // photographer, hackathon, fitness
  const [tuantuanClicks, setTuantuanClicks] = useState(0);
  const [showTuantuanTip, setShowTuantuanTip] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: "assistant", content: "主人好呀～我是团团🍙你的生活小管家！今天有什么我能帮你的嘛？不管是吃饭、出去玩、还是想聊聊心事，团团都在哦～" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);
  const inspirationRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleTripSearch = () => {
    if (inputText.includes("杭州") || inputText.includes("玩") || inputText.length > 0) {
      setTripResult(MOCK_TRIP);
    }
  };

  // 小团团互动回调
  const handleTuantuanInteract = useCallback((clicks) => {
    setTuantuanClicks(clicks);
    if (clicks >= 5 && !showTuantuanTip) {
      setShowTuantuanTip(true);
      setTimeout(() => setShowTuantuanTip(false), 5000);
    }
  }, [showTuantuanTip]);

  // 灵感区域拖拽滑动
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - inspirationRef.current.offsetLeft);
    setScrollLeft(inspirationRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - inspirationRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    inspirationRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 获取个性化推荐
  const getPersonalizedRecommendations = () => {
    return PERSONALIZED_RECOMMENDATIONS[userProfile] || [];
  };

  // 预设场景快捷按钮
  const PRESET_SCENARIOS = [
    {
      icon: "🍚", label: "推荐午餐",
      userMsg: "团团，中午吃什么呀？帮我推荐一下",
      reply: `主人中午好呀～团团看了下你这周的饮食记录📝\n\n你已经连着三天吃重口味的了，今天换个清爽的吧！团团给你挑了几个👇\n\n🥗 鲜蔬工坊 · 藜麦鸡胸沙拉\n评分 4.8 | 高蛋白低卡 | 团团券 ¥28（原价¥38）\n\n🍜 味千拉面 · 番茄肥牛拉面\n评分 4.6 | 暖胃首选 | ¥32\n\n🍱 吉野家 · 照烧鸡腿饭套餐\n评分 4.5 | 有菜有肉均衡搭配 | ¥29\n\n主人想吃哪个呀？团团可以帮你一键下单哦～今天鲜蔬工坊有团团专属8折券！🍙`
    },
    {
      icon: "🎵", label: "出去玩",
      userMsg: "团团，最近好累，想出去放松一下",
      reply: `主人辛苦啦～团团注意到你已经 18 天没有出去玩了🥺 工作再忙也要好好休息呀！\n\n团团帮你找了附近几个放松好去处👇\n\n💆 悦泉推拿 · 60分钟全身推拿\n评分 4.9 | 含热石理疗 | 距你800m\n团团价 ¥128（原价¥198）\n\n♨️ 汤泉物语 · 温泉+汗蒸\n评分 4.7 | 18小时畅玩含餐 | 距你2km\n¥158/位\n\n🎤 麦乐迪KTV · 下午场欢唱3小时\n评分 4.6 | 含小食饮料 | 距你1.2km\n¥68/人\n\n主人想选哪个呀？团团帮你预约～如果想约朋友一起，团团还能帮你发组局邀请哦！🎵`
    },
    {
      icon: "💪", label: "健身计划",
      userMsg: "团团，我想开始健身，你能帮我吗",
      reply: `太棒了主人！团团超支持你的！💪\n\n团团帮你做了个完整的健身入门方案👇\n\n🏋️ 健身房推荐\n「活力健身」距你500m · 评分4.8\n新人月卡团团价 ¥199（原价¥399）\n含1次免费私教体验课\n\n📋 本周训练计划（新手友好）\n周一：胸+三头 40min\n周三：背+二头 40min\n周五：腿+肩 45min\n周日：有氧+拉伸 30min\n\n🥗 饮食搭配建议\n训练日：高蛋白低碳水（鸡胸肉+糙米+西兰花）\n休息日：正常饮食，多吃蔬菜水果\n\n团团会每天提醒你训练，还会帮你推荐健身餐哦～坚持一周团团给你发小红花！🌸\n\n要不要先办个体验卡试试？`
    },
    {
      icon: "✈️", label: "帮我规划旅行",
      userMsg: "团团，我想周末去杭州玩两天，预算2000块",
      reply: `好嘞主人！团团帮你规划好了～杭州超美的！🌸\n\n📋 杭州2日游方案\n\n🚄 交通\n去程：周六 07:30 G1234 北京南→杭州东 ¥553\n回程：周日 16:00 G5678 杭州东→北京南 ¥553\n\n🏨 住宿\n全季酒店·西湖店 ¥389/晚 含早\n步行10分钟到西湖\n\n🍽️ 美餐\n午餐：新白鹿餐厅（评分4.7 人均¥68）\n晚餐：楼外楼（评分4.5 人均¥128 必点西湖醋鱼！）\n\n🎫 景点\n西湖游船 ¥55 | 灵隐寺 ¥75\n\n💰 总计 ¥1,881 比预算省了 ¥119！\n\n主人觉得怎么样？如果满意的话团团可以一键帮你全部订好～酒店、高铁、餐厅、门票全搞定，你只需要收拾行李就好啦！✨`
    }
  ];

  // 触发预设场景
  const triggerPreset = (scenario) => {
    setChatMessages(prev => [...prev, { role: "user", content: scenario.userMsg }]);
    setChatLoading(true);
    // 模拟打字延迟后显示预设回复
    setTimeout(() => {
      setChatMessages(prev => [...prev, { role: "assistant", content: scenario.reply }]);
      setChatLoading(false);
    }, 1200);
  };

  // 发送聊天消息给团团
  const sendChatMessage = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setChatMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setChatLoading(true);

    try {
      const res = await fetch("https://token-plan-cn.xiaomimimo.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer tp-cy32x5hceteky7ryi57w6l3yn1c9wriz1msacmf006pfmcvl"
        },
        body: JSON.stringify({
          model: "mimo-v2.5-pro",
          messages: [
            { role: "system", content: "你是团团🍙，美团的AI生活管家。你超级可爱、呆萌、温暖，说话带语气词和emoji，像一个贴心的小棉袄。你关心用户的饮食健康、娱乐生活、出行安排，会主动提醒用户吃饭、休息、运动。你说话风格：可爱、温柔、简短（每次回复控制在3-5句话内），偶尔卖萌，用「～」「呀」「哦」「嘛」等语气词。你是用户的伙伴，不是冷冰冰的工具。记住：你爱用户，保护用户，用心陪伴用户。" },
            ...chatMessages.map(m => ({ role: m.role, content: m.content })),
            { role: "user", content: userMsg }
          ],
          temperature: 0.8,
          max_tokens: 300
        })
      });
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || "团团暂时有点迷糊了，等会儿再聊嘛～";
      setChatMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      setChatMessages(prev => [...prev, { role: "assistant", content: "呜呜，团团网络断了一下，主人再说一次嘛～" }]);
    }
    setChatLoading(false);
  };

  // 聊天自动滚到底部（只滚聊天区域，不滚页面）
  useEffect(() => {
    const area = document.querySelector('.chat-messages-area');
    if (area) {
      area.scrollTop = area.scrollHeight;
    }
  }, [chatMessages, chatLoading]);

  return (
    <div className="phone-frame">
      {/* 状态栏 */}
      <div className="status-bar">
        <span>9:41</span>
        <div className="status-icons">
          <span>📶</span>
          <span>🔋</span>
        </div>
      </div>

      {/* 主屏幕 */}
      <div className="phone-screen">
        {/* 首页 */}
        {screen === "home" && (
          <div className="home-screen">
            {/* 头部 */}
            <div className="home-header">
              <div className="header-left">
                <Bot size={20} />
                <span>美团生活管家</span>
              </div>
              <Bell size={20} />
            </div>

            {/* 小团团宠物区域 */}
            <div className="tuantuan-section">
              <TuanTuan 
                userState={userState} 
                onInteract={handleTuantuanInteract}
              />
              {showTuantuanTip && (
                <div className="tuantuan-tip">
                  <span>🎉 团团已经记住你的喜好啦~</span>
                </div>
              )}
            </div>

            {/* 和团团聊天 */}
            <div className="section chat-section">
              <div className="section-header">
                <h3>💬 和团团聊天</h3>
                <span className="more">在线</span>
              </div>
              <div className="preset-scenarios">
                {PRESET_SCENARIOS.map((s, i) => (
                  <button key={i} className="preset-btn" onClick={() => triggerPreset(s)} disabled={chatLoading}>
                    <span className="preset-icon">{s.icon}</span>
                    <span className="preset-label">{s.label}</span>
                  </button>
                ))}
              </div>
              <div className="chat-container">
                <div className="chat-messages-area">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`chat-bubble ${msg.role === "user" ? "chat-user" : "chat-tuantuan"}`}>
                      {msg.role === "assistant" && <span className="bubble-avatar">🍙</span>}
                      <div className="bubble-text">{msg.content}</div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="chat-bubble chat-tuantuan">
                      <span className="bubble-avatar">🍙</span>
                      <div className="bubble-text typing-dots"><span>·</span><span>·</span><span>·</span></div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                <div className="chat-input-bar">
                  <input
                    type="text"
                    placeholder="和团团说点什么吧～"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendChatMessage()}
                    disabled={chatLoading}
                  />
                  <button onClick={sendChatMessage} disabled={chatLoading || !chatInput.trim()}>
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* 功能入口卡片 */}
            <div className="feature-grid">
              <VideoCard 
                video={VIDEOS.beach}
                className="feature-card trip-card"
                onClick={() => setScreen("trip")}
              >
                <Plane size={24} />
                <h3>行程规划</h3>
                <p>帮你安排一整天</p>
              </VideoCard>

              <VideoCard 
                video={VIDEOS.friends}
                className="feature-card group-card"
                onClick={() => setScreen("group")}
              >
                <Users size={24} />
                <h3>多人组局</h3>
                <p>朋友聚会一键搞定</p>
              </VideoCard>
            </div>

            {/* 灵感推荐 - 支持拖拽 */}
            <div className="section">
              <div className="section-header">
                <h3>💡 今日灵感</h3>
                <span className="more" onClick={() => setScreen("inspiration")}>更多</span>
              </div>
              
              <div 
                className="inspiration-scroll"
                ref={inspirationRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <div className="inspiration-card" onClick={() => setScreen("inspiration")}>
                  <div className="inspiration-icon">🎬</div>
                  <h4>看电影</h4>
                  <p>《消失的她》正在热映</p>
                  <span className="price">¥45起</span>
                </div>
                <div className="inspiration-card" onClick={() => setScreen("inspiration")}>
                  <div className="inspiration-icon">🎲</div>
                  <h4>桌游局</h4>
                  <p>岛上桌游望京店</p>
                  <span className="price">¥68/人</span>
                </div>
                <div className="inspiration-card" onClick={() => setScreen("inspiration")}>
                  <div className="inspiration-icon">✨</div>
                  <h4>手作体验</h4>
                  <p>朝阳大悦城5F</p>
                  <span className="price">¥79/人</span>
                </div>
                <div className="inspiration-card" onClick={() => setScreen("inspiration")}>
                  <div className="inspiration-icon">🎤</div>
                  <h4>K歌</h4>
                  <p>周末嗨唱3小时</p>
                  <span className="price">¥88/人</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 行程规划 - 聊天风格 */}
        {screen === "trip" && (
          <div className="detail-screen chat-screen">
            {/* 视频背景头部 */}
            <div className="trip-video-header">
              <video
                src={VIDEOS.beach}
                autoPlay
                loop
                muted
                playsInline
                className="trip-video-bg"
              />
              <div className="trip-video-overlay" />
              <div className="trip-video-content">
                <button className="trip-back-btn" onClick={() => { setScreen("home"); setTripResult(null); setInputText(""); }}>
                  ← 返回
                </button>
                <h2>✈️ 行程规划</h2>
                <p>AI 帮你安排完美旅程</p>
              </div>
            </div>

            {/* 聊天消息区域 */}
            <div className="chat-messages">
              {/* AI 欢迎消息 */}
              <div className="message ai-message">
                <div className="message-avatar">🤖</div>
                <div className="message-bubble">
                  <p>你好！我是你的行程规划助手 ✈️</p>
                  <p>告诉我你想要什么样的旅行，我来帮你安排！</p>
                </div>
              </div>

              {/* 案例展示 */}
              <div className="message ai-message">
                <div className="message-avatar">🤖</div>
                <div className="message-bubble">
                  <p>你可以这样问我：</p>
                  <div className="example-chips">
                    <span className="example-chip" onClick={() => setInputText("周末想去杭州玩2天，预算2000")}>
                      🏖️ 周末想去杭州玩2天
                    </span>
                    <span className="example-chip" onClick={() => setInputText("准备去哪开演唱会？推荐几个场地")}>
                      🎤 准备去哪开演唱会
                    </span>
                    <span className="example-chip" onClick={() => setInputText("我在北京，周末想出去玩")}>
                      📍 告诉我你在哪
                    </span>
                    <span className="example-chip" onClick={() => setInputText("帮我规划一个3天的旅行")}>
                      🎲 随机推荐一个目的地
                    </span>
                  </div>
                </div>
              </div>

              {/* 用户消息 */}
              {inputText && (
                <div className="message user-message">
                  <div className="message-bubble">
                    <p>{inputText}</p>
                  </div>
                </div>
              )}

              {/* AI 回复 - 行程结果 */}
              {tripResult && (
                <div className="message ai-message">
                  <div className="message-avatar">🤖</div>
                  <div className="message-bubble trip-result-bubble">
                    <p>好的！为你规划了 <strong>{tripResult.destination} {tripResult.duration}游</strong></p>
                    
                    <div className="trip-summary">
                      <div className="trip-meta">
                        <span><Calendar size={12} /> {tripResult.duration}</span>
                        <span><Users size={12} /> {tripResult.people}人</span>
                        <span><DollarSign size={12} /> ¥{tripResult.budget}</span>
                      </div>
                      
                      <div className="price-row">
                        <div>
                          <span className="label">预估费用</span>
                          <span className="value">¥{tripResult.total_price}</span>
                        </div>
                        <div className="savings">
                          <span className="label">已节省</span>
                          <span className="value">¥{tripResult.savings}</span>
                        </div>
                      </div>
                    </div>

                    {/* 行程详情 */}
                    {tripResult.itinerary.map(day => (
                      <div key={day.day} className="day-card">
                        <div className="day-header">
                          <span>Day {day.day}</span>
                          <span>{day.date}</span>
                        </div>
                        {day.activities.map((act, i) => (
                          <div key={i} className="activity-row">
                            <span className="time">{act.time}</span>
                            <div className="info">
                              <h4>{act.name}</h4>
                              <p>{act.detail}</p>
                            </div>
                            <span className="price">¥{act.price}</span>
                          </div>
                        ))}
                      </div>
                    ))}

                    <div className="action-row">
                      <button className="primary-btn"><Check size={14} /> 一键预订</button>
                      <button className="secondary-btn"><Share2 size={14} /> 分享</button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 输入区域 */}
            <div className="chat-input-area">
              <div className="chat-input-box">
                <input
                  type="text"
                  placeholder="告诉我你想去哪里玩..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && inputText.trim()) {
                      handleTripSearch();
                    }
                  }}
                />
                <button className="dice-btn" onClick={() => {
                  const examples = ["周末想去杭州玩2天", "准备去三亚度假", "北京周边一日游", "上海周末游"];
                  setInputText(examples[Math.floor(Math.random() * examples.length)]);
                }}>
                  🎲
                </button>
                <button className="send-btn" onClick={() => {
                  if (inputText.trim()) handleTripSearch();
                }}>
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 多人组局 - 主题选择 */}
        {screen === "group" && !selectedTheme && (
          <div className="detail-screen">
            <div className="detail-header">
              <button onClick={() => setScreen("home")}>← 返回</button>
              <h2>多人组局</h2>
              <div></div>
            </div>

            {/* 搜索框 */}
            <div className="group-search-bar">
              <Search size={16} />
              <input type="text" placeholder="搜索活动类型、地点..." />
            </div>

            <div className="group-theme-grid">
              {GROUP_THEMES.map(theme => (
                <VideoCard
                  key={theme.id}
                  video={theme.video}
                  className="theme-card"
                  onClick={() => setSelectedTheme(theme)}
                >
                  <span className="theme-icon">{theme.icon}</span>
                  <h3>{theme.name}</h3>
                  <p>{theme.desc}</p>
                </VideoCard>
              ))}
            </div>

            {/* 正在拼人的活动 */}
            <div className="section">
              <div className="section-header">
                <h3>🔥 正在拼人</h3>
                <span className="more">查看更多</span>
              </div>
              <div className="ongoing-activities">
                {ONGOING_ACTIVITIES.map(activity => (
                  <div key={activity.id} className="activity-card" onClick={() => {
                    const theme = GROUP_THEMES.find(t => t.name === activity.theme);
                    if (theme) setSelectedTheme(theme);
                  }}>
                    <div className="activity-info">
                      <h4>{activity.title}</h4>
                      <p><Clock size={12} /> {activity.time}</p>
                      <p><MapPin size={12} /> {activity.location}</p>
                    </div>
                    <div className="activity-meta">
                      <span className="people-count">{activity.people}</span>
                      <span className="price">{activity.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 多人组局 - 主题详情 */}
        {screen === "group" && selectedTheme && (
          <div className="detail-screen">
            <div className="detail-header">
              <button onClick={() => setSelectedTheme(null)}>← 返回</button>
              <h2>{selectedTheme.icon} {selectedTheme.name}</h2>
              <button className="invite-btn" onClick={() => setShowInviteModal(true)}>
                <Plus size={16} /> 发起邀约
              </button>
            </div>

            <VideoCard 
              video={selectedTheme.video}
              className="theme-cover"
            >
              <h2>{selectedTheme.name}</h2>
              <p>{selectedTheme.desc}</p>
            </VideoCard>

            {/* 附近的人 */}
            <div className="section">
              <div className="section-header">
                <h3>📍 附近的人</h3>
                <span className="more">筛选</span>
              </div>
              <div className="nearby-people">
                {NEARBY_PEOPLE.map(person => (
                  <div key={person.id} className="person-card">
                    <div className="person-avatar">{person.avatar}</div>
                    <div className="person-info">
                      <h4>{person.name}</h4>
                      <p className="looking-for">{person.looking}</p>
                      <div className="person-meta">
                        <span><MapPin size={12} /> {person.distance}</span>
                        <span><Clock size={12} /> {person.time}</span>
                      </div>
                    </div>
                    <button className="join-btn">加入</button>
                  </div>
                ))}
              </div>
            </div>

            {/* 发起邀约按钮 */}
            <div className="create-invite-section">
              <button className="create-invite-btn" onClick={() => setShowInviteModal(true)}>
                <Plus size={20} /> 发起新的邀约
              </button>
            </div>
          </div>
        )}

        {/* 灵感推荐 */}
        {screen === "inspiration" && (
          <div className="detail-screen">
            <div className="detail-header">
              <button onClick={() => setScreen("home")}>← 返回</button>
              <h2>今日灵感</h2>
              <div></div>
            </div>

            <div className="env-bar">
              <span>📍 望京</span>
              <span>🌧️ 小雨 18°C</span>
              <span>🕐 周六 14:00</span>
            </div>

            <div className="section">
              <h3>🔥 本周热门</h3>
              <div className="inspiration-list">
                <VideoCard video={VIDEOS.movie} className="inspiration-video-item">
                  <div className="item-icon">🎬</div>
                  <div className="item-info">
                    <h4>《消失的她》</h4>
                    <p>万达影城 · 16:20</p>
                  </div>
                  <div className="item-action">
                    <span className="price">¥45</span>
                    <button>购票</button>
                  </div>
                </VideoCard>
                <VideoCard video={VIDEOS.city} className="inspiration-video-item">
                  <div className="item-icon">🎲</div>
                  <div className="item-info">
                    <h4>桌游局</h4>
                    <p>岛上桌游望京店</p>
                  </div>
                  <div className="item-action">
                    <span className="price">¥68</span>
                    <button>查看</button>
                  </div>
                </VideoCard>
                <VideoCard video={VIDEOS.nature} className="inspiration-video-item">
                  <div className="item-icon">✨</div>
                  <div className="item-info">
                    <h4>手作香薰体验</h4>
                    <p>朝阳大悦城5F</p>
                  </div>
                  <div className="item-action">
                    <span className="price">¥79</span>
                    <button>预约</button>
                  </div>
                </VideoCard>
              </div>
            </div>

            <div className="section">
              <h3>🎲 适合雨天</h3>
              <div className="inspiration-list">
                <VideoCard video={VIDEOS.food} className="inspiration-video-item">
                  <div className="item-icon">🎤</div>
                  <div className="item-info">
                    <h4>K歌3小时</h4>
                    <p>朝阳大悦城KTV</p>
                  </div>
                  <div className="item-action">
                    <span className="price">¥88</span>
                    <button>预订</button>
                  </div>
                </VideoCard>
                <VideoCard video={VIDEOS.friends} className="inspiration-video-item">
                  <div className="item-icon">🎳</div>
                  <div className="item-info">
                    <h4>保龄球</h4>
                    <p>望京保龄球馆</p>
                  </div>
                  <div className="item-action">
                    <span className="price">¥58</span>
                    <button>预订</button>
                  </div>
                </VideoCard>
              </div>
            </div>

            <div className="section">
              <h3>✨ 新发现</h3>
              <div className="inspiration-list">
                <VideoCard video={VIDEOS.nature} className="inspiration-video-item">
                  <div className="item-icon">🧘</div>
                  <div className="item-info">
                    <h4>瑜伽体验课</h4>
                    <p>朝阳大悦城3F</p>
                  </div>
                  <div className="item-action">
                    <span className="price">¥9.9</span>
                    <button>预约</button>
                  </div>
                </VideoCard>
                <VideoCard video={VIDEOS.beach} className="inspiration-video-item">
                  <div className="item-icon">🎨</div>
                  <div className="item-info">
                    <h4>油画体验</h4>
                    <p>798艺术区</p>
                  </div>
                  <div className="item-action">
                    <span className="price">¥128</span>
                    <button>预约</button>
                  </div>
                </VideoCard>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 底部导航 */}
      <div className="bottom-bar">
        <span className={screen === "home" ? "active" : ""} onClick={() => { setScreen("home"); setSelectedTheme(null); setInputText(""); }}>
          <Home size={18} />
          <span>首页</span>
        </span>
        <span className={screen === "trip" ? "active" : ""} onClick={() => { setScreen("trip"); setTripResult(null); setInputText(""); }}>
          <Plane size={18} />
          <span>行程</span>
        </span>
        <span className={screen === "group" ? "active" : ""} onClick={() => { setScreen("group"); setSelectedTheme(null); }}>
          <Users size={18} />
          <span>组局</span>
        </span>
        <span className={screen === "inspiration" ? "active" : ""} onClick={() => setScreen("inspiration")}>
          <Sparkles size={18} />
          <span>灵感</span>
        </span>
      </div>

      {/* 发起邀约弹窗 */}
      {showInviteModal && (
        <div className="modal-overlay" onClick={() => setShowInviteModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>发起邀约</h3>
              <button onClick={() => setShowInviteModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>活动主题</label>
                <input type="text" placeholder="如：周末K歌局" />
              </div>
              <div className="form-group">
                <label>活动时间</label>
                <input type="text" placeholder="如：周六 14:00-18:00" />
              </div>
              <div className="form-group">
                <label>活动地点</label>
                <input type="text" placeholder="如：朝阳大悦城KTV" />
              </div>
              <div className="form-group">
                <label>需要人数</label>
                <input type="number" placeholder="如：4" />
              </div>
              <div className="form-group">
                <label>活动描述</label>
                <textarea placeholder="描述一下活动内容..."></textarea>
              </div>
              <button className="submit-btn">发布邀约</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
