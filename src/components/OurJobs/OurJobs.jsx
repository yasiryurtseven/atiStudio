import { useState } from 'react';
import css from './OurJobs.module.css';
import CircularCarousel from '../CircularCarousel/CircularCarousel';
import miamoreLogo from '../../assets/miamore.png';
import sıkılmısLogo from '../../assets/sıkılmıs.png';
import bulutLogo from '../../assets/bulut.png';
import arapLogo from '../../assets/arap.png';
import ShinyText from '../ShinyText/ShinyText';

function OurJobs() {
  const [activeVideoIndex, setActiveVideoIndex] = useState(null);

  const items = [
    { src: miamoreLogo, alt: 'MiaMore' },
    { src: sıkılmısLogo, alt: 'Sıkılmış'},
    { src: bulutLogo, alt: 'Bulut' },
    { src: arapLogo, alt: 'Arap' },
     { src: miamoreLogo, alt: 'MiaMore' },
    { src: sıkılmısLogo, alt: 'Sıkılmış'},
    { src: bulutLogo, alt: 'Bulut' },
    { src: arapLogo, alt: 'Arap' },
    
  ];

  const videos = [
    '/videos/miamore.mp4',
    '/videos/miamore2.mp4',
    '/videos/pizza.mp4',
    '/videos/sıkılmıs2.mp4',
    '/videos/lugat.mp4',
    '/videos/sıkılmıs.mp4',
  ];

  return (
    <section id="ourjobs" className={css.ourJobs}>
      <h2 className={css.title}> 
        <ShinyText
          text="İş Birliklerimiz"
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
      
      {/* SOL TARAF: Dönen Logonun Olduğu Karusel */}
      <div className={css.carouselContainer}>
  <CircularCarousel
    items={items}
    preset="cylinder"
    intro="rise"
    cardWidth={220}
    aspectRatio={1}
    speed={14}
    captions={false}
    gap={25}
    tilt={-5}
    curve={1}
    perspective={2500}
    autoplay="drift"
    interval={3}
    direction="left"
    momentum={0.6}
    snap
    pauseOnHover
    focusOnClick
    draggable
    parallax={0.3}
    stretch={0.5}
    fadeColor="#d8d8d8"
    depthFade={0.55}
    innerShade={0.6}
    cornerRadius={12}
/>
</div>

      {/* SAĞ TARAF: Otomatik Oynayan Dikey Müşteri Videoları */}
      <div className={css.videoContainer}>
        {videos.map((src, index) => (
          <div 
            key={index}
            className={`${css.videoItem} ${activeVideoIndex === index ? css.activeMobile : ''}`}
            onClick={() => setActiveVideoIndex(activeVideoIndex === index ? null : index)}
          >
            <video 
              src={src} 
              autoPlay 
              muted 
              loop 
              playsInline 
              preload="none" 
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default OurJobs;