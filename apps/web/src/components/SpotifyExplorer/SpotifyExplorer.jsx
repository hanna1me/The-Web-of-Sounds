"use client";

import { useState, useCallback } from "react";
import { useSpotifyData } from "@/hooks/useSpotifyData";
import { useCollaborationData } from "@/hooks/useCollaborationData";
import { useChartData } from "@/hooks/useChartData";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { OverviewTab } from "./OverviewTab";
import { ExplorerTab } from "./ExplorerTab";

export function SpotifyExplorer() {
  const [spotifyToken] = useState(
    "BQD5zlh334bOPi8Wf0nQHTxG6lltPnds_jlhKUCgvKRckU7d_cZWjvj3aW0uRUz-e4vzujIWXJOuV7qt0Hqmslm8M49xpw9mjjjCXIMO4cq6sxa600rRwwhocd5LIAE_JlLPbWNFbAg",
  );
  const [yearRange, setYearRange] = useState([2020, 2024]);
  const [selectedArtist, setSelectedArtist] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [compareItems, setCompareItems] = useState([]);
  const [expandedSidebar, setExpandedSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

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
