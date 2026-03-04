import { X, Key, ExternalLink } from "lucide-react";
import { useState } from "react";

export function TokenSettingsModal({ token, setToken, onClose }) {
  const [draft, setDraft] = useState(token);

  function handleSave() {
    setToken(draft.trim());
    onClose();
  }

  function handleClear() {
    setDraft("");
    setToken("");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 flex flex-col gap-5"
        style={{
          background: "#ffffff",
          border: "1px solid rgba(64,0,116,0.15)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(64,0,116,0.08)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "#400074" }}
            >
              <Key size={15} color="#CDF35F" />
            </div>
            <span className="font-semibold text-base" style={{ color: "#000000", fontFamily: "Inter, system-ui, sans-serif" }}>Spotify API Token</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
            onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.06)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <X size={16} />
          </button>
        </div>

        {/* Instructions */}
        <div
          className="rounded-xl p-4 text-sm leading-relaxed"
          style={{
            background: "rgba(64,0,116,0.04)",
            border: "1px solid rgba(64,0,116,0.12)",
            color: "#6b7280",
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          Get a short-lived access token from{" "}
          <a
            href="https://developer.spotify.com/console/get-artist/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium"
            style={{ color: "#400074" }}
          >
            developer.spotify.com
            <ExternalLink size={11} />
          </a>
          {" "}and paste it below. Tokens expire after ~1 hour.
        </div>

        {/* Input */}
        <div className="flex flex-col gap-2">
          <label className="section-heading">Access Token</label>
          <input
            type="password"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="BQC..."
            className="w-full rounded-xl px-4 py-3 text-sm transition-all duration-150"
            style={{
              background: "#ffffff",
              border: `1px solid ${draft ? "rgba(64,0,116,0.4)" : "rgba(0,0,0,0.1)"}`,
              color: "#000000",
              fontFamily: "Inter, system-ui, sans-serif",
            }}
            onFocus={e => {
              e.currentTarget.style.border = "1px solid rgba(64,0,116,0.5)";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(64,0,116,0.1)";
            }}
            onBlur={e => {
              e.currentTarget.style.border = `1px solid ${draft ? "rgba(64,0,116,0.4)" : "rgba(0,0,0,0.1)"}`;
              e.currentTarget.style.boxShadow = "none";
            }}
            onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
          />
          {token && (
            <p className="text-xs" style={{ color: "#400074", fontFamily: "Inter, system-ui, sans-serif" }}>
              ✓ Token is currently set
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            onClick={handleClear}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors"
            style={{
              background: "rgba(0,0,0,0.04)",
              border: "1px solid rgba(0,0,0,0.08)",
              color: "#6b7280",
              fontFamily: "Inter, system-ui, sans-serif",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.07)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0.04)"}
          >
            Clear token
          </button>
          <button
            onClick={handleSave}
            className="flex-[2] py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: "#400074",
              color: "#ffffff",
              boxShadow: draft ? "0 2px 12px rgba(64,0,116,0.3)" : "none",
              fontFamily: "Inter, system-ui, sans-serif",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "#2d0054";
              e.currentTarget.style.color = "#CDF35F";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(64,0,116,0.4)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "#400074";
              e.currentTarget.style.color = "#ffffff";
              e.currentTarget.style.boxShadow = draft ? "0 2px 12px rgba(64,0,116,0.3)" : "none";
            }}
          >
            Save & connect
          </button>
        </div>
      </div>
    </div>
  );
}
