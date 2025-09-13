import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Send, 
  Calendar, 
  MapPin, 
  Utensils, 
  BookOpen, 
  FileText,
  GraduationCap,
  Clock,
  Users
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  category?: string;
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  category: string;
  description: string;
}

const quickActions: QuickAction[] = [
  {
    id: 'schedule',
    label: 'Class Schedules',
    icon: <Calendar className="w-4 h-4" />,
    category: 'academics',
    description: 'View your class timetable and academic calendar'
  },
  {
    id: 'dining',
    label: 'Dining Services',
    icon: <Utensils className="w-4 h-4" />,
    category: 'services',
    description: 'Menu, hours, and dining hall locations'
  },
  {
    id: 'library',
    label: 'Library Services',
    icon: <BookOpen className="w-4 h-4" />,
    category: 'services',
    description: 'Hours, reservations, and research help'
  },
  {
    id: 'facilities',
    label: 'Campus Facilities',
    icon: <MapPin className="w-4 h-4" />,
    category: 'campus',
    description: 'Building locations and facility information'
  },
  {
    id: 'admin',
    label: 'Administrative',
    icon: <FileText className="w-4 h-4" />,
    category: 'admin',
    description: 'Registration, transcripts, and forms'
  },
  {
    id: 'events',
    label: 'Campus Events',
    icon: <Users className="w-4 h-4" />,
    category: 'campus',
    description: 'Upcoming events and activities'
  }
];

// Mock responses for different categories
const mockResponses = {
  schedule: "📅 **Your Class Schedule for Today:**\n\n• **CS 101** - Introduction to Programming\n  📍 Room: Engineering Hall 205\n  ⏰ Time: 9:00 AM - 10:30 AM\n\n• **MATH 201** - Calculus II\n  📍 Room: Mathematics Building 101\n  ⏰ Time: 2:00 PM - 3:30 PM\n\n• **ENG 102** - English Composition\n  📍 Room: Liberal Arts 302\n  ⏰ Time: 4:00 PM - 5:30 PM\n\nNeed to check a different day or semester schedule?",
  
  dining: "🍽️ **Dining Services - Today's Information:**\n\n**Main Cafeteria**\n⏰ Hours: 7:00 AM - 9:00 PM\n🍳 Breakfast: 7:00 AM - 11:00 AM\n🍕 Lunch: 11:00 AM - 3:00 PM\n🥘 Dinner: 5:00 PM - 9:00 PM\n\n**Featured Today:** Mediterranean Bowl, BBQ Chicken, Vegan Curry\n\n**Campus Café**\n⏰ Hours: 8:00 AM - 6:00 PM\n☕ Coffee, sandwiches, and light meals\n\nMeal plan balance and nutritional info available in the dining app!",
  
  library: "📚 **Library Services:**\n\n**Main Library Hours:**\n• Monday-Thursday: 7:00 AM - 12:00 AM\n• Friday: 7:00 AM - 8:00 PM\n• Saturday: 10:00 AM - 6:00 PM\n• Sunday: 12:00 PM - 12:00 AM\n\n**Available Services:**\n📖 Study rooms (reserve online)\n🖥️ Computer lab access\n📝 Research assistance\n📄 Printing services\n💡 Tutoring center\n\n**Quick Links:**\n• Reserve study room\n• Check book availability\n• Access digital resources\n\nNeed help with research or finding specific materials?",
  
  facilities: "🏛️ **Campus Facilities:**\n\n**Key Buildings:**\n• 🏫 Student Union - Center of campus\n• 🧪 Science Complex - North campus\n• 📚 Main Library - Central quad\n• 🏃‍♂️ Recreation Center - South campus\n• 🏥 Health Center - Near dorms\n\n**Services:**\n🚗 Parking permits and maps\n🚌 Shuttle schedule\n♿ Accessibility services\n🔧 Maintenance requests\n\n**Recreation Center:**\n⏰ Hours: 6:00 AM - 11:00 PM\n🏋️‍♀️ Gym, pool, courts available\n\nNeed directions to a specific building or service?",
  
  admin: "📋 **Administrative Services:**\n\n**Registrar's Office:**\n• 📝 Course registration\n• 📜 Official transcripts\n• 🎓 Graduation applications\n⏰ Hours: 8:00 AM - 5:00 PM (Mon-Fri)\n\n**Student Accounts:**\n• 💳 Tuition payments\n• 🏠 Housing contracts\n• 📊 Financial aid status\n\n**Quick Actions:**\n• Request transcript\n• Update personal info\n• View academic record\n• Submit forms online\n\n**Contact:** admin@university.edu | (555) 123-4567\n\nWhat specific administrative task can I help you with?",
  
  events: "🎉 **Upcoming Campus Events:**\n\n**This Week:**\n\n**Today (March 15)**\n• 🎵 Jazz Concert - 7:00 PM, Student Union\n• 📚 Study Group Fair - 12:00 PM, Library\n\n**Tomorrow (March 16)**\n• ⚽ Soccer Game vs. State - 3:00 PM, Stadium\n• 🍕 Pizza Night - 6:00 PM, Residence Halls\n\n**Weekend (March 18-19)**\n• 🎨 Art Exhibition Opening - Saturday 2:00 PM\n• 🏃‍♀️ Fun Run for Charity - Sunday 9:00 AM\n\n**Career Fair** - March 22-23, Career Center\n\nWant details about any specific event or category?",
  
  default: "Hello! I'm your Campus Assistant. I can help you with:\n\n• 📅 Class schedules and academic calendar\n• 🍽️ Dining services and menus\n• 📚 Library hours and services\n• 🏛️ Campus facilities and locations\n• 📋 Administrative procedures\n• 🎉 Campus events and activities\n\nClick on any quick action below or ask me a specific question!"
};

export default function CampusAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: mockResponses.default,
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleQuickAction = (action: QuickAction) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: `Show me ${action.label.toLowerCase()}`,
      isUser: true,
      timestamp: new Date(),
      category: action.category
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Simulate AI response
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        const response: Message = {
          id: (Date.now() + 1).toString(),
          text: mockResponses[action.id as keyof typeof mockResponses] || mockResponses.default,
          isUser: false,
          timestamp: new Date(),
          category: action.category
        };
        setMessages(prev => [...prev, response]);
        setIsTyping(false);
      }, 1500);
    }, 300);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        const response: Message = {
          id: (Date.now() + 1).toString(),
          text: "I understand you're asking about campus services. Let me help you with that! You can use the quick actions above for common queries, or feel free to ask me anything specific about campus life, academics, or services.",
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, response]);
        setIsTyping(false);
      }, 1500);
    }, 300);
  };

  const formatMessageText = (text: string) => {
    return text.split('\n').map((line, index) => (
      <div key={index} className={line.trim() === '' ? 'h-2' : ''}>
        {line.includes('**') ? (
          line.split('**').map((part, i) => 
            i % 2 === 1 ? <strong key={i}>{part}</strong> : part
          )
        ) : (
          line
        )}
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-gradient-hero shadow-soft">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 text-white">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Campus Assistant</h1>
              <p className="text-white/90 text-sm">Your AI-powered campus information helper</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Quick Actions */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                className="h-auto p-4 justify-start text-left hover:shadow-chat transition-smooth hover:border-primary/30 hover:bg-accent/50"
                onClick={() => handleQuickAction(action)}
              >
                <div className="flex items-start gap-3 w-full">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary shrink-0">
                    {action.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-foreground">{action.label}</div>
                    <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {action.description}
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Chat Interface */}
        <Card className="shadow-elevated border-0 bg-card/50 backdrop-blur">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-primary" />
              Campus Chat
            </h3>
          </div>
          
          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${message.isUser ? 'order-2' : 'order-1'}`}>
                  <div className={`rounded-lg p-3 shadow-chat ${
                    message.isUser 
                      ? 'bg-gradient-primary text-white' 
                      : 'bg-card border border-border'
                  }`}>
                    <div className={`text-sm ${message.isUser ? 'text-white' : 'text-foreground'} whitespace-pre-wrap`}>
                      {formatMessageText(message.text)}
                    </div>
                    {message.category && (
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {message.category}
                      </Badge>
                    )}
                  </div>
                  <div className={`text-xs text-muted-foreground mt-1 ${message.isUser ? 'text-right' : 'text-left'}`}>
                    <Clock className="w-3 h-3 inline mr-1" />
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-card border border-border rounded-lg p-3 shadow-chat">
                  <div className="flex items-center gap-1">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">Assistant is typing...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border bg-muted/30">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask me about campus services, schedules, facilities..."
                className="bg-background border-border focus:border-primary transition-smooth"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!inputMessage.trim()}
                className="bg-gradient-primary hover:bg-primary text-primary-foreground shadow-soft transition-smooth px-4"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              💡 Tip: Use quick actions above for faster responses to common questions
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}