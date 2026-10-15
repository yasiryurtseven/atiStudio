import { useEffect, useId, useRef } from 'react';
import css from './About.module.css';

const approach = [
  { title: 'Düşünüyoruz.', text: 'Her markanın kendi hikâyesi var. Önce dinliyor, soruyor ve o hikâyenin özünü buluyoruz.' },
  { title: 'Tasarlıyoruz.', text: 'Fikri bir görsel dile dönüştürüyor; kimliği, kompozisyonu ve her detayı birlikte düşünüyoruz.' },
  { title: 'Üretiyoruz.', text: 'Tasarım, fotoğraf, film ve dijital medyayı bir araya getirerek hikâyeyi görünür kılıyoruz.' },
];
const clamp = value => Math.max(0, Math.min(1, value));
const phase = (value, start, end) => {
  const t = clamp((value - start) / (end - start));
  return t * t * (3 - 2 * t);
};
const point = (radius, angle) => `${(500 + radius * Math.cos(angle)).toFixed(2)},${(500 + radius * Math.sin(angle)).toFixed(2)}`;

// Eight interlocking leaves form a real opening: the title sits underneath them.
function bladePath(index, radius, rotation) {
  const angle = index * Math.PI / 4 + rotation;
  const next = angle + Math.PI / 4;
  const shoulder = radius + (1500 - radius) * 0.28;
  const sweep = radius + (1500 - radius) * 0.66;
  // Shared curved seams keep adjacent leaves joined throughout the opening.
  return `M ${point(radius, angle)} A ${radius} ${radius} 0 0 1 ${point(radius, next)} C ${point(shoulder, next + 0.66)} ${point(sweep, next + 0.9)} ${point(1500, next + 0.65)} A 1500 1500 0 0 0 ${point(1500, angle + 0.65)} C ${point(sweep, angle + 0.9)} ${point(shoulder, angle + 0.66)} ${point(radius, angle)} Z`;
}

function About() {
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const irisRef = useRef(null);
  const gradientId = useId().replace(/:/g, '');

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    const blades = irisRef.current.querySelectorAll('[data-blade]');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const compact = window.matchMedia('(max-height: 560px)');
    let frame = 0;
    let displayed = null;
    let lastTime = 0;
    const update = (now = performance.now()) => {
      frame = 0;
      if (reduced.matches || compact.matches) {
        displayed = null;
        return;
      }
      const distance = Math.max(1, track.offsetHeight - stage.offsetHeight);
      const top = track.getBoundingClientRect().top;
      const target = clamp(-top / distance);
      const elapsed = Math.min(32, Math.max(1, now - lastTime));
      lastTime = now;
      // Ease discrete mouse-wheel steps without taking control of page scrolling.
      if (displayed === null || top > stage.offsetHeight || top < -track.offsetHeight) displayed = target;
      // A large wheel delta must still travel through the intermediate poses.
      // Time-based easing behaves consistently on 60/120 Hz displays.
      const easedStep = (target - displayed) * (1 - Math.exp(-elapsed / 280));
      const maxStep = elapsed * 0.00065;
      const next = displayed + Math.max(-maxStep, Math.min(maxStep, easedStep));
      const progress = Math.abs(target - next) < 0.0001 ? target : next;
      if (progress === displayed && stage.dataset.ready) return;
      displayed = progress;
      stage.dataset.ready = 'true';
      const opening = phase(progress, 0.02, 0.4);
      const travel = phase(progress, 0.53, 0.85);
      // Enlarge the opening inside a fixed-size SVG, not a six-screen GPU layer.
      const radius = 1 + opening * 330 + travel * 700;
      stage.style.setProperty('--iris-visibility', travel > 0.96 ? 'hidden' : 'visible');
      stage.style.setProperty('--housing-opacity', 1 - phase(travel, 0, 0.18));
      stage.style.setProperty('--title-scale', 0.94 + opening * 0.06 + travel * 0.65);
      stage.style.setProperty('--title-opacity', 1 - phase(progress, 0.55, 0.77));
      stage.style.setProperty('--title-blur', `${phase(progress, 0.55, 0.78) * 5}px`);
      stage.style.setProperty('--story-opacity', phase(progress, 0.73, 0.91));
      stage.style.setProperty('--story-shift', `${(1 - phase(progress, 0.73, 0.91)) * 24}px`);
      stage.style.setProperty('--hint-opacity', 1 - phase(progress, 0.04, 0.16));
      stage.style.setProperty('--progress', progress);
      blades.forEach((blade, index) => blade.setAttribute('d', bladePath(index, radius, opening * 0.32)));
      if (progress !== target) frame = requestAnimationFrame(update);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('pageshow', schedule);
    reduced.addEventListener('change', schedule);
    compact.addEventListener('change', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('pageshow', schedule);
      reduced.removeEventListener('change', schedule);
      compact.removeEventListener('change', schedule);
    };
  }, []);

  return (
    <section id="bizkimiz?" className={css.aboutSection} aria-labelledby="about-title">
      <div className={css.scrollTrack} ref={trackRef}>
        <div className={css.stage} ref={stageRef}>
          <div className={css.stageLabel}><span>ATI STUDIO</span><span>BİZ KİMİZ?</span></div>
          <div className={css.story}>
            <span className={css.eyebrow}>GÖRÜNENİN ARDINDA, BİR HİKÂYE VAR.</span>
            <p className={css.lead}>Fikirleri güçlü görsel anlatılara dönüştüren bağımsız bir yaratıcı stüdyoyuz.</p>
            <div className={css.storyColumns}>
              <p>Grafik tasarım, fotoğraf, video prodüksiyon ve dijital medya alanlarında; her markanın kendine özgü karakterini ortaya çıkaran çalışmalar üretiyoruz.</p>
              <p>Bizim için tasarım yalnızca estetik bir sonuç değil; düşüncenin, hikâyenin ve kimliğin görsel bir ifadeye dönüşme süreci. Her projeye kendi hikâyesi ve ihtiyaçları doğrultusunda yaklaşıyoruz.</p>
            </div>
          </div>
          <div className={css.headline}>
            <h2 id="about-title">Görünenin<br /><span>ötesini</span><br />tasarlıyoruz.</h2>
          </div>
          <div className={css.iris} aria-hidden="true">
            <svg ref={irisRef} viewBox="0 0 1000 1000" focusable="false">
              <defs>
                <linearGradient id={`${gradientId}-rim`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#696c70" />
                  <stop offset="23%" stopColor="#202226" />
                  <stop offset="52%" stopColor="#08090b" />
                  <stop offset="76%" stopColor="#4b4e52" />
                  <stop offset="100%" stopColor="#17191c" />
                </linearGradient>
                <radialGradient id={`${gradientId}-shade`}>
                  <stop offset="20%" stopColor="#000" stopOpacity="0" />
                  <stop offset="76%" stopColor="#000" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="#000" stopOpacity="0.65" />
                </radialGradient>
                <pattern id={`${gradientId}-grain`} width="4" height="4" patternUnits="userSpaceOnUse">
                  <path d="M0 0H4 M0 2H4" stroke="#fff" strokeOpacity="0.025" strokeWidth="0.35" />
                </pattern>
                {Array.from({ length: 8 }, (_, index) => (
                  <linearGradient key={index} id={`${gradientId}-metal-${index}`} gradientUnits="userSpaceOnUse" x1="200" y1="100" x2="800" y2="900" gradientTransform={`rotate(${index * 45} 500 500)`}>
                    <stop offset="0%" stopColor="#15171a" />
                    <stop offset="35%" stopColor="#383c40" />
                    <stop offset="48%" stopColor="#54585c" />
                    <stop offset="54%" stopColor="#2d3034" />
                    <stop offset="80%" stopColor="#191b1e" />
                    <stop offset="100%" stopColor="#0b0c0f" />
                  </linearGradient>
                ))}
                {Array.from({ length: 8 }, (_, index) => (
                  <path key={index} id={`${gradientId}-blade-${index}`} data-blade={index} d={bladePath(index, 1, 0)} />
                ))}
              </defs>
              {Array.from({ length: 8 }, (_, index) => (
                <g key={index}>
                  <use href={`#${gradientId}-blade-${index}`} fill={`url(#${gradientId}-metal-${index})`} stroke="#050607" strokeWidth="3" strokeLinejoin="round" />
                  <use href={`#${gradientId}-blade-${index}`} fill={`url(#${gradientId}-grain)`} stroke="#bbc0c5" strokeOpacity="0.22" strokeWidth="0.65" />
                  <use href={`#${gradientId}-blade-${index}`} fill={`url(#${gradientId}-shade)`} />
                </g>
              ))}
              <g className={css.housing}>
                <circle cx="500" cy="500" r="468" fill="none" stroke="#050607" strokeWidth="56" />
                <circle cx="500" cy="500" r="468" fill="none" stroke={`url(#${gradientId}-rim)`} strokeWidth="42" />
                {[446, 450, 482, 487, 493].map(radius => <circle key={radius} cx="500" cy="500" r={radius} fill="none" stroke="#92979d" strokeOpacity="0.25" strokeWidth="0.8" />)}
                <circle cx="500" cy="500" r="480" fill="none" stroke="#e34242" strokeOpacity="0.65" strokeWidth="1.2" />
                <circle cx="500" cy="500" r="458" fill="none" stroke="#b0b4b8" strokeOpacity="0.3" strokeWidth="5" strokeDasharray="0.7 12" />
              </g>
            </svg>
          </div>
          <div className={css.scrollHint} aria-hidden="true"><span className={css.redDot} />GÖRÜNENİN ÖTESİNE GEÇ<span>↓</span></div>
          <div className={css.progressBar} aria-hidden="true" />
        </div>
      </div>
      <div className={css.details}>
        <div className={css.approachHeader}><span>NASIL ÇALIŞIYORUZ?</span><span>Bir fikir. Birlikte şekillenen bir süreç.</span></div>
        <ol className={css.approach}>
          {approach.map((step, index) => (
            <li className={css.step} key={step.title}><span className={css.number} aria-hidden="true">0{index + 1}</span><h3>{step.title}</h3><p>{step.text}</p></li>
          ))}
        </ol>
        <a className={css.contactLink} href="#iletişim">Hikâyeni birlikte anlatalım <span aria-hidden="true">↗</span></a>
      </div>
    </section>
  );
}
export default About;
