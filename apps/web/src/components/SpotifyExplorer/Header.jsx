import { Globe, BarChart3, BadgeInfo, Settings } from "lucide-react";

const TABS = [
  { id: "overview", label: "Overview", Icon: Globe },
  { id: "explorer", label: "Explorer", Icon: BarChart3 },
  { id: "about", label: "About", Icon: BadgeInfo },
];

export function Header({ activeTab, setActiveTab, onOpenSettings, hasToken }) {
  return (
    <header
      className="px-6 pt-6 pb-4 flex flex-col gap-4"
      style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}
    >
      {/* Title row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1
            className="text-3xl font-bold tracking-tight leading-none"
            style={{
              background: "linear-gradient(135deg, #000000 0%, #400074 55%, #6b21a8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            The Web of Sounds
          </h1>
          <p className="text-sm" style={{ color: "#6b7280" }}>
            Artist Collaboration Explorer &nbsp;·&nbsp; by Hanna Chang &amp; Joshua Segebre
          </p>
        </div>

        {/* Settings gear */}
        <button
          onClick={onOpenSettings}
          title="Spotify API settings"
          className="relative flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150"
          style={{
            background: hasToken ? "rgba(64,0,116,0.1)" : "rgba(0,0,0,0.04)",
            border: hasToken ? "1px solid rgba(64,0,116,0.25)" : "1px solid rgba(0,0,0,0.08)",
            color: hasToken ? "#400074" : "#6b7280",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = hasToken ? "rgba(64,0,116,0.18)" : "rgba(0,0,0,0.07)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = hasToken ? "rgba(64,0,116,0.1)" : "rgba(0,0,0,0.04)";
          }}
        >
          <Settings size={16} />
          {!hasToken && (
            <span
              className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full"
              style={{ background: "#f59e0b", boxShadow: "0 0 6px rgba(245,158,11,0.6)" }}
            />
          )}
        </button>
      </div>

      {/* Tab navigation */}
      <nav
        className="inline-flex gap-1 p-1 rounded-xl self-start"
        style={{ background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.08)" }}
      >
        {TABS.map(({ id, label, Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150"
              style={{
                background: active ? "#400074" : "transparent",
                color: active ? "#CDF35F" : "#6b7280",
                border: "1px solid transparent",
                boxShadow: active ? "0 2px 8px rgba(64,0,116,0.3)" : "none",
              }}
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.color = "#400074";
                  e.currentTarget.style.background = "rgba(64,0,116,0.08)";
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  e.currentTarget.style.color = "#6b7280";
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              <Icon size={15} />
              {label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
