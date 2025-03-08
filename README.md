# MOA City - Parking Ticket Timer

A digital parking ticket system that displays current rates, time remaining, and allows for payment processing.

## 🎯 Features

- Real-time display of current parking rates (R10-R80)
- Visual indicator of time remaining
- Interactive UI with expandable details
- Payment processing with confirmation screen
- Fully accessible with keyboard navigation and screen reader support
- Responsive design with customizable positioning

## 📦 Component Overview

The `TicketTimer` component is a modular, reusable widget that can be placed anywhere in your application.

### Usage

```jsx
import TicketTimer from '@/components/TicketTimer';

// Basic usage
<TicketTimer />

// With custom options
<TicketTimer 
  initialMinutes={60} 
  position="top-right"
  defaultExpanded={true}
  onPayment={(amount) => console.log(`Payment of ${amount} processed`)}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialMinutes` | number | 0 | Initial position for the timer (minutes from starting point) |
| `position` | 'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left' | 'bottom-right' | Custom position for the widget |
| `defaultExpanded` | boolean | false | Initial state of the expansion |
| `onPayment` | (amount: string) => void | undefined | Callback when payment is made |

## 🏗️ Project Structure

```
├── components/
│   └── TicketTimer/           # Widget component folder
│       ├── index.tsx          # Main TicketTimer component
│       ├── index.test.tsx     # Tests for the component
│       ├── TicketHeader.tsx   # Price display component
│       ├── ProgressIndicator.tsx  # Dot indicators component
│       ├── ExpandedSection.tsx    # Detailed view component
│       └── PaymentConfirmation.tsx # Payment success component
├── lib/
│   ├── constants.ts           # Price tiers and type definitions
│   ├── styleUtils.ts          # Style-related utility functions
│   └── timerUtils.ts          # Timer-related utility functions
```

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Run the development server:
   ```
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) to see the result.

## 🧪 Testing

Run tests with:

```
npm test
```

## 🔍 Implementation Details

The TicketTimer is built using a modular architecture with:

- React hooks for state management (useState, useEffect, useMemo, useCallback)
- TypeScript for type safety
- Tailwind CSS for styling
- ARIA attributes for accessibility
- React.memo for performance optimization

## 📱 Responsive Design

The component is designed to work on devices of all sizes and can be positioned in any corner of the screen using the `position` prop.

## 📄 License

MIT
