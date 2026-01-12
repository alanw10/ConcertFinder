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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-violet-950 via-fuchsia-950 to-indigo-950">
      <Header active="home" isSignedIn={isSignedIn} onLogout={onLogout} userProfile={userProfile} />

==      <section className="relative overflow-hidden flex-1 flex items-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(139,92,246,0.3),transparent_50%),radial-gradient(circle_at_70%_50%,rgba(236,72,153,0.3),transparent_50%)]" />

        <div className="container mx-auto px-6 relative">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                  <span className="text-sm text-white/90">
                    Discover Live Music Near You
                  </span>
                </div>

                <h1 className="text-6xl md:text-7xl font-bold text-white leading-tight">
                  Experience music that{" "}
                  <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                    moves you
                  </span>
                </h1>

                <p className="text-xl text-white/70 leading-relaxed">
                  Connect with artists, discover concerts, and immerse yourself
                  in unforgettable live performances.
                </p>

                {!isSignedIn ? (
                  <Button
                    size="lg"
                    className="bg-white text-violet-950 hover:bg-white/90 px-8 text-lg"
                    onClick={handleSpotifyLogin}
                  >
                    Sign In with Spotify
                  </Button>
                ) : (
                  <div className="flex gap-4">
                    <Link to="/concerts">
                      <Button
                        size="lg"
                        className="bg-white text-violet-950 hover:bg-white/90 px-8 text-lg"
                      >
                        Browse Concerts
                      </Button>
                    </Link>
                    <Link to="/artists">
                      <Button
                        size="lg"
                        className="bg-violet-600 text-white hover:bg-violet-700 px-8 text-lg border-0"
                      >
                        Discover Artists
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-3xl blur-3xl opacity-30" />
                <img
                  src="/live-concert-stage-with-crowd-and-colorful-lights.jpg"
                  alt="Live concert atmosphere"
                  className="relative rounded-3xl shadow-2xl w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
