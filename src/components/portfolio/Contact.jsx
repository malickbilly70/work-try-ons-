import React, { useState } from 'react';
import { Mail, Phone, Send, CheckCircle2, AlertCircle, Copy, Check, MessageSquare } from 'lucide-react';
import { PERSONAL_DATA } from '../../data/personalData';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState({ type: null, message: '' });
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (status.type) setStatus({ type: null, message: '' });
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_DATA.socials.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus({
        type: 'error',
        message: 'Please complete all required fields.'
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus({
        type: 'error',
        message: 'Please provide a valid email address.'
      });
      return;
    }

    // Save message simulation (stores into localStorage messages for reference)
    try {
      const existing = JSON.parse(localStorage.getItem('portfolio_messages') || '[]');
      const newMsg = {
        ...formData,
        id: 'msg_' + Date.now(),
        date: new Date().toISOString()
      };
      localStorage.setItem('portfolio_messages', JSON.stringify([newMsg, ...existing]));

      setStatus({
        type: 'success',
        message: `Thank you, ${formData.name}! Your message has been received. I'll get back to you shortly.`
      });

      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus({
        type: 'error',
        message: 'Something went wrong while sending your message. Please try emailing directly.'
      });
    }
  };

  return (
    <section id="contact" className="py-20 bg-slate-100/50 dark:bg-mb-surface/30 border-t border-slate-200/80 dark:border-mb-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-mb-blue">
            Initiate Collaboration
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Get In Touch
          </h2>
          <div className="w-16 h-1 bg-mb-blue mx-auto rounded-full" />
          <p className="text-sm sm:text-base text-slate-600 dark:text-mb-textMuted">
            Whether you are looking to build a high-performance product, explore venture advisory, or discuss system architecture—reach out directly!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Contact Details & Direct Links Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-mb-border bg-white dark:bg-mb-surface space-y-6 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Contact Information
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Feel free to email directly or copy the address below. I typically respond within 24 hours.
              </p>

              {/* Direct Email Card */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-mb-surfaceLight border border-slate-200/80 dark:border-mb-border flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2.5 rounded-lg bg-mb-blue/10 text-mb-blue flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <span className="text-xs font-medium text-slate-500 dark:text-mb-textMuted block">
                      Email Address
                    </span>
                    <a
                      href={`mailto:${PERSONAL_DATA.socials.email}`}
                      className="text-sm font-semibold text-slate-900 dark:text-white hover:text-mb-blue truncate block"
                    >
                      {PERSONAL_DATA.socials.email}
                    </a>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="p-2 rounded-lg border border-slate-200 dark:border-mb-border text-slate-600 dark:text-slate-300 hover:text-mb-blue transition-colors flex-shrink-0"
                  title="Copy email to clipboard"
                >
                  {copiedEmail ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Social Channels List */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Online Profiles
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={PERSONAL_DATA.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-mb-border bg-slate-50 dark:bg-mb-surfaceLight text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-mb-blue hover:border-mb-blue/40 transition-colors"
                  >
                    <span>GitHub</span>
                  </a>
                  <a
                    href={PERSONAL_DATA.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-mb-border bg-slate-50 dark:bg-mb-surfaceLight text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-mb-blue hover:border-mb-blue/40 transition-colors"
                  >
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Interactive Contact Form Column */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-mb-border bg-white dark:bg-mb-surface shadow-sm">

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Send a Direct Message
              </h3>
              <p className="text-sm text-slate-600 dark:text-mb-textMuted mb-6">
                Fill in the details below and I'll receive your message instantly.
              </p>

              {status.type && (
                <div
                  className={`p-4 rounded-xl mb-6 flex items-start gap-3 text-sm ${
                    status.type === 'success'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                      : 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
                  }`}
                >
                  {status.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-500 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500 mt-0.5" />
                  )}
                  <span>{status.message}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Your Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jane Doe"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-mb-border bg-slate-50 dark:bg-mb-surfaceLight text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-mb-blue focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jane@example.com"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-mb-border bg-slate-50 dark:bg-mb-surfaceLight text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-mb-blue focus:border-transparent transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Project Inquiry / Opportunity"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-mb-border bg-slate-50 dark:bg-mb-surfaceLight text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-mb-blue focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project, timeline, or idea..."
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-mb-border bg-slate-50 dark:bg-mb-surfaceLight text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-mb-blue focus:border-transparent transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-mb-blue hover:bg-mb-accentHover text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
