# Pana Mia Club

**Community platform for Pana Mia - connecting Latin American music lovers and artists**

[![Next.js](https://img.shields.io/badge/Next.js-16.0.8-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.1-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-see%20LICENSE-green)](./LICENSE)

---

## Table of Contents

- [About](#about)
- [Quick Start](#quick-start)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [Documentation](#documentation)
- [Contact](#contact)

---

## About

Pana Mia Club is a community-driven platform built to showcase what can be accomplished for local music communities. This project is:

- **Open Source**: Publicly available to encourage collaboration with local projects
- **Community-Focused**: Built for connecting artists, venues, and music lovers
- **Accessible**: Following WCAG guidelines and best practices
- **Budget-Conscious**: Using cost-effective, scalable technologies

### Key Features

- **User Profiles & Directory**: Browse and connect with community members
- **Mentoring Platform**: Peer-to-peer video mentoring (prototype)
- **Event Listings**: Integration with Shotgun Live for venue events
- **Authentication**: Secure, passwordless login with NextAuth v5
- **Responsive Design**: Mobile-first, accessible UI with Tailwind CSS

---

## Quick Start

Get up and running in 5 minutes:

```bash
# 1. Clone the repository
git clone https://github.com/panamiaclub/panamia.club.git
cd panamia.club

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp example.env .env.local
# Edit .env.local with your credentials

# 4. Start development server
npm run dev

# 5. Open http://localhost:3000
```

**Need help with environment variables?** [Contact us](https://www.panamia.club/form/contact-us/) for a developer ENV file.

---

## Prerequisites

Before you begin, ensure you have:

- **Node.js**: Version 20.x or higher ([Download](https://nodejs.org/))
- **npm**: Version 10.x or higher (comes with Node.js)
- **MongoDB**: Local instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- **Git**: For version control

### Optional Services

These are required for full functionality:

- **Pusher Account**: For real-time features (free tier available)
- **Stripe Account**: For payment processing (test mode available)
- **BunnyCDN Account**: For file uploads (optional for local development)
- **Email Service**: For authentication emails (NodeMailer with SMTP)

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/panamiaclub/panamia.club.git
cd panamia.club
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:

- Next.js, React, TypeScript
- NextAuth for authentication
- MongoDB/Mongoose for database
- Tailwind CSS for styling
- Playwright for testing

### 3. Set Up Environment Variables

Create `.env.local` in the root directory:

```env
# ===================================
# Database
# ===================================
MONGODB_URI=mongodb://localhost:27017/panamia_dev
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/panamia

# ===================================
# NextAuth Configuration
# ===================================
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-min-32-characters-long

# Generate a secret with:
# openssl rand -base64 32

# ===================================
# Email Configuration (for authentication)
# ===================================
EMAIL_SERVER=smtp://username:password@smtp.example.com:587
EMAIL_FROM=noreply@panamia.club

# ===================================
# Pusher (for real-time features)
# ===================================
PUSHER_APP_ID=your_app_id
PUSHER_KEY=your_key
PUSHER_SECRET=your_secret
PUSHER_CLUSTER=us2

# Public variables (exposed to client)
NEXT_PUBLIC_PUSHER_KEY=your_key
NEXT_PUBLIC_PUSHER_CLUSTER=us2

# ===================================
# Stripe (for payments)
# ===================================
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...

# ===================================
# BunnyCDN (for file uploads)
# ===================================
BUNNYCDN_API_KEY=your_api_key
BUNNYCDN_STORAGE_ZONE=your_zone
BUNNYCDN_HOSTNAME=your_hostname

# ===================================
# reCAPTCHA (optional)
# ===================================
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key
RECAPTCHA_SECRET_KEY=your_secret_key
```

### 4. Set Up MongoDB

**Option A: Local MongoDB**

```bash
# Install MongoDB (macOS with Homebrew)
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Your MONGODB_URI:
# mongodb://localhost:27017/panamia_dev
```

**Option B: MongoDB Atlas (Recommended)**

1. Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Add to `.env.local` as `MONGODB_URI`

---

## Development

### Start Development Server

```bash
npm run dev
```

The application will be available at:

- **Main app**: http://localhost:3000
- **API routes**: http://localhost:3000/api/\*

The dev server includes:

- Hot module replacement (HMR)
- Fast refresh for React components
- Automatic TypeScript compilation
- Error overlay with detailed stack traces

### Development with HTTPS (Optional)

For testing HTTPS-only features (like WebRTC):

```bash
# Development server with HTTPS
npm run dev
```

The server will automatically use HTTPS in development when needed.

### Code Quality

**Run linter:**

```bash
npm run lint
```

**Auto-fix linting issues:**

```bash
npm run lint -- --fix
```

**Format code with Prettier:**

```bash
npx prettier --write .
```

### Git Hooks (Husky)

Pre-commit hooks automatically run:

- Prettier formatting
- ESLint checks
- TypeScript compilation check

These ensure code quality before commits.

---

## Testing

### End-to-End Tests (Playwright)

```bash
# Run all tests
npm test

# Run tests in UI mode (interactive)
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed

# View test report
npm run test:report
```

### Test Coverage

Current test coverage includes:

- Authentication flows
- Profile creation and editing
- Directory search
- Navigation and routing

See `docs/TESTING_CHECKLIST.md` for manual testing procedures.

---

## Deployment

### Vercel Deployment (Recommended)

**Automatic deployment:**

1. Push to `main` branch
2. Vercel automatically builds and deploys
3. Preview deployments for all branches

**Environment variables:**

Set these in Vercel dashboard (Settings → Environment Variables):

- All variables from `.env.local`
- Set `NODE_ENV=production`
- Ensure `NEXTAUTH_URL` points to production domain

**Deployment requirements:**

- HTTPS is automatically enforced in production
- All security headers are set via middleware
- MongoDB connection must be from allowed IPs (Atlas IP whitelist)

### Build Locally

```bash
# Create production build
npm run build

# Start production server
npm start
```

### Branch Deployments

Every branch pushed to GitHub gets a preview deployment:

- View status in GitHub PR checks
- Access preview URL from PR comments
- Test features before merging

---

## Technology Stack

### Core

- **[Next.js 16.0.8](https://nextjs.org/)**: React framework with App Router
- **[React 19.2.1](https://react.dev/)**: UI library
- **[TypeScript 5.9.3](https://www.typescriptlang.org/)**: Type-safe JavaScript
- **[MongoDB](https://www.mongodb.com/)**: NoSQL database
- **[Mongoose 9.0.1](https://mongoosejs.com/)**: MongoDB ODM

### UI & Styling

- **[Tailwind CSS 4.1.17](https://tailwindcss.com/)**: Utility-first CSS
- **[shadcn/ui](https://ui.shadcn.com/)**: Component library
- **[Radix UI](https://www.radix-ui.com/)**: Accessible primitives
- **[Lucide Icons](https://lucide.dev/)**: Icon library
- **[Framer Motion](https://www.framer.com/motion/)**: Animations

### Authentication & State

- **[NextAuth.js v5](https://next-auth.js.org/)**: Authentication
- **[TanStack Query](https://tanstack.com/query/)**: Server state management
- **[React Hook Form](https://react-hook-form.com/)**: Form handling
- **[Zod](https://zod.dev/)**: Schema validation

### Real-time & Payments

- **[Pusher](https://pusher.com/)**: WebSocket/real-time communication
- **[Stripe](https://stripe.com/)**: Payment processing

### Testing & Quality

- **[Playwright](https://playwright.dev/)**: E2E testing
- **[ESLint](https://eslint.org/)**: Code linting
- **[Prettier](https://prettier.io/)**: Code formatting
- **[Husky](https://typicode.github.io/husky/)**: Git hooks

See `docs/FLOSS-ALTERNATIVES.md` for detailed technology choices and alternatives.

---

## Project Structure

```
panamia.club/
├── app/                      # Next.js App Router
│   ├── (mentoring)/         # Mentoring feature group
│   ├── (public)/            # Public pages
│   ├── account/             # User account pages
│   ├── api/                 # API routes
│   ├── directory/           # User directory
│   └── layout.tsx           # Root layout
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── flower-power/        # Flower Power theme
│   └── *.tsx                # Shared components
├── lib/                     # Utilities
│   ├── model/               # Mongoose schemas
│   ├── validations/         # Zod schemas
│   └── *.ts                 # Utility functions
├── public/                  # Static assets
│   ├── logos/               # Logo images
│   └── images/              # Other images
├── styles/                  # Global styles
├── docs/                    # Documentation
│   ├── MENTORING.md         # Mentoring feature guide
│   ├── SECURITY_AUDIT.md    # Security documentation
│   ├── TESTING_CHECKLIST.md # Testing procedures
│   └── FLOSS-ALTERNATIVES.md # Technology choices
├── tests/                   # Playwright E2E tests
├── middleware.ts            # Next.js middleware (HTTPS, headers)
├── next.config.js           # Next.js configuration
└── package.json             # Dependencies
```

---

## Contributing

We welcome contributions from developers of all skill levels!

### Getting Started

1. **Read the guidelines**: See [CONTRIBUTING.md](./CONTRIBUTING.md)
2. **Check existing issues**: [GitHub Issues](https://github.com/panamiaclub/panamia.club/issues)
3. **Join discussions**: Comment on issues you're interested in
4. **Fork and clone**: Create your own fork to work on

### Development Workflow

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes with clear commit messages
3. Write tests if applicable
4. Run linter: `npm run lint`
5. Push and create a Pull Request

### Code Standards

- Follow existing code style
- Use TypeScript for type safety
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation if needed

### Areas for Contribution

- **Bug fixes**: Check open issues
- **Features**: Propose new features in discussions
- **Documentation**: Improve guides and comments
- **Tests**: Add test coverage
- **Accessibility**: Improve WCAG compliance
- **Performance**: Optimize queries and rendering

---

## Documentation

- **[Mentoring Feature Guide](./docs/MENTORING.md)**: Complete guide to mentoring platform
- **[Security Audit](./docs/SECURITY_AUDIT.md)**: Security architecture and considerations
- **[Testing Checklist](./docs/TESTING_CHECKLIST.md)**: Manual testing procedures
- **[FLOSS Alternatives](./docs/FLOSS-ALTERNATIVES.md)**: Technology choices and philosophy

---

## Contact

- **Website**: [panamia.club](https://www.panamia.club/)
- **Contact Form**: [panamia.club/form/contact-us](https://www.panamia.club/form/contact-us/)
- **GitHub Issues**: [Report bugs or suggest features](https://github.com/panamiaclub/panamia.club/issues)
- **Security Issues**: Use contact form with subject "SECURITY VULNERABILITY"

---

## License

See [LICENSE](./LICENSE) file for details.

---

## Acknowledgments

Built with ❤️ by the Pana Mia Club community. Special thanks to all contributors who help make this project possible.

**Notable Technologies:**

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- MongoDB for database infrastructure
- Open source community for incredible tools

---

## Project Status

- **Current Version**: 0.1.0 (Beta)
- **Status**: Active Development
- **Production**: Deployed at panamia.club
- **Roadmap**: See [GitHub Projects](https://github.com/panamiaclub/panamia.club/projects)

### Recent Updates

- ✅ Migrated to Next.js 16 App Router
- ✅ Implemented Flower Power psychedelic theme
- ✅ Added comprehensive E2E testing with Playwright
- ✅ Upgraded to React 19 and NextAuth v5
- ✅ Removed Google Analytics (privacy-first)

### Experimental Features

- **Peer-to-Peer Mentoring**: Video calling with WebRTC (prototype stage)
- **Real-time Collaboration**: Shared notes and chat during sessions

**Note**: The WebRTC-based peer-to-peer video mentoring feature is currently in **prototype stage** and under active development. It may not work in all network configurations and is not yet production-ready.

---

**Questions?** Feel free to [contact us](https://www.panamia.club/form/contact-us/) or open an issue!
