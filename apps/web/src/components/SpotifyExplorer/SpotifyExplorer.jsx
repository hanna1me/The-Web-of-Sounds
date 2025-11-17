"use client";

import { useState, useCallback, useEffect } from "react";
import { useSpotifyData } from "@/hooks/useSpotifyData";
import { useCollaborationData } from "@/hooks/useCollaborationData";
import { useChartData } from "@/hooks/useChartData";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { OverviewTab } from "./OverviewTab";
import { ExplorerTab } from "./ExplorerTab";

export function SpotifyExplorer() {
  const [spotifyToken, setSpotifyToken] = useState(() => {
    const envToken = import.meta.env.VITE_SPOTIFY_TOKEN || "";

    if (typeof window === "undefined") {
      return envToken;
    }

    return window.localStorage.getItem("spotifyToken") || envToken;
  });
  const [yearRange, setYearRange] = useState([2020, 2024]);
  const [selectedArtist, setSelectedArtist] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [compareItems, setCompareItems] = useState([]);
  const [expandedSidebar, setExpandedSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (spotifyToken) {
      window.localStorage.setItem("spotifyToken", spotifyToken);
    } else {
      window.localStorage.removeItem("spotifyToken");
    }
  }, [spotifyToken]);

  // Use custom hooks
  const {
    globalArtists,
    topArtists,
    isLoading,
    useArtistSearch,
    useArtistDetails,
  } = useSpotifyData(spotifyToken);
  const { data: searchResults } = useArtistSearch(searchQuery);
  const { data: artistData } = useArtistDetails(selectedArtist);
  const collaborationData = useCollaborationData(globalArtists);
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
    <div className="min-h-screen bg-black text-white">
      <div className="bg-gray-900 border-b border-gray-800 p-4">
        <div className="max-w-5xl space-y-2">
          <label className="text-sm text-gray-300 font-medium">
            Spotify access token
          </label>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <input
              type="text"
              value={spotifyToken}
              onChange={(event) => setSpotifyToken(event.target.value)}
              placeholder="Paste a short-lived Spotify access token to fetch live data"
              className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setSpotifyToken("")}
              className="self-start rounded-md border border-gray-700 px-3 py-2 text-sm text-gray-200 transition hover:border-red-400 hover:text-red-300"
            >
              Clear token
            </button>
          </div>
          <p className="text-xs text-gray-400">
            Spotify tokens expire frequently. Paste a fresh token to enable live API
            requests. {spotifyToken
              ? "The token is stored locally for this browser session."
              : "Fallback demo data is shown until a token is provided."}
          </p>
        </div>
      </div>
      {/* Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
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

        {/* Main Content Area */}
        <div className="flex-1 p-6">
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
        </div>
      </div>
    </div>
  );
}
