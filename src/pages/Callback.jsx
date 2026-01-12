import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { exchangeCodeForToken, verifyState, storeTokens } from '../lib/spotifyAuth';

export default function Callback({ onAuthSuccess }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setError(errorParam);
      setTimeout(() => navigate('/'), 3000);
      return;
    }

    if (!code || !state) {
      setError('Missing authorization code or state');
      setTimeout(() => navigate('/'), 3000);
      return;
    }

    if (!verifyState(state)) {
      setError('Invalid state parameter');
      setTimeout(() => navigate('/'), 3000);
      return;
    }

    exchangeCodeForToken(code)
      .then((tokens) => {
        storeTokens(tokens);
        window.location.href = '/';
      })
      .catch((err) => {
        console.error('Error exchanging code for token:', err);
        setError(err.message || 'Failed to authenticate');
        setTimeout(() => navigate('/'), 3000);
      });
  }, [searchParams, navigate, onAuthSuccess]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-950 via-fuchsia-950 to-indigo-950">
      <div className="text-center px-6">
        {error ? (
          <>
            <h2 className="text-2xl font-bold text-white mb-4">Authentication Error</h2>
            <p className="text-white/70 mb-4">{error}</p>
            <p className="text-white/50 text-sm">Redirecting to home page...</p>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-white mb-2">Completing authentication...</h2>
            <p className="text-white/70">Please wait while we sign you in.</p>
          </>
        )}
      </div>
    </div>
  );
}
