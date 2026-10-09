import { useEffect, useRef } from "react";
import css from "./ScrollAperture.module.css";

function ScrollAperture() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;

    if (!section || !video) return;

    // Video metadata'sının yüklenmesini bekleyip duration'ı alıyoruz
    video.pause();

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const scrollRange = section.offsetHeight - window.innerHeight;
      
      // Scroll ilerlemesini 0 ile 1 arasında hesapla
      const progress = Math.min(
        Math.max(-rect.top / Math.max(scrollRange, 1), 0),
        1
      );

      // Video süresine göre frame'i ayarla
      if (video.duration) {
        video.currentTime = progress * video.duration;
      }

      // İçerik görünürlüğü (Video açıldıktan sonra belirsin)
      if (contentRef.current) {
        const textProgress = Math.min(Math.max((progress - 0.4) / 0.3, 0), 1);
        contentRef.current.style.opacity = textProgress;
        contentRef.current.style.transform = `translate(-50%, -50%) scale(${0.9 + textProgress * 0.1})`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={sectionRef} id="about" className={css.apertureSection}>
      <div className={css.stickyStage}>
        {/* Doğrudan 3D render videonu buraya bağlıyoruz */}
        <video
          ref={videoRef}
          src="/aperture.mp4" 
          muted
          playsInline
          preload="auto"
          className={css.apertureVideo}
        />

        <div ref={contentRef} className={css.content}>
          <h2>Biz Kimiz?</h2>
          <p>
            Reklam, fotoğraf, prodüksiyon ve yazılım alanlarında yaratıcı
            çözümler üreten bir stüdyoyuz.
          </p>
        </div>
      </div>
    </section>
  );
}

export default ScrollAperture;