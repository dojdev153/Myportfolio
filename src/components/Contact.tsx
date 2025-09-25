
import { useState, useEffect, useRef } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { contactAPI, analyticsAPI } from '../lib/api';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [focusedField, setFocusedField] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  
  // Animation refs
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contactInfoRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setSubmitStatus('error');
      setSubmitMessage('Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');

    try {
      // Submit contact form
      const response = await contactAPI.submit({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim()
      });

      if (response.success) {
        setSubmitStatus('success');
        setSubmitMessage(response.message || 'Thank you for your message! I will get back to you within 24 hours.');
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });

        // Track analytics
        analyticsAPI.track({
          event: 'contact_form',
          page: '/contact',
          metadata: {
            subject: formData.subject.substring(0, 50)
          }
        });
      } else {
        throw new Error(response.message || 'Failed to send message');
      }
    } catch (error: any) {
      console.error('Contact form error:', error);
      setSubmitStatus('error');
      setSubmitMessage(
        error.response?.data?.message || 
        error.message || 
        'Sorry, there was an error sending your message. Please try again later.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'frank.duff@dojdev.com',
      href: 'mailto:frank.duff@dojdev.com'
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+1 (555) 123-4567',
      href: 'tel:+15551234567'
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Kigali, Rwanda',
      href: '#'
    }
  ];

  // GSAP animations
  useEffect(() => {
    if (!sectionRef.current || !headerRef.current || !contactInfoRef.current || !formRef.current) return;

    // Set initial states
    gsap.set(headerRef.current, { opacity: 0, y: 50 });
    gsap.set(contactInfoRef.current, { opacity: 0, y: 80 });
    gsap.set(formRef.current, { opacity: 0, y: 80 });

    // Create timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        once: true
      }
    });

    // Animate header
    tl.to(headerRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power2.out'
    });

    // Animate contact info and form with upward motion
    tl.to([contactInfoRef.current, formRef.current], {
      opacity: 1,
      y: 0,
      duration: 1.2,
      stagger: 0.3,
      ease: 'power2.out'
    }, '-=0.5');

    // Animate contact info items with stagger
    const contactItems = contactInfoRef.current.querySelectorAll('.contact-item');
    if (contactItems.length > 0) {
      gsap.set(contactItems, { opacity: 0, x: -30 });
      
      tl.to(contactItems, {
        opacity: 1,
        x: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out'
      }, '-=0.3');
    }

    // Cleanup
    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === sectionRef.current) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-20 px-4 relative" id="contact">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div ref={headerRef} className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-cyber font-bold mb-4">
            <span className="bg-gradient-to-r from-cyber-pink to-cyber-blue bg-clip-text text-transparent glow-text">
              Get In Touch
            </span>
          </h2>
          <p className="text-xl text-gray-400 font-tech">
            Let's build something extraordinary together
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-cyber-pink to-cyber-blue mx-auto rounded-full mt-4"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div ref={contactInfoRef} className="space-y-8">
            <div className="hologram p-8 rounded-lg">
              <h3 className="text-2xl font-cyber font-bold text-cyber-blue mb-6">
                Connect With Me
              </h3>
              <p className="text-gray-300 mb-8 leading-relaxed">
                Ready to collaborate on your next project? Whether it's a cutting-edge web application, 
                a stunning user interface, or an innovative digital experience, I'm here to help bring 
                your vision to life.
              </p>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <a
                    key={index}
                    href={info.href}
                    className="contact-item flex items-center gap-4 p-4 rounded-lg border border-cyber-blue/30 hover:border-cyber-blue hover:bg-cyber-blue/5 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-cyber-blue to-cyber-purple rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <info.icon size={20} className="text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 font-tech">{info.label}</div>
                      <div className="text-white font-tech font-medium group-hover:text-cyber-blue transition-colors duration-300">
                        {info.value}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="hologram p-6 rounded-lg">
              <h4 className="text-lg font-cyber font-bold text-cyber-green mb-4">
                Follow The Journey
              </h4>
              <div className="flex gap-4">
                {['GitHub', 'LinkedIn', 'Twitter', 'Dribbble'].map((platform, index) => (
                  <a
                    key={platform}
                    href="#"
                    className="w-12 h-12 bg-gradient-to-br from-cyber-purple/20 to-cyber-pink/20 rounded-lg flex items-center justify-center border border-cyber-purple/30 hover:border-cyber-purple hover:scale-110 hover:bg-cyber-purple/20 transition-all duration-300 group"
                  >
                    <span className="text-xs font-tech font-bold text-cyber-purple group-hover:text-white">
                      {platform.slice(0, 2)}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div ref={formRef} className="hologram p-8 rounded-lg">
            <h3 className="text-2xl font-cyber font-bold text-cyber-green mb-6">
              Send Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField('')}
                  className="w-full bg-cyber-dark/50 border-2 border-cyber-blue/30 rounded-lg px-4 py-3 text-white font-tech focus:border-cyber-blue focus:outline-none transition-all duration-300"
                  required
                />
                <label 
                  className={`absolute left-4 transition-all duration-300 pointer-events-none font-tech ${
                    focusedField === 'name' || formData.name 
                      ? 'top-2 text-xs text-cyber-blue' 
                      : 'top-3 text-gray-400'
                  }`}
                >
                  Full Name
                </label>
              </div>

              {/* Email Field */}
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField('')}
                  className="w-full bg-cyber-dark/50 border-2 border-cyber-blue/30 rounded-lg px-4 py-3 text-white font-tech focus:border-cyber-blue focus:outline-none transition-all duration-300"
                  required
                />
                <label 
                  className={`absolute left-4 transition-all duration-300 pointer-events-none font-tech ${
                    focusedField === 'email' || formData.email 
                      ? 'top-2 text-xs text-cyber-blue' 
                      : 'top-3 text-gray-400'
                  }`}
                >
                  Email Address
                </label>
              </div>

              {/* Subject Field */}
              <div className="relative">
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('subject')}
                  onBlur={() => setFocusedField('')}
                  className="w-full bg-cyber-dark/50 border-2 border-cyber-blue/30 rounded-lg px-4 py-3 text-white font-tech focus:border-cyber-blue focus:outline-none transition-all duration-300"
                  required
                />
                <label 
                  className={`absolute left-4 transition-all duration-300 pointer-events-none font-tech ${
                    focusedField === 'subject' || formData.subject 
                      ? 'top-2 text-xs text-cyber-blue' 
                      : 'top-3 text-gray-400'
                  }`}
                >
                  Subject
                </label>
              </div>

              {/* Message Field */}
              <div className="relative">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField('')}
                  rows={5}
                  className="w-full bg-cyber-dark/50 border-2 border-cyber-blue/30 rounded-lg px-4 py-3 text-white font-tech focus:border-cyber-blue focus:outline-none transition-all duration-300 resize-none"
                  required
                />
                <label 
                  className={`absolute left-4 transition-all duration-300 pointer-events-none font-tech ${
                    focusedField === 'message' || formData.message 
                      ? 'top-2 text-xs text-cyber-blue' 
                      : 'top-3 text-gray-400'
                  }`}
                >
                  Your Message
                </label>
              </div>

              {/* Submit Status */}
              {submitStatus !== 'idle' && (
                <div className={`p-4 rounded-lg border flex items-center gap-3 ${
                  submitStatus === 'success' 
                    ? 'bg-cyber-green/10 border-cyber-green/30 text-cyber-green'
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}>
                  {submitStatus === 'success' ? (
                    <CheckCircle size={20} className="text-cyber-green flex-shrink-0" />
                  ) : (
                    <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
                  )}
                  <span className="text-sm">{submitMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full cyber-button flex items-center justify-center gap-3 transition-all duration-300 ${
                  isSubmitting 
                    ? 'opacity-60 cursor-not-allowed' 
                    : 'hover:scale-105'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-24 h-24 border border-cyber-pink/20 rounded-full animate-float"></div>
        <div className="absolute bottom-40 right-20 w-20 h-20 bg-gradient-to-br from-cyber-green/10 to-cyber-blue/10 transform rotate-45 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
    </section>
  );
};

export default Contact;
