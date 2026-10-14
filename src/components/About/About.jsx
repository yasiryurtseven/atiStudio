import css from './About.module.css';
import ShinyText from '../ShinyText/ShinyText';

function About() {
  return (
    <section id="bizkimiz?" className={css.aboutSection}>
      {/* Başlığı kutunun dışına, üst tarafa aldık */}
      <h2 className={css.title}> 
        <ShinyText
          text="Biz Kimiz ?"
          color="#0c0c0c" /* Zemin koyu olduğu için başlık açık renkli/gri parıltılı harika durur */
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

      <div className={css.aboutBox}>
        <p className={css.text}>
          <span className={css.textTitle}>
            <ShinyText
              text="Görünenin ötesini tasarlıyoruz."
              color="#0c0c0c"
              shineColor="#fff"
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
          </span><br/> 
          ATI Studio, fikirleri güçlü görsel anlatılara dönüştüren bağımsız bir yaratıcı stüdyodur.<br/> <br/>   
          Grafik tasarım, fotoğraf, video prodüksiyon ve dijital medya alanlarında; her markanın kendine özgü karakterini ortaya çıkaran çalışmalar üretiyoruz.<br/> <br/>
          Bizim için tasarım yalnızca estetik bir sonuç değil; düşüncenin, hikâyenin ve kimliğin görsel bir ifadeye dönüşme sürecidir.<br/> 
          Her projeye aynı kalıplarla değil, kendi hikâyesi ve ihtiyaçları doğrultusunda yaklaşıyoruz.<br/> <br/>
          Düşünüyoruz. Tasarlıyoruz. Üretiyoruz.
        </p>
      </div>
    </section>
  );
}

export default About;