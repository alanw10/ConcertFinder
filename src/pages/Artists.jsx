import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { artists } from "../lib/mock-data";
import Header from "../Components/Header";

export default function ArtistsPage({ isSignedIn, setIsSignedIn }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-fuchsia-950 to-indigo-950">
      <Header active="artists" />

      {!isSignedIn ? (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-89px)] text-center px-6">
          <h2 className="text-4xl font-bold text-white mb-4">
            Sign in with Spotify to see artists
          </h2>
          <Button
            size="lg"
            className="bg-white text-violet-950 hover:bg-white/90 border-0 px-8 text-lg"
            onClick={() => setIsSignedIn(true)}
          >
            Sign In with Spotify
          </Button>
        </div>
      ) : (
        <main className="container mx-auto px-6 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="mb-10">
              <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Discover Artists
              </h1>
              <p className="text-gray-700 text-lg">
                Browse your favorite musicians and explore new sounds
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artists.map((artist) => (
                <div
                  key={artist.id}
                  className="rounded-2xl bg-white overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
                >
                  <img
                    src={artist.image || "/placeholder.svg"}
                    alt={artist.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">
                      {artist.name}
                    </h3>
                    <p className="text-sm text-purple-600 font-medium mb-4">
                      {artist.genre}
                    </p>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0">
                      View Concerts
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
