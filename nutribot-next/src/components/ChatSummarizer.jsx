import React, { useState } from 'react';
import { MessageCircle, FileText, Send, Sparkles, Brain } from 'lucide-react';

export default function ChatSummarizer() {
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [summaryText, setSummaryText] = useState('');
  const [summary, setSummary] = useState('');

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      setMessages([...messages, { type: 'user', text: chatInput }]);

      // DUMMY RESPONSE - Replace this with actual LLaMA integration
      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: 'bot',
          text: 'Thank you for your question! I am MealHealth Assistant. This is a placeholder response. Your teammate will integrate the actual LLaMA model here.'
        }]);
      }, 1000);

      setChatInput('');
    }
  };

  const handleSummarize = () => {
    if (summaryText.trim()) {
      // DUMMY SUMMARIZATION - Replace this with actual model integration
      setSummary('Summary: This is a placeholder summary. Your teammate will integrate the actual summarization model here. The system will process the input text and generate a concise summary based on the content.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-xl">
              <Brain className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900">
              AI Assistant
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Chat with our AI for diet advice and summarize health articles
          </p>
          <div className="mt-4 px-6 py-3 bg-yellow-100 border-2 border-yellow-300 rounded-xl inline-block">
            <p className="text-sm font-semibold text-yellow-800">
              ⚠️ Note: This is a placeholder. Integrate your LLaMA model here.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Chatbot Panel */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-100">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-8">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                  <MessageCircle className="w-9 h-9 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white">Diet Chatbot</h2>
                  <p className="text-emerald-100">Powered by LLaMA (Local)</p>
                </div>
              </div>
            </div>

            <div className="h-[500px] overflow-y-auto p-8 space-y-4 bg-gradient-to-b from-white to-emerald-50/30">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center max-w-md">
                    <div className="w-32 h-32 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <Brain className="w-16 h-16 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Hi! I'm MealHealth Assistant 🥗
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      Ask me anything about healthy eating, meal planning, nutrition, or weight management!
                    </p>
                    <div className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
                      <p className="font-mono">
                        {'// TODO: Integrate LLaMA model'}<br />
                        {'// API endpoint: /api/chat'}<br />
                        {'// Model: llama-3-8b-local'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] px-6 py-4 rounded-3xl ${msg.type === 'user'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-br-md shadow-lg'
                      : 'bg-white border-2 border-emerald-200 text-gray-800 rounded-bl-md shadow-md'
                      }`}>
                      <p className="leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 bg-white border-t-2 border-emerald-100">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your question about diet..."
                  className="flex-1 px-6 py-4 border-2 border-emerald-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl hover:shadow-xl transition-all flex items-center gap-2 font-bold"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">
                Powered by your local LLaMA model
              </p>
            </div>
          </div>

          {/* Summarization Panel */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-blue-100">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-8">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                  <MessageCircle className="w-9 h-9 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white">Text Summarizer</h2>
                  <p className="text-blue-100">AI-powered summarization</p>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                  Paste Article or Text
                </label>
                <textarea
                  value={summaryText}
                  onChange={(e) => setSummaryText(e.target.value)}
                  placeholder="Paste your article about diet, nutrition, or health here to get a brief summary..."
                  className="w-full h-80 px-6 py-4 border-2 border-blue-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-800"
                />
                <p className="text-xs text-gray-400 mt-2">
                  Maximum 5000 characters
                </p>
              </div>

              <button
                onClick={handleSummarize}
                className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-2xl hover:shadow-xl transition-all font-bold text-lg"
              >
                Generate Summary
              </button>

              {summary && (
                <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-6 h-6 text-blue-600" />
                    <h3 className="font-black text-gray-900 text-lg">Summary Result</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-base">{summary}</p>
                  <div className="mt-4 text-xs text-gray-400 bg-white rounded-lg p-3">
                    <p className="font-mono">
                      {'// TODO: Integrate summarization model'}<br />
                      {'// API endpoint: /api/summarize'}<br />
                      {'// Model: bart-large-cnn'}
                    </p>
                  </div>
                </div>
              )}

              {!summary && (
                <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6">
                  <h4 className="font-bold text-gray-900 mb-3">Integration Notes:</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>Replace handleSummarize function with API call to your model</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>Add loading state during processing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>Handle errors and edge cases</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>Consider adding word count limits</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Integration Guide */}
        <div className="mt-12 bg-gray-900 text-white rounded-3xl p-8 shadow-2xl">
          <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
            <Brain className="w-8 h-8" />
            Integration Guide for Your Team
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-emerald-400 mb-3">Chatbot Integration (LLaMA)</h4>
              <div className="bg-gray-800 rounded-xl p-4 font-mono text-sm">
                <p className="text-gray-400 mb-2">{'// In handleSendMessage function:'}</p>
                <code className="text-emerald-300">
                  const response = await fetch('/api/chat', &#123;<br />
                  &nbsp;&nbsp;method: 'POST',<br />
                  &nbsp;&nbsp;body: JSON.stringify(&#123; message: chatInput &#125;)<br />
                  &#125;);<br />
                  const data = await response.json();<br />
                  setMessages([...prev, &#123; type: 'bot', text: data.response &#125;]);
                </code>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-blue-400 mb-3">Summarizer Integration</h4>
              <div className="bg-gray-800 rounded-xl p-4 font-mono text-sm">
                <p className="text-gray-400 mb-2">{'// In handleSummarize function:'}</p>
                <code className="text-blue-300">
                  const response = await fetch('/api/summarize', &#123;<br />
                  &nbsp;&nbsp;method: 'POST',<br />
                  &nbsp;&nbsp;body: JSON.stringify(&#123; text: summaryText &#125;)<br />
                  &#125;);<br />
                  const data = await response.json();<br />
                  setSummary(data.summary);
                </code>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-900/30 border-2 border-yellow-700 rounded-xl">
            <p className="text-yellow-200 text-sm">
              <strong>Note:</strong> This component is a placeholder. Replace the dummy responses with actual API calls to your LLaMA model and summarization model.
              Update the API endpoints, error handling, and loading states as needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
