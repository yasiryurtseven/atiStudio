import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Skills from './components/Skills/Skills';
import OurJobs from './components/OurJobs/OurJobs';
import ContactMe from './components/ContactMe/ContactMe';
import Footer from './components/Footer/Footer';
import css from './App.module.css';

function App() {
  return (
    <div className={css.appContainer}>
      {/* Sabit Üst Menü */}
      <Navbar />

      {/* Ana Sayfa Akış Bölümleri */}
      <main className={css.mainContent}>
        <Hero />
        <OurJobs />
        <Skills />
        <About />
        <ContactMe />
      </main>

      {/* Alt Bilgi Alanı */}
      <Footer className={css.footer} />
    </div>
  );
}

export default App;