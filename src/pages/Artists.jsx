import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../Components/ui/Button";
import Header from "../Components/Header";
import { loginWithSpotify, getUserTopArtists } from "../lib/spotifyAuth";

export default function ArtistsPage({ isSignedIn, setIsSignedIn, onLogout, userProfile }) {
  const [topArtists, setTopArtists] = useState([]);
  //topArtists is the array of artists from the user's spotify. I think for the ticketmaster and concerts,
  //  you can use this array to input the names maybe? we can work through it together.
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('medium_term'); 
  
  useEffect(() => {
    if (isSignedIn) {
      fetchTopArtists();
    }
  }, [isSignedIn, timeRange]);

  const fetchTopArtists = async () => {
    setLoading(true);
    setError(null);
    try {
      const artists = await getUserTopArtists(timeRange,50);
      setTopArtists(artists);
      console.log(topArtists);
    } catch (err) {
      console.error('Error fetching top artists:', err);
      setError(err.message || 'Failed to load your top artists');
    } finally {
      setLoading(false);
    }
  };

  const handleSpotifyLogin = async () => {
    try {
      await loginWithSpotify();
    } catch (error) {
      console.error('Error initiating Spotify login:', error);
      alert(error.message || 'Failed to initiate Spotify login');
    }
  };

  const getTimeRangeLabel = (range) => {
    switch (range) {
      case 'short_term':
        return 'Last 4 Weeks';
      case 'medium_term':
        return 'Last 6 Months';
      case 'long_term':
        return 'All Time';
      default:
        return 'Last 6 Months';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header active="artists" isSignedIn={isSignedIn} onLogout={onLogout} userProfile={userProfile} />

      {!isSignedIn ? (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-89px)] text-center px-6">
          <h2 className="text-4xl font-bold text-black mb-4">
            Sign in with Spotify to see artists
          </h2>
          <Button
            size="lg"
            className="bg-black text-white hover:bg-gray-800 border-0 px-8 text-lg"
            onClick={handleSpotifyLogin}
          >
            Sign In with Spotify
          </Button>
        </div>
      ) : (
        <main className="container mx-auto px-6 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="mb-10">
              <h1 className="text-5xl font-bold mb-3 text-black">
                Concerts From Your Favorites 
              </h1>
              <p className="text-gray-700 text-lg mb-4">
                Your favorite artists based on your listening history
              </p>
              
              <div className="flex gap-2 mb-6">
                {['short_term', 'medium_term', 'long_term'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      timeRange === range
                        ? 'bg-black text-white'
                        : 'bg-gray-200 text-black hover:bg-gray-300'
                    }`}
                  >
                    {getTimeRangeLabel(range)}
                  </button>
                ))}
              </div>
            </div>

            {loading && (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800">{error}</p>
                <Button
                  onClick={fetchTopArtists}
                  className="mt-4 bg-black text-white hover:bg-gray-800"
                >
                  Try Again
                </Button>
              </div>
            )}

            {!loading && !error && topArtists.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-600 text-lg">
                  No top artists found. Start listening to music on Spotify to see your favorites here!
                </p>
              </div>
            )}

            {!loading && !error && topArtists.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topArtists.map((artist) => (
                  <div
                    key={artist.id}
                    className="rounded-lg bg-white overflow-hidden shadow-md hover:shadow-lg transition-all border border-gray-200"
                  >
                    <img
                      src={artist.images?.[0]?.url || artist.images?.[1]?.url || "/placeholder.svg"}
                      alt={artist.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-4 text-black">
                        {artist.name}
                      </h3>
                      <div className="flex gap-3 justify-center">
                        <a
                          href={`https://www.ticketmaster.com/search?q=${encodeURIComponent(artist.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        
                        >
                          <div className="w-20 h-20 bg-white rounded-lg p-2 hover:bg-gray-100 transition-colors flex items-center justify-center shadow-md hover:shadow-lg border border-gray-200">
                            <img
                              src="/ticketmaster.png"
                              alt="Ticketmaster"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </a>
                        <a
                          href={`https://seatgeek.com/search?f=1&search=${encodeURIComponent(artist.name)}&ui_origin=home_search`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                       
                        >
                          <div className="w-20 h-20 bg-white rounded-lg p-2 hover:bg-gray-100 transition-colors flex items-center justify-center shadow-md hover:shadow-lg border border-gray-200">
                            <img
                              src="/seatgeek.png"
                              alt="SeatGeek"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </a>
                        <a
                          href={`https://www.tickpick.com/search/?q=${encodeURIComponent(artist.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        
                        >
                          <div className="w-20 h-20 bg-white rounded-lg p-2 hover:bg-gray-100 transition-colors flex items-center justify-center shadow-md hover:shadow-lg border border-gray-200">
                            <img
                              src="/tickpick.png"
                              alt="TickPick"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      )}
    </div>
  );
}
