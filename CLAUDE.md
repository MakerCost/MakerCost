# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Application Branding
- **Application Name**: MakerCost
- **Logo**: `/public/makercost-logo.png` - displayed at the top of the application
- **Favicon**: `/public/favicon.png`

## Development Commands

### Core Commands
- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build the application for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint with Next.js configuration

### Package Manager
This project uses `pnpm` as the package manager (evident from `pnpm-lock.yaml`).

## Architecture Overview

### Technology Stack
- **Framework**: Next.js 15.4.5 with App Router
- **Runtime**: React 19.1.0
- **Language**: TypeScript with strict mode enabled
- **Styling**: Tailwind CSS v4 with PostCSS
- **Fonts**: Geist and Geist Mono from Google Fonts
- **Linting**: ESLint with Next.js TypeScript configuration

### Project Structure
```
src/app/
├── layout.tsx    # Root layout with fonts and metadata
├── page.tsx      # Home page component
└── globals.css   # Global styles with Tailwind and theme variables
```

### Key Configuration Files
- `tsconfig.json` - TypeScript configuration with path mapping (`@/*` → `./src/*`)
- `next.config.ts` - Next.js configuration (currently minimal)
- `eslint.config.mjs` - ESLint configuration extending Next.js rules
- `postcss.config.mjs` - PostCSS configuration for Tailwind CSS

### Styling System
- Uses Tailwind CSS v4 with inline theme configuration
- CSS variables for theming (`--background`, `--foreground`)
- Automatic dark mode support via `prefers-color-scheme`
- Font variables integrated with Tailwind theme

### Current State
This is MakerCost - a comprehensive business calculator for makers and custom product businesses. The application features:

- **Pricing Calculator**: Material costs, labor, overhead, machine depreciation calculations
- **Quote System**: Multi-product quotes with discount and shipping support
- **P&L Analysis**: Real-time profit and loss breakdowns
- **What-If Matrix**: Scenario planning for different price/quantity combinations
- **Export Features**: Quote finalization and customer presentation tools

The application is fully functional with a complete quote management system, toast notifications, form validation, and professional UI/UX design.