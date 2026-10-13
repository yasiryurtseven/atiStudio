import css from './Footer.module.css';

function Footer() {
  return (
    <footer className={css.footer}>
      <div className={css.container}>
        {/* Sol Taraf: Logo ve Kısa Açıklama */}
        <div className={css.leftBrand}>
          <div className={css.logoWrapper}>
            <img 
              src="https://i.imgur.com/b3xHKQV.png" 
              alt="AtiStudio Logo" 
              className={css.logo} 
            />
          </div>
          <p className={css.brandText}>
            Görsel & Dijital Prodüksiyon Stüdyosu. Projelerinizi geleceğe taşıyoruz.
          </p>
        </div>

        {/* Sağ Taraf: Hızlı Linkler veya Sosyal Medya / Telif */}
        <div className={css.rightContent}>
          <div className={css.links}>
            <a href="#contact" className={css.footerLink}>İletişim</a>
            <a href="#portfolio" className={css.footerLink}>Projeler</a>
          </div>
          <p className={css.copyright}>
            &copy; {new Date().getFullYear()} AtiStudio. Tüm Hakları Saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;