import { useState, useEffect } from "react";
import css from "./Hero.module.css";
import LightRays from "../LigthRays/LightRays";

function Hero() {
  // Animasyonun oynayıp oynamadığını kontrol eden state
  const [isAnimationFinished, setIsAnimationFinished] = useState(false);

  useEffect(() => {
    // Logonun animasyon süresini buraya milisaniye cinsinden yazabilirsin (Örn: 2000 milisaniye = 2 saniye)
    // Logon kaç saniyede tamamlanıyorsa o süreyi verebilirsin.
    const timer = setTimeout(() => {
      setIsAnimationFinished(true);
    }, 2050); // 2 saniye sonra sabit görsele geçiş yapar

    return () => clearTimeout(timer);
  }, []);

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
        <picture className={css.logoWrapper}>
          <source
            media="(prefers-reduced-motion: reduce)"
            srcSet="/images/ati-studio-hero.png"
            type="image/png"
          />
          {/* Animasyon bittiyse statik PNG'yi göster, bitmediyse APNG'yi oynat */}
          <img
            src={isAnimationFinished ? "/images/ati-studio-hero.png" : "/images/ati-studio-hero.apng"}
            alt="ATI Studio"
            width="1200"
            height="675"
            fetchPriority="high"
            className={css.logo}
          />
        </picture>
      </div>
    </section>
  );
}

export default Hero;