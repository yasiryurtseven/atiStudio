import { useEffect, useState } from "react";
import css from "./Navbar.module.css";

const navItems = [
  { id: "about", label: "Biz Kimiz?" },
  { id: "skills", label: "Ne İstersiniz?" },
  { id: "ourJobs", label: "İş Birliklerimiz" },
  { id: "contact", label: "İletişim" },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleSection) {
          setActiveSection(visibleSection.target.id);
        }
      },
      {
        root: null,
        rootMargin: "-30% 0px -50% 0px",
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
    <header className={css.navbar}>
      <a href="#hero" className={css.logo}>
        Portfolyo
      </a>

      <nav className={`${css.navLinks} ${isOpen ? css.active : ""}`}>
        {navItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={handleLinkClick}
            className={activeSection === item.id ? css.activeLink : ""}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <button
        className={`${css.hamburger} ${isOpen ? css.open : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Menüyü kapat" : "Menüyü aç"}
        aria-expanded={isOpen}
      >
        <span />
        <span />
        <span />
      </button>
    </header>
  );
}

export default Navbar;