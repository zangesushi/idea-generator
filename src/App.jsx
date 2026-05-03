import { useState } from "react";

const SYSTEM_PROMPT = `あなたは「Neta（ネタ）」という名前のアイデア出しAI社員です。
ユーザーのプロフィール：ゲームプランナー（会社員）、コードが書けない非エンジニア、AIを使って副業ツールを量産中、オルカン積立×株式投資で不労所得を目指している。

以下の2種類のアイデアを生成してください：

【AIツールアイデア】
- 非エンジニアでもAIで作れる実用的なWebツール
- 副業・投資・ゲーム業界・会社員の悩みに関連するもの
- 収益化（アフィリ・販売・サブスク）につながるもの

【note・ブログ記事アイデア】
- 実体験ベースで書けるリアルなテーマ
- SEOで検索されそうなキーワードを含む
- 読者が「自分のことだ」と感じるタイトル

必ず以下のJSON形式だけで返答してください。前置きや説明は不要です：
{
  "tools": [
    {"title": "ツール名", "target": "ターゲット", "problem": "解決する悩み", "monetize": "収益化方法", "difficulty": "★☆☆〜★★★"},
    {"title": "ツール名", "target": "ターゲット", "problem": "解決する悩み", "monetize": "収益化方法", "difficulty": "★☆☆〜★★★"},
    {"title": "ツール名", "target": "ターゲット", "problem": "解決する悩み", "monetize": "収益化方法", "difficulty": "★☆☆〜★★★"}
  ],
  "articles": [
    {"title": "記事タイトル", "keyword": "メインキーワード", "hook": "読者が共感するポイント", "cta": "記事末の誘導先"},
    {"title": "記事タイトル", "keyword": "メインキーワード", "hook": "読者が共感するポイント", "cta": "記事末の誘導先"},
    {"title": "記事タイトル", "keyword": "メインキーワード", "hook": "読者が共感するポイント", "cta": "記事末の誘導先"}
  ]
}`;

const THEMES = [
  { label: "副業・収入UP", emoji: "💰", prompt: "副業・収入アップに悩む会社員向けのアイデアを生成して" },
  { label: "投資・資産形成", emoji: "📈", prompt: "投資初心者・積立投資をしている会社員向けのアイデアを生成して" },
  { label: "ゲーム業界", emoji: "🎮", prompt: "ゲームプランナー・ゲーム業界の人向けのアイデアを生成して" },
  { label: "AI活用", emoji: "🤖", prompt: "非エンジニアがAIを使って仕事効率化・副業するアイデアを生成して" },
  { label: "FIRE・不労所得", emoji: "🏖️", prompt: "FIRE・不労所得・経済的自由を目指す会社員向けのアイデアを生成して" },
  { label: "サプライズで！", emoji: "🎲", prompt: "意外性のある、誰も思いつかなそうなニッチなアイデアを生成して" },
];

function DifficultyBadge({ d }) {
  const filled = (d.match(/★/g) || []).length;
  const colors = ["#22c55e", "#f59e0b", "#ef4444"];
  return (
    <span style={{ fontSize: 12, color: colors[filled - 1] || "#94a3b8", letterSpacing: 1 }}>{d}</span>
  );
}

function IdeaCard({ item, type, index, onSelect }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    const text = type === "tool"
      ? `【ツールアイデア】\n${item.title}\nターゲット：${item.target}\n悩み：${item.problem}\n収益化：${item.monetize}\n難易度：${item.difficulty}`
      : `【記事アイデア】\n${item.title}\nキーワード：${item.keyword}\nフック：${item.hook}\nCTA：${item.cta}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={{
      background: "#0f172a",
      border: "1px solid #1e293b",
      borderRadius: 14,
      padding: "18px 20px",
      position: "relative",
      cursor: "pointer",
      transition: "border-color 0.2s, transform 0.15s",
      animation: `fadeUp 0.4s ease ${index * 0.08}s both`,
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = type === "tool" ? "#7c3aed50" : "#0ea5e950"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e293b"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: type === "tool" ? "#c084fc" : "#38bdf8", lineHeight: 1.4, flex: 1, paddingRight: 8 }}>
          {item.title}
        </div>
        <button onClick={copy} style={{
          background: copied ? "#16a34a20" : "#1e293b",
          border: `1px solid ${copied ? "#16a34a60" : "#334155"}`,
          color: copied ? "#4ade80" : "#64748b",
          borderRadius: 6, padding: "3px 8px", fontSize: 10, cursor: "pointer", flexShrink: 0, transition: "all 0.2s"
        }}>{copied ? "✓ コピー済" : "コピー"}</button>
      </div>

      {type === "tool" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, color: "#94a3b8", background: "#1e293b", borderRadius: 4, padding: "2px 8px" }}>👤 {item.target}</span>
            <DifficultyBadge d={item.difficulty} />
          </div>
          <div style={{ fontSize: 12, color: "#64748b" }}>😣 {item.problem}</div>
          <div style={{ fontSize: 12, color: "#34d399" }}>💴 {item.monetize}</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 11, color: "#94a3b8", background: "#1e293b", borderRadius: 4, padding: "2px 8px", display: "inline-block", width: "fit-content" }}>🔍 {item.keyword}</span>
          <div style={{ fontSize: 12, color: "#64748b" }}>💬 {item.hook}</div>
          <div style={{ fontSize: 12, color: "#fb923c" }}>→ {item.cta}</div>
        </div>
      )}

      <button onClick={() => onSelect(item, type)} style={{
        marginTop: 12, width: "100%", padding: "7px 0",
        background: "transparent", border: `1px solid ${type === "tool" ? "#7c3aed30" : "#0ea5e930"}`,
        color: type === "tool" ? "#a78bfa" : "#7dd3fc",
        borderRadius: 8, fontSize: 11, cursor: "pointer", transition: "background 0.2s"
      }}
        onMouseEnter={e => e.currentTarget.style.background = type === "tool" ? "#7c3aed15" : "#0ea5e915"}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
      >
        このアイデアで記事の下書きを作る →
      </button>
    </div>
  );
}

export default function IdeaGenerator() {
  const [ideas, setIdeas] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTheme, setActiveTheme] = useState(null);
  const [tab, setTab] = useState("tool");
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailText, setDetailText] = useState("");

  async function generate(theme) {
    setLoading(true);
    setActiveTheme(theme.label);
    setIdeas(null);
    setDetail(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: theme.prompt }]
        })
      });
      const data = await res.json();
      const raw = data.content?.map(b => b.text || "").join("") || "";
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setIdeas(parsed);
      setTab("tool");
    } catch (e) {
      setIdeas({ error: true });
    }
    setLoading(false);
  }

  async function generateDetail(item, type) {
    setDetail({ item, type });
    setDetailLoading(true);
    setDetailText("");
    const prompt = type === "tool"
      ? `「${item.title}」というAIツールを作る企画書と、そのツールを紹介するnote記事の下書きを作ってください。\n・ターゲット：${item.target}\n・解決する悩み：${item.problem}\n・収益化：${item.monetize}\n\nゲームプランナーの非エンジニアがAIを使って作った実体験として書いてください。`
      : `「${item.title}」というnote記事の下書きを作ってください。\n・キーワード：${item.keyword}\n・フック：${item.hook}\n\nゲームプランナーの非エンジニアが副業×投資で不労所得を目指す実体験として、リアルに書いてください。`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }]
        })
      });
      const data = await res.json();
      setDetailText(data.content?.map(b => b.text || "").join("") || "");
    } catch (e) {
      setDetailText("エラーが発生しました。再試行してください。");
    }
    setDetailLoading(false);
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#020917",
      backgroundImage: "radial-gradient(ellipse 60% 40% at 50% 0%, #0c1a3a 0%, transparent 70%)",
      fontFamily: "'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif",
      color: "#e2e8f0",
      padding: "32px 16px"
    }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 2px; }
      `}</style>

      <div style={{ maxWidth: 780, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.3em", color: "#38bdf8", marginBottom: 10 }}>AI EMPLOYEE — IDEA GENERATOR</div>
          <h1 style={{ fontSize: "clamp(24px,5vw,40px)", fontWeight: 800, margin: "0 0 8px", letterSpacing: "-0.03em" }}>
            ネタ出しAI社員 <span style={{ color: "#38bdf8" }}>Neta</span>
          </h1>
          <p style={{ fontSize: 13, color: "#475569", margin: 0 }}>テーマを選ぶだけで、ツールと記事のアイデアを自動生成</p>
        </div>

        {/* Theme buttons */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 32 }}>
          {THEMES.map(t => (
            <button key={t.label} onClick={() => generate(t)} disabled={loading}
              style={{
                padding: "14px 10px", borderRadius: 12,
                background: activeTheme === t.label ? "#0ea5e915" : "transparent",
                border: `1px solid ${activeTheme === t.label ? "#0ea5e960" : "#1e293b"}`,
                color: activeTheme === t.label ? "#38bdf8" : "#94a3b8",
                fontSize: 13, cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s", display: "flex", flexDirection: "column", alignItems: "center", gap: 6
              }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.borderColor = "#0ea5e950"; e.currentTarget.style.color = "#38bdf8"; } }}
              onMouseLeave={e => { if (activeTheme !== t.label) { e.currentTarget.style.borderColor = "#1e293b"; e.currentTarget.style.color = "#94a3b8"; } }}
            >
              <span style={{ fontSize: 22 }}>{t.emoji}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "48px 0", color: "#475569" }}>
            <div style={{ width: 32, height: 32, border: "2px solid #1e293b", borderTopColor: "#38bdf8", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
            <div style={{ fontSize: 13 }}>Netaがアイデアを考えています...</div>
          </div>
        )}

        {/* Results */}
        {ideas && !ideas.error && !loading && (
          <div style={{ animation: "fadeUp 0.3s ease" }}>
            {/* Tabs */}
            <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "#0f172a", border: "1px solid #1e293b", borderRadius: 10, padding: 4 }}>
              {[{ key: "tool", label: `🛠 AIツールアイデア (${ideas.tools?.length || 0})` }, { key: "article", label: `📝 記事アイデア (${ideas.articles?.length || 0})` }].map(t => (
                <button key={t.key} onClick={() => setTab(t.key)} style={{
                  flex: 1, padding: "9px 0", borderRadius: 7, border: "none",
                  background: tab === t.key ? (t.key === "tool" ? "#7c3aed20" : "#0ea5e920") : "transparent",
                  color: tab === t.key ? (t.key === "tool" ? "#c084fc" : "#38bdf8") : "#475569",
                  fontSize: 13, cursor: "pointer", fontWeight: tab === t.key ? 600 : 400, transition: "all 0.2s"
                }}>{t.label}</button>
              ))}
            </div>

            {/* Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {tab === "tool" && ideas.tools?.map((item, i) => (
                <IdeaCard key={i} item={item} type="tool" index={i} onSelect={generateDetail} />
              ))}
              {tab === "article" && ideas.articles?.map((item, i) => (
                <IdeaCard key={i} item={item} type="article" index={i} onSelect={generateDetail} />
              ))}
            </div>

            {/* Regenerate */}
            <button onClick={() => generate(THEMES.find(t => t.label === activeTheme))} style={{
              width: "100%", marginTop: 16, padding: "12px 0",
              background: "transparent", border: "1px dashed #334155",
              color: "#475569", borderRadius: 10, fontSize: 13, cursor: "pointer", transition: "all 0.2s"
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#475569"; e.currentTarget.style.color = "#94a3b8"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#334155"; e.currentTarget.style.color = "#475569"; }}
            >
              🔄 同じテーマで再生成
            </button>
          </div>
        )}

        {/* Detail panel */}
        {detail && (
          <div style={{ marginTop: 24, background: "#0f172a", border: "1px solid #1e293b", borderRadius: 16, padding: 24, animation: "fadeUp 0.3s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: detail.type === "tool" ? "#c084fc" : "#38bdf8" }}>
                {detail.type === "tool" ? "🛠 企画書 & 記事下書き" : "📝 記事下書き"}：{detail.item.title}
              </div>
              <button onClick={() => setDetail(null)} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 18 }}>×</button>
            </div>
            {detailLoading ? (
              <div style={{ textAlign: "center", padding: "32px 0", color: "#475569" }}>
                <div style={{ width: 24, height: 24, border: "2px solid #1e293b", borderTopColor: "#38bdf8", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
                <div style={{ fontSize: 12 }}>生成中...</div>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 13, lineHeight: 1.9, color: "#cbd5e1", whiteSpace: "pre-wrap" }}>{detailText}</div>
                <button onClick={() => { navigator.clipboard.writeText(detailText); }} style={{
                  marginTop: 16, padding: "9px 20px", background: "#1e293b", border: "1px solid #334155",
                  color: "#94a3b8", borderRadius: 8, fontSize: 12, cursor: "pointer"
                }}>全文コピー</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
