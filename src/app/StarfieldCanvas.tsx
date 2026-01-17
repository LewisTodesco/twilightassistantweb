"use client";

import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import Delaunay from "delaunay-fast";

const particleCount = 45;
const flareCount = 10;
const constellationFrequency = 0.005;
const motion = 0.05;
const color = "#FFEED4";
const particleSizeBase = 0.8;
const particleSizeMultiplier = 0.5;
const flareSizeMultiplier = 100;
const lineWidth = 1;
const linkLengthMin = 5;
const linkLengthMax = 7;
const linkOpacity = 0.25;
const linkFade = 90;
const linkSpeed = 1;
const glareAngle = -60;
const glareOpacityMultiplier = 0.05;
const renderParticles = true;
const renderParticleGlare = true;
const renderFlares = true;
const renderLinks = true;
const flicker = true;
const flickerSmoothing = 15;
const blurSize = 0;
const randomMotion = true;
const noiseLength = 1000;
const noiseStrength = 1;

interface Vec2 {
  x: number;
  y: number;
}

interface Props {
  setLoaded: Dispatch<SetStateAction<boolean>>;
}

const StarfieldCanvas = (props: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef<Vec2>({ x: 0, y: 0 });
  const n = useRef(0);
  const nAngle = (Math.PI * 2) / noiseLength;
  const nRad = 100;
  const nPos = useRef<Vec2>({ x: 0, y: 0 });
  const particles = useRef<any[]>([]);
  const flares = useRef<any[]>([]);
  const vertices = useRef<number[]>([]);
  const triangles = useRef<number[][]>([]);
  const links = useRef<any[]>([]);

  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(
    () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const context = canvas.getContext("2d");
      if (!context) return;
      contextRef.current = context;

      const resize = () => {
        canvas.width = window.innerWidth * (window.devicePixelRatio || 1);
        canvas.height =
          canvas.width * (canvas.clientHeight / canvas.clientWidth);
      };

      const noisePoint = (i: number): Vec2 => {
        const a = nAngle * i;
        return {
          x: nRad * Math.cos(a),
          y: nRad * Math.sin(a),
        };
      };

      const random = (min: number, max: number, float = false): number => {
        return float
          ? Math.random() * (max - min) + min
          : Math.floor(Math.random() * (max - min + 1)) + min;
      };

      const position = (x: number, y: number, z: number): Vec2 => {
        const offsetX =
          (canvas.width / 2 -
            mouse.current.x +
            (nPos.current.x - 0.5) * noiseStrength) *
          z *
          motion;
        const offsetY =
          (canvas.height / 2 -
            mouse.current.y +
            (nPos.current.y - 0.5) * noiseStrength) *
          z *
          motion;
        return {
          x: x * canvas.width + offsetX,
          y: y * canvas.height + offsetY,
        };
      };

      const sizeRatio = () => {
        return canvas.width >= canvas.height ? canvas.width : canvas.height;
      };

      class Particle {
        x = random(-0.1, 1.1, true);
        y = random(-0.1, 1.1, true);
        z = random(0, 4);
        color = color;
        opacity = random(0.1, 1, true);
        flicker = 0;
        neighbors: number[] = [];

        render() {
          const pos = position(this.x, this.y, this.z);
          const r =
            (this.z * particleSizeMultiplier + particleSizeBase) *
            (sizeRatio() / 1000);
          let o = this.opacity;

          if (flicker) {
            const newVal = random(-0.5, 0.5, true);
            this.flicker += (newVal - this.flicker) / flickerSmoothing;
            this.flicker = Math.max(-0.5, Math.min(this.flicker, 0.5));
            o += this.flicker;
            o = Math.max(0, Math.min(o, 1));
          }

          if (!contextRef.current) {
            return;
          }

          contextRef.current.globalAlpha = o;
          contextRef.current.fillStyle = this.color;
          contextRef.current.beginPath();
          contextRef.current.arc(pos.x, pos.y, r, 0, 2 * Math.PI);
          contextRef.current.fill();
          contextRef.current.closePath();

          if (renderParticleGlare) {
            contextRef.current.globalAlpha = o * glareOpacityMultiplier;
            contextRef.current.beginPath();
            contextRef.current.ellipse(
              pos.x,
              pos.y,
              r * flareSizeMultiplier,
              r,
              (glareAngle - (nPos.current.x - 0.5) * noiseStrength * motion) *
                (Math.PI / 180),
              0,
              2 * Math.PI
            );
            contextRef.current.fill();
            contextRef.current.closePath();
          }

          contextRef.current.globalAlpha = 1;
        }
      }

      class Link {
        verts: number[];
        linked: number[];
        distances: number[];
        traveled: number;
        stage: number;
        fade: number;
        finished: boolean;
        length: number;

        constructor(startVertex: number, numPoints: number) {
          this.length = numPoints;
          this.verts = [startVertex];
          this.linked = [startVertex];
          this.distances = [];
          this.traveled = 0;
          this.stage = 0;
          this.fade = 0;
          this.finished = false;
        }

        render() {
          if (!canvasRef.current) return;
          if (!contextRef.current) return;

          switch (this.stage) {
            case 0: {
              const last = particles.current[this.verts[this.verts.length - 1]];
              if (last && last.neighbors.length > 0) {
                const neighbor =
                  last.neighbors[random(0, last.neighbors.length - 1)];
                if (!this.verts.includes(neighbor)) {
                  this.verts.push(neighbor);
                }
              } else {
                this.finished = true;
                return;
              }

              if (this.verts.length >= this.length) {
                for (let i = 0; i < this.verts.length - 1; i++) {
                  const p1 = particles.current[this.verts[i]];
                  const p2 = particles.current[this.verts[i + 1]];
                  const dx = p1.x - p2.x;
                  const dy = p1.y - p2.y;
                  const dist = Math.sqrt(dx * dx + dy * dy);
                  this.distances.push(dist);
                }
                this.stage = 1;
              }
              break;
            }

            case 1: {
              if (this.distances.length === 0) {
                this.finished = true;
                return;
              }

              const points: [number, number][] = [];
              for (let i = 0; i < this.linked.length; i++) {
                const p = particles.current[this.linked[i]];
                const pos = position(p.x, p.y, p.z);
                points.push([pos.x, pos.y]);
              }

              const linkSpeedRel =
                linkSpeed * 0.00001 * canvasRef.current.width;
              this.traveled += linkSpeedRel;
              const d = this.distances[this.linked.length - 1];

              if (this.traveled >= d) {
                this.traveled = 0;
                this.linked.push(this.verts[this.linked.length]);
                const p =
                  particles.current[this.linked[this.linked.length - 1]];
                const pos = position(p.x, p.y, p.z);
                points.push([pos.x, pos.y]);

                if (this.linked.length >= this.verts.length) {
                  this.stage = 2;
                }
              } else {
                const a =
                  particles.current[this.linked[this.linked.length - 1]];
                const b = particles.current[this.verts[this.linked.length]];
                const t = d - this.traveled;
                const x = (this.traveled * b.x + t * a.x) / d;
                const y = (this.traveled * b.y + t * a.y) / d;
                const z = (this.traveled * b.z + t * a.z) / d;
                const pos = position(x, y, z);
                points.push([pos.x, pos.y]);
              }

              this.drawLine(points);

              break;
            }

            case 2: {
              if (this.fade < linkFade) {
                this.fade++;
                const alpha = (1 - this.fade / linkFade) * linkOpacity;
                const points = this.verts.map((v) => {
                  const p = particles.current[v];
                  const pos = position(p.x, p.y, p.z);
                  return [pos.x, pos.y];
                });
                this.drawLine(points, alpha);
              } else {
                this.finished = true;
              }
              break;
            }

            default:
              this.finished = true;
          }
        }

        drawLine(points: number[][], alpha = linkOpacity) {
          if (!contextRef.current) return;

          if (points.length <= 1 || alpha <= 0) return;

          contextRef.current.save();
          contextRef.current.globalAlpha = alpha;
          contextRef.current.shadowColor = color;
          contextRef.current.shadowBlur = 20;

          contextRef.current.beginPath();
          for (let i = 0; i < points.length - 1; i++) {
            contextRef.current.moveTo(points[i][0], points[i][1]);
            contextRef.current.lineTo(points[i + 1][0], points[i + 1][1]);
          }

          contextRef.current.strokeStyle = color;
          contextRef.current.lineWidth = lineWidth;
          contextRef.current.stroke();
          contextRef.current.closePath();

          contextRef.current.restore();
          contextRef.current.globalAlpha = 1;
        }
      }

      resize();
      mouse.current.x = canvas.clientWidth / 2;
      mouse.current.y = canvas.clientHeight / 2;

      for (let i = 0; i < particleCount; i++) {
        const p = new Particle();
        particles.current.push(p);
      }

      const points = particles.current.map((p) => [p.x * 1000, p.y * 1000]);
      vertices.current = Delaunay.triangulate(points);

      for (let i = 0; i < vertices.current.length; i += 3) {
        triangles.current.push(vertices.current.slice(i, i + 3));
      }

      particles.current.forEach((p, i) => {
        triangles.current.forEach((tri) => {
          if (tri.includes(i)) {
            tri.forEach((idx) => {
              if (idx !== i && !p.neighbors.includes(idx)) {
                p.neighbors.push(idx);
              }
            });
          }
        });
      });

      if (renderFlares) {
        for (let i = 0; i < flareCount; i++) {
          flares.current.push(new Particle());
        }
      }

      const animate = () => {
        if (randomMotion) {
          n.current = (n.current + 1) % noiseLength;
          nPos.current = noisePoint(n.current);
        }

        context.clearRect(0, 0, canvas.width, canvas.height);
        if (blurSize > 0) {
          context.shadowBlur = blurSize;
          context.shadowColor = color;
        }

        if (renderParticles) {
          particles.current.forEach((p) => p.render());
        }

        if (renderLinks) {
          if (Math.random() < constellationFrequency) {
            const length = random(linkLengthMin, linkLengthMax);
            const start = random(0, particles.current.length - 1);
            links.current.push(new Link(start, length));
          }

          for (let i = links.current.length - 1; i >= 0; i--) {
            const link = links.current[i];
            if (link && !link.finished) {
              link.render();
            } else {
              links.current.splice(i, 1);
            }
          }
        }

        requestAnimationFrame(animate);
      };

      window.addEventListener("resize", resize);
      document.body.addEventListener("mousemove", (e) => {
        mouse.current.x = e.clientX;
        mouse.current.y = e.clientY;
      });

      animate();

      props.setLoaded(true);

      return () => {
        window.removeEventListener("resize", resize);
      };
    },
    // eslint-disable-next-line
    []
  );

  return (
    <canvas
      ref={canvasRef}
      id="stars"
      className="w-screen h-screen top-0 left-0 fixed z-[0]"
    ></canvas>
  );
};

export default StarfieldCanvas;
