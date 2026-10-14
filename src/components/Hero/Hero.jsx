import css from "./Hero.module.css";
import LightRays from "../LigthRays/LightRays";

function Hero() {
  return (
    <section id="hero" className={css.hero}>
      <div className={css.raysWrapper}>
        <LightRays
          raysOrigin="top-center"
          raysColor="#ffffff"
          raysSpeed={0.3}
          lightSpread={1.9}
          rayLength={2}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0}
          distortion={0}
          pulsating={false}
          fadeDistance={1.9}
          saturation={1.3}

          // Kırmızı hüzmeler
          redRaysColor="#ff0000"
          redRayIntensity={0.2}
          redRayAngle={0.22}
        />
      </div>

      <div className={css.heroContent}>
        {/* Videoyu kontrol altında tutmak için özel bir wrapper ekledik */}
        <div className={css.videoWrapper}>
          <video 
  autoPlay 
  loop 
  muted 
  playsInline 
  className="w-full h-auto"
>
  {/* Safari ve Apple cihazlar için */}
  <source src="/videos/apple-logo.mov" type="video/mp4" />
  
  {/* Chrome, Firefox ve diğer tarayıcılar için */}
  <source src="/videos/atiStudio.webm" type="video/webm" />
  
  Tarayıcınız video etiketini desteklemiyor.
</video>
        </div>
      </div>
    </section>
  );
}

export default Hero;