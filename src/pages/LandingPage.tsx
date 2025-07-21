import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  ArrowRight,
  Shield,
  Zap,
  Users,
  BarChart3,
  Globe,
  Star,
  CheckCircle,
  Play,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';

console.log("LandingPage loaded");

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [stats, setStats] = useState({
    users: 0,
    trades: 0,
    profit: 0,
    success: 0,
  });

  // Animated counter effect
  useEffect(() => {
    const targetStats = {
      users: 12500,
      trades: 2400000,
      profit: 15600000,
      success: 87,
    };

    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      
      setStats({
        users: Math.floor(targetStats.users * progress),
        trades: Math.floor(targetStats.trades * progress),
        profit: Math.floor(targetStats.profit * progress),
        success: Math.floor(targetStats.success * progress),
      });

      if (step >= steps) {
        clearInterval(timer);
        setStats(targetStats);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Lightning Fast Execution",
      description: "Copy trades in milliseconds with our advanced WebSocket technology",
      color: "from-yellow-400 to-orange-500",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Bank-Grade Security",
      description: "AES-256 encryption and secure API key management",
      color: "from-green-400 to-blue-500",
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Advanced Analytics",
      description: "Real-time performance tracking and risk management",
      color: "from-purple-400 to-pink-500",
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Multi-Exchange Support",
      description: "Trade across Binance, Bybit, OKX, and Delta Exchange",
      color: "from-blue-400 to-cyan-500",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Professional Trader",
      content: "CopyTrader Pro transformed my trading. I've increased my portfolio by 340% following top traders.",
      avatar: "👩‍💼",
      profit: "+$45,000",
    },
    {
      name: "Marcus Rodriguez",
      role: "Crypto Investor",
      content: "The real-time copying is incredible. I can follow multiple strategies simultaneously with perfect execution.",
      avatar: "👨‍💻",
      profit: "+$78,000",
    },
    {
      name: "Emily Watson",
      role: "Day Trader",
      content: "Finally, a platform that actually works. The analytics help me choose the best traders to follow.",
      avatar: "👩‍🚀",
      profit: "+$23,000",
    },
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for beginners",
      features: [
        "1 Master Account",
        "2 Copy Subscriptions",
        "Basic Analytics",
        "Email Support",
      ],
      popular: false,
    },
    {
      name: "Pro",
      price: "$29",
      period: "/month",
      description: "For serious traders",
      features: [
        "5 Master Accounts",
        "Unlimited Subscriptions",
        "Advanced Analytics",
        "Priority Support",
        "Risk Management Tools",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "/month",
      description: "For trading firms",
      features: [
        "Unlimited Accounts",
        "White-label Solution",
        "Custom Analytics",
        "24/7 Phone Support",
        "API Access",
      ],
      popular: false,
    },
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gray-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <Link to="/" className="flex items-center group">
                <div className="relative">
                  <TrendingUp className="h-10 w-10 text-blue-400 group-hover:text-blue-300 transition-colors" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                </div>
                <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  CopyTrader Pro
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0 space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
              <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Reviews</a>
              <Link
                to="/login"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-full text-base font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Start Trading
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-400 hover:text-white"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-800">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
                <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
                <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Reviews</a>
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors">Sign in</Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-full text-base font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  Start Trading
                </Link>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-300 text-sm font-medium mb-8">
              <Star className="h-4 w-4 mr-2" />
              Trusted by 12,500+ traders worldwide
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 leading-tight">
              Copy{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                Successful
              </span>
              <br />
              Traders Automatically
            </h1>
            
            <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Join the future of trading. Our AI-powered platform connects you with top-performing traders, 
              automatically copying their strategies in real-time across multiple exchanges.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25"
              >
                Start Copy Trading
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-gray-600 rounded-full hover:border-white transition-all duration-300">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </button>
            </div>

            {/* Live Stats */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {formatNumber(stats.users)}+
                </div>
                <div className="text-gray-400">Active Traders</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  ${formatNumber(stats.trades)}
                </div>
                <div className="text-gray-400">Trades Copied</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-400 mb-2">
                  ${formatNumber(stats.profit)}
                </div>
                <div className="text-gray-400">Profits Generated</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">
                  {stats.success}%
                </div>
                <div className="text-gray-400">Success Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-6 w-6 text-gray-400" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why Choose CopyTrader Pro?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Advanced technology meets intuitive design to deliver the ultimate copy trading experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative p-8 bg-gray-800 rounded-2xl border border-gray-700 hover:border-gray-600 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-6`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Trusted by Traders Worldwide
            </h2>
            <p className="text-xl text-gray-300">
              See what our community is saying about their success
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="bg-gray-800 rounded-2xl p-8 md:p-12 border border-gray-700">
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">
                  {testimonials[currentTestimonial].avatar}
                </div>
                <div>
                  <div className="text-xl font-semibold text-white">
                    {testimonials[currentTestimonial].name}
                  </div>
                  <div className="text-gray-400">
                    {testimonials[currentTestimonial].role}
                  </div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-2xl font-bold text-green-400">
                    {testimonials[currentTestimonial].profit}
                  </div>
                  <div className="text-sm text-gray-400">This Year</div>
                </div>
              </div>
              
              <blockquote className="text-xl text-gray-300 leading-relaxed mb-6">
                "{testimonials[currentTestimonial].content}"
              </blockquote>
              
              <div className="flex justify-center space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentTestimonial ? 'bg-blue-400' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-300">
              Start free, upgrade when you're ready to scale
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative p-8 rounded-2xl border transition-all duration-300 transform hover:-translate-y-2 ${
                  plan.popular
                    ? 'bg-gradient-to-b from-blue-900/50 to-purple-900/50 border-blue-500 shadow-2xl shadow-blue-500/20'
                    : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    {plan.period && <span className="text-gray-400 ml-1">{plan.period}</span>}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/register"
                  className={`block w-full text-center py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transform hover:scale-105'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-3xl p-12 md:p-16 border border-blue-500/30">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Trading?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of successful traders who are already using CopyTrader Pro to maximize their profits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-gray-600 rounded-full hover:border-white transition-all duration-300"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <TrendingUp className="h-8 w-8 text-blue-400" />
                <span className="ml-2 text-xl font-bold text-white">CopyTrader Pro</span>
              </div>
              <p className="text-gray-400 text-base max-w-md">
                The world's most advanced copy trading platform. Trade smarter, not harder.
              </p>
              <div className="mt-6 flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Discord</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
                Product
              </h3>
              <ul className="space-y-3">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
                Support
              </h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 border-t border-gray-700 pt-8">
            <p className="text-base text-gray-400 text-center">
              &copy; 2024 CopyTrader Pro. All rights reserved. Trade responsibly.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;