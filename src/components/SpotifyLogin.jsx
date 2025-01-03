import { useSpotify } from '../context/SpotifyContext';

function SpotifyLogin() {
  const { login } = useSpotify();

  return (
    <div className="bg-white shadow rounded-lg p-6 text-center">
      <h2 className="text-xl font-semibold mb-4">Connect with Spotify</h2>
      <button
        onClick={login}
        className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors"
      >
        Login with Spotify
      </button>
    </div>
  );
}

export default SpotifyLogin;