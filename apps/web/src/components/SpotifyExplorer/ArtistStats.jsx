import { Plus } from "lucide-react";

export function ArtistStats({ artistData, addToCompare, compareItems }) {
  if (!artistData?.artist) return null;

  return (
    <div className="bg-gray-900 p-6 rounded-lg mb-6">
      <div className="flex items-center space-x-4 mb-4">
        <img
          src={artistData.artist.images[0]?.url || "/api/placeholder/80/80"}
          alt={artistData.artist.name}
          className="w-20 h-20 rounded-full"
        />
        <div>
          <h2 className="text-2xl font-bold">{artistData.artist.name}</h2>
          <p className="text-gray-400">
            {artistData.artist.followers.total.toLocaleString()} followers
          </p>
          <p className="text-green-400">
            Popularity: {artistData.artist.popularity}/100
          </p>
        </div>
        <button
          onClick={addToCompare}
          disabled={
            compareItems.length >= 3 ||
            compareItems.some((item) => item.id === artistData.artist.id)
          }
          className="ml-auto px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded transition-colors"
        >
          <Plus size={16} className="inline mr-1" />
          Add to Compare
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {artistData.artist.genres.map((genre) => (
          <span
            key={genre}
            className="px-3 py-1 bg-gray-800 rounded-full text-sm"
          >
            {genre}
          </span>
        ))}
      </div>
    </div>
  );
}
