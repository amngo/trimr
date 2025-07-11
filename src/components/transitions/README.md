# Page Transition Components

This directory contains components for handling smooth page transitions in the application.

## Components

### FadeTransition
A simple fade transition component that animates page changes with opacity and subtle vertical movement.

**Usage:**
```jsx
import { FadeTransition } from '@/components/transitions';

<FadeTransition>
  {children}
</FadeTransition>
```

### PageTransition
A more advanced page transition component with AnimatePresence for smooth transitions between routes.

### RouteTransition
A comprehensive route transition component with loading states and sophisticated animations.

### TransitionLink
A custom Link component that provides smooth transitions when navigating between pages.

### LoadingOverlay
A loading overlay component that appears during route transitions.

## Features

- **Smooth fade transitions** between pages
- **Optimized performance** with proper motion settings
- **DaisyUI integration** with themed loading spinners
- **TypeScript support** with proper type definitions
- **Accessibility** with proper ARIA attributes

## Configuration

The transitions use optimized easing curves and durations:
- **Duration**: 0.3s for most transitions
- **Easing**: Custom cubic bezier `[0.25, 0.1, 0.25, 1]`
- **Movement**: Subtle 10px vertical shift during transition