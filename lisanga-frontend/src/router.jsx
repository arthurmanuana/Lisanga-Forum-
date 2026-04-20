import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

function AppRouter() {
  return (
    <div className="app">
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<div className="container" style={{paddingTop: '2rem'}}>Page non trouvée</div>} />
        </Routes>
      </main>
    </div>
  );
}

export default AppRouter;
