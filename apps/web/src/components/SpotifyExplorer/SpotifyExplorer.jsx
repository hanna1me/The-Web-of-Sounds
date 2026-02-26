"use client";

import { useState, useCallback, useEffect } from "react";
import { useSpotifyData } from "@/hooks/useSpotifyData";
import { useCollaborationData } from "@/hooks/useCollaborationData";
import { useChartData } from "@/hooks/useChartData";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { OverviewTab } from "./OverviewTab";
import { ExplorerTab } from "./ExplorerTab";
import { TokenSettingsModal } from "./TokenSettingsModal";

export function SpotifyExplorer() {
  const [spotifyToken, setSpotifyToken] = useState(() => {
    const envToken = import.meta.env.VITE_SPOTIFY_TOKEN || "";
    if (typeof window === "undefined") return envToken;
    return window.localStorage.getItem("spotifyToken") || envToken;
  });
  const [yearRange, setYearRange] = useState([2020, 2024]);
  const [selectedArtist, setSelectedArtist] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [compareItems, setCompareItems] = useState([]);
  const [expandedSidebar, setExpandedSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (spotifyToken) {
      window.localStorage.setItem("spotifyToken", spotifyToken);
    } else {
      window.localStorage.removeItem("spotifyToken");
    }
  }, [spotifyToken]);

  const {
    globalArtists,
    topArtists,
    isLoading,
    useArtistSearch,
    useArtistDetails,
  } = useSpotifyData(spotifyToken);
  const { data: searchResults } = useArtistSearch(searchQuery);
  const { data: artistData } = useArtistDetails(selectedArtist);
  const collaborationData = useCollaborationData(globalArtists, yearRange, spotifyToken);
  const { pieData, chartData } = useChartData(artistData, yearRange);

  const addToCompare = useCallback(() => {
    if (artistData?.artist && compareItems.length < 3) {
      setCompareItems((prev) => [
        ...prev,
        {
          id: artistData.artist.id,
          name: artistData.artist.name,
          image: artistData.artist.images[0]?.url,
          popularity: artistData.artist.popularity,
          followers: artistData.artist.followers.total,
          genres: artistData.artist.genres.slice(0, 3),
        },
      ]);
    }
  }, [artistData, compareItems]);

  const removeFromCompare = useCallback((index) => {
    setCompareItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#ffffff" }}>
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => setShowSettings(true)}
        hasToken={!!spotifyToken}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          expandedSidebar={expandedSidebar}
          setExpandedSidebar={setExpandedSidebar}
          yearRange={yearRange}
          setYearRange={setYearRange}
          activeTab={activeTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchResults={searchResults}
          setSelectedArtist={setSelectedArtist}
          globalArtists={globalArtists}
          collaborationData={collaborationData}
        />

        <main className="flex-1 p-6 overflow-y-auto">
          {activeTab === "overview" && (
            <OverviewTab
              collaborationData={collaborationData}
              yearRange={yearRange}
              globalArtists={globalArtists}
            />
          )}
          {activeTab === "explorer" && (
            <ExplorerTab
              pieData={pieData}
              chartData={chartData}
              artistData={artistData}
              addToCompare={addToCompare}
              compareItems={compareItems}
              removeFromCompare={removeFromCompare}
            />
          )}
          {activeTab === "about" && <AboutTab />}
        </main>
      </div>

      {showSettings && (
        <TokenSettingsModal
          token={spotifyToken}
          setToken={setSpotifyToken}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

function AboutTab() {
  return (
    <div className="max-w-2xl mx-auto py-8 flex flex-col gap-6">
      <div className="glass p-6 flex flex-col gap-3">
        <h2 className="text-xl font-semibold" style={{ color: "#400074" }}>
          About This Project
        </h2>
        <p style={{ color: "#6b7280", lineHeight: "1.7" }}>
          <strong style={{ color: "#000000" }}>The Web of Sounds</strong> is a data visualization
          project built for COMP 435. It explores the connections between artists through their
          collaborative work, genre relationships, and discographies using live Spotify data.
        </p>
        <p style={{ color: "#6b7280", lineHeight: "1.7" }}>
          Built by <strong style={{ color: "#000000" }}>Hanna Chang</strong> and{" "}
          <strong style={{ color: "#000000" }}>Joshua Segebre</strong>.
        </p>
      </div>
      <div className="glass p-6 flex flex-col gap-4">
        <h3 className="font-semibold" style={{ color: "#000000" }}>How to use</h3>
        <ul className="flex flex-col gap-3" style={{ color: "#6b7280" }}>
          {[
            ["⚙ Settings icon", "Paste a Spotify access token from developer.spotify.com."],
            ["Overview tab", "See a chord diagram of artist collaboration networks filtered by year."],
            ["Explorer tab", "Search any artist to inspect genres, album timeline, and top tracks."],
            ["Sidebar sliders", "Filter all data by year range."],
          ].map(([key, val]) => (
            <li key={key} className="flex gap-3">
              <span
                className="flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-md h-fit mt-0.5"
                style={{ background: "rgba(64,0,116,0.08)", color: "#400074", border: "1px solid rgba(64,0,116,0.18)" }}
              >
                {key}
              </span>
              <span>{val}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
