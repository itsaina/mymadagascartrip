# Overview

This is a comprehensive Madagascar tourism website built with React, Express.js, and PostgreSQL. The project showcases destinations and activities across Madagascar with a modern, responsive design. It features a comprehensive travel guide with detailed destination pages, 130+ authentic activities with local photos, circuit packages with taxi-brousse transport details, and a vehicle rental cost simulator. The application maintains a clean, professional interface using shadcn/ui components and Tailwind CSS with a red color scheme reflecting Madagascar's tourism branding.

## Recent Changes (January 2025)
- **Activity Integration**: Added 130 activities from Excel data with authentic local photos
- **Vehicle Simulator**: Created comprehensive travel cost calculator with accommodation, food, and transport
- **Transport Details**: Enhanced circuits with authentic taxi-brousse transportation information  
- **Currency System**: Implemented multi-currency pricing (Ariary, USD, EUR) with real exchange rates
- **Branding Update**: Changed site name from "Madagascar Explorer" to "My Madagascar Trip"
- **Footer Simplification**: Updated all footers with new agency description and removed unnecessary sections
- **CTA Consistency**: Changed all call-to-action buttons from "Planifier votre voyage", "Réserver", "Découvrir" to uniform "Se Renseigner" across all pages

# User Preferences

Preferred communication style: Simple, everyday language.
Content language: French (site content in French for Madagascar tourism)
Design preference: Red color scheme for tourism branding

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **Build Tool**: Vite for fast development and optimized production builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Form Handling**: React Hook Form with Zod validation resolvers

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **API Pattern**: RESTful API design with `/api` prefix for all endpoints
- **Session Management**: Built-in session support with connect-pg-simple
- **Development**: Hot reload with tsx for server-side development

## Data Storage
- **Database**: PostgreSQL with Neon serverless driver
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Type Safety**: Full end-to-end type safety from database to frontend
- **Storage Interface**: Abstracted storage layer with in-memory fallback for development

## Project Structure
- **Monorepo Layout**: Client, server, and shared code in separate directories
- **Shared Types**: Common schemas and types in `/shared` directory
- **Asset Management**: Centralized asset handling through Vite aliases
- **Environment Configuration**: Development and production build processes

## Development Workflow
- **Hot Reload**: Both frontend and backend support hot reloading
- **Type Checking**: Strict TypeScript configuration across all modules
- **Build Process**: Separate build commands for client and server with esbuild
- **Database Operations**: Push-based schema updates with Drizzle

# External Dependencies

## Core Framework Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless driver for database connectivity
- **drizzle-orm**: Type-safe ORM for database operations
- **express**: Web application framework for the backend API
- **react**: Frontend UI framework with hooks support
- **vite**: Frontend build tool and development server

## UI and Styling
- **@radix-ui/***: Comprehensive set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework for styling
- **class-variance-authority**: Utility for creating component variants
- **lucide-react**: Icon library for UI components

## Development and Build Tools
- **typescript**: Static type checking across the entire codebase
- **tsx**: TypeScript execution engine for development
- **esbuild**: Fast bundler for production server builds
- **drizzle-kit**: Database schema management and migration tool

## State Management and Data Fetching
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight routing solution for React
- **react-hook-form**: Form state management with validation

## Additional Utilities
- **zod**: Runtime type validation and schema parsing
- **date-fns**: Date manipulation utilities
- **nanoid**: Unique ID generation for development tools