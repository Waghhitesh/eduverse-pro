'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Sparkles, FileText, Image as ImageIcon, BookOpen, Download } from 'lucide-react';
import { generatePDF, generateWord, generatePPT } from '@/lib/fileGenerator';

interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
  attachments?: string[];
  hasAction?: boolean;
  actionType?: 'download_pdf' | 'download_word' | 'download_ppt';
  actionData?: any;
}

interface ConversationContext {
  topic?: string;
  requestType?: 'pyq' | 'document' | 'summary' | 'help' | 'general';
  documentType?: 'pdf' | 'word' | 'ppt';
  hasProvidedDetails?: boolean;
  userDetails?: {
    title?: string;
    content?: string;
    sections?: string[];
    subject?: string;
  };
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'agent',
      content: "Hello! I'm your Student Helper Agent. I can help you with:\n\n• 📚 PYQ Analysis - I'll analyze patterns and predict questions\n• 📄 Create Documents (PDF, Word, PPT) - Just tell me the topic!\n• 🎨 Generate Images - Describe what you need\n• 📝 Summarize Notes - Upload or paste your content\n• ❓ Answer Questions - Ask me anything!\n\nWhat would you like help with?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [context, setContext] = useState<ConversationContext>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userInput = input;
    setInput('');
    setIsTyping(true);

    // Simulate processing delay
    setTimeout(() => {
      const response = generateIntelligentResponse(userInput, context);
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: response.message,
        timestamp: new Date(),
        hasAction: response.hasAction,
        actionType: response.actionType,
        actionData: response.actionData,
      };
      setMessages((prev) => [...prev, agentMessage]);
      setContext(response.newContext);
      setIsTyping(false);
    }, 1000);
  };

  const generateIntelligentResponse = (
    userInput: string,
    currentContext: ConversationContext
  ): {
    message: string;
    newContext: ConversationContext;
    hasAction?: boolean;
    actionType?: any;
    actionData?: any;
  } => {
    const input = userInput.toLowerCase();

    // Update context based on user input
    let newContext = { ...currentContext };

    // Check if user is answering a previous question
    if (currentContext.requestType === 'document' && !currentContext.hasProvidedDetails) {
      // User is providing details for document
      newContext.hasProvidedDetails = true;
      newContext.userDetails = {
        title: extractTitle(userInput) || 'Student Document',
        content: userInput,
        sections: extractSections(userInput),
      };

      const docType = currentContext.documentType || 'pdf';
      return {
        message: `Perfect! I'll create a ${docType.toUpperCase()} document for you titled "${newContext.userDetails.title}".\n\nClick the download button below to get your document!`,
        newContext,
        hasAction: true,
        actionType: `download_${docType}`,
        actionData: newContext.userDetails,
      };
    }

    // Detect PYQ request
    if (input.includes('pyq') || input.includes('previous year') || input.includes('past paper')) {
      newContext.requestType = 'pyq';
      const subject = extractSubject(userInput);

      if (subject) {
        return {
          message: `I'll help you analyze PYQ for ${subject}!\n\n**Analysis Overview:**\n\n1. **Most Frequent Topics** (Last 5 years):\n   • Units and Measurements (18%)\n   • Motion in a Straight Line (15%)\n   • Laws of Motion (22%)\n   • Work, Energy & Power (20%)\n   • System of Particles (25%)\n\n2. **Question Pattern:**\n   • Short Answer (1-2 marks): 40%\n   • Long Answer (3-5 marks): 35%\n   • Numerical Problems: 25%\n\n3. **High Probability Questions:**\n   • Derive equations of motion\n   • Newton's laws applications\n   • Work-energy theorem problems\n   • Conservation of momentum\n\n4. **Predicted Questions:**\n   • Numerical on projectile motion\n   • Derivation of kinetic energy formula\n   • Problems on collision\n\nWould you like a detailed PDF report of this analysis?`,
          newContext,
        };
      }

      return {
        message: "I'll analyze Previous Year Questions for you! Which subject do you need help with?\n\nFor example: Physics, Mathematics, Chemistry, Biology, etc.",
        newContext,
      };
    }

    // Detect document creation request
    if (input.includes('pdf') || input.includes('document') || input.includes('report') ||
      input.includes('word') || input.includes('ppt') || input.includes('presentation') ||
      input.includes('create') || input.includes('generate') || input.includes('make')) {

      newContext.requestType = 'document';

      // Determine document type
      if (input.includes('ppt') || input.includes('presentation') || input.includes('powerpoint')) {
        newContext.documentType = 'ppt';
      } else if (input.includes('word') || input.includes('doc')) {
        newContext.documentType = 'word';
      } else {
        newContext.documentType = 'pdf';
      }

      // Check if user provided topic in the same message
      const topic = extractTopic(userInput);
      if (topic && topic.length > 10) {
        newContext.hasProvidedDetails = true;
        newContext.userDetails = {
          title: extractTitle(userInput) || topic.substring(0, 50),
          content: topic,
          sections: extractSections(userInput) || ['Introduction', 'Main Content', 'Conclusion'],
        };

        return {
          message: `Great! I'll create a ${newContext.documentType?.toUpperCase()} document about "${newContext.userDetails.title}".\n\nClick the download button below to get your document!`,
          newContext,
          hasAction: true,
          actionType: `download_${newContext.documentType}`,
          actionData: newContext.userDetails,
        };
      }

      return {
        message: `I'll create a ${newContext.documentType?.toUpperCase()} for you!\n\nPlease tell me:\n1. What's the topic/title?\n2. What should the content cover?\n3. Any specific sections you want? (optional)\n\nYou can provide this all in your next message!`,
        newContext,
      };
    }

    // Detect summarization request
    if (input.includes('summarize') || input.includes('summary') || input.includes('notes')) {
      newContext.requestType = 'summary';
      return {
        message: "I'll summarize content for you! You can:\n\n1. **Paste your notes** directly in the next message\n2. **Upload files** using the paperclip button\n3. **Share a YouTube link** and I'll summarize the video\n\nWhat would you like to summarize?",
        newContext,
      };
    }

    // Detect image generation
    if (input.includes('image') || input.includes('picture') || input.includes('diagram') || input.includes('illustration')) {
      return {
        message: "I can help generate images! Please describe:\n\n• What type of image? (diagram, chart, illustration, etc.)\n• What should it show?\n• Any specific style or colors?\n• Size requirements?\n\nNote: For this demo, I'll guide you to use DALL-E or similar AI image generators. In a production version, this would integrate with image generation APIs!",
        newContext: { ...newContext, requestType: 'help' },
      };
    }

    // Answer general questions
    if (input.includes('what') || input.includes('how') || input.includes('why') ||
      input.includes('explain') || input.includes('?')) {

      // Provide actual answers to common academic questions
      if (input.includes('photosynthesis')) {
        return {
          message: "**Photosynthesis** is the process by which green plants convert light energy into chemical energy.\n\n**Equation:**\n6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂\n\n**Key Points:**\n• Occurs in chloroplasts\n• Two stages: Light reactions and Calvin cycle\n• Produces glucose and oxygen\n• Essential for all life on Earth\n\nWould you like a detailed PDF report on photosynthesis?",
          newContext: {},
        };
      }

      if (input.includes('newton') || input.includes('law of motion')) {
        return {
          message: "**Newton's Laws of Motion:**\n\n**1st Law (Inertia):** An object remains at rest or in uniform motion unless acted upon by a force.\n\n**2nd Law (F=ma):** The acceleration of an object is directly proportional to the net force and inversely proportional to its mass.\n\n**3rd Law (Action-Reaction):** For every action, there is an equal and opposite reaction.\n\nWould you like practice problems or a PDF summary?",
          newContext: {},
        };
      }

      if (input.includes('mitochondria')) {
        return {
          message: "**Mitochondria** - The powerhouse of the cell!\n\n**Functions:**\n• ATP production (cellular energy)\n• Cellular respiration\n• Regulates metabolic activity\n\n**Structure:**\n• Double membrane (outer and inner)\n• Cristae (folded inner membrane)\n• Matrix (contains enzymes)\n\n**Fun Fact:** Mitochondria have their own DNA!\n\nNeed more details or diagrams?",
          newContext: {},
        };
      }

      // Generic helpful response for other questions
      return {
        message: "I'd be happy to help answer that! However, for the best answer, could you:\n\n1. Be more specific about what you need\n2. Provide context (which subject/topic)\n3. Let me know if you need:\n   • A quick explanation\n   • Detailed notes\n   • Practice problems\n   • A PDF document\n\nOr you can use the Document Generator to create comprehensive study materials!",
        newContext: {},
      };
    }

    // Default helpful response
    return {
      message: "I'm here to help! Here's what I can do:\n\n✅ **Create Documents** - \"Create a PDF about Artificial Intelligence\"\n✅ **PYQ Analysis** - \"Analyze PYQ for Physics\"\n✅ **Answer Questions** - \"Explain photosynthesis\" or \"What is Newton's law?\"\n✅ **Summarize Content** - \"Summarize these notes...\"\n✅ **Generate Images** - \"Create a diagram of...\"\n\nJust tell me what you need!",
      newContext: {},
    };
  };

  // Helper functions
  const extractTopic = (text: string): string => {
    const patterns = [
      /(?:about|on|regarding|for)\s+(.+?)(?:\.|$)/i,
      /(?:create|make|generate)\s+(?:a|an)?\s*(?:pdf|doc|ppt|document|report)?\s*(?:about|on)?\s*"?([^".]+)"?/i,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    return '';
  };

  const extractTitle = (text: string): string => {
    const topic = extractTopic(text);
    if (topic) {
      return topic.split('.')[0].substring(0, 100);
    }
    return '';
  };

  const extractSections = (text: string): string[] => {
    if (text.includes('section') || text.includes('include')) {
      const match = text.match(/sections?:?\s*(.+)/i);
      if (match) {
        return match[1].split(/,|;|\n/).map(s => s.trim()).filter(Boolean);
      }
    }
    return ['Introduction', 'Main Content', 'Conclusion'];
  };

  const extractSubject = (text: string): string => {
    const subjects = ['physics', 'chemistry', 'mathematics', 'biology', 'english', 'history', 'geography', 'computer', 'economics'];
    for (const subject of subjects) {
      if (text.toLowerCase().includes(subject)) {
        return subject.charAt(0).toUpperCase() + subject.slice(1);
      }
    }
    return '';
  };

  const handleAction = async (actionType: string, actionData: any) => {
    try {
      const { title, content, sections } = actionData;
      const sectionArray = Array.isArray(sections) ? sections : ['Introduction', 'Main Content', 'Conclusion'];

      if (actionType === 'download_pdf') {
        await generatePDF(title, content, sectionArray);
      } else if (actionType === 'download_word') {
        await generateWord(title, content, sectionArray);
      } else if (actionType === 'download_ppt') {
        await generatePPT(title, content, sectionArray);
      }

      // Add confirmation message
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'agent',
          content: `✅ Your document has been downloaded! Check your Downloads folder.\n\nNeed anything else?`,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'agent',
          content: `❌ There was an error generating the file. Please try again or provide more details.`,
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`${message.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-agent'
                } animate-[slideIn_0.3s_ease-out]`}
            >
              <div className="flex items-start gap-3">
                {message.role === 'agent' && (
                  <div className="w-8 h-8 rounded-full gradient-academic flex items-center justify-center flex-shrink-0 mt-1">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>

                  {message.hasAction && message.actionType && message.actionData && (
                    <button
                      onClick={() => handleAction(message.actionType!, message.actionData)}
                      className="mt-3 btn-primary text-sm flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download {message.actionType.includes('pdf') ? 'PDF' : message.actionType.includes('word') ? 'Word' : 'PowerPoint'}
                    </button>
                  )}

                  <span className="text-xs opacity-70 mt-2 block">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="chat-bubble-agent">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-6 py-3 border-t border-slate-200 bg-slate-50/50">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setInput('Analyze PYQ for Mathematics')}
            className="btn-secondary text-sm whitespace-nowrap flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            PYQ Analysis
          </button>
          <button
            onClick={() => setInput('Create a PDF report about Artificial Intelligence')}
            className="btn-secondary text-sm whitespace-nowrap flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            Create PDF
          </button>
          <button
            onClick={() => setInput('Explain photosynthesis')}
            className="btn-secondary text-sm whitespace-nowrap flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Ask Question
          </button>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-slate-200 bg-white">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Try: 'Create a PDF about Machine Learning' or 'Explain Newton's Laws' or 'Analyze PYQ for Physics'"
            className="input-field pr-24 resize-none min-h-[60px] max-h-[200px]"
            rows={2}
          />
          <div className="absolute right-2 bottom-2 flex gap-2">
            <button
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Attach file"
            >
              <Paperclip className="w-5 h-5 text-slate-600" />
            </button>
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="btn-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
        <p className="text-xs text-slate-600 mt-2">
          Press Enter to send • Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
