# Illuminate - WebGL Shader Gradient

A modern, full-screen grain-blurred animated shader gradient built with Next.js and WebGL.

## Features

- **Full-screen WebGL Canvas**: Renders a high-performance shader animation
- **Spectral Color Mapping**: Uses spectral color calculation based on wavelength
- **Animated Transformation**: Dynamic moving gradient with time-based transformations
- **Grain Effect**: Added noise texture for a modern, grainy aesthetic
- **Responsive**: Automatically adapts to window resizing
- **Performance Optimized**: Uses WebGL 2.0 for efficient GPU rendering

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Build

```bash
npm run build
npm start
```

## How It Works

The shader gradient uses:
1. **Spectral Color Function**: Maps wavelengths (400-700nm) to RGB colors
2. **Animated Transformations**: 8 iterations of sine/cosine distortions based on time
3. **Grain/Noise**: Procedurally generated noise for texture
4. **Motion Blur**: Slight blurring effect for smoothness

The animation runs at 60fps (or higher depending on your device) and continuously updates based on elapsed time.

## Technology Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **WebGL 2.0** - GPU-accelerated graphics
- **Tailwind CSS** - Styling

## License

Open source
