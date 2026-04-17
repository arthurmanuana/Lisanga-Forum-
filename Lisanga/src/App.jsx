import TopNavbar from './components/layout/TopNavbar';
import MainNavbar from './components/layout/MainNavbar';
import HeroCarousel from './components/hero/HeroCarousel';
import './App.css';
import ArticlesSection from './components/articles/ArticlesSection';
import Footer from './components/layout/Footer';

function App() {
  return (
    <div className="app">
      <TopNavbar />
      <MainNavbar />
      <HeroCarousel />
      <ArticlesSection />
      <Footer />
    </div>
  );
}

export default App;