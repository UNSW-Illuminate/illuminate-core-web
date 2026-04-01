'use client';

import { useEffect, useRef } from 'react';
import { ShaderSettings } from '@/app/hooks/useShaderSettings';

export default function ShaderGradient({ 
  settings, 
  scrollColor,
  scrollColorRgb 
}: { 
  settings: ShaderSettings;
  scrollColor?: { hue: number; saturation: number; lightness: number };
  scrollColorRgb?: [number, number, number];
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const smoothMousePosRef = useRef({ x: 0, y: 0 });
  const mouseTrailRef = useRef<Array<{ x: number; y: number }>>(
    Array(8).fill({ x: 0, y: 0 })
  );

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

    void main() {
      vec2 fragCoord = gl_FragCoord.xy;
      vec2 p = (2.0 * fragCoord - iResolution) / min(iResolution.x, iResolution.y);
      p *= 2.0;

      // Calculate normalized mouse position for enhanced hover effect
      vec2 mouseNorm = iMouse / iResolution;
      mouseNorm = (2.0 * mouseNorm - 1.0) * vec2(iResolution.x / iResolution.y, 1.0);
      
      // Distance from current fragment to mouse position
      float distToMouse = distance(p, mouseNorm);
      float mouseProximity = exp(-distToMouse * distToMouse * 2.0);
      
      // Enhanced mouse influence on animation with proximity-based intensity
      float mouseInfluence = sin(mouseNorm.x * 0.5 + iTime * 0.1) * 0.2 * mouseProximity;
      float mouseInfluenceY = cos(mouseNorm.y * 0.5 + iTime * 0.1) * 0.2 * mouseProximity;
      
      // Directional displacement toward mouse for hover effect
      vec2 mouseDisplace = normalize(mouseNorm - p) * mouseProximity * 0.3;

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
        transformedP + vec2(ripple * 3.0, ripple * 3.0) + mouseDisplace * 2.0, 
        borderMask * (1.0 + trailInfluence * 0.5 + mouseProximity * 0.8)
      );

      // Get base color from palette
      vec3 color;
      if (uColorMode == 0) {
        color = spectral_colour(modulatedP.y * 50.0 + 500.0 + sin(iTime * 0.15 * uAnimationSpeed));
      } else {
        color = customColor(modulatedP.y * 2.0 + sin(iTime * 0.2 * uAnimationSpeed) * 0.5);
      }

      // Add grain effect
      float grain = noise(fragCoord * 0.5 + iTime * 0.02) * uGrainIntensity;
      color += vec3(grain);

      // Add subtle blur via multiple samples
      vec3 blurred = color;
      if (uColorMode == 0) {
        blurred += spectral_colour(modulatedP.y * 50.0 + 500.0 + sin((iTime + 0.1) * 0.15 * uAnimationSpeed)) * 0.1;
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
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? [
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255
      ] : [1, 0, 0];
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
      gl.uniform1f(uGrainIntensityLocation, settings.grainIntensity);
      gl.uniform1f(uCircleRadiusLocation, settings.circleRadius);
      gl.uniform1f(uRippleIntensityLocation, settings.rippleIntensity);
      gl.uniform1i(uColorModeLocation, settings.colorMode === 'spectral' ? 0 : 1);

      // Set custom colors - use scroll colors if available, otherwise use settings
      let col1: [number, number, number];
      let col2: [number, number, number];
      let col3: [number, number, number];

      if (scrollColorRgb && scrollColor) {
        // Generate complementary colors from scroll color hue
        const baseHue = scrollColor.hue;
        const sat = scrollColor.saturation;
        const light = scrollColor.lightness;
        
        // Generate three colors spaced around the color wheel
        col1 = scrollColorRgb;
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