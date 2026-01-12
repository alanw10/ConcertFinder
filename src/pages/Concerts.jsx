import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Calendar } from "lucide-react";
import { Button } from "../Components/ui/Button";
import { concerts } from "../lib/mock-data";
import ConcertMap from "../Components/ConcertMap";
import Header from "../Components/Header";
import { loginWithSpotify } from "../lib/spotifyAuth";

export default function ConcertsPage({ isSignedIn, setIsSignedIn, onLogout, userProfile }) {
  const [selectedConcertId, setSelectedConcertId] = useState(null);

  const handleSpotifyLogin = async () => {
    try {
      await loginWithSpotify();
    } catch (error) {
      console.error('Error initiating Spotify login:', error);
      alert(error.message || 'Failed to initiate Spotify login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-fuchsia-950 to-indigo-950">
      <Header active="concert" isSignedIn={isSignedIn} onLogout={onLogout} userProfile={userProfile} />

      {!isSignedIn ? (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-89px)] text-center px-6">
          <h2 className="text-4xl font-bold text-white mb-4">
            Sign in with Spotify to see concerts
          </h2>
          <Button
            size="lg"
            className="bg-white text-violet-950 hover:bg-white/90 border-0 px-8 text-lg"
            onClick={handleSpotifyLogin}
          >
            Sign In with Spotify
          </Button>
        </div>
      ) : (
        <main className="relative h-[calc(100vh-89px)] flex">
          <div className="w-2/5 overflow-y-auto border-r border-gray-200">
            <div className="px-8 py-16">
              <div className="mb-10">
                <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Nearby Concerts
                </h1>
                <p className="text-gray-700 text-lg">
                  Check out upcoming shows in your area
                </p>
              </div>

              <div className="space-y-4 pr-4">
                {concerts.map((concert) => (
                  <div
                    key={concert.id}
                    onMouseEnter={() => setSelectedConcertId(concert.id)}
                    className={`rounded-2xl bg-white p-6 shadow-lg hover:shadow-xl transition-all border ${
                      selectedConcertId === concert.id
                        ? "border-purple-500 ring-2 ring-purple-200"
                        : "border-gray-100"
                    }`}
                  >
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {concert.artist}
                      </h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-purple-600" />
                          <span>
                            {concert.venue}, {concert.city}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-pink-600" />
                          <span>{concert.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          ${concert.price}
                        </div>
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
                          Get Tickets
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Map  */}
          <div className="w-3/5 h-full">
            <ConcertMap
              concerts={concerts}
              selectedConcertId={selectedConcertId}
              onMarkerClick={setSelectedConcertId}
            />
          </div>
        </main>
      )}
    </div>
  );
}
