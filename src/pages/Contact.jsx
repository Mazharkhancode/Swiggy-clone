import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, ChevronDown, HelpCircle } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const contactDetails = [
    { label: 'Call Support', value: '+91 731 456 7890', desc: 'Mon-Sun, 9 AM - 11 PM', icon: Phone, color: 'from-orange-500 to-amber-500' },
    { label: 'Email Queries', value: 'support@swiggy-indore.com', desc: 'Response within 24 hours', icon: Mail, color: 'from-blue-500 to-indigo-500' },
    { label: 'Indore Head Office', value: '405, Vijay Nagar Main Rd, Indore', desc: 'Madhya Pradesh, 452010', icon: MapPin, color: 'from-emerald-500 to-teal-500' }
  ];

  const faqs = [
    { q: 'How do I cancel or modify my active order?', a: 'You can cancel or modify your order within 60 seconds of placing it by navigating to your Active Orders section in your profile dashboard. After 60 seconds, cancellation depends on whether the restaurant has started preparing the food.' },
    { q: 'What should I do if my payment failed but the amount was deducted?', a: 'Do not worry! If an order was not generated but your bank account was debited, the amount is automatically refunded by your payment gateway within 3-5 business days. You can also contact support with the transaction ID.' },
    { q: 'Can I change my delivery address after placing an order?', a: 'Address changes are only possible before the delivery executive is assigned. Please contact support immediately via our support helpline with your active order ID.' },
    { q: 'How do I register my restaurant on Swiggy?', a: 'You can apply by visiting the "Partner with us" link in the footer, filling out the basic details form along with your FSSAI certificate and menu prices, and our team will get in touch.' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 4000);
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800 font-sans pb-24">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-slate-900 to-zinc-900 text-white py-20 px-4 text-center">
        <div className="absolute inset-0 bg-black/10 z-0"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-orange-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="bg-white/10 border border-white/10 text-white font-extrabold text-xs uppercase tracking-[0.2em] px-4 py-1.5 rounded-full backdrop-blur-md">
              Support Center
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-4xl sm:text-5xl font-black mt-6 tracking-tight leading-tight"
          >
            We'd Love to Hear From You <br />
            <span className="text-primary">Get Instant Help & Support</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-4 text-sm sm:text-base text-gray-300 font-medium max-w-2xl mx-auto"
          >
            Have queries about your order, payments, coupons or partnering with us? Our customer happiness team is available round-the-clock.
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-10 relative z-20 max-w-6xl">
        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {contactDetails.map((detail, idx) => {
            const Icon = detail.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex items-center gap-5 group hover:shadow-2xl transition-all duration-300"
              >
                <div className={`p-4 rounded-2xl bg-gradient-to-tr ${detail.color} text-white flex-shrink-0 group-hover:scale-105 transition-transform duration-300`}>
                  <Icon size={24} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[11px] text-gray-400 font-black uppercase tracking-wider">{detail.label}</span>
                  <span className="text-base sm:text-lg font-black text-gray-950 mt-1">{detail.value}</span>
                  <span className="text-xs text-gray-400 font-semibold mt-0.5">{detail.desc}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Contact Form & Side Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-24">
          {/* FAQ Accordion Side */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-8 shadow-xl border border-gray-100/50 h-full flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-black text-gray-950 mb-6 flex items-center gap-2">
                <HelpCircle className="text-primary" size={24} />
                Frequently Asked Questions
              </h3>
              
              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <button
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full flex items-center justify-between text-left font-extrabold text-[14px] sm:text-[15px] text-gray-800 hover:text-primary transition-colors focus:outline-none"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown 
                        size={18} 
                        className={`text-gray-400 transform transition-transform duration-300 ${openFaq === idx ? 'rotate-180 text-primary' : ''}`}
                      />
                    </button>
                    <AnimatePresence>
                      {openFaq === idx && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <p className="text-gray-500 text-xs sm:text-sm mt-2 leading-relaxed bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 shadow-xl border border-gray-100/50 relative overflow-hidden h-full flex flex-col justify-between">
            <h3 className="text-2xl font-black text-gray-950 mb-6 flex items-center gap-2">
              <Send className="text-primary" size={24} />
              Send Us a Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-500 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="border border-gray-200 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 rounded-xl px-4 py-3 outline-none text-sm transition-all"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-500 mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email"
                    className="border border-gray-200 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 rounded-xl px-4 py-3 outline-none text-sm transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-500 mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter 10-digit number"
                    className="border border-gray-200 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 rounded-xl px-4 py-3 outline-none text-sm transition-all"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-500 mb-1.5">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Reason for contact"
                    className="border border-gray-200 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 rounded-xl px-4 py-3 outline-none text-sm transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-500 mb-1.5">Your Message *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we help you today?"
                  className="border border-gray-200 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 rounded-xl px-4 py-3 outline-none text-sm transition-all resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-orange-600 text-white font-extrabold py-4 px-6 rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center justify-center gap-2"
              >
                <span>Submit Message</span>
                <Send size={18} />
              </button>
            </form>

            {/* Submission Toast Banner */}
            <AnimatePresence>
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  className="absolute inset-0 bg-white/95 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center"
                >
                  <motion.div
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="text-green-500 mb-4"
                  >
                    <CheckCircle2 size={64} className="fill-green-50" />
                  </motion.div>
                  <h4 className="text-xl font-black text-gray-950">Thank you, {formData.name}!</h4>
                  <p className="text-gray-500 text-sm mt-2 max-w-sm">
                    Your query has been recorded. Our customer support will contact you at **{formData.email}** shortly.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
