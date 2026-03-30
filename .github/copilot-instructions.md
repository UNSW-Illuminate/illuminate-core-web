# Illuminate - WebGL Shader Gradient Project

Custom instructions for developing the Illuminate shader gradient visualization.

## Project Overview

This is a Next.js project that renders a full-screen animated WebGL shader gradient with spectral color mapping, grain effects, and motion blur. The shader creates a modern, visually striking background animation.

## Key Files

- **app/components/ShaderGradient.tsx** - Main WebGL shader component
  - Contains vertex and fragment shaders
  - Manages canvas rendering and animation loop
  - Handles window resizing
  
- **app/page.tsx** - Main page that displays the shader gradient
- **app/layout.tsx** - Root layout with metadata
- **app/globals.css** - Global styles and Tailwind imports

## Development Guidelines

### Running the Project

```bash
npm install      # Install dependencies
npm run dev      # Start development server (port 3001)
npm run build    # Build for production
npm start        # Start production server
```

### Modifying Shaders

The fragment shader is located in `ShaderGradient.tsx`. Key sections:

1. **spectral_colour()** - Maps wavelength (400-700nm) to RGB
2. **Transformation loop** - 8 iterations of sine/cosine distortions
3. **Grain effect** - Procedural noise for texture
4. **Color blending** - Motion blur effect

### Customization Tips

- **Animation speed**: Modify `iTime` multipliers (e.g., `iTime * 0.6`)
- **Grain intensity**: Change `grain *= 0.15` to adjust noise amount
- **Color range**: Adjust `p.y * 50.0 + 500.0` for different spectral bands
- **Transformation intensity**: Change loop multiplier for different distortion effects

## Technical Stack

- **Next.js 15** - React framework with server components
- **TypeScript** - Type-safe development
- **WebGL 2.0** - GPU-accelerated rendering
- **Tailwind CSS** - Styling
- **React Hooks** - Canvas manipulation via useEffect and useRef

## Performance Considerations

- Canvas automatically resizes with window
- Shader runs native on GPU at 60+ fps
- Minimal CPU overhead - all calculations in GPU
- requestAnimationFrame for optimized rendering loop

## Browser Support

Requires WebGL 2.0 support:
- Chrome/Edge 56+
- Firefox 51+
- Safari 15+
- Opera 43+

## Building for Production

```bash
npm run build
npm start
```

The production build optimizes Next.js for deployment and uses static generation where possible.
