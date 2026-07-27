'use client';

import { useEffect, useRef, useState } from 'react';
import { ShaderSettings } from '@/app/hooks/useShaderSettings';
import { FRAGMENT_SHADER_SOURCE, VERTEX_SHADER_SOURCE } from './shader-source';

/**
 * Full-screen WebGL 2 gradient that paints behind the whole site.
 *
 * The effect builds the shader program once per `settings` change, then runs a
 * requestAnimationFrame loop that pushes uniforms (time, mouse trail, scroll
 * offset, colours) each frame. If WebGL 2 is unavailable or the program fails to
 * build, it falls back to a static CSS gradient so the page is never blank.
 */
export default function ShaderGradient({
  settings, 
  scrollColor,
  scrollColorRgb,
  scrollProgress = 0,
}: { 
  settings: ShaderSettings;
  scrollColor?: { hue: number; saturation: number; lightness: number };
  scrollColorRgb?: [number, number, number];
  scrollProgress?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const smoothMousePosRef = useRef({ x: 0, y: 0 });
  const scrollColorRef = useRef(scrollColor);
  const scrollColorRgbRef = useRef(scrollColorRgb);
  const scrollProgressRef = useRef(scrollProgress);
  const mouseTrailRef = useRef<Array<{ x: number; y: number }>>(
    Array(8).fill({ x: 0, y: 0 })
  );
  // Set when WebGL 2 is unavailable or the program fails to build, so we can
  // render a static gradient fallback instead of a blank canvas.
  const [renderFailed, setRenderFailed] = useState(false);

  // Live settings reach the render loop through a ref: the WebGL program is
  // expensive to compile, so a slider drag must not tear down and rebuild it.
  const settingsRef = useRef(settings);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    scrollColorRef.current = scrollColor;
    scrollColorRgbRef.current = scrollColorRgb;
    scrollProgressRef.current = scrollProgress;
  }, [scrollColor, scrollColorRgb, scrollProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2');
    if (!gl) {
      console.error('WebGL 2 is not supported in this browser; using gradient fallback.');
      setRenderFailed(true);
      return;
    }
    setRenderFailed(false);

    // Set canvas to window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);


    // Compile shader
    function compileShader(source: string, type: number): WebGLShader | null {
      const shader = gl!.createShader(type);
      if (!shader) return null;

      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);

      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        console.error(`Shader compilation error: ${gl!.getShaderInfoLog(shader)}`);
        gl!.deleteShader(shader);
        return null;
      }

      return shader;
    }

    const vertexShader = compileShader(VERTEX_SHADER_SOURCE, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(FRAGMENT_SHADER_SOURCE, gl.FRAGMENT_SHADER);

    if (!vertexShader || !fragmentShader) {
      setRenderFailed(true);
      return;
    }

    // Link program
    const program = gl.createProgram();
    if (!program) {
      setRenderFailed(true);
      return;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(`Program linking error: ${gl.getProgramInfoLog(program)}`);
      setRenderFailed(true);
      return;
    }

    gl.useProgram(program);

    // Set up geometry
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
       1.0,  1.0,
    ]);

    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionAttribLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionAttribLocation);
    gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, false, 0, 0);

    // Get uniform locations
    const iResolutionLocation = gl.getUniformLocation(program, 'iResolution');
    const iTimeLocation = gl.getUniformLocation(program, 'iTime');
    const iMouseLocation = gl.getUniformLocation(program, 'iMouse');
    const iSmoothedMouseLocation = gl.getUniformLocation(program, 'iSmoothedMouse');
    const uAnimationSpeedLocation = gl.getUniformLocation(program, 'uAnimationSpeed');
    const uGrainIntensityLocation = gl.getUniformLocation(program, 'uGrainIntensity');
    const uCircleRadiusLocation = gl.getUniformLocation(program, 'uCircleRadius');
    const uRippleIntensityLocation = gl.getUniformLocation(program, 'uRippleIntensity');
    const uColorModeLocation = gl.getUniformLocation(program, 'uColorMode');
    const uSpectralHueShiftLocation = gl.getUniformLocation(program, 'uSpectralHueShift');
    const uSpectralScaleLocation = gl.getUniformLocation(program, 'uSpectralScale');
    const uSpectralTimeShiftLocation = gl.getUniformLocation(program, 'uSpectralTimeShift');
    const uSpectralSaturationLocation = gl.getUniformLocation(program, 'uSpectralSaturation');
    const uVerticalScrollOffsetLocation = gl.getUniformLocation(program, 'uVerticalScrollOffset');
    const uColor1Location = gl.getUniformLocation(program, 'uColor1');
    const uColor2Location = gl.getUniformLocation(program, 'uColor2');
    const uColor3Location = gl.getUniformLocation(program, 'uColor3');
    
    // Get array uniform locations
    const iTrailPosLocations: (WebGLUniformLocation | null)[] = [];
    const iTrailFalloffLocations: (WebGLUniformLocation | null)[] = [];
    for (let i = 0; i < 8; i++) {
      iTrailPosLocations.push(gl.getUniformLocation(program, `iTrailPos[${i}]`));
      iTrailFalloffLocations.push(gl.getUniformLocation(program, `iTrailFalloff[${i}]`));
    }

    let startTime = Date.now();
    let elapsedBeforeHidden = 0;

    // Helper function to convert hex to RGB
    const hexToRgb = (hex: string): [number, number, number] => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? [
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255
      ] as [number, number, number] : [1, 0, 0];
    };

    // Helper function to convert HSL to RGB normalized
    const hslToRgbNormalized = (h: number, s: number, l: number): [number, number, number] => {
      s /= 100;
      l /= 100;
      const k = (n: number) => (n + h / 30) % 12;
      const a = s * Math.min(l, 1 - l);
      const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
      return [f(0), f(8), f(4)];
    };

    // Animation loop. The frame id is captured so cleanup can cancel it — without
    // this, every `settings` change would leave the previous loop running against
    // a now-deleted program.
    let animationFrameId = 0;

    const animate = () => {
      const liveSettings = settingsRef.current;
      const elapsed = (Date.now() - startTime) / 1000;

      // Increase drag significantly - slower smoothing
      const smoothingFactor = liveSettings.trailDrag;
      smoothMousePosRef.current.x += (mousePosRef.current.x - smoothMousePosRef.current.x) * smoothingFactor;
      smoothMousePosRef.current.y += (mousePosRef.current.y - smoothMousePosRef.current.y) * smoothingFactor;

      // Update trail - shift positions and add new one
      mouseTrailRef.current.shift();
      mouseTrailRef.current.push({ 
        x: smoothMousePosRef.current.x, 
        y: smoothMousePosRef.current.y 
      });

      gl.uniform2f(iResolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(iTimeLocation, elapsed);
      gl.uniform2f(iMouseLocation, mousePosRef.current.x, canvas.height - mousePosRef.current.y);
      gl.uniform2f(iSmoothedMouseLocation, smoothMousePosRef.current.x, canvas.height - smoothMousePosRef.current.y);
      gl.uniform1f(uAnimationSpeedLocation, liveSettings.animationSpeed);
      const isMobileViewport = canvas.width < 768;
      const effectiveGrainIntensity = isMobileViewport ? liveSettings.grainIntensity * 0.45 : liveSettings.grainIntensity;
      const verticalScrollOffset = scrollProgressRef.current * 8;

      gl.uniform1f(uGrainIntensityLocation, effectiveGrainIntensity);
      gl.uniform1f(uCircleRadiusLocation, liveSettings.circleRadius);
      gl.uniform1f(uRippleIntensityLocation, liveSettings.rippleIntensity);
      gl.uniform1i(uColorModeLocation, liveSettings.colorMode === 'spectral' ? 0 : 1);
      gl.uniform1f(uVerticalScrollOffsetLocation, verticalScrollOffset);

      // In spectral mode, derive palette from scroll color.
      // In custom mode, always use the user-selected settings colors.
      let col1: [number, number, number];
      let col2: [number, number, number];
      let col3: [number, number, number];

      const activeScrollColor = scrollColorRef.current;
      const activeScrollColorRgb = scrollColorRgbRef.current;
      const scrollHueShift = activeScrollColor ? ((activeScrollColor.hue / 360) * 240 - 120) : 0;
      const combinedSpectralShift = liveSettings.spectralHueShift + scrollHueShift;

      gl.uniform1f(uSpectralHueShiftLocation, combinedSpectralShift);
      gl.uniform1f(uSpectralScaleLocation, liveSettings.spectralScale);
      gl.uniform1f(uSpectralTimeShiftLocation, liveSettings.spectralTimeShift);
      gl.uniform1f(uSpectralSaturationLocation, liveSettings.spectralSaturation);

      if (liveSettings.colorMode === 'spectral' && activeScrollColorRgb && activeScrollColor) {
        // Generate complementary colors from scroll color hue
        const baseHue = activeScrollColor.hue;
        const sat = activeScrollColor.saturation;
        const light = activeScrollColor.lightness;
        
        // Generate three colors spaced around the color wheel
        col1 = activeScrollColorRgb;
        col2 = hslToRgbNormalized(
          (baseHue + 120) % 360,
          Math.min(sat + 10, 100),
          Math.max(light - 10, 20)
        );
        col3 = hslToRgbNormalized(
          (baseHue + 240) % 360,
          Math.min(sat + 10, 100),
          Math.min(light + 10, 80)
        );
      } else {
        col1 = hexToRgb(liveSettings.customColor1);
        col2 = hexToRgb(liveSettings.customColor2);
        col3 = hexToRgb(liveSettings.customColor3);
      }

      gl.uniform3f(uColor1Location, col1[0], col1[1], col1[2]);
      gl.uniform3f(uColor2Location, col2[0], col2[1], col2[2]);
      gl.uniform3f(uColor3Location, col3[0], col3[1], col3[2]);

      // Pass trail positions and falloff (newest to oldest)
      for (let i = 0; i < 8; i++) {
        const trailPoint = mouseTrailRef.current[i];
        gl.uniform2f(iTrailPosLocations[i], trailPoint.x, canvas.height - trailPoint.y);
        // Falloff increases toward older positions (index 0 = oldest, index 7 = newest)
        gl.uniform1f(iTrailFalloffLocations[i], (i + 1) / 8);
      }

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationFrameId = requestAnimationFrame(animate);
    };

    // Stop drawing if the GPU drops the context (e.g. tab backgrounded, driver
    // reset); preventDefault keeps the context eligible for restoration.
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      cancelAnimationFrame(animationFrameId);
    };
    canvas.addEventListener('webglcontextlost', handleContextLost);

    // A hidden tab still owns the GPU context; stop feeding it frames and pick
    // up again (with the clock rebased) when the page comes back.
    const handleVisibilityChange = () => {
      cancelAnimationFrame(animationFrameId);

      if (!document.hidden) {
        startTime = Date.now() - elapsedBeforeHidden * 1000;
        animate();
      } else {
        elapsedBeforeHidden = (Date.now() - startTime) / 1000;
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
    };
    // Set up once: settings reach the loop through settingsRef, so this effect
    // must not re-run (and recompile the program) when they change.
  }, []);

  return (
    <>
      {renderFailed && (
        <div
          aria-hidden="true"
          className="fixed inset-0 -z-10 pointer-events-none"
          style={{
            // Brand-tinted glow over the black page background (no hardcoded hex).
            background:
              'radial-gradient(circle at 30% 20%, var(--brand-color), transparent 55%), radial-gradient(circle at 75% 75%, color-mix(in srgb, var(--brand-color) 35%, black), transparent 60%)',
          }}
        />
      )}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none"
      />
    </>
  );
}