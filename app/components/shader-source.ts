/**
 * GLSL source for the full-screen gradient rendered by ShaderGradient.tsx.
 *
 * Kept in its own module so the component stays about wiring (context, uniforms,
 * animation loop) rather than 160 lines of shader text. Uniform names here are
 * the contract with ShaderGradient — rename in both places or the lookup silently
 * returns null and the uniform stops updating.
 */

export const VERTEX_SHADER_SOURCE = `#version 300 es
    precision highp float;

    in vec2 position;

    void main() {
      gl_Position = vec4(position, 0.0, 1.0);
    }
`;

export const FRAGMENT_SHADER_SOURCE = `#version 300 es
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
