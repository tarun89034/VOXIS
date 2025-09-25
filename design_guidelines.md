# Voice Assistant Design Guidelines

## Design Approach
**Reference-Based Approach** - Drawing inspiration from modern AI assistants like ChatGPT, Claude, and voice interfaces like Alexa/Google Assistant, emphasizing clean, tech-forward aesthetics with dynamic visual feedback.

## Core Design Elements

### A. Color Palette
**Dark Mode Primary (Default):**
- Background: 220 15% 8% (deep navy-black)
- Surface: 220 12% 12% (elevated dark surface)
- Primary: 210 100% 65% (vibrant blue for waveform)
- Secondary: 280 60% 70% (purple accent for interactions)
- Text: 0 0% 95% (near-white)
- Muted Text: 220 10% 65% (gray for secondary info)

**Light Mode:**
- Background: 0 0% 98% (off-white)
- Surface: 0 0% 100% (pure white)
- Primary: 210 100% 50% (deeper blue)
- Secondary: 280 60% 55% (darker purple)
- Text: 220 15% 15% (dark gray)

### B. Typography
- **Primary Font:** Inter (Google Fonts) - modern, highly legible
- **Accent Font:** JetBrains Mono (Google Fonts) - for technical elements
- **Hierarchy:** 
  - Hero text: 2xl-3xl font-bold
  - Chat messages: base font-normal
  - UI labels: sm font-medium
  - System info: xs font-mono

### C. Layout System
**Spacing Units:** Tailwind spacing of 2, 4, 6, 8, 12, 16, 24 for consistent rhythm
- Micro spacing: 2-4 units (buttons, form elements)
- Component spacing: 6-8 units (between sections)
- Layout spacing: 12-24 units (major sections)

### D. Component Library

**Core Avatar/Visualizer:**
- Large circular container (w-32 h-32 to w-48 h-48)
- Animated concentric circles for waveform visualization
- Smooth CSS transforms and Web Audio API integration
- Pulsing glow effect using box-shadow
- Gradient borders transitioning with audio activity

**Chat Interface:**
- Message bubbles with rounded corners (rounded-2xl)
- User messages: right-aligned with primary color background
- Assistant messages: left-aligned with surface color background
- Typing indicators with animated dots
- Timestamp display with muted text styling

**Control Panel:**
- Floating action buttons for mic toggle, settings
- Clean toggle switches for voice/text modes
- Minimal icon buttons using Heroicons
- Glass morphism effects for overlay elements

**System Integration Panel:**
- Compact status cards showing system info
- Subtle border treatments
- Icon + text combinations for clear communication

### E. Visual Treatments

**Animations:**
- Micro-interactions only: button hover states, loading spinners
- Waveform animation: smooth, continuous radial waves
- Message appearance: gentle slide-in from appropriate side
- NO distracting page transitions or complex animations

**Audio Visualization:**
- Real-time circular waveform around avatar
- Color intensity matches audio amplitude
- Smooth interpolation between states
- Subtle background pulse during active listening

**Interactive States:**
- Hover: subtle scale transforms (scale-105)
- Active: slight depression effect
- Focus: clear outline indicators for accessibility
- Loading: spinner overlays, not full-page loaders

## Layout Architecture

**Single-Page Application Structure:**
1. **Header Bar** - Logo, settings access, theme toggle
2. **Central Avatar Area** - Dominant circular visualizer with surrounding space
3. **Chat Panel** - Scrollable conversation history (collapsible)
4. **Control Strip** - Voice controls, input methods, quick actions
5. **Status Footer** - Connection status, system info (minimal)

**Responsive Behavior:**
- Desktop: Wide layout with side chat panel
- Tablet: Stacked layout with collapsible chat
- Mobile: Full-screen chat with floating avatar overlay

## Accessibility Considerations
- High contrast ratios in both light and dark modes
- Clear focus indicators for keyboard navigation
- Screen reader friendly labels for all interactive elements
- Voice control as primary interaction method accommodates motor accessibility
- Visual feedback supplements audio for hearing accessibility

This design emphasizes the core voice interaction while providing a clean, modern interface that feels both technological and approachable, with the animated avatar as the central focal point.