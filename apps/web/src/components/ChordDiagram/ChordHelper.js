import * as d3 from "d3";

const SPOTIFY_TOKEN =
  "BQDyy1q9tdm-BoissSrLEQWo6Xva3-dFb9INZplxVrOXpsmJssKZgSQ6rbkbq3dAXfHG5Lp8WQLjQcn9aZ1Xxnnt0rsMg1LPTQwZtnAwrsdhh-A2IKjP29dJyYSDsO8lv5inwYdcE5k";

//Search Artists
async function overallArtists(limit=5){
  const characterNames = "abcdefghijklmnopqrstuvwxyz".split("");
  let allArtist = [];
  
  for (const letter of characterNames){
    const names = await spotifyAPI(`/search?q=${letter}&type=artist&limit=5`);
    allArtist.push(...names.artists.items);
    if (allArtist.length >= limit) break;
  }
  return [...new Map(allArtist.map(a => [a.id, a])).values()];
}

// Collaboration Function
async function getCollaborations(artist){
  const topTracks = await getTopTracks(artist.id);
  const collaborations = [];

      topTracks.forEach(track => {
        const year = new Date(track.album.release_date).getFullYear();
        
        if (track.artists.length > 1){
          track.artists.forEach(source => {
            track.artists.forEach(target =>{
              if (source.id !== target.id){
                collaborations.push({
                  year: year,
                  track: track.name,
                  source: source.name,
                  target: target.name,
                  genre: artist.genres.length ? artist.genres[0] : "Not Specified",
                  popularity: track.popularity
                });
              }
            });
          });
        }
    });
  

  return collaborations;
}

// Genre Map for Artist
function mapGenres(allArtists){
  const genreMap = {};
  allArtists.forEach(a => {
    genreMap[a.name] = a.genres.length ? a.genres[0] : "Not Specified";
  });
  return genreMap;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function createChords(collaborations, genreMap) {
  const artistNames = new Set();
  collaborations.forEach((d) => {
    artistNames.add(d.source);
    artistNames.add(d.target);
  });

  const nodes = Array.from(artistNames).map((name) => ({
    name,
    genre: genreMap[name] || "Not Specified",
  }));

  const links = collaborations.map((d) => ({
    source: d.source,
    target: d.target,
    track: d.track,
    genre: genreMap[d.source] || "Not Specified",
    targetGenre: genreMap[d.target] || "Not Specified",
  }));

  return { nodes, links };
}

export async function fetchChordData(limit = 10) {
  const allArtists = await overallArtists(limit);
  const genreMap = mapGenres(allArtists);

  let allCollaborators = [];
  for (const artist of allArtists) {
    const collaborations = await getCollaborations(artist);
    allCollaborators.push(...collaborations);
    await delay(1000);
  }

  return createChords(allCollaborators, genreMap);
}
