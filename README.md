# 🎨 CopyTrader Pro Frontend

Modern React 18 + TypeScript trading interface for CopyTrader Pro platform.

## ✨ Features

- **🎨 Modern UI**: React 18 + TypeScript + Vite
- **📱 Responsive Design**: Mobile-first with Tailwind CSS
- **🔐 Authentication**: Supabase integration with JWT tokens
- **⚡ Real-time**: WebSocket connection for live trading data
- **🛡️ Security**: Input validation, XSS protection, CSRF guards
- **📊 Trading Interface**: Complete copy trading dashboard
- **🎯 Performance**: Optimized with React.memo and lazy loading

## 🚀 Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/copytrader-frontend)

### 1. Deploy Backend First
Make sure to deploy the backend repository first and get the API URL.

### 2. Set Environment Variables
In Vercel dashboard, add these environment variables:

```env
# Backend API Configuration (REQUIRED)
VITE_API_URL=https://your-backend-url.vercel.app/api
VITE_WS_URL=wss://your-backend-url.vercel.app/ws

# Supabase Configuration (REQUIRED)
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# App Configuration
VITE_APP_NAME=CopyTrader Pro
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=production

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_REPORTING=true
VITE_ENABLE_PERFORMANCE_MONITORING=true
```

### 3. Deploy
Click "Deploy" and your frontend will be live!

## 🛠️ Local Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/copytrader-frontend.git
cd copytrader-frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Edit .env.local with your configuration
# Add your backend URL and Supabase credentials

# Start development server
npm run dev
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── contexts/           # React contexts (Auth, Trading)
├── hooks/              # Custom hooks
├── services/           # API and external services
├── utils/              # Utility functions
├── config/             # Configuration files
└── __tests__/          # Test files
```

## 🔗 API Integration

The frontend connects to the CopyTrader Pro backend API:
- **Authentication**: JWT token management
- **WebSocket**: Real-time trading data
- **REST API**: Account management, trading operations
- **Error Handling**: Comprehensive error boundaries

## 🎯 Key Components

- **AuthContext**: Supabase authentication management
- **TradingContext**: Trading state and operations
- **Dashboard**: Main trading interface
- **BrokerSetup**: Multi-broker account configuration
- **LiveTrading**: Real-time trading interface

## 🔒 Security Features

- Input validation and sanitization
- XSS protection headers
- CSRF protection
- IP restriction guards
- Secure cookie handling
- JWT token rotation

## 📱 Mobile Support

Fully responsive design optimized for:
- Desktop (1920px+)
- Tablet (768px - 1919px)
- Mobile (320px - 767px)

## 🚀 Performance

- Code splitting with React.lazy()
- Image optimization
- Bundle size optimization
- Memory leak prevention
- Performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@copytrader.pro or join our Discord community.

---

**⚠️ Important**: Make sure to deploy the backend repository first and update the `VITE_API_URL` environment variable with your backend URL.
