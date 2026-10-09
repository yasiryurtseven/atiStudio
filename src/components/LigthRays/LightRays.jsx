"use client";

import { useRef, useEffect, useState } from "react";
import { Renderer, Program, Triangle, Mesh } from "ogl";
import "./LightRays.css";

const DEFAULT_COLOR = "#ffffff";
const DEFAULT_RED_COLOR = "#ff0000";

const hexToRgb = (hex) => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  return m
    ? [
        parseInt(m[1], 16) / 255,
        parseInt(m[2], 16) / 255,
        parseInt(m[3], 16) / 255,
      ]
    : [1, 1, 1];
};

const getAnchorAndDir = (origin, w, h) => {
  const outside = 0.2;

  switch (origin) {
    case "top-left":
      return {
        anchor: [0, -outside * h],
        dir: [0, 1],
      };

    case "top-right":
      return {
        anchor: [w, -outside * h],
        dir: [0, 1],
      };

    case "left":
      return {
        anchor: [-outside * w, 0.5 * h],
        dir: [1, 0],
      };

    case "right":
      return {
        anchor: [(1 + outside) * w, 0.5 * h],
        dir: [-1, 0],
      };

    case "bottom-left":
      return {
        anchor: [0, (1 + outside) * h],
        dir: [0, -1],
      };

    case "bottom-center":
      return {
        anchor: [0.5 * w, (1 + outside) * h],
        dir: [0, -1],
      };

    case "bottom-right":
      return {
        anchor: [w, (1 + outside) * h],
        dir: [0, -1],
      };

    default:
      return {
        anchor: [0.5 * w, -outside * h],
        dir: [0, 1],
      };
  }
};

const LightRays = ({
  raysOrigin = "top-center",
  raysColor = DEFAULT_COLOR,
  raysSpeed = 1,
  lightSpread = 1,
  rayLength = 2,
  pulsating = false,
  fadeDistance = 1.0,
  saturation = 1.0,
  followMouse = true,
  mouseInfluence = 0.1,
  noiseAmount = 0.0,
  distortion = 0.0,
  lightMode = false,
  className = "",

  // Yeni kırmızı ışın ayarları
  redRaysColor = DEFAULT_RED_COLOR,
  redRayIntensity = 0.2,
  redRayAngle = 0.22,
}) => {
  const containerRef = useRef(null);
  const uniformsRef = useRef(null);
  const rendererRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const smoothMouseRef = useRef({ x: 0.5, y: 0.5 });
  const animationIdRef = useRef(null);
  const meshRef = useRef(null);
  const cleanupFunctionRef = useRef(null);

  const [isVisible, setIsVisible] = useState(false);

  const observerRef = useRef(null);

  /*
   * Görünürlük kontrolü
   */
  useEffect(() => {
    if (!containerRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1,
      }
    );

    observerRef.current.observe(containerRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, []);

  /*
   * WebGL başlatma
   */
  useEffect(() => {
    if (!isVisible || !containerRef.current) return;

    if (cleanupFunctionRef.current) {
      cleanupFunctionRef.current();
      cleanupFunctionRef.current = null;
    }

    const initializeWebGL = async () => {
      if (!containerRef.current) return;

      await new Promise((resolve) => setTimeout(resolve, 10));

      if (!containerRef.current) return;

      const renderer = new Renderer({
        dpr: Math.min(window.devicePixelRatio, 2),
        alpha: true,
      });

      rendererRef.current = renderer;

      const gl = renderer.gl;

      gl.canvas.style.width = "100%";
      gl.canvas.style.height = "100%";

      while (containerRef.current.firstChild) {
        containerRef.current.removeChild(
          containerRef.current.firstChild
        );
      }

      containerRef.current.appendChild(gl.canvas);

      /*
       * Vertex Shader
       */
      const vert = `
        attribute vec2 position;

        varying vec2 vUv;

        void main() {
          vUv = position * 0.5 + 0.5;
          gl_Position = vec4(position, 0.0, 1.0);
        }
      `;

      /*
       * Fragment Shader
       */
      const frag = `
        precision highp float;

        uniform float iTime;
        uniform vec2 iResolution;

        uniform vec2 rayPos;
        uniform vec2 rayDir;

        uniform vec3 raysColor;

        uniform vec3 redRaysColor;
        uniform float redRayIntensity;
        uniform float redRayAngle;

        uniform float raysSpeed;
        uniform float lightSpread;
        uniform float rayLength;
        uniform float pulsating;
        uniform float fadeDistance;
        uniform float saturation;

        uniform vec2 mousePos;
        uniform float mouseInfluence;
        uniform float noiseAmount;
        uniform float distortion;
        uniform float lightMode;

        varying vec2 vUv;

        float noise(vec2 st) {
          return fract(
            sin(dot(st.xy, vec2(12.9898, 78.233))) *
            43758.5453123
          );
        }

        /*
         * Işının gücünü hesaplar
         */
        float rayStrength(
          vec2 raySource,
          vec2 rayRefDirection,
          vec2 coord,
          float seedA,
          float seedB,
          float speed
        ) {
          vec2 sourceToCoord = coord - raySource;

          vec2 dirNorm = normalize(sourceToCoord);

          float cosAngle = dot(
            dirNorm,
            rayRefDirection
          );

          float distortedAngle =
            cosAngle +
            distortion *
            sin(
              iTime * 2.0 +
              length(sourceToCoord) * 0.01
            ) *
            0.2;

          float spreadFactor =
            pow(
              max(distortedAngle, 0.0),
              1.0 / max(lightSpread, 0.001)
            );

          float distance =
            length(sourceToCoord);

          float maxDistance =
            iResolution.x * rayLength;

          float lengthFalloff =
            clamp(
              (maxDistance - distance) /
              maxDistance,
              0.0,
              1.0
            );

          float fadeFalloff =
            clamp(
              (
                iResolution.x * fadeDistance -
                distance
              ) /
              (iResolution.x * fadeDistance),
              0.5,
              1.0
            );

          float pulse =
            pulsating > 0.5
              ? (
                  0.8 +
                  0.2 *
                  sin(iTime * speed * 3.0)
                )
              : 1.0;

          float baseStrength = clamp(
            (
              0.45 +
              0.15 *
              sin(
                distortedAngle * seedA +
                iTime * speed
              )
            ) +
            (
              0.3 +
              0.2 *
              cos(
                -distortedAngle * seedB +
                iTime * speed
              )
            ),
            0.0,
            1.0
          );

          return
            baseStrength *
            lengthFalloff *
            fadeFalloff *
            spreadFactor *
            pulse;
        }

        /*
         * 2D yön döndürme
         */
        vec2 rotateDirection(
          vec2 direction,
          float angle
        ) {
          float c = cos(angle);
          float s = sin(angle);

          return normalize(
            vec2(
              direction.x * c - direction.y * s,
              direction.x * s + direction.y * c
            )
          );
        }

        void mainImage(
          out vec4 fragColor,
          in vec2 fragCoord
        ) {
          vec2 coord = vec2(
            fragCoord.x,
            iResolution.y - fragCoord.y
          );

          /*
           * Mouse etkisi
           */
          vec2 finalRayDir = rayDir;

          if (mouseInfluence > 0.0) {
            vec2 mouseScreenPos =
              mousePos * iResolution.xy;

            vec2 mouseDirection =
              normalize(
                mouseScreenPos - rayPos
              );

            finalRayDir =
              normalize(
                mix(
                  rayDir,
                  mouseDirection,
                  mouseInfluence
                )
              );
          }

          /*
           * BEYAZ HÜZMELER
           */
          float whiteRay1 =
            rayStrength(
              rayPos,
              finalRayDir,
              coord,
              36.2214,
              21.11349,
              1.5 * raysSpeed
            );

          float whiteRay2 =
            rayStrength(
              rayPos,
              finalRayDir,
              coord,
              22.3991,
              18.0234,
              1.1 * raysSpeed
            );

          vec3 whiteLight =
            (
              whiteRay1 * 0.5 +
              whiteRay2 * 0.4
            ) * raysColor;

          /*
           * KIRMIZI HÜZMELER
           *
           * Beyaz ışınlarla aynı kaynaktan geliyorlar
           * fakat açıları biraz değiştirilerek aralara
           * farklı yönlerde kırmızı hüzmeler ekleniyor.
           */
          vec2 redDirectionLeft =
            rotateDirection(
              finalRayDir,
              -redRayAngle
            );

          vec2 redDirectionRight =
            rotateDirection(
              finalRayDir,
              redRayAngle
            );

          float redRay1 =
            rayStrength(
              rayPos,
              redDirectionLeft,
              coord,
              15.421,
              42.117,
              1.25 * raysSpeed
            );

          float redRay2 =
            rayStrength(
              rayPos,
              redDirectionRight,
              coord,
              27.831,
              11.294,
              0.95 * raysSpeed
            );

          vec3 redLight =
            (
              redRay1 * 0.55 +
              redRay2 * 0.45
            ) *
            redRaysColor *
            redRayIntensity;

          /*
           * Beyaz + kırmızı birleşimi
           */
          fragColor = vec4(
            whiteLight + redLight,
            1.0
          );

          /*
           * Noise
           */
          if (noiseAmount > 0.0) {
            float n =
              noise(
                coord * 0.01 +
                iTime * 0.1
              );

            fragColor.rgb *=
              (
                1.0 -
                noiseAmount +
                noiseAmount * n
              );
          }

          /*
           * Parlaklık
           */
          float brightness =
            1.0 -
            (coord.y / iResolution.y);

          fragColor.r *=
            0.1 + brightness * 0.8;

          fragColor.g *=
            0.3 + brightness * 0.6;

          fragColor.b *=
            0.5 + brightness * 0.5;

          /*
           * Saturation
           */
          if (saturation != 1.0) {
            float gray =
              dot(
                fragColor.rgb,
                vec3(
                  0.299,
                  0.587,
                  0.114
                )
              );

            fragColor.rgb =
              mix(
                vec3(gray),
                fragColor.rgb,
                saturation
              );
          }

          /*
           * Light mode
           */
          if (lightMode > 0.5) {
            vec3 mapped =
              vec3(1.0) -
              exp(
                -max(
                  fragColor.rgb,
                  vec3(0.0)
                ) * 1.35
              );

            float energy =
              clamp(
                max(
                  mapped.r,
                  max(mapped.g, mapped.b)
                ),
                0.0,
                1.0
              );

            vec3 hue =
              mapped /
              max(
                energy,
                0.0001
              );

            vec3 ink =
              mix(
                hue * 0.25,
                hue * 0.72,
                energy
              );

            fragColor =
              vec4(
                mix(
                  vec3(1.0),
                  ink,
                  energy
                ),
                1.0
              );
          }
        }

        void main() {
          vec4 color;

          mainImage(
            color,
            gl_FragCoord.xy
          );

          gl_FragColor = color;
        }
      `;

      /*
       * Uniformlar
       */
      const uniforms = {
        iTime: {
          value: 0,
        },

        iResolution: {
          value: [1, 1],
        },

        rayPos: {
          value: [0, 0],
        },

        rayDir: {
          value: [0, 1],
        },

        raysColor: {
          value: hexToRgb(raysColor),
        },

        redRaysColor: {
          value: hexToRgb(redRaysColor),
        },

        redRayIntensity: {
          value: redRayIntensity,
        },

        redRayAngle: {
          value: redRayAngle,
        },

        raysSpeed: {
          value: raysSpeed,
        },

        lightSpread: {
          value: lightSpread,
        },

        rayLength: {
          value: rayLength,
        },

        pulsating: {
          value: pulsating ? 1.0 : 0.0,
        },

        fadeDistance: {
          value: fadeDistance,
        },

        saturation: {
          value: saturation,
        },

        mousePos: {
          value: [0.5, 0.5],
        },

        mouseInfluence: {
          value: mouseInfluence,
        },

        noiseAmount: {
          value: noiseAmount,
        },

        distortion: {
          value: distortion,
        },

        lightMode: {
          value: lightMode ? 1.0 : 0.0,
        },
      };

      uniformsRef.current = uniforms;

      const geometry = new Triangle(gl);

      const program = new Program(gl, {
        vertex: vert,
        fragment: frag,
        uniforms,
      });

      const mesh = new Mesh(gl, {
        geometry,
        program,
      });

      meshRef.current = mesh;

      /*
       * Canvas boyutlandırma
       */
      const updatePlacement = () => {
        if (!containerRef.current || !renderer) return;

        renderer.dpr = Math.min(
          window.devicePixelRatio,
          2
        );

        const {
          clientWidth: wCSS,
          clientHeight: hCSS,
        } = containerRef.current;

        renderer.setSize(
          wCSS,
          hCSS
        );

        const dpr = renderer.dpr;

        const w = wCSS * dpr;
        const h = hCSS * dpr;

        uniforms.iResolution.value = [
          w,
          h,
        ];

        const {
          anchor,
          dir,
        } = getAnchorAndDir(
          raysOrigin,
          w,
          h
        );

        uniforms.rayPos.value =
          anchor;

        uniforms.rayDir.value =
          dir;
      };

      /*
       * Render loop
       */
      const loop = (t) => {
        if (
          !rendererRef.current ||
          !uniformsRef.current ||
          !meshRef.current
        ) {
          return;
        }

        uniforms.iTime.value =
          t * 0.001;

        if (
          followMouse &&
          mouseInfluence > 0.0
        ) {
          const smoothing = 0.92;

          smoothMouseRef.current.x =
            smoothMouseRef.current.x *
              smoothing +
            mouseRef.current.x *
              (1 - smoothing);

          smoothMouseRef.current.y =
            smoothMouseRef.current.y *
              smoothing +
            mouseRef.current.y *
              (1 - smoothing);

          uniforms.mousePos.value = [
            smoothMouseRef.current.x,
            smoothMouseRef.current.y,
          ];
        }

        try {
          renderer.render({
            scene: mesh,
          });

          animationIdRef.current =
            requestAnimationFrame(
              loop
            );
        } catch (error) {
          console.warn(
            "WebGL rendering error:",
            error
          );
        }
      };

      window.addEventListener(
        "resize",
        updatePlacement
      );

      updatePlacement();

      animationIdRef.current =
        requestAnimationFrame(loop);

      /*
       * Temizlik
       */
      cleanupFunctionRef.current =
        () => {
          if (
            animationIdRef.current
          ) {
            cancelAnimationFrame(
              animationIdRef.current
            );

            animationIdRef.current =
              null;
          }

          window.removeEventListener(
            "resize",
            updatePlacement
          );

          if (renderer) {
            try {
              const canvas =
                renderer.gl.canvas;

              const loseContextExt =
                renderer.gl.getExtension(
                  "WEBGL_lose_context"
                );

              if (loseContextExt) {
                loseContextExt.loseContext();
              }

              if (
                canvas &&
                canvas.parentNode
              ) {
                canvas.parentNode.removeChild(
                  canvas
                );
              }
            } catch (error) {
              console.warn(
                "Error during WebGL cleanup:",
                error
              );
            }
          }

          rendererRef.current =
            null;

          uniformsRef.current =
            null;

          meshRef.current = null;
        };
    };

    initializeWebGL();

    return () => {
      if (cleanupFunctionRef.current) {
        cleanupFunctionRef.current();
        cleanupFunctionRef.current =
          null;
      }
    };
  }, [
    isVisible,
    raysOrigin,
    raysColor,
    raysSpeed,
    lightSpread,
    rayLength,
    pulsating,
    fadeDistance,
    saturation,
    followMouse,
    mouseInfluence,
    noiseAmount,
    distortion,
    lightMode,
    redRaysColor,
    redRayIntensity,
    redRayAngle,
  ]);

  /*
   * Uniform güncelleme
   */
  useEffect(() => {
    if (
      !uniformsRef.current ||
      !containerRef.current ||
      !rendererRef.current
    ) {
      return;
    }

    const u =
      uniformsRef.current;

    const renderer =
      rendererRef.current;

    u.raysColor.value =
      hexToRgb(raysColor);

    u.redRaysColor.value =
      hexToRgb(redRaysColor);

    u.redRayIntensity.value =
      redRayIntensity;

    u.redRayAngle.value =
      redRayAngle;

    u.raysSpeed.value =
      raysSpeed;

    u.lightSpread.value =
      lightSpread;

    u.rayLength.value =
      rayLength;

    u.pulsating.value =
      pulsating ? 1.0 : 0.0;

    u.fadeDistance.value =
      fadeDistance;

    u.saturation.value =
      saturation;

    u.mouseInfluence.value =
      mouseInfluence;

    u.noiseAmount.value =
      noiseAmount;

    u.distortion.value =
      distortion;

    u.lightMode.value =
      lightMode ? 1.0 : 0.0;

    const {
      clientWidth: wCSS,
      clientHeight: hCSS,
    } = containerRef.current;

    const dpr =
      renderer.dpr;

    const {
      anchor,
      dir,
    } = getAnchorAndDir(
      raysOrigin,
      wCSS * dpr,
      hCSS * dpr
    );

    u.rayPos.value =
      anchor;

    u.rayDir.value =
      dir;
  }, [
    raysColor,
    redRaysColor,
    redRayIntensity,
    redRayAngle,
    raysSpeed,
    lightSpread,
    raysOrigin,
    rayLength,
    pulsating,
    fadeDistance,
    saturation,
    mouseInfluence,
    noiseAmount,
    distortion,
    lightMode,
  ]);

  /*
   * Mouse
   */
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (
        !containerRef.current ||
        !rendererRef.current
      ) {
        return;
      }

      const rect =
        containerRef.current.getBoundingClientRect();

      const x =
        (e.clientX - rect.left) /
        rect.width;

      const y =
        (e.clientY - rect.top) /
        rect.height;

      mouseRef.current = {
        x,
        y,
      };
    };

    if (followMouse) {
      window.addEventListener(
        "mousemove",
        handleMouseMove
      );

      return () => {
        window.removeEventListener(
          "mousemove",
          handleMouseMove
        );
      };
    }
  }, [followMouse]);

  return (
    <div
      ref={containerRef}
      className={`light-rays-container ${className}`.trim()}
    />
  );
};

export default LightRays;