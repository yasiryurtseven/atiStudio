import css from './Skills.module.css';
import ShinyText from '../ShinyText/ShinyText';
import { FaCamera,FaPenNib, FaFilm, FaCode } from 'react-icons/fa';
import { MdOutlineOndemandVideo } from "react-icons/md";


function Skills() {
  return (
    <section id="hizmetlerimiz" className={css.skills}>
      <h2 className={css.title}> 
        <ShinyText
          text="Hizmetlerimiz"
          color="#0c0c0c"
          shineColor="#ff0000"
          speed={2}
          shineWidth={800}
          softness={1.5}
          trigger="loop"
          delay={0}
          angle={120}
          bands={1}
          glow={0}
          direction="right"
          easing="smooth"
          yoyo={false}
          followPointer={false}
          pauseOnHover={false}
          disabled={false}
        />
      </h2>
      
      <div className={css.cardsContainer}>
        <div className={css.card}>
          <div className={css.iconWrapper}><FaPenNib /></div>
          <h3>Görsel Tasarım</h3>
          <p>Grafik tasarım, görsel kimlik ve markaya özgün yaratıcı tasarım çözümleri.</p>
        </div>

        <div className={css.card}>
          <div className={css.iconWrapper}><FaFilm /></div>
          <h3>Film & Prodüksiyon</h3>
          <p>Video prodüksiyon, sinematik içerikler, kurgu ve görsel hikaye anlatımı.</p>
        </div>

        <div className={css.card}>
          <div className={css.iconWrapper}><FaCamera /> </div>
          <h3>Fotoğraf</h3>
          <p>Ürün, marka ve ticari fotoğrafçılık.</p>
        </div>

        <div className={css.card}>
          <div className={css.iconWrapper}><MdOutlineOndemandVideo /></div>
          <h3>Dijital Medya</h3>
          <p>Sosyal medya yönetimi, dijital içerik üretimi ve marka iletişimi.</p>
        </div>

        <div className={css.card}>
          <div className={css.iconWrapper}>  <FaCode /></div>
          <h3>Yazılım</h3>
          <p>İsteğiniz doğrultusunda markanızı yansıtan web sitesi yapımı.</p>
        </div>
      </div>
    </section>
  );
}

export default Skills;