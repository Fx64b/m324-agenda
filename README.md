# Modul 342 Agenda App

A basic agend app for the school [Module 342](https://www.modulbaukasten.ch/module/324/1/de-DE?title=DevOps-Prozesse-mit-Tools-unterst%C3%BCtzen).

## Features

- Create, update, and delete tasks
- Set task priorities (low, medium, high)
- Add due dates to tasks
- Filter tasks by status (all, active, completed)
- Filter tasks by priority

<br>

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React useState
- **Testing**: Vitest + React Testing Library
- **Date Handling**: date-fns
- **Package Manager**: pnpm
- **CI/CD**: GitHub Actions
- **Versioning**: semantic-release

<br>

## Prerequisites

- Node.js 20 or later
- pnpm 10 or later

<br>

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/Fx64b/m324-agenda.git
cd m324-agenda
```

2. Install dependencies

```bash
pnpm install
```

3. Run the development server:

```bash
pnpm dev
```

4. Open http://localhost:3000 with your browser to see the application.

### Available Scripts

```bash
pnpm dev         # Start development server with Turbopack
pnpm build       # Build the application for production
pnpm start       # Start production server
pnpm lint        # Run ESLint
pnpm test        # Run tests
pnpm test:watch  # Run tests in watch mode
```

### Testing

The project uses Vitest and React Testing Library for testing. Tests can be found in files with the .test.tsx extension.
To run tests:

```bash
pnpm test
```

### Deployment

The project is configured for deployment on Vercel or GitHub Pages. The main branch is automatically deployed through GitHub Actions.
Contributing

### Fork the repository

- Create your feature branch (git checkout -b feature/amazing-feature)
- Commit your changes using conventional commits
- Push to the branch (git push origin feature/amazing-feature)
- Open a Pull Request
