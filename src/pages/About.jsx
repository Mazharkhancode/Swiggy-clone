import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Compass, Shield, Users, Award, Landmark, TrendingUp } from 'lucide-react';

export default function About() {
  const stats = [
    { label: 'Restaurant Partners', value: '150,000+', icon: Landmark, color: 'from-orange-500 to-amber-500' },
    { label: 'Cities Covered', value: '500+', icon: Compass, color: 'from-blue-500 to-indigo-500' },
    { label: 'Delivery Heroes', value: '300,000+', icon: Users, color: 'from-emerald-500 to-teal-500' },
    { label: 'Happy Customers', value: '50M+', icon: Heart, color: 'from-rose-500 to-pink-500' }
  ];

  const values = [
    {
      title: 'Customer First',
      description: 'We obsess over customer convenience. Every product feature and operational milestone is built around customer delight.',
      icon: Users
    },
    {
      title: 'Always Striving',
      description: 'We believe that excellence is a journey, not a destination. We continuously push limits to deliver your orders faster.',
      icon: TrendingUp
    },
    {
      title: 'Trust & Safety',
      description: 'Ensuring food safety, secure online payment, and hygienic deliveries through our trusted partner networks.',
      icon: Shield
    },
    {
      title: 'Community Care',
      description: 'Supporting local businesses, restaurant owners, and empowering our delivery fleet with fair earnings and security.',
      icon: Award
    }
  ];

  const milestones = [
    { year: '2014', title: 'The Spark', desc: 'Started with just 6 delivery executives and 25 restaurants in Bengaluru.' },
    { year: '2016', title: 'Expansion Surge', desc: 'Expanded delivery operations to Mumbai, Pune, Delhi, Chennai, and Kolkata.' },
    { year: '2018', title: 'Unicorn Status', desc: 'Achieved Unicorn valuation and launched Swiggy Instamart for instant groceries.' },
    { year: '2021', title: 'Go Indore!', desc: 'Launched full-scale Indori street food delivery, capturing local tastes.' },
    { year: '2026', title: 'Super-App Era', desc: 'Integrating AI-driven personalized food recommendation engines.' }
  ];

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800 font-sans pb-24">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-slate-900 to-zinc-900 text-white py-24 px-4 text-center">
        <div className="absolute inset-0 bg-black/10 z-0"></div>
        
        {/* Decorative background shapes */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-orange-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="bg-white/10 border border-white/10 text-white font-extrabold text-xs uppercase tracking-[0.2em] px-4 py-1.5 rounded-full backdrop-blur-md">
              Our Journey
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-4xl sm:text-6xl font-black mt-6 tracking-tight leading-tight"
          >
            Elevating the Quality of Life <br />
            <span className="text-primary">With Unmatched Convenience</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 text-lg sm:text-xl text-orange-50 font-medium max-w-2xl mx-auto leading-relaxed"
          >
            Swiggy is India’s leading on-demand convenience platform, delivering food, groceries, and more right to your doorstep instantly.
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-10 relative z-20">
        {/* Statistics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100/50 flex flex-col items-center text-center group"
              >
                <div className={`p-4 rounded-2xl bg-gradient-to-tr ${stat.color} text-white mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={24} />
                </div>
                <span className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">{stat.value}</span>
                <span className="text-xs sm:text-sm text-gray-400 font-semibold mt-2">{stat.label}</span>
              </motion.div>
            );
          })}
        </div>

        {/* Our Mission / Vision Section */}
        <section className="mt-24 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-6">
              <span className="text-primary font-bold text-xs uppercase tracking-widest">Our Vision</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-950 mt-2 mb-6 tracking-tight leading-tight">
                Driven by technology, <br />delivered with care.
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4 text-[15px]">
                What started as a small service in South Bengaluru is now a household name across India. We believe in harnessing the power of local logistics and smart tech routing algorithms to bring speed, transparency, and delight to online ordering.
              </p>
              <p className="text-gray-600 leading-relaxed text-[15px]">
                From your morning Indori Poha to late-night gourmet cravings, our delivery fleet rides through wind, rain, and traffic to ensure you never go hungry.
              </p>
            </div>
            
            <div className="md:col-span-6 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-400 to-amber-400 rounded-3xl transform rotate-3 scale-95 opacity-20 pointer-events-none"></div>
              <img 
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80" 
                alt="Delicious Gourmet Pizza" 
                className="w-full h-80 object-cover rounded-3xl shadow-xl relative z-10 hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="mt-32">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-primary font-bold text-xs uppercase tracking-widest">Core values</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-950 mt-2 tracking-tight">The Principles That Guide Us</h2>
            <p className="text-gray-500 mt-3 text-sm sm:text-[15px]">We hold ourselves accountable to high standards of operational excellence, mutual respect, and constant innovation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val, index) => {
              const Icon = val.icon;
              return (
                <div 
                  key={index}
                  className="bg-white rounded-3xl p-8 border border-gray-100 hover:border-orange-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1"
                >
                  <div className="p-3 bg-orange-50 text-primary w-fit rounded-xl mb-6">
                    <Icon size={22} />
                  </div>
                  <h3 className="font-extrabold text-lg text-gray-950 mb-3">{val.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{val.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Our Timeline / Milestones */}
        <section className="mt-32 max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-primary font-bold text-xs uppercase tracking-widest">Our Timeline</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-950 mt-2 tracking-tight">Milestones Along The Way</h2>
          </div>

          <div className="relative border-l-2 border-orange-200 ml-4 md:ml-32">
            {milestones.map((stone, index) => (
              <div key={index} className="mb-12 relative pl-8">
                {/* Timeline circle node */}
                <div className="absolute -left-2 top-1.5 w-3.5 h-3.5 rounded-full bg-primary border-4 border-white ring-2 ring-orange-200"></div>
                
                {/* Year Label */}
                <div className="md:absolute md:-left-32 md:top-1.5 text-primary font-black text-lg text-left md:w-24">
                  {stone.year}
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="font-extrabold text-[16px] text-gray-950 mb-2">{stone.title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{stone.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-32 text-center bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-12 sm:p-16 text-white max-w-5xl mx-auto shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-orange-500/10 blur-3xl pointer-events-none"></div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">Craving delicious food?</h3>
            <p className="text-gray-400 mb-8 text-sm sm:text-base leading-relaxed">
              Browse Indore's top-rated restaurants, choose your favorite dishes, and experience the lightning-fast Swiggy delivery.
            </p>
            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/restaurants" 
              className="inline-block bg-primary hover:bg-orange-600 text-white font-extrabold px-8 py-4 rounded-2xl transition-colors shadow-lg shadow-primary/25"
            >
              Order Food Now
            </motion.a>
          </div>
        </section>
      </div>
    </div>
  );
}
