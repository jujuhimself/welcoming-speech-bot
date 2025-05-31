
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, X, Send, Bot, User, HelpCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
  suggestions?: string[];
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
      // Initial greeting
      const greeting: Message = {
        id: '1',
        type: 'bot',
        content: `Hello ${user?.name || 'there'}! 👋 I'm your BEPAWA assistant. I'm here to help you navigate the platform and answer any questions you might have.`,
        timestamp: new Date(),
        suggestions: [
          'How do I place an order?',
          'Where can I view my credit status?',
          'How to track my deliveries?',
          'What payment methods are available?'
        ]
      };
      setMessages([greeting]);
    }
  }, [isOpen, user?.name]);

  const getBotResponse = (userMessage: string): Message => {
    const message = userMessage.toLowerCase();
    let response = '';
    let suggestions: string[] = [];

    if (message.includes('order') || message.includes('place')) {
      response = "To place an order: 1) Go to the Products page 📦 2) Browse or search for items 3) Add them to your cart 🛒 4) Review and checkout. You can also use bulk ordering for large quantities!";
      suggestions = ['How to add items to cart?', 'Bulk ordering process', 'Order approval workflow'];
    } else if (message.includes('credit') || message.includes('payment')) {
      response = "You can check your credit status in the Credit Request section 💳. We offer NET 30 and NET 60 payment terms for approved pharmacies. You can also request credit limit increases there.";
      suggestions = ['How to request credit increase?', 'Payment terms explained', 'View payment history'];
    } else if (message.includes('delivery') || message.includes('track')) {
      response = "Track your deliveries in the Orders section 🚚. You'll see real-time updates, estimated delivery times, and can contact the delivery agent directly. We also provide GPS tracking for live location updates!";
      suggestions = ['Delivery time slots', 'Contact delivery agent', 'Delivery fees'];
    } else if (message.includes('payment method')) {
      response = "We accept multiple payment methods: M-Pesa 📱, Bank transfers 🏦, and Credit terms for approved pharmacies. You can set your preferred payment method in your profile settings.";
      suggestions = ['M-Pesa integration', 'Bank transfer details', 'Credit application'];
    } else if (message.includes('product') || message.includes('search')) {
      response = "Use our advanced product search 🔍! You can filter by category, price range, stock status, and more. We have over 1000+ medical products available with detailed descriptions and specifications.";
      suggestions = ['Product categories', 'Stock notifications', 'Product specifications'];
    } else if (message.includes('help') || message.includes('support')) {
      response = "I'm here to help! 🤝 You can also contact our support team directly, check our FAQ section, or explore the platform features. What specific area would you like assistance with?";
      suggestions = ['Contact support team', 'Platform tutorial', 'FAQ section'];
    } else if (message.includes('hello') || message.includes('hi')) {
      response = "Hello! 👋 Great to see you here. I'm your BEPAWA assistant, ready to help you make the most of our platform. What would you like to know about?";
      suggestions = ['Platform overview', 'Getting started guide', 'Key features'];
    } else {
      response = "I understand you're asking about something specific! 🤔 While I'm still learning, I can help you with orders, payments, deliveries, products, and general platform navigation. Could you rephrase your question or try one of the suggestions below?";
      suggestions = ['How to place an order?', 'Payment options', 'Track deliveries', 'Browse products'];
    }

    return {
      id: Date.now().toString(),
      type: 'bot',
      content: response,
      timestamp: new Date(),
      suggestions
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
                <CardTitle className="text-lg font-semibold">BEPAWA Assistant</CardTitle>
                <p className="text-sm text-white/80">Here to help you navigate</p>
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
                        <Bot className="h-4 w-4 text-gray-600" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className={`p-3 rounded-lg ${
                        message.type === 'user' 
                          ? 'bg-primary-600 text-white' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        <p className="text-sm leading-relaxed">{message.content}</p>
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
                placeholder="Ask me anything about BEPAWA..."
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
              Powered by BEPAWA AI Assistant
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatBot;
