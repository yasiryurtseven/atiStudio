
import { useEffect, useState } from "react";
import css from "./Navbar.module.css";
import Logo from "../../assets/atiSiyah.svg";

const navItems = [
  { id: "işbirliklerimiz", label: "İş Birliklerimiz" },
  { id: "hizmetlerimiz", label: "Hizmetlerimiz" },
  { id: "bizkimiz?", label: "Biz Kimiz?" },
  { id: "iletişim", label: "İletişim" },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

 useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.2; // Ekranın %30 üst kısımdaki referans çizgisi
      
      const sectionIds = ["hero", ...navItems.map((item) => item.id)];
      let currentSection = "hero";

      for (const id of sectionIds) {
        // İsimdeki olası boşlukları temizleyerek ID'yi bulalım
        const cleanId = id.trim();
        const element = document.getElementById(cleanId);
        
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;
          const elementBottom = elementTop + element.offsetHeight;

          // Eğer kaydırma pozisyonumuz bu section'ın sınırları içindeyse
          if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
            currentSection = cleanId;
            break;
          }
        }
      }

      setActiveSection(currentSection);

      // URL hash güncellemesi
      if (currentSection === "hero") {
        if (window.location.hash) {
          window.history.replaceState(null, "", window.location.pathname);
        }
      } else if (window.location.hash !== `#${currentSection}`) {
        window.history.replaceState(null, "", `#${currentSection}`);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // İlk açılışta tetikle

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

 const handleLinkClick = () => {
  setIsOpen(false);
};

  return (
    <>
      {/* Mobil menü açıkken dışarı tıklamayı yakalar */}
      {isOpen && (
        <div
          className={css.menuOverlay}
          onClick={() => setIsOpen(false)}
        />
      )}

      <header className={css.navbar}>
        <a href="#hero" className={css.logo}>
          <img src={Logo} alt="Logo" className={css.logo} />
        </a>

        <nav
          className={`${css.navLinks} ${
            isOpen ? css.active : ""
          }`}
        >
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={handleLinkClick}
              className={
                activeSection === item.id
                  ? css.activeLink
                  : ""
              }
>
  {item.label}
</a>
          ))}
        </nav>

        <button
          className={`${css.hamburger} ${
            isOpen ? css.open : ""
          }`}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={
            isOpen ? "Menüyü kapat" : "Menüyü aç"
          }
          aria-expanded={isOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </header>
    </>
  );
}

export default Navbar;