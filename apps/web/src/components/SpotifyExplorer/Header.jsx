import { Globe, BarChart3 } from "lucide-react";

export function Header({ activeTab, setActiveTab }) {
  return (
    <div className="p-6 border-b border-gray-800">
      <h1 className="text-3xl font-bold text-green-400 mb-4">
        COMP 435 Data Visualization Final Project
      </h1>

      <h2 className="text-2xl font-italics text-white-400 mb-4">
        The Spotify Artist & Genre Explorer   |   by Hanna Chang and Joshua Segebre
      </h2>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-900 rounded-lg p-1">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center px-4 py-2 rounded-md transition-colors ${
            activeTab === "overview"
              ? "bg-green-600 text-white"
              : "text-gray-400 hover:text-white hover:bg-gray-800"
          }`}
        >
          <Globe size={18} className="mr-2" />
          General Overview
        </button>
        <button
          onClick={() => setActiveTab("explorer")}
          className={`flex items-center px-4 py-2 rounded-md transition-colors ${
            activeTab === "explorer"
              ? "bg-green-600 text-white"
              : "text-gray-400 hover:text-white hover:bg-gray-800"
          }`}
        >
          <BarChart3 size={18} className="mr-2" />
          Artist Explorer
        </button>
      </div>
    </div>
  );
}
