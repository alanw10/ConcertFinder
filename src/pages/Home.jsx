import { Link } from "react-router-dom";
import { Button } from "../Components/ui/Button";
import { Calendar, MapPin, Music, Users } from "lucide-react";
import Header from "../Components/Header";
import { loginWithSpotify } from "../lib/spotifyAuth";

export default function Home({ isSignedIn, setIsSignedIn, onLogout, userProfile }) {
  const handleSpotifyLogin = async () => {
    try {
      await loginWithSpotify();
    } catch (error) {
      console.error('Error initiating Spotify login:', error);
      alert(error.message || 'Failed to initiate Spotify login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header active="home" isSignedIn={isSignedIn} onLogout={onLogout} userProfile={userProfile} />

      <section className="relative overflow-hidden flex-1 flex items-center">
        <div className="container mx-auto px-6 relative">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <h1 className="text-6xl md:text-7xl font-bold text-black leading-tight">
                  Find Concerts From Your Favorites
                </h1>

                <p className="text-xl text-gray-700 leading-relaxed">
                  ConcertFinder helps you find concerts from your favorite artists.
                </p>

                {!isSignedIn ? (
                  <Button
                    size="lg"
                    className="bg-black text-white hover:bg-gray-800 px-8 text-lg"
                    onClick={handleSpotifyLogin}
                  >
                    Connect Spotify
                  </Button>
                ) : (
                  <Link to="/artists">
                    <Button
                      size="lg"
                      className="bg-black text-white hover:bg-gray-800 px-8 text-lg"
                    >
                      Find Concerts
                    </Button>
                  </Link>
                )}
              </div>

              <div className="flex justify-center items-center">
                <img
                  src="/model.png"
                  alt="ConcertFinder Flowchart"
                  className="max-w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
