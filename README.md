# ArambhGPT - AI-Powered Mental Health Platform

## 🌟 Overview

ArambhGPT is a comprehensive AI-powered mental health platform designed specifically for Indian users. It provides culturally sensitive mental health support, professional consultations, and wellness tools in Hindi, Hinglish, and English.

## ✨ Key Features

### 🤖 AI Chat System
- **Honey AI Assistant** - Culturally aware mental health support
- **Multi-language Support** - Hindi, Hinglish, and English
- **Personalized Responses** - Context-aware conversations
- **Emotional Intelligence** - Mood detection and appropriate responses

### 👨‍⚕️ Professional Consultations
- **Expert Network** - Licensed mental health professionals
- **Video/Audio Calls** - WebRTC-based real-time communication
- **Chat Consultations** - Text-based professional support
- **Booking System** - Schedule appointments with ease

### 💰 Wallet & Payment System
- **Digital Wallet** - Secure payment management
- **Multiple Payment Options** - UPI, cards, and more
- **Session Billing** - Transparent pricing for consultations
- **Transaction History** - Complete payment records

### 🏥 Wellness Tools
- **Mood Tracking** - Daily mood monitoring and insights
- **Breathing Exercises** - Guided relaxation techniques
- **Meditation Timer** - Mindfulness and meditation support
- **Progress Analytics** - Track your mental health journey

### 👥 Community Features
- **Support Groups** - Connect with others facing similar challenges
- **Anonymous Sharing** - Safe space for expression
- **Group Discussions** - Moderated community conversations
- **Peer Support** - Help and get help from community members

## 🏗️ Technical Architecture

### Frontend (Next.js 14)
```
arambhgpt-frontend/
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── types/              # TypeScript definitions
│   └── contexts/           # React contexts
```

### Backend (FastAPI + Python)
```
arambhgpt-backend/
├── app/
│   ├── main.py             # FastAPI application
│   ├── auth.py             # Authentication system
│   ├── chat.py             # AI chat endpoints
│   ├── professionals.py    # Professional management
│   ├── communication.py    # Real-time messaging
│   ├── webrtc_signaling.py # Video/audio calling
│   ├── wallet.py           # Payment system
│   ├── mood.py             # Mood tracking
│   └── database.py         # Database management
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- SQLite (for development)

### Frontend Setup
```bash
cd arambhgpt-frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd arambhgpt-backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

### Environment Variables

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

#### Backend (.env)
```env
SECRET_KEY=your-secret-key
GEMINI_API_KEY=your-gemini-api-key
DATABASE_URL=sqlite:///./arambhgpt.db
```

## 📱 Features in Detail

### AI Chat System
- **Cultural Context Awareness** - Understands Indian cultural nuances
- **Language Detection** - Automatically detects user's preferred language
- **Emotional Support** - Provides empathetic responses
- **Crisis Intervention** - Identifies and responds to mental health crises

### Professional Network
- **Verified Experts** - Licensed psychologists and counselors
- **Specialization Matching** - Find professionals for specific needs
- **Real-time Communication** - Video, audio, and text consultations
- **Session Management** - Complete consultation lifecycle

### Wellness Ecosystem
- **Holistic Approach** - Combines AI support with human expertise
- **Progress Tracking** - Monitor mental health improvements
- **Personalized Recommendations** - Tailored wellness suggestions
- **Community Support** - Peer-to-peer assistance

## 🔒 Security & Privacy

- **End-to-End Encryption** - Secure communication channels
- **Data Privacy** - GDPR-compliant data handling
- **Anonymous Options** - Use platform without personal identification
- **Secure Payments** - PCI-DSS compliant payment processing

## 🌐 Supported Languages

- **Hindi** - Native Hindi support
- **Hinglish** - Hindi-English mix (most popular)
- **English** - Full English support

## 📊 Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **WebRTC** - Real-time communication

### Backend
- **FastAPI** - Modern Python web framework
- **SQLite/PostgreSQL** - Database management
- **WebSockets** - Real-time messaging
- **Google Gemini AI** - AI-powered responses

### Infrastructure
- **Vercel** - Frontend deployment
- **Railway/Heroku** - Backend deployment
- **Cloudflare** - CDN and security

## 🧪 Testing

### Run Tests
```bash
# Frontend tests
cd arambhgpt-frontend
npm test

# Backend tests
cd arambhgpt-backend
python -m pytest

# Integration tests
./test-complete-system.sh
```

## 📈 Roadmap

### Phase 1 (Current)
- ✅ AI Chat System
- ✅ Professional Consultations
- ✅ Wallet System
- ✅ Basic Wellness Tools

### Phase 2 (Next)
- 🔄 Mobile App (React Native)
- 🔄 Advanced Analytics
- 🔄 Group Therapy Sessions
- 🔄 Integration with Healthcare Systems

### Phase 3 (Future)
- 📋 AI-Powered Assessments
- 📋 Prescription Management
- 📋 Insurance Integration
- 📋 Telemedicine Platform

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation** - Check our comprehensive docs
- **Issues** - Report bugs on GitHub Issues
- **Community** - Join our Discord server
- **Email** - support@arambhgpt.com

## 🙏 Acknowledgments

- **Mental Health Professionals** - For their expertise and guidance
- **Open Source Community** - For the amazing tools and libraries
- **Beta Testers** - For their valuable feedback
- **Indian Mental Health Organizations** - For their support and insights

---

**Made with ❤️ for mental health awareness in India**

*ArambhGPT - Your journey to better mental health starts here*