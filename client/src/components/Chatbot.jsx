import React, { useState, useRef, useEffect } from 'react';

const Chatbot = ({ language, generatedCode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: input,
                    code: generatedCode,
                    language: language
                })
            });

            const data = await response.json();
            const botMessage = { role: 'assistant', content: data.response };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage = {
                role: 'assistant',
                content: language === 'hi'
                    ? 'क्षमा करें, कुछ गलत हो गया।'
                    : 'Sorry, something went wrong.'
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Floating Chat Button */}
            <button
                className="chatbot-toggle"
                onClick={() => setIsOpen(!isOpen)}
                title={language === 'hi' ? 'सहायता चैट' : 'Help Chat'}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                {messages.length > 0 && <span className="chat-badge">{messages.length}</span>}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <div>
                            <h3>{language === 'hi' ? 'विकास सहायक' : 'Development Assistant'}</h3>
                            <p>{language === 'hi' ? 'AI द्वारा संचालित' : 'AI Powered'}</p>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="close-chat">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    <div className="chatbot-messages">
                        {messages.length === 0 && (
                            <div className="chat-welcome">
                                <p>{language === 'hi'
                                    ? 'नमस्ते! मैं आपकी विकास संबंधी प्रश्नों में मदद कर सकता हूं।'
                                    : 'Hello! I can help you with development questions and explain the generated code.'}
                                </p>
                            </div>
                        )}

                        {messages.map((msg, idx) => (
                            <div key={idx} className={`chat-message ${msg.role}`}>
                                <div className="message-content">{msg.content}</div>
                            </div>
                        ))}

                        {loading && (
                            <div className="chat-message assistant">
                                <div className="message-content typing-indicator">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chatbot-input">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={language === 'hi' ? 'अपना प्रश्न पूछें...' : 'Ask your question...'}
                            rows="2"
                        />
                        <button onClick={handleSend} disabled={loading || !input.trim()}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;
