// frontend-user/src/pages/Contact.jsx
import React, { useState } from 'react';
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend, FiCheckCircle } from 'react-icons/fi';
import { useLanguage } from '../contexts/LanguageContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const Contact = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    setSubmitting(true);
    
    try {
      console.log('Sending message:', formData);
      
      // Send to backend API
      const response = await api.post('/contacts', formData);
      
      console.log('Response:', response.data);
      
      if (response.status === 200 || response.status === 201) {
        setSubmitted(true);
        toast.success('Message sent successfully! We will contact you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
        
        // Reset submitted status after 5 seconds
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(error.response?.data?.detail || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {t('contact') || 'Contact Us'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get in touch with us for any inquiries or support
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FiMapPin className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Address</p>
                    <p className="text-gray-600 text-sm">123 Education Street, Phnom Penh, Cambodia</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FiPhone className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Phone</p>
                    <p className="text-gray-600 text-sm">+855 12 345 678</p>
                    <p className="text-gray-600 text-sm">+855 98 765 432</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FiMail className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Email</p>
                    <p className="text-gray-600 text-sm">info@school.edu.kh</p>
                    <p className="text-gray-600 text-sm">admission@school.edu.kh</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FiClock className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Office Hours</p>
                    <p className="text-gray-600 text-sm">Monday - Friday: 8:00 AM - 5:00 PM</p>
                    <p className="text-gray-600 text-sm">Saturday: 8:00 AM - 12:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden h-64">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1959.1592243806816!2d104.916212!3d11.544873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3109516b8f3b4a0b%3A0x5e8b9c0c8a5e8b9c!2sPhnom%20Penh!5e0!3m2!1sen!2skh!4v1700000000000!5m2!1sen!2skh"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="School Location"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h3>
              
              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiCheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="text-xl font-semibold text-green-800 mb-2">Message Sent Successfully!</h4>
                  <p className="text-green-700">Thank you for contacting us. We will get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                        required
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                        required
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      required
                      placeholder="What is this regarding?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="5"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      required
                      placeholder="Please write your message here..."
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <FiSend className="w-5 h-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;