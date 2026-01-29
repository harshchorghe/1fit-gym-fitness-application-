'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';   // Correct import for App Router

export default function GymLandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const goToSignup = () => {
    router.push('/signup');
  };

  const features = [
    { icon: '💪', title: 'Strength Training', desc: 'Build raw power with state-of-the-art equipment' },
    { icon: '🏃', title: 'Cardio Zone', desc: 'Premium cardio machines with virtual training' },
    { icon: '🥊', title: 'Fight Club', desc: 'Boxing, MMA, and martial arts classes' },
    { icon: '🧘', title: 'Recovery Studio', desc: 'Yoga, stretching, and meditation spaces' }
  ];

  const plans = [
    { name: 'Starter', price: '29', features: ['Gym Access', 'Locker Room', 'Mobile App'] },
    { name: 'Pro', price: '59', features: ['All Starter', 'Group Classes', 'Nutrition Plan', 'Recovery Tools'], popular: true },
    { name: 'Elite', price: '99', features: ['All Pro', 'Personal Trainer', '24/7 Access', 'Spa & Sauna', 'Priority Support'] }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Barlow:wght@300;400;600&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Barlow', sans-serif;
          background: #000;
          color: #fff;
        }

        .grain {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 100;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: translateY(30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-slide-in {
          animation: slideIn 0.8s ease-out forwards;
        }

        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }

        .animate-scale-in {
          animation: scaleIn 0.6s ease-out forwards;
        }

        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }

        .text-stroke {
          -webkit-text-stroke: 2px #ff3366;
          -webkit-text-fill-color: transparent;
        }

        @media (max-width: 768px) {
          .text-stroke {
            -webkit-text-stroke: 1px #ff3366;
          }
        }
      `}</style>

      <div className="grain"></div>

      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-black/90 backdrop-blur-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="text-3xl font-bold" style={{ fontFamily: 'Oswald, sans-serif' }}>
              <span className="text-white">IRON</span>
              <span className="text-red-500">FORGE</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              {['Home', 'Features', 'Plans', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-300 hover:text-red-500 transition-colors font-medium tracking-wide"
                >
                  {item}
                </a>
              ))}
            </div>

            <button 
              onClick={goToSignup}
              className="hidden md:block bg-red-500 hover:bg-red-600 px-6 py-3 rounded-none font-semibold transition-all transform hover:scale-105"
            >
              JOIN NOW
            </button>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-lg">
            <div className="px-4 pt-2 pb-6 space-y-4">
              {['Home', 'Features', 'Plans', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block text-gray-300 hover:text-red-500 transition-colors font-medium tracking-wide py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <button 
                onClick={() => {
                  setIsMenuOpen(false);
                  goToSignup();
                }}
                className="w-full bg-red-500 hover:bg-red-600 px-6 py-3 rounded-none font-semibold transition-all"
              >
                JOIN NOW
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-10 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold mb-6 animate-slide-in"
            style={{ fontFamily: 'Oswald, sans-serif', lineHeight: '0.9' }}
          >
            <div className="text-white">FORGE</div>
            <div className="text-stroke">YOUR</div>
            <div className="text-white">LEGEND</div>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto animate-slide-in stagger-1">
            Transform your body, elevate your mind, and unleash your true potential in the ultimate fitness sanctuary.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-in stagger-2">
            <button 
              onClick={goToSignup}
              className="bg-red-500 hover:bg-red-600 px-8 py-4 text-lg font-bold rounded-none transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/50"
            >
              START YOUR JOURNEY
            </button>
            <button className="border-2 border-white hover:bg-white hover:text-black px-8 py-4 text-lg font-bold rounded-none transition-all transform hover:scale-105">
              WATCH TOUR
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 animate-slide-in stagger-3">
            {[
              { num: '500+', label: 'Members' },
              { num: '50+', label: 'Classes' },
              { num: '24/7', label: 'Access' },
              { num: '15+', label: 'Trainers' }
            ].map((stat, i) => (
              <div key={i} className="border border-gray-800 p-6 hover:border-red-500 transition-colors">
                <div className="text-3xl md:text-4xl font-bold text-red-500" style={{ fontFamily: 'Oswald, sans-serif' }}>{stat.num}</div>
                <div className="text-gray-500 text-sm md:text-base mt-2 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-pulse">
          <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-red-500 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold text-center mb-16" style={{ fontFamily: 'Oswald, sans-serif' }}>
            ELITE <span className="text-red-500">FACILITIES</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div 
                key={i}
                className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 p-8 hover:border-red-500 transition-all group hover:transform hover:scale-105 animate-scale-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="text-5xl md:text-6xl mb-6 transform group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-red-500 transition-colors" style={{ fontFamily: 'Oswald, sans-serif' }}>
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm md:text-base">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-red-600 to-red-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.05) 10px, rgba(255,255,255,.05) 20px)'
          }}></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6" style={{ fontFamily: 'Oswald, sans-serif' }}>
            FIRST WEEK FREE
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 opacity-90">
            No commitment. No excuses. Just results.
          </p>
          <button 
            onClick={goToSignup}
            className="bg-black hover:bg-gray-900 text-white px-8 py-4 text-lg font-bold rounded-none transition-all transform hover:scale-105"
          >
            CLAIM YOUR TRIAL
          </button>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="plans" className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold text-center mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
            MEMBERSHIP <span className="text-red-500">PLANS</span>
          </h2>
          <p className="text-center text-gray-400 text-lg mb-16">Choose your path to greatness</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {plans.map((plan, i) => (
              <div 
                key={i}
                className={`relative border ${plan.popular ? 'border-red-500 scale-105 md:scale-110' : 'border-gray-800'} p-8 hover:border-red-500 transition-all bg-gradient-to-b from-gray-900 to-black animate-scale-in`}
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-red-500 px-6 py-1 text-sm font-bold">
                    MOST POPULAR
                  </div>
                )}
                
                <h3 className="text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
                  {plan.name}
                </h3>
                
                <div className="mb-6">
                  <span className="text-5xl md:text-6xl font-bold text-red-500">${plan.price}</span>
                  <span className="text-gray-500">/month</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start">
                      <span className="text-red-500 mr-3 text-xl">✓</span>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={goToSignup}
                  className={`w-full py-4 font-bold transition-all ${plan.popular ? 'bg-red-500 hover:bg-red-600' : 'bg-transparent border-2 border-gray-700 hover:border-red-500 hover:bg-red-500'}`}
                >
                  SELECT PLAN
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 md:py-32 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold text-center mb-16" style={{ fontFamily: 'Oswald, sans-serif' }}>
            GET <span className="text-red-500">STARTED</span>
          </h2>

          <form className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <input 
                type="text" 
                placeholder="First Name"
                className="bg-transparent border-2 border-gray-800 px-6 py-4 focus:border-red-500 outline-none transition-colors"
              />
              <input 
                type="text" 
                placeholder="Last Name"
                className="bg-transparent border-2 border-gray-800 px-6 py-4 focus:border-red-500 outline-none transition-colors"
              />
            </div>
            
            <input 
              type="email" 
              placeholder="Email Address"
              className="w-full bg-transparent border-2 border-gray-800 px-6 py-4 focus:border-red-500 outline-none transition-colors"
            />
            
            <input 
              type="tel" 
              placeholder="Phone Number"
              className="w-full bg-transparent border-2 border-gray-800 px-6 py-4 focus:border-red-500 outline-none transition-colors"
            />
            
            <textarea 
              placeholder="Tell us about your fitness goals"
              rows="5"
              className="w-full bg-transparent border-2 border-gray-800 px-6 py-4 focus:border-red-500 outline-none transition-colors resize-none"
            ></textarea>

            <button 
              type="button"  // Changed from submit → button since we're redirecting
              onClick={goToSignup}
              className="w-full bg-red-500 hover:bg-red-600 py-4 font-bold text-lg transition-all transform hover:scale-105"
            >
              SUBMIT APPLICATION
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
                <span className="text-white">IRON</span><span className="text-red-500">FORGE</span>
              </h3>
              <p className="text-gray-500 text-sm">Building champions since 2020</p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-red-500">QUICK LINKS</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Classes</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Trainers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Schedule</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-red-500">SUPPORT</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Membership</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-red-500">HOURS</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Mon - Fri: 5AM - 11PM</li>
                <li>Sat - Sun: 6AM - 10PM</li>
                <li className="text-red-500 font-semibold mt-4">24/7 Elite Members</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-900 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 sm:mb-0">
              © 2026 IronForge Fitness. All rights reserved.
            </p>
            <div className="flex space-x-6">
              {['Facebook', 'Instagram', 'Twitter', 'YouTube'].map((social) => (
                <a key={social} href="#" className="text-gray-500 hover:text-red-500 transition-colors text-sm">
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}