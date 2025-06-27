
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Bot, User, Lightbulb, TrendingUp, Package } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const ChatbotAssistant = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hello! I'm your pharmacy assistant. I can help you with inventory insights, restock suggestions, and generate invoices. What would you like to know?",
      timestamp: new Date(),
      suggestions: [
        "Show me low stock items",
        "Generate sales report",
        "Suggest restocking priorities",
        "Create invoice template"
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (message?: string) => {
    const messageText = message || inputMessage.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Simulate bot response (in real implementation, this would call an AI service)
    setTimeout(() => {
      const botResponse = generateBotResponse(messageText);
      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const generateBotResponse = (userMessage: string): Message => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('low stock') || message.includes('restock')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "Based on your current inventory, I found 5 items that need restocking:\n\n• Paracetamol 500mg (3 units left)\n• Amoxicillin 250mg (1 unit left)\n• Vitamin C Tablets (8 units left)\n• Cough Syrup (2 units left)\n• Bandages (4 units left)\n\nWould you like me to help you create purchase orders for these items?",
        timestamp: new Date(),
        suggestions: ["Create purchase orders", "Show supplier contacts", "Set reorder points"]
      };
    }
    
    if (message.includes('sales') || message.includes('report')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "Here's your sales summary for today:\n\n📊 Total Sales: TZS 125,000\n📦 Items Sold: 45 units\n💰 Best Seller: Paracetamol 500mg\n📈 Growth: +15% vs yesterday\n\nYour top categories today:\n1. Pain Relief (40%)\n2. Antibiotics (25%)\n3. Vitamins (20%)\n4. First Aid (15%)",
        timestamp: new Date(),
        suggestions: ["Export detailed report", "Compare with last week", "View customer analytics"]
      };
    }
    
    if (message.includes('invoice') || message.includes('bill')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "I can help you create professional invoices! Here are your options:\n\n• Standard Invoice Template\n• Prescription Invoice Template\n• Bulk Order Invoice Template\n• Recurring Invoice Setup\n\nWhich type of invoice would you like to create?",
        timestamp: new Date(),
        suggestions: ["Standard invoice", "Prescription invoice", "View invoice history"]
      };
    }
    
    if (message.includes('profit') || message.includes('margin')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "Here's your profit analysis:\n\n💰 Today's Gross Profit: TZS 45,000\n📊 Average Margin: 36%\n\nTop Profit Makers:\n1. Generic Medications (45% margin)\n2. OTC Supplements (40% margin)\n3. Medical Supplies (32% margin)\n\n⚠️ Low Margin Alert: Brand medications showing 18% margin. Consider reviewing pricing strategy.",
        timestamp: new Date(),
        suggestions: ["Pricing recommendations", "Cost analysis", "Competitor comparison"]
      };
    }
    
    if (message.includes('staff') || message.includes('employee')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "Staff Performance Overview:\n\n👥 Active Staff: 4 members\n⏰ Today's Hours: 32 total\n🏆 Top Performer: Sarah (15 sales)\n\nDaily Tasks Completed:\n✅ Morning inventory check\n✅ Customer service training\n⏳ Evening stock count (pending)\n\nWould you like to assign new tasks or review performance metrics?",
        timestamp: new Date(),
        suggestions: ["Assign tasks", "Performance reports", "Schedule management"]
      };
    }

    // Default response
    return {
      id: Date.now().toString(),
      type: 'bot',
      content: "I understand you're asking about pharmacy operations. I can help you with:\n\n• Inventory management and stock alerts\n• Sales reporting and analytics\n• Invoice and billing assistance\n• Staff management insights\n• Restock recommendations\n• Profit margin analysis\n\nWhat specific area would you like to explore?",
      timestamp: new Date(),
      suggestions: [
        "Inventory insights",
        "Sales analytics", 
        "Create invoice",
        "Staff performance"
      ]
    };
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">AI Assistant</h2>
        <p className="text-gray-600">Get intelligent insights and assistance for your pharmacy operations</p>
      </div>

      <Card className="h-96">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Pharmacy Assistant Chat
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Messages Container */}
          <div className="h-64 overflow-y-auto space-y-3 p-2 border rounded-lg bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white border shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.type === 'bot' && <Bot className="h-4 w-4 mt-1 text-blue-500" />}
                    {message.type === 'user' && <User className="h-4 w-4 mt-1" />}
                    <div className="flex-1">
                      <div className="whitespace-pre-line text-sm">{message.content}</div>
                      <div className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  
                  {message.suggestions && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {message.suggestions.map((suggestion, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="cursor-pointer hover:bg-blue-50 text-xs"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border shadow-sm p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-blue-500" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me about your pharmacy operations..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
            />
            <Button 
              onClick={() => handleSendMessage()} 
              disabled={!inputMessage.trim() || isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleSendMessage("Show me inventory insights")}>
          <CardContent className="p-4 text-center">
            <Package className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <h3 className="font-medium">Inventory Insights</h3>
            <p className="text-sm text-gray-600">Get stock levels and reorder suggestions</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleSendMessage("Generate sales report")}>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <h3 className="font-medium">Sales Analytics</h3>
            <p className="text-sm text-gray-600">View performance and trends</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleSendMessage("Help me create an invoice")}>
          <CardContent className="p-4 text-center">
            <Lightbulb className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
            <h3 className="font-medium">Smart Assistance</h3>
            <p className="text-sm text-gray-600">Get help with daily operations</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatbotAssistant;
