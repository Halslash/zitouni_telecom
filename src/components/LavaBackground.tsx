import { useEffect, useRef } from 'react';
import './LavaBackground.css';

/**
 * The signature living lava field.
 *
 * One WebGL1 canvas runs a single full-screen fragment shader at reduced
 * resolution (soft field, upscaled by CSS). Seven metaballs on desktop, four
 * on phones, each on its own slow Lissajous path with a lava-lamp rise/fall
 * and a 12% radius pulse. Fallbacks: WebGL → CSS blobs → static gradient.
 * Everything is presentational: aria-hidden, no pointer events, contain strict.
 */

const MAX_BLOBS = 7;

interface BlobParams {
  x: number;
  y: number;
  r: number;
  ax: number;
  ay: number;
  sx: number;
  sy: number;
  px: number;
  py: number;
  riseAmp: number;
  riseFreq: number;
  risePhase: number;
  pulseFreq: number;
  pulsePhase: number;
}

const LAYOUT: Array<[number, number, number]> = [
  [0.2, 0.26, 0.34],
  [0.8, 0.2, 0.3],
  [0.5, 0.6, 0.38],
  [0.14, 0.82, 0.28],
  [0.88, 0.74, 0.26],
  [0.6, 0.92, 0.24],
  [0.36, 0.1, 0.22],
];

function makeBlobs(count: number): BlobParams[] {
  return LAYOUT.slice(0, count).map(([x, y, r], i) => ({
    x,
    y,
    r,
    ax: 0.1 + (i % 3) * 0.02,
    ay: 0.08 + ((i + 1) % 3) * 0.025,
    sx: 0.045 + (i % 4) * 0.008,
    sy: 0.035 + ((i + 2) % 4) * 0.009,
    px: i * 1.7,
    py: i * 2.3 + 0.9,
    riseAmp: 0.05 + (i % 3) * 0.015,
    riseFreq: (Math.PI * 2) / (40 + i * 7),
    risePhase: i * 1.3,
    pulseFreq: 0.5 + (i % 3) * 0.12,
    pulsePhase: i * 0.8,
  }));
}

const VERTEX_SRC = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAGMENT_SRC = `
precision mediump float;

uniform vec2 u_res;
uniform float u_aspect;
uniform vec3 u_blobs[7];
uniform float u_count;
uniform float u_scroll;
uniform float u_swell;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res - 0.5;
  uv.x *= u_aspect;
  uv.y += u_scroll;

  float field = 0.0;
  for (int i = 0; i < 7; i++) {
    if (float(i) >= u_count) break;
    vec3 b = u_blobs[i];
    vec2 d = uv - b.xy;
    float r = b.z * u_swell;
    field += (r * r) / (dot(d, d) + 0.0008);
  }

  float thresh = 1.0;
  float body = smoothstep(thresh * 0.82, thresh * 1.18, field);
  float rim = smoothstep(thresh * 1.0, thresh * 1.26, field)
    * (1.0 - smoothstep(thresh * 1.26, thresh * 1.58, field));

  float grad = clamp(uv.y * 0.9 + 0.5, 0.0, 1.0);
  vec3 c1 = vec3(0.969, 0.839, 0.878);
  vec3 c2 = vec3(0.910, 0.706, 0.784);
  vec3 c3 = vec3(0.831, 0.639, 0.769);
  vec3 c4 = vec3(0.788, 0.702, 0.839);

  vec3 wax = mix(c1, c2, smoothstep(0.0, 0.65, grad));
  wax = mix(wax, c3, smoothstep(0.35, 1.0, grad) * 0.55);
  wax = mix(wax, c4, smoothstep(0.55, 1.0, 1.0 - grad) * 0.45);
  wax = mix(wax, wax * 0.94, smoothstep(thresh * 1.4, thresh * 2.6, field));

  vec3 base = vec3(0.988, 0.949, 0.961);
  float glow = smoothstep(0.0, thresh * 0.82, field) * (1.0 - body) * 0.55;

  vec3 col = base;
  col = mix(col, mix(base, c2, 0.55), glow);
  col = mix(col, wax, body);
  col = mix(col, mix(wax, vec3(1.0), 0.45), rim * 0.5);

  col += (hash(gl_FragCoord.xy) - 0.5) * 0.03;

  vec2 v = gl_FragCoord.xy / u_res - 0.5;
  col *= 1.0 - dot(v, v) * 0.22;

  gl_FragColor = vec4(col, 1.0);
}
`;

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function compile(
  gl: WebGLRenderingContext,
  type: number,
  src: string
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function LavaBackground() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return undefined;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean };
      deviceMemory?: number;
    };
    const saveData = nav.connection?.saveData === true;
    const lowEnd =
      (nav.hardwareConcurrency ?? 8) <= 4 && (nav.deviceMemory ?? 8) <= 4;
    const phone = window.matchMedia('(max-width: 767px)').matches;

    const setMode = (mode: 'webgl' | 'css' | 'static') => {
      root.dataset.mode = mode;
      root.classList.toggle('lava-bg--css', mode !== 'webgl');
      root.classList.toggle('lava-bg--static', mode === 'static');
    };

    /* CSS / static fallback: no WebGL, no loop. */
    if (saveData || lowEnd) {
      setMode(reduceMotion ? 'static' : 'css');
      return undefined;
    }

    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power',
      preserveDrawingBuffer: false,
    });

    const fail = () => setMode(reduceMotion ? 'static' : 'css');
    if (!gl) {
      fail();
      return undefined;
    }

    const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX_SRC);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC);
    const program = gl.createProgram();
    if (!vertex || !fragment || !program) {
      fail();
      return undefined;
    }
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      fail();
      return undefined;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(program, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, 'u_res');
    const uAspect = gl.getUniformLocation(program, 'u_aspect');
    const uBlobs = gl.getUniformLocation(program, 'u_blobs');
    const uCount = gl.getUniformLocation(program, 'u_count');
    const uScroll = gl.getUniformLocation(program, 'u_scroll');
    const uSwell = gl.getUniformLocation(program, 'u_swell');

    let scale = phone ? 0.3 : 0.4;
    let blobCount = phone ? 4 : MAX_BLOBS;
    let blobs = makeBlobs(blobCount);
    const blobData = new Float32Array(MAX_BLOBS * 3);
    let aspect = 1;
    let raf = 0;
    let running = true;
    let time = 0;
    let lastFrame = performance.now();
    let scrollTarget = 0;
    let scrollEased = 0;
    let pointerX = 0;
    let pointerY = 0;
    let attractX = 0;
    let attractY = 0;
    let nearest = -1;
    let slowSince = 0;
    let frameAcc = 0;
    let frameCount = 0;

    const resize = () => {
      aspect = window.innerWidth / Math.max(1, window.innerHeight);
      canvas.width = Math.max(1, Math.round(window.innerWidth * scale));
      canvas.height = Math.max(1, Math.round(window.innerHeight * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uAspect, aspect);
    };

    const render = (swell: number) => {
      for (let i = 0; i < blobCount; i += 1) {
        const b = blobs[i];
        const rise =
          Math.sin(time * b.riseFreq + b.risePhase) * b.riseAmp;
        const pulse = 1 + Math.sin(time * b.pulseFreq + b.pulsePhase) * 0.12;
        let nx = b.x + Math.sin(time * b.sx + b.px) * b.ax;
        let ny = b.y + Math.sin(time * b.sy + b.py) * b.ay + rise;
        nx = 0.5 + (nx - 0.5) * (0.05 + 0.95 * swell);
        ny = 0.5 + (ny - 0.5) * (0.05 + 0.95 * swell);
        blobData[i * 3] = (nx - 0.5) * aspect;
        blobData[i * 3 + 1] = ny - 0.5;
        blobData[i * 3 + 2] = b.r * pulse;
      }
      if (nearest >= 0 && nearest < blobCount) {
        blobData[nearest * 3] += attractX;
        blobData[nearest * 3 + 1] += attractY;
      }
      gl.uniform3fv(uBlobs, blobData);
      gl.uniform1f(uCount, blobCount);
      gl.uniform1f(uScroll, scrollEased);
      gl.uniform1f(uSwell, 0.15 + 0.85 * swell);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const degrade = () => {
      if (scale > 0.25) {
        scale = Math.max(0.25, scale - 0.1);
        resize();
        return true;
      }
      if (blobCount > 4) {
        blobCount -= 1;
        blobs = makeBlobs(blobCount);
        return true;
      }
      return false;
    };

    const loop = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(loop);

      const dt = Math.min(64, now - lastFrame);
      lastFrame = now;
      time += dt / 1000;

      scrollEased += (scrollTarget - scrollEased) * 0.08;

      if (nearest >= 0 && nearest < blobCount) {
        const b = blobs[nearest];
        const nx = (b.x + Math.sin(time * b.sx + b.px) * b.ax - 0.5) * aspect;
        const ny =
          b.y + Math.sin(time * b.sy + b.py) * b.ay - 0.5;
        const dx = Math.max(-0.06, Math.min(0.06, pointerX - nx));
        const dy = Math.max(-0.06, Math.min(0.06, pointerY - ny));
        attractX += (dx - attractX) * 0.02;
        attractY += (dy - attractY) * 0.02;
      }

      const swell = easeOutCubic(Math.min(1, time / 2.2));
      render(swell);

      /* Adaptive quality: rolling average of frame deltas. */
      frameAcc += dt;
      frameCount += 1;
      if (frameCount >= 30) {
        const avg = frameAcc / frameCount;
        frameAcc = 0;
        frameCount = 0;
        if (avg > 20) {
          if (!slowSince) slowSince = now;
          else if (now - slowSince > 2000) {
            slowSince = 0;
            if (!degrade()) {
              running = false;
              cancelAnimationFrame(raf);
              setMode('css');
              return;
            }
          }
        } else {
          slowSince = 0;
        }
      }
    };

    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      pointerX = (event.clientX / window.innerWidth - 0.5) * aspect;
      pointerY = 0.5 - event.clientY / window.innerHeight;
      nearest = 0;
      let best = Infinity;
      for (let i = 0; i < blobCount; i += 1) {
        const b = blobs[i];
        const dx = pointerX - (b.x - 0.5) * aspect;
        const dy = pointerY - (b.y - 0.5);
        const d = dx * dx + dy * dy;
        if (d < best) {
          best = d;
          nearest = i;
        }
      }
    };

    const onScroll = () => {
      scrollTarget = window.scrollY * 0.0004;
    };

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        lastFrame = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };

    const onLost = (event: Event) => {
      event.preventDefault();
      running = false;
      cancelAnimationFrame(raf);
      setMode('css');
    };

    /* Last degradation step: drop to four blobs. */
    const onPerf = (event: Event) => {
      if ((event as CustomEvent<string>).detail !== 'blobs') return;
      if (blobCount > 4) {
        blobCount = 4;
        blobs = makeBlobs(blobCount);
      }
    };

    resize();
    setMode('webgl');
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointer, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    canvas.addEventListener('webglcontextlost', onLost);
    window.addEventListener('zitouni:perf', onPerf);

    if (reduceMotion) {
      render(1);
      running = false;
      root.classList.add('is-live');
    } else {
      onScroll();
      raf = requestAnimationFrame(loop);
      requestAnimationFrame(() => root.classList.add('is-live'));
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('webglcontextlost', onLost);
      window.removeEventListener('zitouni:perf', onPerf);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return (
    <div ref={rootRef} className="lava-bg" aria-hidden="true">
      <div className="lava-bg__base" />
      <canvas ref={canvasRef} className="lava-bg__canvas" />
      <div className="lava-bg__blobs">
        <span className="lava-blob lava-blob--1" />
        <span className="lava-blob lava-blob--2" />
        <span className="lava-blob lava-blob--3" />
        <span className="lava-blob lava-blob--4" />
        <span className="lava-blob lava-blob--5" />
      </div>
      <div className="lava-bg__grain" />
      <div className="lava-bg__vignette" />
    </div>
  );
}
