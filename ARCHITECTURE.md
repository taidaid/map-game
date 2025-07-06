# Architecture & Technology Stack

## Overview
This document outlines the technology stack options for the **Blind Navigator** map game, from proof of concept to full-scale application.

> **📚 Related Documentation:**
> - **[README.md](./README.md)** - Project overview, quick start, and development progress
> - **[PRODUCT.md](./PRODUCT.md)** - Product vision, features, and user experience
> - **[QA.md](./QA.md)** - Testing strategy and quality assurance
> - **[src/README.md](./src/README.md)** - Unit testing and source code details
> - **[e2e/README.md](./e2e/README.md)** - End-to-end testing with Playwright

## POC Technology Stack (Recommended)

### **Frontend: React + Vite**
**Why this choice:**
- **Fast development** with hot reload and instant startup
- **Excellent Google Maps integration** with established libraries
- **Easy deployment** to static hosting
- **Simple to iterate** and add features later
- **Great documentation** and community support

### **Mapping: Google Maps Platform**
**APIs needed:**
- **Maps JavaScript API** - for map display and customization
- **Directions API** - for getting Google's suggested route
- **Places API** - optional, for landmark identification

**Key advantages:**
- **Custom map styling** to hide street names
- **Marker placement** for start/end points
- **Route comparison** capabilities built-in

### **Key Libraries**
```json
{
  "@googlemaps/js-api-loader": "^1.16.2",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "vite": "^5.0.0"
}
```

### **Deployment: Vercel/Netlify**
- **Zero configuration** deployment
- **Free tier** perfect for POC
- **Easy sharing** with generated URLs
- **Environment variables** for API keys

## Long-term Architecture Options

### **Option 1: Next.js Full-Stack (Recommended for Simplicity)**
```
POC: React + Vite (client-only)
↓
Full App: Next.js (frontend + API routes + SSR)
```
**Benefits:**
- **Smooth migration** - React components transfer directly
- **Built-in API routes** - no separate backend needed
- **Edge deployment** - globally fast performance
- **File-based routing** - scales to complex apps

### **Option 2: Separate Node.js Backend (More Scalable)**
```
Frontend: React + Vite (keep as-is)
Backend: Node.js + Express/Fastify
Database: PostgreSQL + Prisma ORM
```
**Benefits:**
- **Complete separation** of concerns
- **Language flexibility** (could use Python/Go later)
- **Microservices ready** if needed
- **Team scalability** (frontend/backend developers)

### **Option 3: React Frontend + Go Backend (Best Performance)**
```
Frontend: React + Vite (client-only)
Backend: Go + Gin/Echo + PostgreSQL
Communication: REST API + WebSocket (future)
```

**Go Backend Technology Stack:**
- **Web Framework**: Gin/Echo/Fiber
- **Database**: PostgreSQL + GORM
- **Authentication**: JWT tokens
- **Deployment**: Single binary

**Go Backend Advantages:**
- **Performance**: Compiled binary, excellent concurrency
- **Geographic Processing**: Built-in math libraries, efficient route comparison
- **Development**: Strong typing, fast compilation, simple deployment

## Database & Data Strategy

### **User Data Schema (planned):**
```sql
Users
├── id, email, username, created_at
├── preferences (difficulty, area, hints)
└── statistics (games_played, average_score)

Games
├── id, user_id, start_point, end_point
├── user_route, google_route, score
└── completed_at, duration

Areas
├── id, name, center_lat, center_lng
└── difficulty_level, landmarks
```

### **Database Options:**
- **PostgreSQL** - robust, full-featured, great for complex queries
- **Supabase** - PostgreSQL + auth + real-time + hosting
- **Firebase** - real-time, easy auth, good for rapid development

## Authentication Strategy

**Phase 1 (POC)**: No auth - anonymous play
**Phase 2**: Simple auth with persistent data
**Phase 3**: Full user management

**Auth Options:**
- **Supabase Auth** - email/password + OAuth providers
- **Firebase Auth** - Google/Apple sign-in
- **Auth0** - enterprise-grade, many providers
- **NextAuth.js** - if using Next.js

## Migration-Friendly POC Structure

**Organize POC code to support backend integration:**

```
src/
├── components/           # Reusable UI components
│   ├── Map/
│   ├── RouteInput/
│   └── RouteComparison/
├── hooks/               # Custom React hooks
│   ├── useMap.js
│   ├── useRoute.js
│   └── useGame.js
├── services/           # API layer (starts with Google Maps)
│   ├── maps.js
│   ├── directions.js
│   └── game.js          # Game logic
├── utils/              # Pure functions
│   ├── routing.js
│   ├── scoring.js
│   └── validation.js
└── types/              # TypeScript types
    ├── game.ts
    └── route.ts
```

## 📋 Implementation Progress

### ✅ POC Foundation (Completed)
- [x] **React + Vite Setup** - Modern development environment with hot reload
- [x] **Project Structure** - Migration-friendly directory organization
- [x] **TypeScript Support** - Type safety configuration ready
- [x] **Environment Variables** - Configuration for API keys and deployment
- [x] **Build System** - Optimized production builds with Vite
- [x] **Static Hosting Ready** - Vercel/Netlify deployment configuration

### ✅ Development Tools (Completed)
- [x] **Testing Framework** - Vitest + React Testing Library setup
- [x] **E2E Testing** - Playwright cross-browser testing suite
- [x] **Code Quality** - ESLint configuration and linting scripts
- [x] **Development Scripts** - Complete npm script suite
- [x] **Documentation** - Comprehensive technical documentation

### 🔄 Core Integration (In Progress)
- [ ] **Google Maps Platform** - Maps JavaScript API integration
- [ ] **API Key Management** - Secure environment variable handling
- [ ] **Maps Service Layer** - Abstracted Google Maps functionality
- [ ] **Directions API** - Route calculation and comparison
- [ ] **Custom Map Styling** - Hide street names, show landmarks only

### 📅 POC Features (Week 1-2)
- [ ] **Map Display Component** - Google Maps embed without street labels
- [ ] **Marker System** - Start/end point visualization
- [ ] **Route Input Component** - Text input with format validation
- [ ] **Game Logic Service** - Core game flow and state management
- [ ] **Scoring Algorithm** - Simple route comparison logic
- [ ] **Complete Game Flow** - Single round gameplay implementation

### 📅 Backend Integration (Month 1)
- [ ] **Architecture Decision** - Choose Next.js/Node.js/Go backend
- [ ] **API Layer** - RESTful API design and implementation
- [ ] **Database Schema** - User, games, and areas data models
- [ ] **Authentication System** - User registration and login
- [ ] **Data Persistence** - Game history and user progress
- [ ] **Deployment Strategy** - Production hosting and CI/CD

### 📅 Advanced Features (Month 2-3)
- [ ] **Multiple Game Modes** - Different challenge types
- [ ] **Difficulty Levels** - Dynamic challenge complexity
- [ ] **User Profiles** - Personal statistics and preferences
- [ ] **Social Features** - Leaderboards and sharing
- [ ] **Area Management** - Custom geographic regions
- [ ] **Advanced Scoring** - Multi-factor algorithm implementation

### 📅 Scale Features (Month 6+)
- [ ] **Real-time Multiplayer** - WebSocket-based competitive gameplay
- [ ] **Custom Map Areas** - User-defined challenge regions
- [ ] **Advanced Analytics** - Performance metrics and insights
- [ ] **Mobile App** - React Native cross-platform app
- [ ] **Offline Support** - Progressive Web App capabilities
- [ ] **Internationalization** - Multi-language support

## Evolution Timeline

**Week 1-2: POC**
- React + Vite + Google Maps
- Hardcoded game, no backend

**Month 1: Basic Backend**
- Add Next.js API routes OR separate Express/Go server
- User accounts + game history
- Simple scoring system

**Month 2-3: Advanced Features**
- Multiple game modes
- Difficulty levels
- Social features (leaderboards)
- Area management

**Month 6+: Scale Features**
- Real-time multiplayer
- Custom map areas
- Advanced analytics
- Mobile app (React Native)

## Technology Comparison

| Feature | Next.js Full-Stack | Node.js Backend | Go Backend |
|---------|-------------------|-----------------|------------|
| **Development Speed** | Fastest | Medium | Medium |
| **Performance** | Good | Good | Excellent |
| **Scalability** | Good | Excellent | Excellent |
| **Learning Curve** | Low | Medium | Medium-High |
| **Deployment** | Simple | Complex | Simple |
| **Type Safety** | Good (TS) | Good (TS) | Excellent |
| **Geographic Processing** | OK | OK | Excellent |

## Cost Considerations
- **Google Maps API**: Free tier includes 28,000 map loads/month
- **Directions API**: Free tier includes 2,500 requests/month
- **Hosting**: Free on Vercel/Netlify (frontend), various options for backend
- **Database**: Free tiers available for PostgreSQL hosting
- **Total POC cost**: $0

## Recommended Approach

**Start with React + Vite but structure for growth:**

1. **Use TypeScript** from day one
2. **Abstract Google Maps** into service functions
3. **Separate game logic** from UI components
4. **Plan data models** even if not persisting yet
5. **Use environment variables** for API keys

This approach lets you **start simple** but **scale smartly** without major rewrites.

## 🔗 Next Steps

- **[src/README.md](./src/README.md)** - Explore unit testing and source code structure
- **[e2e/README.md](./e2e/README.md)** - Learn about end-to-end testing approach
- **[QA.md](./QA.md)** - Review comprehensive testing strategy
- **[PRODUCT.md](./PRODUCT.md)** - Understand product vision and features
- **[README.md](./README.md)** - Return to project overview 