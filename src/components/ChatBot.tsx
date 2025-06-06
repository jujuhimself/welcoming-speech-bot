
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, X, Send, Bot, User, HelpCircle, AlertTriangle, TrendingUp, FileText, Stethoscope } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  category?: 'medical' | 'business' | 'general' | 'symptom' | 'lab';
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Role-based initial greeting
      const getRoleSpecificGreeting = () => {
        if (!user) return "Hello! 👋 I'm your BEPAWA assistant. How can I help you today?";
        
        switch (user.role) {
          case 'individual':
            return `Hello ${user.name}! 👋 I'm your personal health assistant. I can help you with medicine information, symptom checking, finding pharmacies, and health consultations. What can I help you with today?`;
          case 'retail':
            return `Welcome back, ${user.pharmacyName}! 🏪 I'm your business assistant. I can help with inventory management, sales insights, order tracking, and customer service. How can I assist your pharmacy today?`;
          case 'wholesale':
            return `Hello ${user.businessName}! 📦 I'm here to help with your wholesale operations including inventory alerts, retailer management, bulk pricing, and market insights. What do you need assistance with?`;
          case 'lab':
            return `Welcome, ${user.labName}! 🔬 I can help interpret test results, manage appointments, explain medical values, and provide diagnostic insights. How can I assist your laboratory today?`;
          case 'admin':
            return `Hello Admin! 👨‍💼 I can help with platform management, user analytics, system monitoring, and administrative tasks. What would you like to know?`;
          default:
            return "Hello! 👋 I'm your BEPAWA assistant. How can I help you today?";
        }
      };

      const getRoleSpecificSuggestions = () => {
        if (!user) return ['How do I get started?', 'What services do you offer?', 'Contact support'];
        
        switch (user.role) {
          case 'individual':
            return ['Check symptoms', 'Find nearby pharmacies', 'Medicine information', 'Upload prescription'];
          case 'retail':
            return ['Inventory alerts', 'Sales analysis', 'Reorder suggestions', 'Customer trends'];
          case 'wholesale':
            return ['Inventory overview', 'Retailer performance', 'Market insights', 'Bulk pricing'];
          case 'lab':
            return ['Interpret test results', 'Normal value ranges', 'Appointment scheduling', 'Lab equipment'];
          case 'admin':
            return ['User analytics', 'System status', 'Platform metrics', 'User management'];
          default:
            return ['How do I get started?', 'Platform features', 'Contact support'];
        }
      };

      const greeting: Message = {
        id: '1',
        type: 'bot',
        content: getRoleSpecificGreeting(),
        timestamp: new Date(),
        suggestions: getRoleSpecificSuggestions(),
        category: 'general'
      };
      setMessages([greeting]);
    }
  }, [isOpen, user]);

  const getSymptomCheckResponse = (symptoms: string): Message => {
    const commonSymptoms = {
      'fever': {
        advice: 'Fever can indicate infection. Monitor temperature, stay hydrated, and rest. Seek medical attention if fever exceeds 39°C (102°F) or persists.',
        urgency: 'moderate',
        suggestions: ['Find nearby pharmacies', 'Consult a doctor', 'Medicine for fever']
      },
      'headache': {
        advice: 'Headaches can have various causes. Ensure adequate hydration, rest in a quiet environment. Persistent or severe headaches warrant medical consultation.',
        urgency: 'low',
        suggestions: ['Pain relief medicines', 'Relaxation techniques', 'When to see a doctor']
      },
      'cough': {
        advice: 'Coughs can be due to infections, allergies, or other conditions. Stay hydrated, consider honey for throat soothing. Persistent cough needs medical evaluation.',
        urgency: 'moderate',
        suggestions: ['Cough medicines', 'Home remedies', 'Chest X-ray locations']
      },
      'chest pain': {
        advice: '⚠️ Chest pain can be serious. If you experience severe chest pain, difficulty breathing, or pain radiating to arms/jaw, seek immediate medical attention.',
        urgency: 'high',
        suggestions: ['Find emergency services', 'Call ambulance', 'Nearest hospital']
      }
    };

    const symptomKey = Object.keys(commonSymptoms).find(key => 
      symptoms.toLowerCase().includes(key)
    );

    if (symptomKey) {
      const symptomInfo = commonSymptoms[symptomKey as keyof typeof commonSymptoms];
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: `🩺 **Symptom Assessment: ${symptomKey.charAt(0).toUpperCase() + symptomKey.slice(1)}**\n\n${symptomInfo.advice}\n\n⚠️ **Important**: This is general guidance only. Always consult healthcare professionals for proper diagnosis and treatment.`,
        timestamp: new Date(),
        suggestions: symptomInfo.suggestions,
        category: 'symptom'
      };
    }

    return {
      id: Date.now().toString(),
      type: 'bot',
      content: '🩺 I understand you\'re experiencing symptoms. While I can provide general guidance, it\'s important to consult with healthcare professionals for proper diagnosis. Would you like me to help you find nearby healthcare providers or pharmacies?',
      timestamp: new Date(),
      suggestions: ['Find nearby doctors', 'Locate pharmacies', 'Emergency services', 'Book lab tests'],
      category: 'symptom'
    };
  };

  const getBusinessInsights = (query: string): Message => {
    const insights = {
      'inventory': 'Your current inventory shows 85% stock levels. Top-selling items this week: Paracetamol, Amoxicillin, Vitamin C. Consider reordering antibiotics as they\'re running low.',
      'sales': 'This month\'s sales are up 12% compared to last month. Peak hours: 9-11 AM and 3-5 PM. Top categories: Pain relief (35%), Antibiotics (28%), Vitamins (20%).',
      'reorder': 'Based on sales patterns, consider reordering: Paracetamol (500mg) - 200 units, Amoxicillin - 100 units, Multivitamins - 150 units. Expected delivery: 2-3 days.',
      'customers': 'Customer traffic analysis shows 45% repeat customers, 30% new patients, 25% prescription refills. Customer satisfaction: 4.6/5 stars.',
    };

    const insightKey = Object.keys(insights).find(key => 
      query.toLowerCase().includes(key)
    );

    if (insightKey) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: `📊 **Business Insight: ${insightKey.charAt(0).toUpperCase() + insightKey.slice(1)}**\n\n${insights[insightKey as keyof typeof insights]}`,
        timestamp: new Date(),
        suggestions: ['Detailed analytics', 'Generate report', 'Set up alerts', 'View trends'],
        category: 'business'
      };
    }

    return {
      id: Date.now().toString(),
      type: 'bot',
      content: '📊 I can help you with business insights including inventory management, sales analysis, customer trends, and reorder suggestions. What specific aspect would you like to explore?',
      timestamp: new Date(),
      suggestions: ['Inventory status', 'Sales report', 'Customer analytics', 'Reorder alerts'],
      category: 'business'
    };
  };

  const getLabResultInterpretation = (query: string): Message => {
    const labTests = {
      'blood glucose': {
        normal: 'Normal fasting glucose: 70-99 mg/dL',
        interpretation: 'Blood glucose levels indicate how well your body processes sugar. Elevated levels may suggest diabetes risk.',
        ranges: 'Normal: <100 mg/dL | Prediabetes: 100-125 mg/dL | Diabetes: ≥126 mg/dL'
      },
      'cholesterol': {
        normal: 'Total cholesterol should be <200 mg/dL',
        interpretation: 'Cholesterol levels help assess cardiovascular risk. Higher levels may require dietary changes or medication.',
        ranges: 'Desirable: <200 mg/dL | Borderline: 200-239 mg/dL | High: ≥240 mg/dL'
      },
      'hemoglobin': {
        normal: 'Normal Hb: Men 13.5-17.5 g/dL, Women 12.0-15.5 g/dL',
        interpretation: 'Hemoglobin carries oxygen in your blood. Low levels may indicate anemia.',
        ranges: 'Low: <12 g/dL (women), <13.5 g/dL (men) | Normal: See above | High: >15.5 g/dL (women), >17.5 g/dL (men)'
      }
    };

    const testKey = Object.keys(labTests).find(key => 
      query.toLowerCase().includes(key)
    );

    if (testKey) {
      const test = labTests[testKey as keyof typeof labTests];
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: `🔬 **Lab Result Interpretation: ${testKey.charAt(0).toUpperCase() + testKey.slice(1)}**\n\n**Normal Range**: ${test.normal}\n\n**What it means**: ${test.interpretation}\n\n**Reference Ranges**: ${test.ranges}\n\n⚠️ **Note**: Always discuss results with your healthcare provider for personalized interpretation.`,
        timestamp: new Date(),
        suggestions: ['Book follow-up test', 'Find specialist', 'Lifestyle recommendations', 'More lab tests'],
        category: 'lab'
      };
    }

    return {
      id: Date.now().toString(),
      type: 'bot',
      content: '🔬 I can help interpret common lab test results including blood glucose, cholesterol, hemoglobin, liver function, and more. Please specify which test result you\'d like me to explain, or upload your lab report for detailed interpretation.',
      timestamp: new Date(),
      suggestions: ['Blood glucose', 'Cholesterol levels', 'Complete blood count', 'Liver function'],
      category: 'lab'
    };
  };

  const getBotResponse = (userMessage: string): Message => {
    const message = userMessage.toLowerCase();
    
    // Role-based response routing
    if (user?.role === 'individual') {
      if (message.includes('symptom') || message.includes('pain') || message.includes('fever') || 
          message.includes('headache') || message.includes('cough') || message.includes('sick')) {
        return getSymptomCheckResponse(message);
      }
    }
    
    if ((user?.role === 'retail' || user?.role === 'wholesale') && 
        (message.includes('inventory') || message.includes('sales') || message.includes('business') || 
         message.includes('reorder') || message.includes('customer'))) {
      return getBusinessInsights(message);
    }
    
    if (user?.role === 'lab' && 
        (message.includes('test') || message.includes('result') || message.includes('blood') || 
         message.includes('lab') || message.includes('glucose') || message.includes('cholesterol'))) {
      return getLabResultInterpretation(message);
    }

    // General responses
    if (message.includes('order') || message.includes('place')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "To place an order: 1) Go to the Products page 📦 2) Browse or search for items 3) Add them to your cart 🛒 4) Review and checkout. You can also use bulk ordering for large quantities!",
        timestamp: new Date(),
        suggestions: ['How to add items to cart?', 'Bulk ordering process', 'Order approval workflow'],
        category: 'general'
      };
    }

    if (message.includes('hello') || message.includes('hi')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "Hello! 👋 Great to see you here. I'm your BEPAWA assistant, ready to help you make the most of our platform. What would you like to know about?",
        timestamp: new Date(),
        suggestions: ['Platform overview', 'Getting started guide', 'Key features'],
        category: 'general'
      };
    }

    // Default response
    return {
      id: Date.now().toString(),
      type: 'bot',
      content: "I understand you're asking about something specific! 🤔 I'm here to help with various aspects of BEPAWA based on your role. Could you rephrase your question or try one of the suggestions below?",
      timestamp: new Date(),
      suggestions: user?.role === 'individual' ? 
        ['Check symptoms', 'Find pharmacies', 'Medicine info'] :
        user?.role === 'retail' || user?.role === 'wholesale' ?
        ['Business insights', 'Inventory help', 'Sales data'] :
        user?.role === 'lab' ?
        ['Interpret results', 'Test ranges', 'Lab equipment'] :
        ['How to place an order?', 'Platform features', 'Contact support'],
      category: 'general'
    };
  };

  const handleSendMessage = async (content?: string) => {
    const messageContent = content || inputValue.trim();
    if (!messageContent) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageContent,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse = getBotResponse(messageContent);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'medical':
      case 'symptom':
        return <Stethoscope className="h-4 w-4" />;
      case 'business':
        return <TrendingUp className="h-4 w-4" />;
      case 'lab':
        return <FileText className="h-4 w-4" />;
      default:
        return <Bot className="h-4 w-4" />;
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
        <div className="absolute -top-3 -right-1 bg-orange-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
          <HelpCircle className="h-3 w-3" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[90vw]">
      <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-t-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">BEPAWA AI Assistant</CardTitle>
                <p className="text-sm text-white/80">
                  {user?.role === 'individual' ? 'Personal Health Assistant' :
                   user?.role === 'retail' || user?.role === 'wholesale' ? 'Business Assistant' :
                   user?.role === 'lab' ? 'Lab Results Interpreter' : 'Healthcare Assistant'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <ScrollArea className="h-80 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-2`}>
                    <div className={`p-2 rounded-full ${message.type === 'user' ? 'bg-primary-100 ml-2' : 'bg-gray-100 mr-2'}`}>
                      {message.type === 'user' ? (
                        <User className="h-4 w-4 text-primary-600" />
                      ) : (
                        getCategoryIcon(message.category)
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className={`p-3 rounded-lg ${
                        message.type === 'user' 
                          ? 'bg-primary-600 text-white' 
                          : message.category === 'symptom' 
                          ? 'bg-red-50 text-red-900 border border-red-200'
                          : message.category === 'business'
                          ? 'bg-blue-50 text-blue-900 border border-blue-200'
                          : message.category === 'lab'
                          ? 'bg-purple-50 text-purple-900 border border-purple-200'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                      </div>
                      {message.suggestions && (
                        <div className="flex flex-wrap gap-1">
                          {message.suggestions.map((suggestion, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs cursor-pointer hover:bg-primary-50 hover:border-primary-300 transition-colors"
                              onClick={() => handleSendMessage(suggestion)}
                            >
                              {suggestion}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex items-start space-x-2">
                  <div className="bg-gray-100 p-2 rounded-full mr-2">
                    <Bot className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>
          
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  user?.role === 'individual' ? "Ask about symptoms, medicines, or health..." :
                  user?.role === 'retail' || user?.role === 'wholesale' ? "Ask about inventory, sales, or business insights..." :
                  user?.role === 'lab' ? "Ask about test results or lab values..." :
                  "Ask me anything about BEPAWA..."
                }
                className="flex-1 border-gray-200 focus:border-primary-500 focus:ring-primary-500"
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isTyping}
                className="bg-primary-600 hover:bg-primary-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              AI-powered healthcare assistant • Always consult professionals for medical decisions
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatBot;
