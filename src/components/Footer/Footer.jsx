import css from './Footer.module.css';
import logo from "../../assets/atiBeyaz.svg";

function Footer() {
  return (
    <footer className={css.footer}>
      <div className={css.container}>
        <div className={css.brand}>
          <img
            src={logo}
            alt="AtiStudio"
            className={css.logo}
          />

          <p className={css.brandText}>
            Görünenin ötesini tasarlıyoruz.
          </p>
        </div>

        <div className={css.bottom}>
          <p className={css.copyright}>
            © {new Date().getFullYear()} AtiStudio.
            {' '}Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;