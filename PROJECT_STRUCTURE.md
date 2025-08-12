# ArambhGPT Project Structure

## 📁 Root Directory Structure

```
ArambhGPT/
├── arambhgpt-frontend/          # Next.js Frontend Application
├── arambhgpt-backend/           # FastAPI Backend Application
├── docs/                        # Documentation files
├── tests/                       # Integration tests
├── scripts/                     # Utility scripts
├── README.md                    # Project overview
├── PROJECT_STRUCTURE.md         # This file
├── .gitignore                   # Git ignore rules
└── LICENSE                      # Project license
```

## 🎨 Frontend Structure (arambhgpt-frontend/)

```
arambhgpt-frontend/
├── public/                      # Static assets
│   ├── icons/                   # App icons
│   ├── images/                  # Images and graphics
│   └── manifest.json            # PWA manifest
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── (auth)/              # Authentication routes
│   │   │   ├── signin/
│   │   │   └── signup/
│   │   ├── chat/                # AI chat interface
│   │   ├── professionals/       # Professional listings
│   │   ├── consultation/        # Video/audio calls
│   │   ├── wallet/              # Payment management
│   │   ├── mood/                # Mood tracking
│   │   ├── community/           # Community features
│   │   ├── wellness/            # Wellness tools
│   │   ├── profile/             # User profile
│   │   ├── professional/        # Professional dashboard
│   │   ├── about/               # About page
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home page
│   │   └── globals.css          # Global styles
│   ├── components/              # Reusable UI components
│   │   ├── ui/                  # Basic UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── index.ts
│   │   ├── auth/                # Authentication components
│   │   ├── chat/                # Chat-related components
│   │   ├── communication/       # Video/audio call components
│   │   ├── professional/        # Professional components
│   │   ├── wallet/              # Wallet components
│   │   ├── mood/                # Mood tracking components
│   │   ├── community/           # Community components
│   │   ├── wellness/            # Wellness components
│   │   ├── layout/              # Layout components
│   │   ├── loading/             # Loading components
│   │   ├── error/               # Error handling components
│   │   ├── mobile/              # Mobile-specific components
│   │   └── accessibility/       # Accessibility components
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.ts           # Authentication hook
│   │   ├── useChat.ts           # Chat functionality
│   │   ├── useWebRTCCall.ts     # Video/audio calling
│   │   ├── useWallet.ts         # Wallet management
│   │   ├── useMoodTracking.ts   # Mood tracking
│   │   └── index.ts
│   ├── contexts/                # React contexts
│   │   ├── AuthContext.tsx      # Authentication context
│   │   └── ThemeContext.tsx     # Theme context
│   ├── lib/                     # Utility functions
│   │   ├── api.ts               # API client
│   │   ├── auth.ts              # Auth utilities
│   │   ├── utils.ts             # General utilities
│   │   └── constants.ts         # App constants
│   ├── types/                   # TypeScript definitions
│   │   ├── auth.ts              # Auth types
│   │   ├── chat.ts              # Chat types
│   │   ├── ui.ts                # UI types
│   │   └── index.ts
│   └── styles/                  # Additional styles
├── package.json                 # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── next.config.js              # Next.js configuration
└── .eslintrc.json              # ESLint configuration
```

## 🔧 Backend Structure (arambhgpt-backend/)

```
arambhgpt-backend/
├── app/
│   ├── main.py                  # FastAPI application entry point
│   ├── database.py              # Database connection and setup
│   ├── models.py                # Pydantic models
│   ├── auth.py                  # Authentication endpoints
│   ├── chat.py                  # AI chat endpoints
│   ├── professionals.py         # Professional management
│   ├── communication.py         # Real-time messaging
│   ├── webrtc_signaling.py      # Video/audio calling signaling
│   ├── wallet.py                # Payment and wallet system
│   ├── mood.py                  # Mood tracking endpoints
│   ├── social.py                # Community features
│   ├── notifications.py         # Notification system
│   ├── file_upload.py           # File upload handling
│   ├── professional_auth.py     # Professional authentication
│   ├── payment_gateway.py       # Payment processing
│   ├── ai_context.py            # AI context management
│   ├── ai_learning.py           # AI learning system
│   ├── ai_memory.py             # AI memory management
│   ├── response_personalizer.py # Response personalization
│   ├── emotion_analyzer.py      # Emotion analysis
│   ├── cultural_context.py      # Cultural context awareness
│   ├── health_guidance.py       # Health guidance system
│   ├── relationship_wellness.py # Relationship counseling
│   ├── sexual_health_educator.py # Sexual health education
│   ├── comprehensive_wellness_system.py # Wellness system
│   ├── sensitive_topics_analyzer.py # Sensitive content handling
│   ├── sensitive_response_templates.py # Response templates
│   ├── mature_health_templates.py # Health templates
│   ├── smart_templates.py       # Smart response templates
│   ├── advanced_nlp.py          # Advanced NLP processing
│   ├── feedback_system.py       # User feedback system
│   └── history.py               # Chat history management
├── requirements.txt             # Python dependencies
├── .env.example                 # Environment variables example
├── create_demo_user.py          # Demo user creation script
├── create_demo_professional.py  # Demo professional creation
└── create_dr_priya.py           # Specific demo professional
```

## 📚 Documentation Structure

```
docs/
├── API_DOCUMENTATION.md         # Complete API documentation
├── DEPLOYMENT_GUIDE.md          # Deployment instructions
├── DEVELOPMENT_SETUP.md         # Development environment setup
├── CONTRIBUTING.md              # Contribution guidelines
├── SECURITY.md                  # Security guidelines
├── CHANGELOG.md                 # Version history
├── USER_GUIDE.md                # User manual
├── PROFESSIONAL_GUIDE.md        # Professional user guide
├── TECHNICAL_ARCHITECTURE.md    # Technical architecture
├── DATABASE_SCHEMA.md           # Database design
├── AI_SYSTEM_DESIGN.md          # AI system architecture
├── COMMUNICATION_SYSTEM_BACKEND.md # Communication system docs
├── AUDIO_VIDEO_CALLING_SYSTEM.md # Calling system docs
├── PATIENT_EXPERT_COMMUNICATION_SYSTEM.md # Patient-expert communication
├── ADVANCED_COMMUNITY_SYSTEM.md # Community features
├── BACKEND_FRONTEND_INTEGRATION.md # Integration guide
├── GEMINI_FINE_TUNING_GUIDE.md  # AI fine-tuning guide
├── QUICK_START.md               # Quick start guide
└── LAUNCH_GUIDE.md              # Production launch guide
```

## 🧪 Testing Structure

```
tests/
├── frontend/
│   ├── components/              # Component tests
│   ├── hooks/                   # Hook tests
│   ├── integration/             # Integration tests
│   └── e2e/                     # End-to-end tests
├── backend/
│   ├── unit/                    # Unit tests
│   ├── integration/             # Integration tests
│   └── api/                     # API tests
├── scripts/                     # Test scripts
│   ├── test-complete-system.sh  # Full system test
│   ├── test-communication-backend.sh # Communication tests
│   ├── test-audio-video-calling.sh # Calling tests
│   ├── test-wallet-system.sh    # Wallet tests
│   └── test-websocket-client.py # WebSocket tests
└── fixtures/                    # Test data
```

## 🛠️ Scripts Structure

```
scripts/
├── deployment/
│   ├── deploy-frontend.sh       # Frontend deployment
│   ├── deploy-backend.sh        # Backend deployment
│   └── setup-production.sh      # Production setup
├── development/
│   ├── start-full-system.sh     # Start all services
│   ├── check-system-status.sh   # System health check
│   ├── restart-servers.sh       # Restart services
│   └── setup-dev-env.sh         # Development environment setup
├── database/
│   ├── migrate.py               # Database migrations
│   ├── seed.py                  # Seed data
│   └── backup.sh                # Database backup
└── utilities/
    ├── cleanup.sh               # Clean temporary files
    ├── update-dependencies.sh   # Update all dependencies
    └── generate-docs.sh         # Generate documentation
```

## 🔧 Configuration Files

### Frontend Configuration
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS setup
- `next.config.js` - Next.js configuration
- `.eslintrc.json` - Code linting rules
- `.env.local` - Environment variables

### Backend Configuration
- `requirements.txt` - Python dependencies
- `.env` - Environment variables
- `pyproject.toml` - Python project configuration
- `Dockerfile` - Container configuration

### Development Tools
- `.gitignore` - Git ignore rules
- `.prettierrc` - Code formatting
- `.vscode/` - VS Code settings
- `docker-compose.yml` - Docker setup

## 📊 Key Features by Directory

### Authentication System (`/auth/`)
- User registration and login
- JWT token management
- Password reset functionality
- Professional authentication

### AI Chat System (`/chat/`)
- Real-time messaging
- AI response generation
- Context awareness
- Multi-language support

### Professional System (`/professional/`)
- Professional profiles
- Consultation booking
- Session management
- Earnings tracking

### Communication System (`/communication/`)
- WebRTC video/audio calls
- Real-time messaging
- Screen sharing
- Call recording

### Wallet System (`/wallet/`)
- Digital wallet management
- Payment processing
- Transaction history
- Billing system

### Wellness Tools (`/wellness/`)
- Mood tracking
- Breathing exercises
- Meditation timer
- Progress analytics

### Community Features (`/community/`)
- Support groups
- Discussion forums
- Peer connections
- Moderation tools

## 🚀 Deployment Structure

### Production Environment
```
production/
├── frontend/                    # Vercel deployment
├── backend/                     # Railway/Heroku deployment
├── database/                    # PostgreSQL
├── cdn/                         # Cloudflare CDN
├── monitoring/                  # Application monitoring
└── backups/                     # Data backups
```

### Development Environment
```
development/
├── local-frontend/              # Local Next.js server
├── local-backend/               # Local FastAPI server
├── local-database/              # SQLite database
└── test-data/                   # Development test data
```

This structure ensures:
- **Scalability** - Easy to add new features
- **Maintainability** - Clear separation of concerns
- **Testability** - Comprehensive testing setup
- **Deployability** - Production-ready configuration
- **Documentation** - Well-documented codebase