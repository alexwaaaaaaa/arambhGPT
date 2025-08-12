# ⚡ ArambhGPT - Quick Start Guide

## 🚀 **Launch in 5 Minutes!**

### **Step 1: Start Backend**
```bash
cd arambhgpt-backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### **Step 2: Start Frontend**
```bash
cd arambhgpt-frontend  
npm run dev -- -p 3000
```

### **Step 3: Access Application**
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

---

## 🎯 **Demo Credentials**
- **Email:** demo@arambhgpt.com
- **Password:** demo123

---

## 🌟 **Key Features to Test**

### **1. AI Chat** 
- Go to `/chat`
- Start conversation with AI "Honey"
- Test Hindi/English responses

### **2. Professional Consultation**
- Go to `/professionals`
- Browse expert profiles
- Try chat/video call features

### **3. Community Groups**
- Go to `/community`
- Join support groups
- Participate in group chats

### **4. Mood Tracking**
- Go to `/mood`
- Log daily mood
- View analytics dashboard

### **5. Wellness Tools**
- Go to `/wellness`
- Try meditation timer
- Practice breathing exercises

---

## 🔧 **Production Deployment**

### **Vercel (Recommended)**
```bash
# Frontend
cd arambhgpt-frontend
vercel --prod

# Backend (Railway)
# Push to GitHub and connect to Railway
```

### **Environment Variables**
```env
# Backend
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://...
GEMINI_API_KEY=your-gemini-key

# Frontend  
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

---

## 📱 **Mobile Testing**
- Open on mobile browser
- Test responsive design
- Try PWA installation
- Test touch interactions

---

## 🎉 **You're Ready to Launch!**

**ArambhGPT is now running and ready for users! 🚀**

**Next Steps:**
1. Customize branding
2. Add real professionals
3. Set up payment gateway
4. Launch marketing campaigns

**Happy Launching! 🌟**