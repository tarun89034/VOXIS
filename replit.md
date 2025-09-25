# Voice Assistant AI Application

## Overview

This is a modern voice assistant application built with React and Express that provides AI-powered speech interaction capabilities. The system features real-time audio visualization, chat interface, and voice recognition technology. The application is designed with a clean, modern UI inspired by ChatGPT and Claude interfaces, emphasizing dark mode aesthetics and smooth animations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on top of Radix UI primitives
- **Styling**: Tailwind CSS with custom design system supporting both dark and light themes
- **State Management**: React Query (TanStack Query) for server state management
- **Routing**: Wouter for lightweight client-side routing

### Component Structure
The application follows a modular component architecture:
- **VoiceVisualizer**: Animated waveform visualization using CSS animations and Web Audio API
- **ChatInterface**: Message display with avatar system and interactive controls
- **VoiceControls**: Voice activation controls with connection status indicators
- **SystemInfo**: Real-time system information display
- **ThemeToggle**: Dark/light mode switching functionality

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Build System**: ESBuild for production bundling and TSX for development
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Storage**: Modular storage interface with in-memory implementation for development

### Database Design
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Type-safe schema definitions with Zod validation
- **Migrations**: Managed through drizzle-kit with automated schema generation

### Design System
- **Theme**: Comprehensive dark/light mode support with CSS custom properties
- **Typography**: Inter font for UI elements, JetBrains Mono for technical content
- **Color Palette**: Sophisticated color system with semantic color tokens
- **Layout**: Consistent spacing system using Tailwind's spacing scale
- **Animations**: Smooth CSS transitions and Web Audio API-driven visualizations

### Development Architecture
- **Monorepo Structure**: Client, server, and shared code in organized directories
- **Type Safety**: Full TypeScript coverage with shared types between frontend and backend
- **Path Aliases**: Configured path mapping for clean imports (@/, @shared/, @assets/)
- **Hot Reload**: Vite HMR for frontend, TSX watch mode for backend development

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity for serverless environments
- **drizzle-orm**: Type-safe ORM with PostgreSQL support
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight React routing

### UI Framework
- **@radix-ui/***: Comprehensive set of unstyled, accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **clsx**: Conditional class name utility

### Development Tools
- **vite**: Fast build tool and development server
- **typescript**: Type safety and enhanced developer experience
- **esbuild**: Fast JavaScript bundler for production builds
- **@replit/vite-plugin-runtime-error-modal**: Development error handling

### Form and Validation
- **react-hook-form**: Performant form library
- **@hookform/resolvers**: Form validation resolvers
- **zod**: Schema validation library

### Date and Utilities
- **date-fns**: Modern date utility library
- **nanoid**: URL-safe unique ID generator
- **cmdk**: Command menu component