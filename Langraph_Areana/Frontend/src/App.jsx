import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2, Bot } from 'lucide-react';
import axios from 'axios';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);

  // =========================
  // API CALL
  // =========================
  const invokeAi = async (message) => {
    console.log("🔥 Invoking AI...");
    console.log("📤 Message:", message);

    try {
      const response = await axios.post(
        'http://localhost:3000/invoke',
        {
          message: message
        }
      );

      console.log("✅ API Response:", response);
      console.log("📦 API Data:", response.data);

      return response.data;

    } catch (error) {
      console.error("❌ Error in Invoke AI:", error);

      if (error.response) {
        console.error("❌ Backend response:", error.response.data);
        console.error("❌ Status:", error.response.status);
      } else if (error.request) {
        console.error("❌ No response from backend:", error.request);
      } else {
        console.error("❌ Error:", error.message);
      }

      return null;
    }
  };


  // =========================
  // AUTO SCROLL
  // =========================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [messages, isLoading]);


  // =========================
  // SEND MESSAGE
  // =========================
  const handleSend = async () => {

    console.log("🔥 HANDLE SEND CALLED");
    console.log("📝 Input:", inputValue);
    console.log("⏳ Loading:", isLoading);

    if (!inputValue.trim() || isLoading) {
      console.log("⚠️ Returning because input is empty or loading");
      return;
    }

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue
    };

    // Show user message
    setMessages(prev => [
      ...prev,
      userMessage
    ]);

    // Save message before clearing input
    const messageToSend = inputValue;

    setInputValue('');
    setIsLoading(true);

    try {

      console.log("🚀 Calling backend with:", messageToSend);

      // IMPORTANT:
      // Actually wait for API response
      const apiResponse = await invokeAi(messageToSend);

      console.log("🔥 FINAL API RESPONSE:", apiResponse);

      if (!apiResponse) {
        console.log("❌ API returned null");
        return;
      }

      // Backend already returns:
      //
      // {
      //   message: "...",
      //   success: true,
      //   result: {...}
      // }
      //
      // Your UI expects msg.data[0].result
      // So just put backend response inside data array.

      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        data: [
          apiResponse
        ]
      };

      console.log("🤖 AI MESSAGE FOR UI:", aiResponse);

      setMessages(prev => [
        ...prev,
        aiResponse
      ]);

    } catch (error) {

      console.error("❌ Handle Send Error:", error);

    } finally {

      // VERY IMPORTANT
      // Loading will stop even if API throws an error
      setIsLoading(false);

    }
  };


  return (
    <div className="bg-[#f8fafc] text-[#0f172a] h-screen flex flex-col font-sans">

      {/* ================= HEADER ================= */}
      <header className="flex justify-center items-center px-6 py-5 bg-white border-b border-[#e2e8f0] shadow-sm shrink-0">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
            <Bot size={24} />
          </div>

          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            AI Solution Judge
          </h1>

        </div>

      </header>


      {/* ================= CHAT AREA ================= */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center">

        <div className="w-full max-w-5xl flex flex-col gap-8 pb-32">

          {/* Empty State */}

          {messages.length === 0 && !isLoading && (

            <div className="text-center mt-32 text-slate-500 animate-fadeIn">

              <Bot
                size={56}
                className="mx-auto text-indigo-300 mb-6"
              />

              <h2 className="text-3xl font-bold mb-4 text-slate-800">
                Ask a Question
              </h2>

              <p className="text-lg text-slate-500 max-w-md mx-auto">
                Submit a problem and our AI will generate two solutions,
                then independently judge and score them.
              </p>

            </div>

          )}


          {/* ================= MESSAGES ================= */}

          {messages.map((msg) => (

            <div
              key={msg.id}
              className="flex flex-col animate-fadeIn"
            >

              {/* USER MESSAGE */}

              {msg.type === 'user' ? (

                <div className="flex justify-end mb-8">

                  <div className="bg-slate-800 text-white px-6 py-4 rounded-3xl rounded-tr-sm max-w-[85%] shadow-md">

                    <p className="text-[17px] leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </p>

                  </div>

                </div>

              ) : (

                /* ================= AI RESPONSE ================= */

                <div className="flex flex-col gap-6 w-full">

                  {msg.data?.map((item, index) => {

                    const result = item?.result;

                    // Safety check
                    if (!result) {
                      return (
                        <div
                          key={index}
                          className="bg-red-50 border border-red-200 rounded-2xl p-5 text-red-700"
                        >
                          AI returned an invalid response.
                        </div>
                      );
                    }

                    return (

                      <div
                        key={index}
                        className="flex flex-col gap-8"
                      >

                        {/* ================= SOLUTIONS ================= */}

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


                          {/* SOLUTION 1 */}

                          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col">

                            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">

                              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">

                                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm">
                                  1
                                </span>

                                Solution One

                              </h3>

                            </div>

                            <div className="p-6 flex-1 overflow-x-auto">

                              <pre className="font-sans text-[15px] text-slate-600 whitespace-pre-wrap leading-relaxed bg-transparent p-0 m-0 border-none">

                                {result.solution_1}

                              </pre>

                            </div>

                          </div>


                          {/* SOLUTION 2 */}

                          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col">

                            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">

                              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">

                                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm">
                                  2
                                </span>

                                Solution Two

                              </h3>

                            </div>

                            <div className="p-6 flex-1 overflow-x-auto">

                              <pre className="font-sans text-[15px] text-slate-600 whitespace-pre-wrap leading-relaxed bg-transparent p-0 m-0 border-none">

                                {result.solution_2}

                              </pre>

                            </div>

                          </div>

                        </div>


                        {/* ================= JUDGE VERDICT ================= */}

                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 border border-indigo-100 shadow-sm">

                          <div className="flex items-center gap-3 mb-6">

                            <div className="p-2 bg-white rounded-xl shadow-sm border border-indigo-100">

                              <Sparkles
                                className="text-indigo-600"
                                size={24}
                              />

                            </div>

                            <h4 className="text-2xl font-bold text-slate-800">
                              Judge's Verdict
                            </h4>

                          </div>


                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


                            {/* SOLUTION 1 JUDGE */}

                            <div className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm">

                              <div className="flex justify-between items-center mb-4">

                                <span className="font-bold text-slate-700 text-lg">
                                  Solution 1
                                </span>

                                <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100">

                                  <span className="text-sm font-semibold text-indigo-900">
                                    Score
                                  </span>

                                  <span className="text-xl font-bold text-indigo-600">
                                    {result.judge?.solution_1_score}/10
                                  </span>

                                </div>

                              </div>

                              <p className="text-[15px] text-slate-600 leading-relaxed">

                                {result.judge?.solution_1_reasoning}

                              </p>

                            </div>


                            {/* SOLUTION 2 JUDGE */}

                            <div className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm">

                              <div className="flex justify-between items-center mb-4">

                                <span className="font-bold text-slate-700 text-lg">
                                  Solution 2
                                </span>

                                <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100">

                                  <span className="text-sm font-semibold text-indigo-900">
                                    Score
                                  </span>

                                  <span className="text-xl font-bold text-indigo-600">
                                    {result.judge?.solution_2_score}/10
                                  </span>

                                </div>

                              </div>

                              <p className="text-[15px] text-slate-600 leading-relaxed">

                                {result.judge?.solution_2_reasoning}

                              </p>

                            </div>


                          </div>

                        </div>

                      </div>

                    );

                  })}

                </div>

              )}

            </div>

          ))}


          {/* ================= LOADING ================= */}

          {isLoading && (

            <div className="flex w-full animate-fadeIn">

              <div className="flex flex-col gap-3 max-w-md w-full">

                <div className="flex items-center gap-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">

                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100 flex-shrink-0">

                    <Loader2
                      size={20}
                      className="text-indigo-600 animate-spin"
                    />

                  </div>

                  <div className="flex flex-col">

                    <span className="font-semibold text-slate-700">
                      AI is evaluating...
                    </span>

                    <span className="text-sm text-slate-500">
                      Generating two solutions and scoring them
                    </span>

                  </div>

                </div>

              </div>

            </div>

          )}


          <div
            ref={bottomRef}
            className="h-8"
          />

        </div>

      </main>


      {/* ================= INPUT ================= */}

      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-[#f8fafc] via-[#f8fafc]/95 to-transparent pt-12">

        <div className="max-w-4xl mx-auto relative">

          <div className="bg-white border-2 border-slate-200 rounded-3xl shadow-lg flex items-end p-2 focus-within:border-indigo-400 focus-within:shadow-indigo-100 transition-all duration-300">

            <textarea

              value={inputValue}

              onChange={(e) => {

                setInputValue(e.target.value);

                e.target.style.height = 'auto';

                e.target.style.height =
                  `${Math.min(e.target.scrollHeight, 200)}px`;

              }}

              onKeyDown={(e) => {

                if (e.key === 'Enter' && !e.shiftKey) {

                  e.preventDefault();

                  handleSend();

                }

              }}

              className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-4 px-5 text-[16px] text-slate-800 placeholder:text-slate-400 outline-none"

              placeholder="Type your problem here..."

              rows="1"

              style={{
                height: '56px'
              }}

              disabled={isLoading}

            />


            <button

              onClick={handleSend}

              disabled={!inputValue.trim() || isLoading}

              className="p-4 bg-indigo-600 text-white rounded-2xl ml-2 hover:bg-indigo-700 disabled:opacity-50 disabled:bg-slate-300 transition-all flex items-center justify-center flex-shrink-0 mb-1 hover:scale-105 active:scale-95"

            >

              <Send size={20} />

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}
