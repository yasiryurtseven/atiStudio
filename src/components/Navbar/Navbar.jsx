
import { useEffect, useState } from "react";
import css from "./Navbar.module.css";
import Logo from "../../assets/atiSiyah.svg";

const navItems = [
  { id: "ourjobs", label: "İş Birliklerimiz" },
  { id: "skills", label: "Ne İstersiniz?" },
  { id: "about", label: "Biz Kimiz?" },
  { id: "contact", label: "İletişim" },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

 useEffect(() => {
  const sectionIds = ["hero", ...navItems.map((item) => item.id)];

  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const observer = new IntersectionObserver(
  (entries) => {
    const visibleSections = entries
      .filter((entry) => entry.isIntersecting)
      .sort(
        (a, b) => b.intersectionRatio - a.intersectionRatio
      );

    if (visibleSections.length > 0) {
      const sectionId = visibleSections[0].target.id;

      setActiveSection(sectionId);

      if (sectionId === "hero") {
        window.history.replaceState(null, "", window.location.pathname);
      } else if (window.location.hash !== `#${sectionId}`) {
        window.history.replaceState(null, "", `#${sectionId}`);
      }
    }
  },
  {
    root: null,
    rootMargin: "-20% 0px -60% 0px",
    threshold: [0.1, 0.25, 0.5],
  }
);

  sections.forEach((section) => observer.observe(section));

  return () => observer.disconnect();
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