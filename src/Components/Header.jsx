import { Link } from "react-router-dom";
import { Button } from "./ui/Button";

export default function Header({ active, isSignedIn, onLogout, userProfile }) {
  const displayName = userProfile?.display_name || userProfile?.id || 'User';
  
  return (
    <header className="border-b border-white/10 backdrop-blur-sm bg-black/20 sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent"
        >
          Concert Finder
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className={`text-lg ${
              active === "home" ? "text-white" : "text-white/70"
            } hover:text-violet-300 transition-colors`}
          >
            Home
          </Link>
          <Link
            to="/artists"
            className={`text-lg ${
              active === "artists" ? "text-white" : "text-white/70"
            } hover:text-violet-300 transition-colors`}
          >
            Artists
          </Link>
          <Link
            to="/concerts"
            className={`text-lg ${
              active === "concerts" ? "text-white" : "text-white/70"
            } hover:text-violet-300 transition-colors`}
          >
            Concerts
          </Link>
          {isSignedIn && (
            <>
              <span className="text-white/90 text-sm">
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
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
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
