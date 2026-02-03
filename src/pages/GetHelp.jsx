import React, { useState } from 'react';
import {
  Search,
  ChevronRight,
  ChevronDown,
  X,
  MessageCircle,
  Phone,
  Mail,
  FileText,
  Star,
  HelpCircle,
  ThumbsUp,
  MessageSquare,
  Clock,
  CheckCircle,
  Users,
  Shield,
} from "lucide-react";

const HelpPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [openFAQ, setOpenFAQ] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'All Topics', count: 12 },
    { id: 'events', label: 'Events', count: 3 },
    { id: 'account', label: 'Account', count: 2 },
    { id: 'tickets', label: 'Tickets', count: 4 },
    { id: 'payment', label: 'Payment', count: 2 },
    { id: 'technical', label: 'Technical', count: 1 },
    { id: 'safety', label: 'Safety', count: 1 },
  ];

  const faqs = [
    {
      id: 1,
      question: "How do I purchase tickets?",
      answer: "To purchase tickets, browse events on our platform, select your preferred seats, and proceed to checkout. You can pay using credit/debit cards, PayPal, or other available payment methods.",
      category: 'tickets',
      popular: true
    },
    {
      id: 2,
      question: "Can I get a refund for my ticket?",
      answer: "Refund policies vary by event. Please check the event's specific refund policy before purchasing. For eligible refunds, contact our support team within 48 hours of purchase.",
      category: 'tickets'
    },
    {
      id: 3,
      question: "How do I create an account?",
      answer: "Click the 'Sign Up' button in the top right corner, enter your email, create a password, and verify your email address. You'll receive a confirmation email to complete the process.",
      category: 'account',
      popular: true
    },
    {
      id: 4,
      question: "What payment methods do you accept?",
      answer: "We accept Visa, MasterCard, American Express, PayPal, Apple Pay, Google Pay, and bank transfers for select events.",
      category: 'payment'
    },
    {
      id: 5,
      question: "How do I transfer tickets to someone else?",
      answer: "Go to 'My Tickets', select the ticket you want to transfer, click 'Transfer', and enter the recipient's email address. They'll receive instructions to claim the ticket.",
      category: 'tickets'
    },
    {
      id: 6,
      question: "Is my payment information secure?",
      answer: "Yes, we use SSL encryption and comply with PCI DSS standards. We never store your full card details on our servers.",
      category: 'safety',
      popular: true
    },
    {
      id: 7,
      question: "How do I find events near me?",
      answer: "Use the location filter on the events page or enable location services to see events in your area. You can also search by city or venue.",
      category: 'events'
    },
    {
      id: 8,
      question: "Can I use the website to purchase tickets?",
      answer: "Yes, our website offers all the features of our  with added convenience.",
      category: 'technical'
    },
    {
      id: 9,
      question: "What if an event is cancelled?",
      answer: "If an event is cancelled, you'll be automatically refunded within 7-10 business days. You'll receive an email notification with details.",
      category: 'events'
    },
    {
      id: 10,
      question: "How do I update my account information?",
      answer: "Go to 'Account Settings' from your profile menu. You can update your personal information, email, password, and notification preferences.",
      category: 'account'
    },
    {
      id: 11,
      question: "Are there any booking fees?",
      answer: "A small service fee may be applied to cover payment processing and platform maintenance. The exact fee is displayed before checkout.",
      category: 'payment'
    },
    {
      id: 12,
      question: "How do I contact customer support?",
      answer: "You can reach us through the chat widget on this page, email at support@tix-ph.com, or call +1 (800) 123-4567. Response time is typically under 30 minutes.",
      category: 'all',
      popular: true
    },
  ];

  const filteredFAQs = faqs.filter(faq => 
    (activeCategory === 'all' || faq.category === activeCategory) &&
    (faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
     faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const popularFAQs = faqs.filter(faq => faq.popular);

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  const contactMethods = [
    {
      icon: <MessageCircle className="w-6 h-6" />,
      label: 'Live Chat',
      description: 'Chat with us now',
      action: 'Start Chat'
    },
    {
      icon: <Phone className="w-6 h-6" />,
      label: 'Call Us',
      description: '+1 (800) 123-4567',
      action: 'Call Now'
    },
    {
      icon: <Mail className="w-6 h-6" />,
      label: 'Email',
      description: 'support@tix-ph.com',
      action: 'Send Email'
    },
    {
      icon: <FileText className="w-6 h-6" />,
      label: 'Help Center',
      description: 'Browse articles',
      action: 'Browse'
    },
  ];

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-6xl  pt-30 mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-6 tracking-tight">
            How can we help you?
          </h1>
          <div className="w-24 h-1 bg-black mx-auto mb-8"></div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Find answers to common questions or contact our support team
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-12">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {contactMethods.map((method, index) => (
            <div key={index} className="bg-white border border-gray-300 rounded-lg p-6 hover:border-black transition-colors">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center">
                  {method.icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-black">{method.label}</h3>
                  <p className="text-gray-600">{method.description}</p>
                </div>
              </div>
              <button className="w-full py-2 border border-black text-black font-medium rounded hover:bg-black hover:text-white transition-colors">
                {method.action}
              </button>
            </div>
          ))}
        </div>

        {/* Category Tabs */}
        <div className="mb-10">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`
                  flex items-center space-x-2 px-5 py-3 rounded-lg border transition-all
                  ${activeCategory === category.id
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                  }
                `}
              >
                <span className="font-medium">{category.label}</span>
                <span className={`
                  px-2 py-1 text-xs rounded
                  ${activeCategory === category.id
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-gray-600'
                  }
                `}>
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Popular Questions */}
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-8">
            <Star className="w-6 h-6 text-black" />
            <h2 className="text-2xl font-bold text-black">Popular Questions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {popularFAQs.map((faq) => (
              <div
                key={faq.id}
                className="border border-gray-300 rounded-lg hover:border-black transition-colors"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full p-6 text-left flex items-start justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-start space-x-4">
                      <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h3 className="font-semibold text-black text-lg mb-2">{faq.question}</h3>
                        {openFAQ === faq.id && (
                          <div className="mt-4">
                            <p className="text-gray-600 mb-4">{faq.answer}</p>
                            <div className="flex items-center space-x-4 text-sm">
                              <button className="flex items-center space-x-1 text-black hover:text-gray-600">
                                <ThumbsUp className="w-4 h-4" />
                                <span>Helpful</span>
                              </button>
                              <button className="flex items-center space-x-1 text-black hover:text-gray-600">
                                <MessageSquare className="w-4 h-4" />
                                <span>Comment</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <ChevronDown
                    className={`
                      w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ml-4
                      ${openFAQ === faq.id ? 'rotate-180' : ''}
                    `}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* All FAQs */}
        <div className="mb-16">
          <div className="flex items-center space-x-3 mb-8">
            <HelpCircle className="w-6 h-6 text-black" />
            <h2 className="text-2xl font-bold text-black">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq) => (
                <div
                  key={faq.id}
                  className="border border-gray-300 rounded-lg hover:border-black transition-colors"
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full p-6 text-left flex items-start justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-start space-x-4">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${faq.popular ? 'bg-black' : 'bg-gray-400'}`}></div>
                        <div>
                          <h3 className="font-medium text-black">{faq.question}</h3>
                          {openFAQ === faq.id && (
                            <div className="mt-4">
                              <p className="text-gray-600 mb-4">{faq.answer}</p>
                              <div className="flex items-center space-x-6 text-sm">
                                <button className="flex items-center space-x-1 text-black hover:text-gray-600">
                                  <ThumbsUp className="w-4 h-4" />
                                  <span>Helpful</span>
                                </button>
                                <button className="flex items-center space-x-1 text-black hover:text-gray-600">
                                  <MessageSquare className="w-4 h-4" />
                                  <span>Comment</span>
                                </button>
                                <button className="text-black hover:text-gray-600 font-medium">
                                  Contact Support
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <ChevronDown
                      className={`
                        w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ml-4
                        ${openFAQ === faq.id ? 'rotate-180' : ''}
                      `}
                    />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-12 border border-gray-300 rounded-lg">
                <p className="text-gray-600">No results found for "{searchQuery}"</p>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="mt-4 text-black underline hover:text-gray-600"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Contact Section */}
        <div className="border-t border-b border-gray-300 py-12 mb-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-black mb-4">Still need help?</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Our support team is available 24/7 to assist you with any questions or concerns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2">
                <MessageCircle className="w-5 h-5" />
                <span>Start Live Chat</span>
              </button>
              <button className="bg-white text-black border-2 border-black px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Schedule a Call
              </button>
            </div>
          </div>
        </div>

        {/* Support Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="text-center p-6 border border-gray-300 rounded-lg">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Clock className="w-6 h-6 text-black" />
            </div>
            <div className="text-3xl font-bold text-black mb-2">24/7</div>
            <div className="text-gray-600">Support Available</div>
          </div>
          <div className="text-center p-6 border border-gray-300 rounded-lg">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <CheckCircle className="w-6 h-6 text-black" />
            </div>
            <div className="text-3xl font-bold text-black mb-2">15 min</div>
            <div className="text-gray-600">Avg. Response Time</div>
          </div>
          <div className="text-center p-6 border border-gray-300 rounded-lg">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Users className="w-6 h-6 text-black" />
            </div>
            <div className="text-3xl font-bold text-black mb-2">98%</div>
            <div className="text-gray-600">Satisfaction Rate</div>
          </div>
          <div className="text-center p-6 border border-gray-300 rounded-lg">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Shield className="w-6 h-6 text-black" />
            </div>
            <div className="text-3xl font-bold text-black mb-2">5000+</div>
            <div className="text-gray-600">Questions Answered</div>
          </div>
        </div>

        {/* Footer Note */}
       
      </div>
    </div>
  );
};

export default HelpPage;