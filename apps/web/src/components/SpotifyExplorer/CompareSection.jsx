import { X } from "lucide-react";

export function CompareSection({ compareItems, removeFromCompare }) {
  if (compareItems.length === 0) return null;

  return (
    <div className="bg-gray-900 p-6 rounded-lg">
      <h3 className="text-xl font-semibold mb-4 text-green-400">
        Compare Artists ({compareItems.length}/3)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {compareItems.map((item, index) => (
          <div key={item.id} className="bg-gray-800 p-4 rounded relative">
            <button
              onClick={() => removeFromCompare(index)}
              className="absolute top-2 right-2 p-1 hover:bg-gray-700 rounded"
            >
              <X size={14} />
            </button>
            <img
              src={item.image || "/api/placeholder/60/60"}
              alt={item.name}
              className="w-15 h-15 rounded-full mx-auto mb-2"
            />
            <h4 className="font-semibold text-center mb-2">{item.name}</h4>
            <div className="text-sm text-gray-400 space-y-1">
              <p>Popularity: {item.popularity}/100</p>
              <p>Followers: {item.followers.toLocaleString()}</p>
              <p>Genres: {item.genres.join(", ")}</p>
            </div>
          </div>
        ))}

        {/* Empty slots */}
        {Array.from({ length: 3 - compareItems.length }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="bg-gray-800 p-4 rounded border-2 border-dashed border-gray-600 flex items-center justify-center min-h-[200px]"
          >
            <span className="text-gray-500">
              Empty Slot {compareItems.length + i + 1}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
