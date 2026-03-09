/**
 * AI Assistant Component
 * Chat interface for AI-powered legal assistance
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, Bot, User, Lightbulb, History, Settings } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestions?: string[];
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

const suggestedQuestions = [
  "What are the essential elements of a valid contract?",
  "Explain the concept of judicial review in Nigerian law",
  "What is the difference between civil and criminal law?",
  "How does evidence law work in Nigerian courts?",
  "What are the steps in filing a civil lawsuit?",
  "Explain the doctrine of stare decisis"
];

const conversationHistory: Conversation[] = [
  {
    id: 'conv-1',
    title: 'Contract Law Basics',
    messages: [
      {
        id: '1',
        role: 'user',
        content: 'What are the essential elements of a valid contract?',
        timestamp: '2024-01-15T10:00:00Z',
      },
      {
        id: '2',
        role: 'assistant',
        content: `A valid contract requires five essential elements:

1. **Offer**: A clear proposal to enter into an agreement
2. **Acceptance**: Unconditional agreement to the terms of the offer
3. **Consideration**: Something of value exchanged between parties
4. **Capacity**: Legal ability to enter into a contract
5. **Legality**: The contract's purpose must be legal

Each element must be present for a contract to be enforceable under Nigerian law.`,
        timestamp: '2024-01-15T10:00:05Z',
        suggestions: [
          'Can you give me an example of consideration?',
          'What happens if one element is missing?',
          'How does this apply to business contracts?'
        ]
      }
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:05Z'
  }
];

export default function AIAssistant() {
  const [currentConversation, setCurrentConversation] = useState<Conversation>({
    id: 'conv-new',
    title: 'New Conversation',
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock AI responses based on keywords
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('contract')) {
      return `Regarding contracts, it's important to understand that under Nigerian law, contracts must meet specific criteria to be enforceable. The Contract Act of 1950 provides the legal framework, and courts generally follow common law principles.

Key points to remember:
- Contracts can be oral or written
- Certain contracts must be in writing (e.g., land transactions)
- The burden of proof is on the party alleging breach
- Damages are the primary remedy for breach

Would you like me to elaborate on any specific aspect of contract law?`;
    } else if (lowerMessage.includes('constitutional')) {
      return `Constitutional law forms the foundation of Nigeria's legal system. The 1999 Constitution establishes the structure of government, fundamental rights, and the relationship between different levels of government.

Important constitutional principles include:
- Supremacy of the Constitution
- Separation of powers
- Rule of law
- Fundamental human rights
- Federalism

The Supreme Court has final jurisdiction on constitutional matters. Is there a specific constitutional issue you'd like to explore?`;
    } else {
      return `I understand you're asking about: "${userMessage}". This is an important legal topic that requires careful consideration.

In Nigerian legal practice, this issue is governed by relevant statutes and case law. The courts have established precedents that help guide how such matters are handled.

To provide you with the most accurate and helpful response, could you provide more specific details about your situation or the particular aspect you'd like to explore?`;
    }
  };

  const generateSuggestions = (message: string): string[] => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('contract')) {
      return [
        'What makes a contract void vs voidable?',
        'How are damages calculated for breach?',
        'Can oral contracts be enforced?'
      ];
    } else if (lowerMessage.includes('constitutional')) {
      return [
        'What are fundamental human rights?',
        'How does judicial review work?',
        'What is the doctrine of separation of powers?'
      ];
    } else {
      return [
        'Can you explain this in simpler terms?',
        'What are the practical implications?',
        'Are there any recent cases on this?'
      ];
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setCurrentConversation(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      updatedAt: new Date().toISOString()
    }));

    setInputMessage('');
    setShowSuggestions(false);
    setIsTyping(true);

    try {
      const aiResponse = await generateAIResponse(inputMessage);
      
      const assistantMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString(),
        suggestions: generateSuggestions(inputMessage)
      };

      setCurrentConversation(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        updatedAt: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error generating AI response:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputMessage(question);
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
    inputRef.current?.focus();
  };

  const loadConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation);
    setShowHistory(false);
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden h-[600px] flex flex-col">
      {/* Header */}
      <div className="border-b border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bot className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-lg font-semibold text-slate-900">AI Legal Assistant</h2>
              <p className="text-sm text-slate-600">Get help with legal questions and concepts</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <History className="h-5 w-5 text-slate-600" />
            </button>
            <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
              <Settings className="h-5 w-5 text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Conversation History Sidebar */}
        {showHistory && (
          <div className="w-64 border-r border-slate-200 bg-slate-50">
            <div className="p-4 border-b border-slate-200">
              <h3 className="font-medium text-slate-900">Conversation History</h3>
            </div>
            <div className="overflow-y-auto">
              <button
                onClick={() => {
                  setCurrentConversation({
                    id: 'conv-new',
                    title: 'New Conversation',
                    messages: [],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                  });
                  setShowHistory(false);
                }}
                className="w-full text-left p-4 hover:bg-slate-100 transition-colors border-b border-slate-200"
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">New Conversation</span>
                </div>
              </button>
              
              {conversationHistory.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => loadConversation(conv)}
                  className="w-full text-left p-4 hover:bg-slate-100 transition-colors border-b border-slate-200"
                >
                  <h4 className="font-medium text-slate-900 text-sm truncate">{conv.title}</h4>
                  <p className="text-xs text-slate-600">
                    {conv.messages.length} messages • {new Date(conv.updatedAt).toLocaleDateString()}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {currentConversation.messages.length === 0 ? (
              <div className="text-center py-8">
                <Bot className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-600 mb-2">How can I help you today?</h3>
                <p className="text-sm text-slate-500 mb-6">Ask me anything about Nigerian law, legal concepts, or procedures</p>
                
                {/* Suggested Questions */}
                {showSuggestions && (
                  <div className="max-w-2xl mx-auto">
                    <h4 className="text-sm font-medium text-slate-700 mb-3">Suggested questions:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {suggestedQuestions.map((question, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestedQuestion(question)}
                          className="text-left p-3 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors text-sm"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              currentConversation.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-blue-600" />
                    </div>
                  )}
                  
                  <div className={`max-w-2xl ${message.role === 'user' ? 'order-first' : ''}`}>
                    <div
                      className={`p-3 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-900'
                      }`}
                    >
                      <p className="whitespace-pre-line">{message.content}</p>
                    </div>
                    
                    {/* Suggestions */}
                    {message.suggestions && (
                      <div className="mt-2 space-y-1">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="text-left p-2 bg-white border border-slate-200 rounded text-sm hover:bg-slate-50 transition-colors w-full"
                          >
                            💡 {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    <p className="text-xs text-slate-500 mt-1">
                      {formatTimestamp(message.timestamp)}
                    </p>
                  </div>
                  
                  {message.role === 'user' && (
                    <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-slate-600" />
                    </div>
                  )}
                </div>
              ))
            )}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-blue-600" />
                </div>
                <div className="bg-slate-100 p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-slate-200 p-4">
            <div className="flex gap-3">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask your legal question..."
                className="flex-1 resize-none border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                disabled={isTyping}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
              <span>Press Enter to send, Shift+Enter for new line</span>
              <span>AI responses are for informational purposes only</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
