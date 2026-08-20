from pathlib import Path
import zipfile, textwrap

root = Path("/mnt/data/neon-nexus-react")
(root/"src").mkdir(parents=True, exist_ok=True)

files = {
"package.json": r'''{
  "name": "neon-nexus",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-router-dom": "^7.8.2"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^5.0.2",
    "vite": "^7.1.3"
  }
}''',

"index.html": r'''<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#070b16" />
    <title>Neon Nexus</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>''',

"src/main.jsx": r'''import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, NavLink, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import "./styles.css";

const games = [
  { id: 1, title: "Neon Arena", genre: "Action", rating: "9.4", players: "12K", icon: "⚡", gradient: "g1", description: "Fast cyberpunk arena battles with responsive movement." },
  { id: 2, title: "Pixel Rift", genre: "Adventure", rating: "9.1", players: "8.7K", icon: "🌀", gradient: "g2", description: "Explore strange worlds, solve puzzles and uncover secrets." },
  { id: 3, title: "Skybound", genre: "Racing", rating: "8.9", players: "6.2K", icon: "🚀", gradient: "g3", description: "High-speed futuristic racing above a neon megacity." },
  { id: 4, title: "Void Runner", genre: "Arcade", rating: "8.7", players: "5.4K", icon: "☄️", gradient: "g4", description: "Survive endless waves and chase a new high score." },
  { id: 5, title: "Cyber Chess", genre: "Strategy", rating: "8.8", players: "4.1K", icon: "♟", gradient: "g5", description: "Classic strategy redesigned for the digital age." },
  { id: 6, title: "Starforge", genre: "Simulation", rating: "8.6", players: "3.8K", icon: "✦", gradient: "g6", description: "Build your own futuristic colony among the stars." }
];

const initialUsers = [
  { id: 1, name: "Aayushmaan", email: "aayushmaan@example.com", level: 27, xp: 7820, status: "Online" },
  { id: 2, name: "ShadowByte", email: "shadow@example.com", level: 21, xp: 6210, status: "Online" },
  { id: 3, name: "PixelKing", email: "pixel@example.com", level: 18, xp: 4980, status: "Away" },
  { id: 4, name: "NovaX", email: "nova@example.com", level: 14, xp: 3610, status: "Offline" }
];

function useStoredUser() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("nn_user") || "null"));
  const login = (data) => {
    const next = { name: data.name || "Player", email: data.email, level: 27, xp: 7820 };
    localStorage.setItem("nn_user", JSON.stringify(next));
    setUser(next);
  };
  const logout = () => { localStorage.removeItem("nn_user"); setUser(null); };
  return { user, login, logout };
}

function App() {
  const auth = useStoredUser();
  return (
    <Routes>
      <Route path="/login" element={auth.user ? <Navigate to="/dashboard" /> : <Auth mode="login" onAuth={auth.login} />} />
      <Route path="/signup" element={auth.user ? <Navigate to="/dashboard" /> : <Auth mode="signup" onAuth={auth.login} />} />
      <Route path="*" element={<Shell user={auth.user} logout={auth.logout} />} />
    </Routes>
  );
}

function Shell({ user, logout }) {
  return (
    <div className="app-shell">
      <Sidebar user={user} logout={logout} />
      <main className="main">
        <Topbar user={user} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<Games />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/dashboard" element={<Protected user={user}><Dashboard user={user} /></Protected>} />
          <Route path="/profile" element={<Protected user={user}><Profile user={user} /></Protected>} />
          <Route path="/settings" element={<Protected user={user}><Settings /></Protected>} />
          <Route path="/admin" element={<Protected user={user}><Admin /></Protected>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

function Protected({ user, children }) {
  return user ? children : <Navigate to="/login" replace />;
}

function Sidebar({ user, logout }) {
  const links = [
    ["/", "⌂", "Home"],
    ["/games", "◈", "Games"],
    ["/leaderboard", "♛", "Leaderboard"],
    ["/dashboard", "▦", "Dashboard"],
    ["/profile", "◉", "Profile"],
    ["/settings", "⚙", "Settings"]
  ];
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">N</div>
        <div><b>NEON</b><span>NEXUS</span></div>
      </div>
      <div className="side-label">NAVIGATION</div>
      <nav>{links.map(([to, icon, label]) =>
        <NavLink key={to} to={to} className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <i>{icon}</i><span>{label}</span>
        </NavLink>
      )}</nav>
      <div className="side-label">SYSTEM</div>
      <NavLink to="/admin" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}><i>▣</i><span>Admin Panel</span></NavLink>
      <div className="sidebar-bottom">
        {user ? (
          <>
            <div className="mini-user"><div className="avatar">{user.name[0]}</div><div><b>{user.name}</b><small>Level {user.level}</small></div></div>
            <button className="logout" onClick={logout}>↪ Sign out</button>
          </>
        ) : <NavLink className="login-side" to="/login">Sign in →</NavLink>}
      </div>
    </aside>
  );
}

function Topbar({ user }) {
  const navigate = useNavigate();
  return <header className="topbar">
    <div className="mobile-brand">NEON<span>NEXUS</span></div>
    <div className="search"><span>⌕</span><input placeholder="Search games, players..." onKeyDown={e => e.key === "Enter" && navigate("/games")} /></div>
    <div className="top-actions">
      <button className="icon-btn" title="Notifications">♢</button>
      {user ? <button className="profile-pill" onClick={() => navigate("/profile")}><span className="avatar small">{user.name[0]}</span>{user.name}</button> : <button className="primary compact" onClick={() => navigate("/login")}>Sign in</button>}
    </div>
  </header>;
}

function Home() {
  const navigate = useNavigate();
  return <div className="page">
    <section className="hero">
      <div className="hero-copy">
        <div className="eyebrow">SYSTEM ONLINE <span></span></div>
        <h1>ENTER THE<br/><em>NEON NEXUS.</em></h1>
        <p>A futuristic gaming hub for discovering games, tracking progress, climbing leaderboards and connecting with the community.</p>
        <div className="hero-actions"><button className="primary" onClick={() => navigate("/games")}>Explore Games <b>→</b></button><button className="ghost" onClick={() => navigate("/signup")}>Create Account</button></div>
      </div>
      <div className="hero-orb"><div className="orb-ring r1"></div><div className="orb-ring r2"></div><div className="orb-core">N</div></div>
    </section>
    <section className="section">
      <SectionTitle title="TRENDING NOW" action="View all" to="/games" />
      <div className="game-grid">{games.slice(0,3).map(g => <GameCard game={g} key={g.id} />)}</div>
    </section>
    <section className="stats-strip">
      <Stat value="36K+" label="ACTIVE PLAYERS" />
      <Stat value="128" label="GAMES" />
      <Stat value="4.8/5" label="COMMUNITY RATING" />
      <Stat value="99.9%" label="UPTIME" />
    </section>
  </div>;
}

function SectionTitle({title, action, to}) {
  return <div className="section-title"><div><span className="line"></span><h2>{title}</h2></div>{action && <NavLink to={to}>{action} →</NavLink>}</div>;
}

function GameCard({game}) {
  const [liked, setLiked] = useState(false);
  return <article className="game-card">
    <div className={`game-art ${game.gradient}`}><span className="game-icon">{game.icon}</span><button className={liked ? "heart liked" : "heart"} onClick={() => setLiked(!liked)}>{liked ? "♥" : "♡"}</button><div className="rating">★ {game.rating}</div></div>
    <div className="game-info"><div><span className="tag">{game.genre}</span><h3>{game.title}</h3></div><span className="players">● {game.players}</span></div>
    <p>{game.description}</p>
    <button className="play-btn">PLAY NOW <span>↗</span></button>
  </article>;
}

function Games() {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Action", "Adventure", "Racing", "Arcade", "Strategy", "Simulation"];
  const shown = filter === "All" ? games : games.filter(g => g.genre === filter);
  return <div className="page">
    <div className="page-heading"><div><span className="eyebrow">DISCOVER</span><h1>Game Library</h1><p>Find your next obsession.</p></div></div>
    <div className="filters">{filters.map(f => <button className={filter === f ? "filter active" : "filter"} onClick={() => setFilter(f)} key={f}>{f}</button>)}</div>
    <div className="game-grid">{shown.map(g => <GameCard game={g} key={g.id} />)}</div>
  </div>;
}

function Dashboard({user}) {
  return <div className="page">
    <div className="page-heading"><div><span className="eyebrow">WELCOME BACK</span><h1>{user.name}</h1><p>Your command center is ready.</p></div><div className="level-badge">LVL {user.level}<small>{user.xp.toLocaleString()} XP</small></div></div>
    <div className="dashboard-grid">
      <div className="panel progress-panel"><div className="panel-title"><b>LEVEL PROGRESS</b><span>Next: Level {user.level + 1}</span></div><div className="progress"><i style={{width:"72%"}}></i></div><div className="progress-meta"><span>{user.xp.toLocaleString()} XP</span><span>10,000 XP</span></div><div className="xp-big">72%</div></div>
      <div className="panel"><div className="panel-title"><b>QUICK STATS</b></div><div className="quick-stats"><Stat value="47" label="MATCHES" /><Stat value="31" label="WINS" /><Stat value="18h" label="PLAY TIME" /></div></div>
    </div>
    <section className="section"><SectionTitle title="RECENT GAMES" /><div className="recent-list">{games.slice(0,4).map((g,i)=><div className="recent" key={g.id}><div className={`recent-icon ${g.gradient}`}>{g.icon}</div><div><b>{g.title}</b><small>{i % 2 ? "2 hours ago" : "Yesterday"}</small></div><span className="recent-score">{i % 2 ? "1,420 XP" : "2,080 XP"}</span></div>)}</div></section>
  </div>;
}

function Leaderboard() {
  const players = [...initialUsers, {id:5,name:"Circuit",email:"",level:12,xp:3190,status:"Online"}].sort((a,b)=>b.xp-a.xp);
  return <div className="page"><div className="page-heading"><div><span className="eyebrow">COMPETE</span><h1>Leaderboard</h1><p>Top players across the Nexus.</p></div></div>
    <div className="leaderboard">{players.map((p,i)=><div className="leader-row" key={p.id}><div className={`rank rank-${i+1}`}>{i+1}</div><div className="avatar">{p.name[0]}</div><div className="leader-name"><b>{p.name}</b><small>Level {p.level}</small></div><div className="leader-xp">{p.xp.toLocaleString()} <span>XP</span></div></div>)}</div>
  </div>;
}

function Profile({user}) {
  return <div className="page"><div className="profile-header"><div className="profile-avatar">{user.name[0]}</div><div><span className="eyebrow">PLAYER PROFILE</span><h1>{user.name}</h1><p>{user.email}</p></div><button className="ghost">Edit Profile</button></div><div className="dashboard-grid"><div className="panel"><div className="panel-title"><b>ACHIEVEMENTS</b></div><div className="achievements"><div>⚡<b>First Strike</b><small>Win your first match</small></div><div>♛<b>Rising Star</b><small>Reach level 10</small></div><div>✦<b>Explorer</b><small>Play 5 games</small></div></div></div><div className="panel"><div className="panel-title"><b>ACCOUNT</b></div><div className="account-lines"><span>Member since <b>August 2026</b></span><span>Rank <b>Neon Elite</b></span><span>XP <b>{user.xp.toLocaleString()}</b></span></div></div></div></div>;
}

function Settings() {
  const [sound,setSound]=useState(true),[motion,setMotion]=useState(true),[theme,setTheme]=useState("Neon Dark");
  return <div className="page"><div className="page-heading"><div><span className="eyebrow">CONFIGURATION</span><h1>Settings</h1><p>Customize your Nexus experience.</p></div></div><div className="settings-list">
    <Setting title="Interface Theme" desc="Choose your visual environment"><select value={theme} onChange={e=>setTheme(e.target.value)}><option>Neon Dark</option><option>Midnight</option><option>High Contrast</option></select></Setting>
    <Setting title="Sound Effects" desc="Enable interface and game sounds"><Toggle on={sound} setOn={setSound}/></Setting>
    <Setting title="Motion Effects" desc="Enable animated transitions and effects"><Toggle on={motion} setOn={setMotion}/></Setting>
    <Setting title="Public Profile" desc="Allow other players to see your profile"><Toggle on={true} setOn={()=>{}}/></Setting>
  </div></div>;
}
function Setting({title,desc,children}) { return <div className="setting"><div><b>{title}</b><p>{desc}</p></div>{children}</div> }
function Toggle({on,setOn}) { return <button className={on?"toggle on":"toggle"} onClick={()=>setOn(!on)}><span></span></button> }

function Admin() {
  const [users,setUsers]=useState(initialUsers);
  const remove=(id)=>setUsers(users.filter(u=>u.id!==id));
  return <div className="page"><div className="page-heading"><div><span className="eyebrow">CONTROL CENTER</span><h1>Admin Panel</h1><p>Manage the Nexus community.</p></div><div className="admin-chip">ADMIN MODE</div></div><div className="admin-stats"><Stat value={users.length} label="USERS" /><Stat value="128" label="GAMES" /><Stat value="36K+" label="SESSIONS" /><Stat value="99.9%" label="UPTIME" /></div><div className="panel table-panel"><div className="panel-title"><b>USER MANAGEMENT</b><button className="primary compact" onClick={()=>alert("User creation form would open here.")}>+ Add User</button></div><div className="table-wrap"><table><thead><tr><th>PLAYER</th><th>LEVEL</th><th>XP</th><th>STATUS</th><th>ACTION</th></tr></thead><tbody>{users.map(u=><tr key={u.id}><td><div className="table-user"><span className="avatar small">{u.name[0]}</span><span>{u.name}<small>{u.email}</small></span></div></td><td>{u.level}</td><td>{u.xp.toLocaleString()}</td><td><span className={`status ${u.status.toLowerCase()}`}>{u.status}</span></td><td><button className="danger" onClick={()=>remove(u.id)}>Remove</button></td></tr>)}</tbody></table></div></div></div>;
}

function Stat({value,label}) { return <div className="stat"><strong>{value}</strong><span>{label}</span></div> }

function Auth({mode,onAuth}) {
  const signup=mode==="signup"; const [name,setName]=useState(""),[email,setEmail]=useState(""),[password,setPassword]=useState("");
  const navigate=useNavigate();
  const submit=e=>{e.preventDefault(); if(email && password && (!signup || name)){onAuth({name:name||email.split("@")[0],email}); navigate("/dashboard");}};
  return <div className="auth-page"><div className="auth-glow"></div><div className="auth-card"><NavLink to="/" className="auth-brand"><span>N</span> NEON NEXUS</NavLink><span className="eyebrow">{signup?"JOIN THE NEXUS":"WELCOME BACK"}</span><h1>{signup?"Create your account":"Sign in"}</h1><p>{signup?"Build your profile and start your journey.":"Enter your credentials to continue."}</p><form onSubmit={submit}>{signup&&<label>Username<input value={name} onChange={e=>setName(e.target.value)} placeholder="Your username" required/></label>}<label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required/></label><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required/></label><button className="primary full">{signup?"Create Account":"Sign In"} <b>→</b></button></form><div className="auth-switch">{signup?"Already have an account?":"New to Neon Nexus?"} <NavLink to={signup?"/login":"/signup"}>{signup?"Sign in":"Create one"}</NavLink></div><small className="demo-note">Demo authentication stores a local session in your browser. Connect a real backend before production use.</small></div></div>;
}

createRoot(document.getElementById("root")).render(<BrowserRouter><App /></BrowserRouter>);
''',

"src/styles.css": r''':root{font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#eaf0ff;background:#070b16;font-synthesis:none;--bg:#070b16;--panel:#0d1322;--panel2:#11192b;--line:#1c2941;--muted:#8491ab;--text:#edf3ff;--cyan:#35e7ff;--purple:#9a5cff;--pink:#ff3fb4}
*{box-sizing:border-box}body{margin:0;background:radial-gradient(circle at 75% 0%,#172044 0,transparent 34%),var(--bg);min-height:100vh}button,input,select{font:inherit}button{cursor:pointer;color:inherit}.app-shell{display:flex;min-height:100vh}.sidebar{position:fixed;inset:0 auto 0 0;width:245px;background:rgba(6,10,20,.94);border-right:1px solid var(--line);padding:24px 15px;display:flex;flex-direction:column;z-index:5}.brand{display:flex;gap:11px;align-items:center;padding:0 10px 30px}.brand-mark{width:38px;height:38px;display:grid;place-items:center;border:1px solid var(--cyan);color:var(--cyan);box-shadow:0 0 22px #35e7ff44;font-weight:900;transform:skew(-8deg)}.brand b,.brand span{display:block;line-height:1}.brand b{font-size:15px;letter-spacing:3px}.brand span{font-size:9px;letter-spacing:4px;color:var(--cyan);margin-top:5px}.side-label{font-size:9px;color:#52617c;letter-spacing:2px;padding:10px 12px}.nav-item{height:45px;display:flex;align-items:center;gap:13px;color:#8995ac;text-decoration:none;padding:0 12px;border-radius:8px;margin:2px 0;transition:.2s}.nav-item i{font-style:normal;width:19px;text-align:center;font-size:18px}.nav-item:hover,.nav-item.active{color:white;background:linear-gradient(90deg,#152238,#101827);box-shadow:inset 2px 0 var(--cyan)}.nav-item.active i{color:var(--cyan)}.sidebar-bottom{margin-top:auto;border-top:1px solid var(--line);padding:16px 8px 0}.mini-user{display:flex;gap:10px;align-items:center;margin-bottom:12px}.mini-user b,.mini-user small{display:block}.mini-user small{font-size:11px;color:var(--muted);margin-top:2px}.avatar{width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg,#26385d,#111b30);border:1px solid #345071;display:grid;place-items:center;color:var(--cyan);font-weight:800}.avatar.small{width:29px;height:29px;border-radius:8px;font-size:12px}.logout,.login-side{width:100%;background:none;border:1px solid var(--line);padding:9px;border-radius:7px;color:#9ba7bc;text-decoration:none;display:block;text-align:center}.logout:hover,.login-side:hover{border-color:#334766;color:white}.main{margin-left:245px;width:calc(100% - 245px)}.topbar{height:72px;border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;padding:0 34px;background:#070b16cc;backdrop-filter:blur(14px);position:sticky;top:0;z-index:4}.search{display:flex;gap:10px;align-items:center;width:min(420px,45%);color:#64718b}.search input{width:100%;background:none;border:0;outline:0;color:white}.top-actions{display:flex;gap:12px;align-items:center}.icon-btn,.profile-pill{background:#0e1627;border:1px solid var(--line);border-radius:8px;padding:8px 12px}.profile-pill{display:flex;align-items:center;gap:8px}.mobile-brand{display:none}.page{max-width:1250px;margin:auto;padding:42px 42px 70px}.hero{min-height:480px;display:flex;align-items:center;justify-content:space-between;overflow:hidden;position:relative;padding:50px 5%;border-bottom:1px solid var(--line)}.hero-copy{max-width:680px;position:relative;z-index:1}.eyebrow{font-size:10px;letter-spacing:3px;color:var(--cyan);font-weight:800}.eyebrow span{display:inline-block;width:6px;height:6px;border-radius:50%;background:#57ff9a;box-shadow:0 0 10px #57ff9a;margin-left:7px}.hero h1{font-size:clamp(44px,6vw,82px);line-height:.92;margin:16px 0 22px;letter-spacing:-4px}.hero h1 em{font-style:normal;color:transparent;-webkit-text-stroke:1px var(--cyan);text-shadow:0 0 28px #35e7ff33}.hero p{color:#93a0b7;line-height:1.7;max-width:590px}.hero-actions{display:flex;gap:12px;margin-top:30px}.primary{border:0;background:linear-gradient(100deg,var(--cyan),#6e9dff);color:#04111b;font-weight:900;padding:13px 19px;border-radius:7px;box-shadow:0 0 25px #35e7ff33}.primary:hover{filter:brightness(1.1);transform:translateY(-1px)}.primary.compact{padding:9px 14px}.ghost{background:transparent;border:1px solid #33425d;padding:12px 18px;border-radius:7px;color:#c5cee0}.ghost:hover{border-color:var(--cyan);color:white}.hero-orb{width:360px;height:360px;position:relative;display:grid;place-items:center}.orb-core{width:130px;height:130px;border-radius:50%;display:grid;place-items:center;font-size:70px;font-weight:900;color:#07101a;background:linear-gradient(135deg,var(--cyan),#9df8ff);box-shadow:0 0 50px #35e7ff88}.orb-ring{position:absolute;border:1px solid #35e7ff55;border-radius:50%;transform:rotate(25deg)}.r1{inset:10px}.r2{inset:55px;border-color:#9a5cff66;transform:rotate(-40deg)}.section{padding-top:42px}.section-title{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}.section-title>div{display:flex;align-items:center;gap:10px}.section-title h2{font-size:13px;letter-spacing:2px;margin:0}.section-title .line{width:3px;height:16px;background:var(--cyan);box-shadow:0 0 10px var(--cyan)}.section-title a{font-size:12px;color:#7f8ca5;text-decoration:none}.game-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:17px}.game-card{background:linear-gradient(180deg,#0d1525,#0a101d);border:1px solid var(--line);border-radius:10px;overflow:hidden;padding-bottom:15px}.game-card:hover{border-color:#2c5470;transform:translateY(-3px);transition:.2s}.game-art{height:175px;position:relative;display:grid;place-items:center;overflow:hidden}.game-art:before{content:"";position:absolute;inset:-40%;background:repeating-linear-gradient(115deg,transparent 0 18px,#ffffff09 19px 20px);transform:rotate(-8deg)}.g1{background:radial-gradient(circle,#155c71,#10152d 70%)}.g2{background:radial-gradient(circle,#4b256c,#11142d 70%)}.g3{background:radial-gradient(circle,#6d3b1c,#10172d 70%)}.g4{background:radial-gradient(circle,#144b67,#11152c 70%)}.g5{background:radial-gradient(circle,#45366b,#10152b 70%)}.g6{background:radial-gradient(circle,#176b54,#10172b 70%)}.game-icon{font-size:65px;filter:drop-shadow(0 0 20px #fff5);z-index:1}.rating{position:absolute;left:10px;bottom:10px;background:#060b15cc;border:1px solid #34425a;padding:5px 8px;border-radius:5px;font-size:11px}.heart{position:absolute;right:10px;top:10px;border:0;background:#07101dcc;border-radius:7px;width:32px;height:32px;color:white;font-size:18px}.heart.liked{color:#ff55b7}.game-info{display:flex;justify-content:space-between;padding:14px 15px 3px;align-items:flex-start}.game-info h3{margin:5px 0 0;font-size:17px}.tag{font-size:9px;color:var(--cyan);letter-spacing:1px}.players{font-size:10px;color:#738199}.players:first-letter{color:#54ff9c}.game-card p{font-size:11px;line-height:1.5;color:#7d899e;padding:0 15px;height:34px}.play-btn{margin:5px 15px 0;width:calc(100% - 30px);border:1px solid #263751;background:#111b2d;padding:9px;border-radius:6px;color:#c8d2e5;font-size:10px;font-weight:800;letter-spacing:1px}.play-btn:hover{border-color:var(--cyan);color:var(--cyan)}.stats-strip{display:grid;grid-template-columns:repeat(4,1fr);margin:45px 5%;border:1px solid var(--line);background:#0a101d}.stat{padding:20px;text-align:center;border-right:1px solid var(--line)}.stat:last-child{border:0}.stat strong{display:block;font-size:26px;color:white}.stat span{display:block;font-size:9px;letter-spacing:2px;color:#697790;margin-top:5px}.page-heading{display:flex;justify-content:space-between;align-items:end;margin-bottom:30px}.page-heading h1{font-size:42px;letter-spacing:-2px;margin:8px 0}.page-heading p{color:var(--muted);margin:0}.filters{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:24px}.filter{border:1px solid var(--line);background:#0c1322;color:#8995ab;padding:8px 13px;border-radius:6px;font-size:11px}.filter.active{color:#04111b;background:var(--cyan);border-color:var(--cyan);font-weight:800}.level-badge,.admin-chip{background:#0c1627;border:1px solid #2b4560;color:var(--cyan);padding:12px 16px;border-radius:7px;font-weight:900}.level-badge small{display:block;color:#738198;font-weight:500;margin-top:4px}.dashboard-grid{display:grid;grid-template-columns:1.5fr 1fr;gap:17px}.panel{background:#0c1321;border:1px solid var(--line);border-radius:10px;padding:20px}.panel-title{display:flex;justify-content:space-between;align-items:center;font-size:11px;letter-spacing:1px;color:#c8d2e4;margin-bottom:20px}.panel-title span{font-size:10px;color:#65728b;font-weight:400;letter-spacing:0}.progress{height:10px;background:#172136;border-radius:10px;overflow:hidden}.progress i{display:block;height:100%;background:linear-gradient(90deg,var(--cyan),var(--purple));box-shadow:0 0 16px #35e7ff55}.progress-meta{display:flex;justify-content:space-between;color:#69768f;font-size:10px;margin-top:7px}.xp-big{font-size:45px;font-weight:900;margin-top:10px;color:#eaf4ff}.quick-stats{display:grid;grid-template-columns:repeat(3,1fr)}.quick-stats .stat{padding:5px}.recent-list{border:1px solid var(--line);border-radius:9px;overflow:hidden}.recent{display:flex;align-items:center;gap:13px;padding:12px 15px;border-bottom:1px solid var(--line)}.recent:last-child{border:0}.recent-icon{width:40px;height:40px;display:grid;place-items:center;border-radius:7px}.recent b,.recent small{display:block}.recent small{color:#68758e;font-size:10px;margin-top:3px}.recent-score{margin-left:auto;color:var(--cyan);font-size:11px}.leaderboard{border:1px solid var(--line);border-radius:10px;overflow:hidden}.leader-row{display:flex;align-items:center;gap:16px;padding:14px 18px;border-bottom:1px solid var(--line);background:#0c1321}.leader-row:last-child{border:0}.rank{width:26px;text-align:center;font-weight:900;color:#69758b}.rank-1{color:#ffd86b}.rank-2{color:#b8c4d7}.rank-3{color:#c88e61}.leader-name b,.leader-name small{display:block}.leader-name small{color:#68758d;font-size:10px;margin-top:3px}.leader-xp{margin-left:auto;color:white;font-weight:800}.leader-xp span{color:#66738b;font-size:10px}.profile-header{display:flex;align-items:center;gap:18px;margin-bottom:35px}.profile-header .ghost{margin-left:auto}.profile-avatar{width:82px;height:82px;border-radius:20px;display:grid;place-items:center;font-size:36px;font-weight:900;color:var(--cyan);background:linear-gradient(135deg,#18334c,#10192d);border:1px solid #2f5970}.achievements{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.achievements>div{padding:16px;background:#111a2b;border:1px solid var(--line);border-radius:7px;font-size:22px}.achievements b,.achievements small{display:block}.achievements b{font-size:11px;margin-top:10px}.achievements small{font-size:9px;color:#69768c;margin-top:4px}.account-lines span{display:flex;justify-content:space-between;padding:13px 0;border-bottom:1px solid var(--line);font-size:11px;color:#77839b}.account-lines span:last-child{border:0}.account-lines b{color:white}.settings-list{border:1px solid var(--line);border-radius:10px;overflow:hidden}.setting{display:flex;justify-content:space-between;align-items:center;padding:20px;border-bottom:1px solid var(--line);background:#0c1321}.setting:last-child{border:0}.setting b{font-size:13px}.setting p{margin:5px 0 0;color:#6f7c94;font-size:11px}.setting select{background:#111a2b;color:white;border:1px solid var(--line);padding:9px;border-radius:6px}.toggle{width:43px;height:23px;border:0;border-radius:20px;background:#26334b;padding:3px}.toggle span{display:block;width:17px;height:17px;background:#aab4c7;border-radius:50%;transition:.2s}.toggle.on{background:var(--cyan)}.toggle.on span{transform:translateX(20px);background:#06121b}.admin-stats{display:grid;grid-template-columns:repeat(4,1fr);border:1px solid var(--line);margin-bottom:18px}.table-panel{padding:0}.table-panel .panel-title{padding:18px 20px;margin:0;border-bottom:1px solid var(--line)}.table-wrap{overflow:auto}table{width:100%;border-collapse:collapse;min-width:650px}th,td{text-align:left;padding:13px 20px;border-bottom:1px solid var(--line);font-size:11px}th{font-size:9px;letter-spacing:1px;color:#5e6c84}.table-user{display:flex;align-items:center;gap:9px}.table-user small{display:block;color:#64718a;margin-top:3px}.status{font-size:9px;padding:5px 8px;border-radius:10px}.status.online{background:#173629;color:#59e79d}.status.away{background:#3b3117;color:#f3cf62}.status.offline{background:#252b36;color:#818b9d}.danger{border:1px solid #5a2936;background:#25141b;color:#ff8297;border-radius:5px;padding:6px 9px;font-size:9px}.auth-page{min-height:100vh;display:grid;place-items:center;background:radial-gradient(circle at 50% 30%,#15284b,transparent 45%),#060a13;position:relative;overflow:hidden}.auth-glow{position:absolute;width:500px;height:500px;border:1px solid #35e7ff22;border-radius:50%;box-shadow:0 0 150px #35e7ff11}.auth-card{width:min(430px,92vw);background:#0b1220ee;border:1px solid #263650;border-radius:14px;padding:34px;position:relative;box-shadow:0 25px 100px #0008}.auth-brand{display:block;color:white;text-decoration:none;font-weight:900;letter-spacing:2px;margin-bottom:35px}.auth-brand span{color:var(--cyan);font-size:25px}.auth-card h1{font-size:34px;margin:10px 0}.auth-card>p{color:#7e8ba4;font-size:12px;margin-bottom:25px}.auth-card form{display:grid;gap:16px}.auth-card label{font-size:10px;color:#8895ab;letter-spacing:1px}.auth-card input{display:block;width:100%;margin-top:7px;padding:12px;background:#080e1a;border:1px solid #233149;border-radius:6px;color:white;outline:none}.auth-card input:focus{border-color:var(--cyan);box-shadow:0 0 0 2px #35e7ff12}.full{width:100%;margin-top:5px}.auth-switch{text-align:center;color:#758199;font-size:11px;margin-top:20px}.auth-switch a{color:var(--cyan);text-decoration:none}.demo-note{display:block;color:#4f5d75;font-size:9px;text-align:center;margin-top:25px;line-height:1.5}.admin-chip{color:#ff73c5;border-color:#71375d;font-size:9px;letter-spacing:1px}
@media(max-width:900px){.sidebar{width:72px;padding:20px 9px}.brand{justify-content:center;padding:0 0 25px}.brand>div:last-child,.side-label,.nav-item span,.mini-user,.logout,.login-side{display:none}.nav-item{justify-content:center;padding:0}.main{margin-left:72px;width:calc(100% - 72px)}.game-grid{grid-template-columns:repeat(2,1fr)}.hero-orb{width:260px;height:260px}.hero{padding:40px 5%}.stats-strip{margin-left:0;margin-right:0}.page{padding:32px 24px}.topbar{padding:0 20px}}
@media(max-width:650px){.topbar{height:62px}.mobile-brand{display:block;font-size:13px;font-weight:900;letter-spacing:2px}.mobile-brand span{color:var(--cyan);margin-left:4px}.search{display:none}.page{padding:25px 15px 50px}.hero{min-height:590px;padding:45px 20px;align-items:flex-start}.hero-orb{position:absolute;right:-80px;bottom:-60px;opacity:.65}.hero h1{font-size:50px;letter-spacing:-3px}.game-grid,.dashboard-grid{grid-template-columns:1fr}.stats-strip,.admin-stats{grid-template-columns:repeat(2,1fr)}.stat{border-bottom:1px solid var(--line)}.page-heading{align-items:flex-start;gap:15px;flex-direction:column}.page-heading h1{font-size:34px}.profile-header{align-items:flex-start;flex-wrap:wrap}.profile-header .ghost{margin-left:0}.achievements{grid-template-columns:1fr}.top-actions .icon-btn{display:none}.hero-actions{flex-direction:column;align-items:flex-start}.level-badge{align-self:flex-start}}
'''
}

for rel, content in files.items():
    p=root/rel
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(content, encoding="utf-8")

readme = """# Neon Nexus — React + Vite

A ready-to-run cyberpunk gaming dashboard built with React and Vite.

## Run
1. Install Node.js 20.19+.
2. Open a terminal in this folder.
3. Run `npm install`
4. Run `npm run dev`
5. Open the local URL Vite prints.

## Included
- Home page
- Game library + filters
- Demo login/signup
- Protected dashboard
- Profile
- Leaderboard
- Settings
- Admin panel with user removal
- Responsive neon UI
- Browser localStorage demo session

Authentication is intentionally demo-only. Do not use the localStorage auth for a real production account system; connect a server/database and secure password hashing before deployment.

React's current docs no longer recommend Create React App; this project uses a Vite-based setup.
"""
(root/"README.md").write_text(readme, encoding="utf-8")

zip_path=Path("/mnt/data/neon-nexus-react.zip")
with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
    for p in root.rglob("*"):
        z.write(p, p.relative_to(root.parent))

print(f"Created: {zip_path}")
print(f"Project files: {sum(1 for p in root.rglob('*') if p.is_file())}")
