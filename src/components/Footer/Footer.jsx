import css from './Footer.module.css';
import logo from "../../assets/atiBeyaz.svg"

function Footer() {
  return (
    <footer className={css.footer}>
      <div className={css.container}>
        {/* Sol Taraf: Logo ve Kısa Açıklama */}
        <div className={css.leftBrand}>
          <div className={css.logoWrapper}>
            <img 
              src={logo} 
              alt="AtiStudio Logo" 
              className={css.logo} 
            />
          </div>
          <p className={css.brandText}>
            Görünenin ötesini tasarlıyoruz.
          </p>
        </div>

        {/* Sağ Taraf: Telif Hakları */}
        <div className={css.rightContent}>
          <div className={css.links}></div>
          <p className={css.copyright}>
            &copy; {new Date().getFullYear()} AtiStudio. Tüm Hakları Saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;