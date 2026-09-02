import React, { useState, useRef, useEffect } from 'react';
import { Send, Settings, HelpCircle, FileText, Menu, Sparkles, MessageSquare, Book, BarChart, History, User } from 'lucide-react';

const INITIAL_DATA = [
  {
    id: 1,
    problem: "Write an code for Factorial function in js",
    solution_1: "Here's a simple implementation of a factorial function in JavaScript using both iter.",
    solution_2: "Certainly! Below is a Javascript function to calculate the factorial of a given numb",
    judge: {
      solution_1_score: 10,
      solution_2_score: 8,
      solution_1_reasoning: "Solution 1 is excellent because it provides three different ways to so",
      solution_2_reasoning: "Solution 2 is less optimal because..."
    }
  }
];

export default function ChatApp() {
  const [messages, setMessages] = useState(INITIAL_DATA);
  const [inputValue, setInputValue] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      problem: inputValue,
      solution_1: "This is a placeholder for Solution 1 based on your prompt: " + inputValue,
      solution_2: "This is a placeholder for Solution 2 based on your prompt: " + inputValue,
      judge: {
        solution_1_score: 9,
        solution_2_score: 7,
        solution_1_reasoning: "Solution 1 provides a clear and concise approach.",
        solution_2_reasoning: "Solution 2 lacks some necessary edge case handling."
      }
    };
    
    setMessages([...messages, newMessage]);
    setInputValue('');
  };

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] h-screen flex overflow-hidden font-sans">
      {/* Sidebar - Desktop */}
      <nav className="hidden md:flex flex-col p-4 w-64 bg-[#eceef0] border-r border-[#e0e3e5] h-full shrink-0">
        <div className="flex items-center gap-3 mb-8 px-2 mt-2">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
            <Sparkles size={16} />
          </div>
          <div>
            <h2 className="text-lg font-semibold leading-tight">Zenith AI</h2>
            <p className="text-xs text-[#464554]">Evaluation Chat</p>
          </div>
        </div>
        
        <button 
          onClick={() => setMessages([])}
          className="mb-8 bg-[#4648d4] text-white py-2.5 px-4 rounded-xl text-sm font-medium hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2 w-full shadow-sm"
        >
          <span className="text-lg leading-none">+</span> New Session
        </button>
        
        <ul className="flex-1 flex flex-col gap-1.5">
          <li>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 bg-[#a6b5fd]/20 text-[#354585] rounded-xl text-sm font-medium transition-transform">
              <MessageSquare size={18} /> Current Chat
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-[#464554] hover:bg-[#e0e3e5] rounded-xl text-sm font-medium transition-all">
              <Book size={18} /> Library
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-[#464554] hover:bg-[#e0e3e5] rounded-xl text-sm font-medium transition-all">
              <BarChart size={18} /> Analytics
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-[#464554] hover:bg-[#e0e3e5] rounded-xl text-sm font-medium transition-all">
              <History size={18} /> Archives
            </a>
          </li>
        </ul>
        
        <ul className="flex flex-col gap-2 mt-auto pt-4 border-t border-[#e0e3e5]">
          <li>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-[#464554] hover:bg-[#e0e3e5] rounded-xl text-sm font-medium transition-all">
              <Settings size={18} /> Settings
            </a>
          </li>
        </ul>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-full relative">
        {/* Top Header */}
        <header className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center px-6 py-4 bg-[#f7f9fb]/90 backdrop-blur-md">
          <div className="flex items-center gap-2 md:hidden">
            <Menu size={24} className="text-[#464554]" />
            <span className="text-lg font-semibold text-[#4648d4]">Zenith AI</span>
          </div>
          <div className="hidden md:block" /> {/* spacer */}
          <div className="flex items-center gap-4">
            <button className="text-[#767586] hover:text-[#4648d4] transition-colors"><Settings size={20} /></button>
            <button className="text-[#767586] hover:text-[#4648d4] transition-colors"><HelpCircle size={20} /></button>
            <div className="w-8 h-8 rounded-full bg-slate-300 ml-2 overflow-hidden border border-[#c7c4d7]">
              <div className="w-full h-full bg-slate-200 flex items-center justify-center text-[#464554]"><User size={16} /></div>
            </div>
          </div>
        </header>

        {/* Scrollable Chat Canvas */}
        <div className="flex-1 overflow-y-auto pt-20 pb-40 px-4 md:px-8">
          <div className="max-w-4xl mx-auto flex flex-col gap-10 mt-4">
            
            {messages.length === 0 && (
              <div className="text-center mt-32 text-[#464554]">
                <Sparkles size={48} className="mx-auto text-indigo-300 mb-6" />
                <h2 className="text-2xl font-semibold mb-3 text-[#191c1e]">Welcome to Zenith AI</h2>
                <p className="text-base text-[#767586] max-w-md mx-auto">Send a problem to get multi-model solutions and an autonomous judge's verdict side-by-side.</p>
              </div>
            )}

            {messages.map((msg) => (
              <div key={msg.id} className="flex flex-col gap-6 animate-fadeIn">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="bg-white border border-[#e0e3e5] text-[#191c1e] px-5 py-3.5 rounded-2xl rounded-tr-sm max-w-[85%] shadow-sm">
                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.problem}</p>
                  </div>
                </div>

                {/* AI Response Block */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100">
                      <Sparkles size={14} className="text-indigo-500" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#767586]">Zenith AI</span>
                  </div>
                  
                  <p className="text-[15px] text-[#464554] mb-1 md:pl-11">Here are two proposed solutions and my recommendation.</p>

                  {/* Solutions Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:pl-11">
                    {/* Solution 1 */}
                    <div className="bg-[#eceef0] border border-[#e0e3e5] rounded-[20px] p-5 flex flex-col shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-semibold text-[#191c1e]">Solution 1</h3>
                        <span className="bg-[#e0e3e5] text-[#464554] px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide">Model A</span>
                      </div>
                      <div className="bg-white rounded-xl p-4 border border-[#e0e3e5] overflow-x-auto flex-1">
                        <code className="font-mono text-[13px] text-[#464554] whitespace-pre-wrap leading-relaxed">
                          {msg.solution_1}
                        </code>
                      </div>
                    </div>

                    {/* Solution 2 */}
                    <div className="bg-[#eceef0] border border-[#e0e3e5] rounded-[20px] p-5 flex flex-col shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-semibold text-[#191c1e]">Solution 2</h3>
                        <span className="bg-[#e1e0ff] text-[#07006c] px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide">Model B</span>
                      </div>
                      <div className="bg-white rounded-xl p-4 border border-[#e0e3e5] overflow-x-auto flex-1">
                        <code className="font-mono text-[13px] text-[#464554] whitespace-pre-wrap leading-relaxed">
                          {msg.solution_2}
                        </code>
                      </div>
                    </div>
                  </div>

                  {/* Judge's Recommendation */}
                  <div className="mt-2 md:pl-11">
                    <div className="bg-white rounded-[20px] p-6 border border-[#e0e3e5] relative overflow-hidden shadow-sm">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>
                      <div className="flex items-center gap-2 mb-5">
                        <Sparkles className="text-indigo-500" size={18} />
                        <h4 className="text-sm font-semibold text-[#191c1e]">Judge's Recommendation</h4>
                      </div>
                      
                      <div className="flex flex-col lg:flex-row gap-8">
                        <div className="flex-1 flex flex-col">
                          <p className="text-[14px] text-[#464554] mb-4 flex-1 leading-relaxed">
                            <strong className="text-[#191c1e] font-semibold">Solution 1:</strong> {msg.judge.solution_1_reasoning}
                          </p>
                          <div className="flex items-center gap-3">
                            <div className="h-2 flex-1 bg-[#eceef0] rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out" style={{ width: `${(msg.judge.solution_1_score / 10) * 100}%` }}></div>
                            </div>
                            <span className="text-sm text-indigo-600 font-bold w-8 text-right">{msg.judge.solution_1_score}/10</span>
                          </div>
                        </div>

                        <div className="w-px bg-[#e0e3e5] hidden lg:block"></div>
                        <div className="h-px bg-[#e0e3e5] lg:hidden w-full my-1"></div>

                        <div className="flex-1 flex flex-col">
                          <p className="text-[14px] text-[#464554] mb-4 flex-1 leading-relaxed">
                            <strong className="text-[#191c1e] font-semibold">Solution 2:</strong> {msg.judge.solution_2_reasoning}
                          </p>
                          <div className="flex items-center gap-3">
                            <div className="h-2 flex-1 bg-[#eceef0] rounded-full overflow-hidden">
                              <div className="h-full bg-[#4b5a9c] rounded-full transition-all duration-1000 ease-out" style={{ width: `${(msg.judge.solution_2_score / 10) * 100}%` }}></div>
                            </div>
                            <span className="text-sm text-[#4b5a9c] font-bold w-8 text-right">{msg.judge.solution_2_score}/10</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={bottomRef} className="h-4" />
          </div>
        </div>

        {/* Floating Input Area */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-[#f7f9fb] via-[#f7f9fb]/95 to-transparent pt-16">
          <div className="max-w-3xl mx-auto relative">
            <div className="bg-white border border-[#e0e3e5] rounded-2xl shadow-lg flex items-end p-2 transition-shadow focus-within:shadow-xl focus-within:border-indigo-300">
              <button className="p-3 text-[#767586] hover:text-indigo-500 transition-colors rounded-xl flex-shrink-0">
                <FileText size={20} />
              </button>
              <textarea 
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-3.5 px-2 text-[15px] text-[#191c1e] placeholder:text-[#767586] outline-none" 
                placeholder="Message Zenith..." 
                rows="1"
                style={{ height: '52px' }}
              />
              <button 
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="p-3 bg-[#4648d4] text-white rounded-xl ml-2 hover:opacity-90 disabled:opacity-50 disabled:bg-[#c7c4d7] transition-all flex items-center justify-center flex-shrink-0 mb-[2px]"
              >
                <Send size={18} />
              </button>
            </div>
            <div className="text-center mt-3">
              <span className="text-[11px] text-[#767586]">Zenith AI can make mistakes. Consider verifying important information.</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
