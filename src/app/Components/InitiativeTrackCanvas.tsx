import React, { JSX, useEffect, useRef } from "react";

interface Props {
  color: string;
  glowColor: string;
  // speed = pixels per animation frame (roughly). Lower = slower.
  speed: number;
  // Trail fade (0..1). Lower = longer trail.
  trailOpacity: number;
  dotRadius: number;
  cornerRadius: number;
  padding: number;
}

const InitiativeTrackCanvas = (props: Props): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const distanceRef = useRef(0); // distance along the perimeter (in px)
  const rafRef = useRef<number | null>(null);
  const prevTotalRef = useRef<number | null>(null);

  useEffect(
    () => {
      const canvas = canvasRef.current;
      if (!canvas || !canvas.parentElement) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let width = 0;
      let height = 0;

      const margin = Math.max(props.dotRadius * 1.5, 4); // keep track away from edge so glow isn't clipped

      const computeGeometry = (w: number, h: number) => {
        // corner radius must fit inside the box (consider margin)
        const pad = props.padding ?? 20; // default padding 20px
        const r = Math.max(
          0,
          Math.min(
            props.cornerRadius,
            Math.floor(Math.min(w, h) / 2) - pad - margin
          )
        );

        const left = margin;
        const top = pad + margin;
        const right = w - margin;
        const bottom = h - margin;

        const straightH = Math.max(0, right - left - 2 * r);
        const straightV = Math.max(0, bottom - top - 2 * r);
        const cornerLength = (Math.PI / 2) * r; // quarter-circle arc length
        const totalPerimeter = 2 * (straightH + straightV) + 4 * cornerLength;

        return {
          r,
          left,
          right,
          top,
          bottom,
          straightH,
          straightV,
          cornerLength,
          totalPerimeter,
        };
      };

      const resizeCanvas = () => {
        const parent = canvas.parentElement!;
        const ratio = window.devicePixelRatio || 1;
        const w = Math.max(2, parent.clientWidth);
        const h = Math.max(2, parent.clientHeight);

        // If nothing changed don't recalc heavy stuff
        if (width === w && height === h) return;

        // compute old progress (fraction along perimeter) so the moving dot keeps
        // roughly the same place on resize
        const oldTotal = prevTotalRef.current;
        const oldProgress = oldTotal
          ? (((distanceRef.current % oldTotal) + oldTotal) % oldTotal) /
            oldTotal
          : 0;

        width = w;
        height = h;

        canvas.width = Math.round(w * ratio);
        canvas.height = Math.round(h * ratio);
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

        const geom = computeGeometry(width, height);
        prevTotalRef.current = geom.totalPerimeter;

        // restore distance according to previous progress so the dot doesn't jump
        distanceRef.current = oldProgress * geom.totalPerimeter;

        // clear to fully transparent so the trail is empty after a resize
        ctx.clearRect(0, 0, width, height);
      };

      const getPointOnTrack = (dist: number): [number, number] => {
        const {
          r,
          left,
          right,
          top,
          bottom,
          straightH,
          straightV,
          cornerLength,
          totalPerimeter,
        } = computeGeometry(width, height);
        let d = ((dist % totalPerimeter) + totalPerimeter) % totalPerimeter;

        // 1) Top edge: left+r -> right-r  (y = top)
        if (d < straightH) {
          return [left + r + d, top];
        }
        d -= straightH;

        // 2) Top-right corner: center (right - r, top + r), angle -90 -> 0
        if (d < cornerLength) {
          const centerX = right - r;
          const centerY = top + r;
          const t = d / cornerLength; // 0..1
          const theta = -Math.PI / 2 + t * (Math.PI / 2);
          return [centerX + r * Math.cos(theta), centerY + r * Math.sin(theta)];
        }
        d -= cornerLength;

        // 3) Right edge: top+r -> bottom-r  (x = right)
        if (d < straightV) {
          return [right, top + r + d];
        }
        d -= straightV;

        // 4) Bottom-right corner: center (right - r, bottom - r), angle 0 -> 90
        if (d < cornerLength) {
          const centerX = right - r;
          const centerY = bottom - r;
          const t = d / cornerLength;
          const theta = 0 + t * (Math.PI / 2);
          return [centerX + r * Math.cos(theta), centerY + r * Math.sin(theta)];
        }
        d -= cornerLength;

        // 5) Bottom edge: right-r -> left+r  (y = bottom)
        if (d < straightH) {
          return [right - r - d, bottom];
        }
        d -= straightH;

        // 6) Bottom-left corner: center (left + r, bottom - r), angle 90 -> 180
        if (d < cornerLength) {
          const centerX = left + r;
          const centerY = bottom - r;
          const t = d / cornerLength;
          const theta = Math.PI / 2 + t * (Math.PI / 2);
          return [centerX + r * Math.cos(theta), centerY + r * Math.sin(theta)];
        }
        d -= cornerLength;

        // 7) Left edge: bottom-r -> top+r (x = left)
        if (d < straightV) {
          return [left, bottom - r - d];
        }
        d -= straightV;

        // 8) Top-left corner: center (left + r, top + r), angle 180 -> 270
        {
          const centerX = left + r;
          const centerY = top + r;
          const t = d / cornerLength;
          const theta = Math.PI + t * (Math.PI / 2);
          return [centerX + r * Math.cos(theta), centerY + r * Math.sin(theta)];
        }
      };

      const drawRoundedRect = () => {
        const { r, left, right, top, bottom } = computeGeometry(width, height);
        ctx.beginPath();
        ctx.moveTo(left + r, top);
        ctx.lineTo(right - r, top);
        // top-right corner
        ctx.arc(right - r, top + r, r, -Math.PI / 2, 0);
        ctx.lineTo(right, bottom - r);
        // bottom-right
        ctx.arc(right - r, bottom - r, r, 0, Math.PI / 2);
        ctx.lineTo(left + r, bottom);
        // bottom-left
        ctx.arc(left + r, bottom - r, r, Math.PI / 2, Math.PI);
        ctx.lineTo(left, top + r);
        // top-left
        ctx.arc(left + r, top + r, r, Math.PI, 1.5 * Math.PI);
        ctx.closePath();
      };

      const drawFrame = () => {
        // Fade previous frames into transparency (so the trail shows but background stays transparent)
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = `rgba(0,0,0,${props.trailOpacity})`;
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = "source-over";

        // track outline
        drawRoundedRect();
        ctx.strokeStyle = props.color;
        ctx.lineWidth = 1;
        ctx.stroke();

        // dot
        const [dotX, dotY] = getPointOnTrack(distanceRef.current);

        const g = ctx.createRadialGradient(
          dotX,
          dotY,
          0,
          dotX,
          dotY,
          props.dotRadius * 3
        );
        g.addColorStop(0, props.glowColor);
        g.addColorStop(0.15, props.glowColor);
        g.addColorStop(1, "transparent");

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(dotX, dotY, props.dotRadius, 0, Math.PI * 2);
        ctx.fill();
      };

      const animate = () => {
        distanceRef.current += props.speed;
        drawFrame();
        rafRef.current = requestAnimationFrame(animate);
      };

      const ro = new ResizeObserver(() => resizeCanvas());
      ro.observe(canvas.parentElement);

      // initial sizing & start
      resizeCanvas();
      rafRef.current = requestAnimationFrame(animate);

      return () => {
        ro.disconnect();
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    },
    // eslint-disable-next-line
    [
      props.color,
      props.glowColor,
      props.speed,
      props.trailOpacity,
      props.dotRadius,
      props.cornerRadius,
    ]
  );

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
      }}
    />
  );
};

export default InitiativeTrackCanvas;
