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
            src="/videos/ATI logo prores444 animasyonai_1-vp9-chrome.webm" 
            autoPlay 
            muted 
            playsInline 
            className={css.logo} 
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;