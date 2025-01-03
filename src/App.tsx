import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SpotifyProvider } from './context/SpotifyContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Callback from './pages/Callback';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SpotifyProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="callback" element={<Callback />} />
            </Route>
          </Routes>
        </Router>
      </SpotifyProvider>
    </QueryClientProvider>
  );
}

export default App;
