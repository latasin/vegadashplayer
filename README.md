# Vega Dash Player

A React Native application for playing DASH video content using Amazon's Kepler platform and W3C Media APIs.

## Features

- DASH video streaming support
- React Native with TypeScript
- Amazon Kepler platform integration
- W3C Media polyfills for cross-platform compatibility
- Video surface and captions support

## Dependencies

- React Native 0.72.0
- @amazon-devices/react-native-w3cmedia
- @amazon-devices/react-native-kepler
- Dash.js for DASH streaming

## Project Structure

```
src/
├── App.tsx                 # Main application component
├── AppPreBuffering.tsx     # Alternative app with pre-buffering
├── PlayerInterface.ts      # Player interface definitions
├── components/             # Reusable components
├── dashjsplayer/          # Dash.js integration
└── assets/                # Static assets

polyfills/                 # W3C Media polyfills
├── DocumentPolyfill.ts
├── ElementPolyfill.ts
├── MiscPolyfill.ts
├── TextDecoderPolyfill.ts
└── W3CMediaPolyfill.ts
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the application:
   ```bash
   npm run build:release
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Scripts

- `npm run clean` - Clean build artifacts
- `npm run build:release` - Build release version
- `npm run build:debug` - Build debug version
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## License

Copyright (c) 2024 Amazon.com, Inc. or its affiliates. All rights reserved.
PROPRIETARY/CONFIDENTIAL. USE IS SUBJECT TO LICENSE TERMS.