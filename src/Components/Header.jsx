import { Link } from "react-router-dom";
import { Button } from "./ui/Button";

export default function Header({ active, isSignedIn, onLogout, userProfile }) {
  const displayName = userProfile?.display_name || userProfile?.id || 'User';
  
  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="text-3xl font-bold text-black"
        >
          ConcertFinder
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className={`text-lg ${
              active === "home" ? "text-black font-semibold" : "text-gray-600"
            } hover:text-black transition-colors`}
          >
            Home
          </Link>
          <Link
            to="/artists"
            className={`text-lg ${
              active === "artists" ? "text-black font-semibold" : "text-gray-600"
            } hover:text-black transition-colors`}
          >
            Artists
          </Link>
          {isSignedIn && (
            <>
              <span className="text-gray-700 text-sm">
                {userProfile?.images?.[0]?.url && (
                  <img 
                    src={userProfile.images[0].url} 
                    alt={displayName}
                    className="inline-block w-8 h-8 rounded-full mr-2 align-middle"
                  />
                )}
                {displayName}
              </span>
              {onLogout && (
                <Button
                  onClick={onLogout}
                  className="bg-gray-100 hover:bg-gray-200 text-black border border-gray-300"
                >
                  Logout
                </Button>
              )}
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
