# Technology Stack

This project is built using a modern, type-safe full-stack web architecture.

## Core Framework

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (v5)
- **Runtime**: Node.js

## Backend & Database

- **Database**: [SQLite](https://www.sqlite.org/) (File-based, serverless)
- **Driver**: `better-sqlite3` (High-performance synchronous driver)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/) (Type-safe SQL schema & queries)
- **Server Actions**: Native Next.js Server Actions for mutations (no separate API routes required).

## Frontend & UI

- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/)
- **Animation**: `tailwindcss-animate`
- **Component Primitives**: [Headless UI](https://headlessui.com/) / Radix UI patterns (via `@base-ui/react`) (Shadcn-like structure).
- **Icons**: [Lucide React](https://lucide.dev/)
- **Fonts**: Inter (via `next/font`)

## Key Libraries

- `clsx` & `tailwind-merge`: For dynamic class name construction.
- `sharp`: For high-performance image optimization.
- `dotenv`: For environment variable management.
- `drizzle-kit`: For database schema migrations and studio.

## Project Structure

- **/app**: Next.js App Router (Routes, Pages, Layouts)
- **/components**: Reusable UI components (Buttons, Inputs, Cards)
- **/lib**: Shared utilities (Database connection, Schema, Helper functions)
- **/modules**: Feature-based organization (e.g., `modules/product`, `modules/auth`)
- **/public**: Static assets (Images, Fonts)

## Deployment

- **Method**: Build (`next build`) and Start (`next start`)
- **Process Manager**: PM2 (optional/recommended for VPS)
- **Reverse Proxy**: Nginx (Recommended for serving port 3000)
