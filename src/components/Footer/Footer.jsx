import css from './Footer.module.css';

function Footer() {
  return (
    <footer className={css.footer}>
      <p>Tüm Hakları Saklıdır. &copy; 2026</p>
    </footer>
  );
}

export default Footer; // <--- İşte bu satır kritik!