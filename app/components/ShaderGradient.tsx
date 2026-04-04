'use client';

import { useEffect, useRef } from 'react';
import { ShaderSettings } from '@/app/hooks/useShaderSettings';

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
      console.error('WebGL 2 not supported');
      return;
    }

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

    // Vertex shader
    const vertexShaderSource = `#version 300 es
    precision highp float;

    in vec2 position;

    void main() {
      gl_Position = vec4(position, 0.0, 1.0);
    }
    `;

    // Fragment shader
    const fragmentShaderSource = `#version 300 es
    precision highp float;

    out vec4 fragColor;

    uniform vec2 iResolution;
    uniform float iTime;
    uniform vec2 iMouse;
    uniform vec2 iSmoothedMouse;
    uniform vec2 iTrailPos[8];
    uniform float iTrailFalloff[8];
    uniform float uAnimationSpeed;
    uniform float uGrainIntensity;
    uniform float uCircleRadius;
    uniform float uRippleIntensity;
    uniform int uColorMode;
    uniform float uSpectralHueShift;
    uniform float uSpectralScale;
    uniform float uSpectralTimeShift;
    uniform float uSpectralSaturation;
    uniform float uVerticalScrollOffset;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;

    vec3 spectral_colour(float l) {
      float r = 0.0, g = 0.0, b = 0.0;
      
      if ((l >= 400.0) && (l < 410.0)) { float t = (l - 400.0) / (410.0 - 400.0); r = +(0.33*t) - (0.20*t*t); }
      else if ((l >= 410.0) && (l < 475.0)) { float t = (l - 410.0) / (475.0 - 410.0); r = 0.14 - (0.13*t*t); }
      else if ((l >= 545.0) && (l < 595.0)) { float t = (l - 545.0) / (595.0 - 545.0); r = +(1.98*t) - (t*t); }
      else if ((l >= 595.0) && (l < 650.0)) { float t = (l - 595.0) / (650.0 - 595.0); r = 0.98 + (0.06*t) - (0.40*t*t); }
      else if ((l >= 650.0) && (l < 700.0)) { float t = (l - 650.0) / (700.0 - 650.0); r = 0.65 - (0.84*t) + (0.20*t*t); }
      
      if ((l >= 415.0) && (l < 475.0)) { float t = (l - 415.0) / (475.0 - 415.0); g = +(0.80*t*t); }
      else if ((l >= 475.0) && (l < 590.0)) { float t = (l - 475.0) / (590.0 - 475.0); g = 0.8 + (0.76*t) - (0.80*t*t); }
      else if ((l >= 585.0) && (l < 639.0)) { float t = (l - 585.0) / (639.0 - 585.0); g = 0.82 - (0.80*t); }
      
      if ((l >= 400.0) && (l < 475.0)) { float t = (l - 400.0) / (475.0 - 400.0); b = +(2.20*t) - (1.50*t*t); }
      else if ((l >= 475.0) && (l < 560.0)) { float t = (l - 475.0) / (560.0 - 475.0); b = 0.7 - (t) + (0.30*t*t); }

      return vec3(r, g, b);
    }

    vec3 customColor(float t) {
      t = fract(t);
      if (t < 0.5) {
        return mix(uColor1, uColor2, t * 2.0);
      } else {
        return mix(uColor2, uColor3, (t - 0.5) * 2.0);
      }
    }

    // Grain/noise function
    float noise(vec2 uv) {
      return fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
    }

    vec3 applySaturation(vec3 c, float s) {
      float luma = dot(c, vec3(0.2126, 0.7152, 0.0722));
      return mix(vec3(luma), c, s);
    }

    void main() {
      vec2 fragCoord = gl_FragCoord.xy;
      vec2 p = (2.0 * fragCoord - iResolution) / min(iResolution.x, iResolution.y);
      p *= 2.0;
      p.y -= uVerticalScrollOffset;

      // Use smoothed cursor position and a bounded warp field.
      // This avoids singularities that can create detached sharp points near the cursor.
      vec2 mouseNorm = iSmoothedMouse / iResolution;
      mouseNorm = (2.0 * mouseNorm - 1.0) * vec2(iResolution.x / iResolution.y, 1.0);

      vec2 toMouse = p - mouseNorm;
      float distToMouse2 = dot(toMouse, toMouse);
      float distToMouse = sqrt(distToMouse2 + 1e-6);
      float mouseProximity = exp(-distToMouse2 * 1.8);

      // Swirl + radial pinch with gaussian falloff produces smooth, stable distortion.
      vec2 swirlDir = vec2(-toMouse.y, toMouse.x);
      vec2 radialDir = toMouse / (distToMouse + 0.35);
      vec2 swirlWarp = swirlDir * (0.22 * mouseProximity);
      vec2 radialWarp = -radialDir * (0.12 * mouseProximity);
      float pulse = sin(distToMouse * 10.0 - iTime * 1.1) * 0.02 * mouseProximity;
      vec2 mouseDisplace = swirlWarp + radialWarp + radialDir * pulse;

      float mouseInfluence = sin(mouseNorm.x * 0.45 + iTime * 0.08) * 0.16 * mouseProximity;
      float mouseInfluenceY = cos(mouseNorm.y * 0.45 + iTime * 0.08) * 0.16 * mouseProximity;

      // Calculate minimum distance to trail and accumulate falloff effect
      float minDistFromTrail = 10000.0;
      float trailInfluence = 0.0;
      
      for(int i = 0; i < 8; i++) {
        float distToTrailPoint = distance(fragCoord, iTrailPos[i]);
        float trailContribution = iTrailFalloff[i] * exp(-distToTrailPoint * distToTrailPoint * 0.001);
        trailInfluence += trailContribution;
        minDistFromTrail = min(minDistFromTrail, distToTrailPoint);
      }
      
      // Soft circle mask based on trail proximity
      float circleMask = smoothstep(uCircleRadius + 80.0, uCircleRadius - 80.0, minDistFromTrail);
      float borderMask = circleMask * (1.0 - circleMask) * 4.0;
      
      // Enhanced rippling effect with mouse influence
      float ripple = sin(minDistFromTrail * 0.03 - iTime * 0.4) * borderMask * uRippleIntensity * (1.0 + mouseProximity);

      // Animated transformation loop with enhanced hover displacement
      vec2 transformedP = p + mouseDisplace;
      for(int i = 0; i < 8; i++) {
        vec2 newp = vec2(
          transformedP.y + cos(transformedP.x + iTime * 0.08 * uAnimationSpeed + mouseInfluence) - sin(transformedP.y * cos(iTime * 0.015 * uAnimationSpeed + mouseInfluenceY)),
          transformedP.x - sin(transformedP.y - iTime * 0.08 * uAnimationSpeed + mouseInfluence) - cos(transformedP.x * sin(iTime * 0.02 * uAnimationSpeed + mouseInfluenceY))
        );
        transformedP = newp;
      }

      // Apply modulation with trail falloff and enhanced hover distortion
      vec2 modulatedP = mix(
        transformedP, 
        transformedP + vec2(ripple * 3.0, ripple * 3.0) + mouseDisplace * 1.5, 
        borderMask * (1.0 + trailInfluence * 0.5 + mouseProximity * 0.8)
      );

      // Get base color from palette
      vec3 color;
      if (uColorMode == 0) {
        float wave = modulatedP.y * uSpectralScale + (500.0 + uSpectralHueShift) + sin(iTime * 0.15 * uAnimationSpeed) * uSpectralTimeShift;
        color = applySaturation(spectral_colour(wave), uSpectralSaturation);
      } else {
        color = customColor(modulatedP.y * 2.0 + sin(iTime * 0.2 * uAnimationSpeed) * 0.5);
      }

      // Add grain effect
      float grain = noise(fragCoord * 0.5 + iTime * 0.02) * uGrainIntensity;
      color += vec3(grain);

      // Add subtle blur via multiple samples
      vec3 blurred = color;
      if (uColorMode == 0) {
        float blurWave = modulatedP.y * uSpectralScale + (500.0 + uSpectralHueShift) + sin((iTime + 0.1) * 0.15 * uAnimationSpeed) * uSpectralTimeShift;
        blurred += applySaturation(spectral_colour(blurWave), uSpectralSaturation) * 0.1;
      } else {
        blurred += customColor(modulatedP.y * 2.0 + sin((iTime + 0.1) * 0.2 * uAnimationSpeed) * 0.5) * 0.1;
      }
      
      color = mix(color, blurred, 0.3);

      // Ensure color is in valid range
      color = clamp(color, 0.0, 1.0);

      fragColor = vec4(color, 1.0);
    }
    `;

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

    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);

    if (!vertexShader || !fragmentShader) return;

    // Link program
    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(`Program linking error: ${gl.getProgramInfoLog(program)}`);
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

    // Animation loop
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;

      // Increase drag significantly - slower smoothing
      const smoothingFactor = settings.trailDrag;
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
      gl.uniform1f(uAnimationSpeedLocation, settings.animationSpeed);
      const isMobileViewport = canvas.width < 768;
      const effectiveGrainIntensity = isMobileViewport ? settings.grainIntensity * 0.45 : settings.grainIntensity;
      const verticalScrollOffset = scrollProgressRef.current * 8;

      gl.uniform1f(uGrainIntensityLocation, effectiveGrainIntensity);
      gl.uniform1f(uCircleRadiusLocation, settings.circleRadius);
      gl.uniform1f(uRippleIntensityLocation, settings.rippleIntensity);
      gl.uniform1i(uColorModeLocation, settings.colorMode === 'spectral' ? 0 : 1);
      gl.uniform1f(uVerticalScrollOffsetLocation, verticalScrollOffset);

      // In spectral mode, derive palette from scroll color.
      // In custom mode, always use the user-selected settings colors.
      let col1: [number, number, number];
      let col2: [number, number, number];
      let col3: [number, number, number];

      const activeScrollColor = scrollColorRef.current;
      const activeScrollColorRgb = scrollColorRgbRef.current;
      const scrollHueShift = activeScrollColor ? ((activeScrollColor.hue / 360) * 240 - 120) : 0;
      const combinedSpectralShift = settings.spectralHueShift + scrollHueShift;

      gl.uniform1f(uSpectralHueShiftLocation, combinedSpectralShift);
      gl.uniform1f(uSpectralScaleLocation, settings.spectralScale);
      gl.uniform1f(uSpectralTimeShiftLocation, settings.spectralTimeShift);
      gl.uniform1f(uSpectralSaturationLocation, settings.spectralSaturation);

      if (settings.colorMode === 'spectral' && activeScrollColorRgb && activeScrollColor) {
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
        col1 = hexToRgb(settings.customColor1);
        col2 = hexToRgb(settings.customColor2);
        col3 = hexToRgb(settings.customColor3);
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

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, [settings]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
    />
  );
}