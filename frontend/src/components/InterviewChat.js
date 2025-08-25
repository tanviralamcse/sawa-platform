import React, { useState, useEffect, useCallback } from 'react';
import { buildApiUrl } from '../config/api';

export default function InterviewChat({ chatThreadId, isOpen, onClose, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchMessages = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(buildApiUrl(`chat/threads/${chatThreadId}/messages/`), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.results || data);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  }, [chatThreadId]);

  useEffect(() => {
    if (isOpen && chatThreadId) {
      fetchMessages();
    }
  }, [isOpen, chatThreadId, fetchMessages]);

  // Close modal on escape key press
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.keyCode === 27) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // fetchMessages is now defined above as a stable callback

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(buildApiUrl(`chat/threads/${chatThreadId}/messages/`), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newMessage,
        }),
      });

      if (response.ok) {
        setNewMessage('');
        await fetchMessages(); // Refresh messages
      } else {
        alert('Failed to send message');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    e.stopPropagation();
    onClose();
  };

  if (!isOpen || !chatThreadId) return null;

  return (
    <>
      {/* Modal Backdrop */}
      <div 
        className="modal-backdrop"
        onClick={handleBackdropClick}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          zIndex: 9999,
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? 'visible' : 'hidden'
        }}
      />
      
      {/* Chat Modal Container */}
      <div 
        className="modal-popup-container"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10000,
          padding: '20px',
          pointerEvents: isOpen ? 'auto' : 'none'
        }}
      >
        <div 
          className="chat-modal-content"
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: 'white',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '800px',
            height: '600px',
            overflow: 'hidden',
            boxShadow: '0 32px 64px rgba(0, 0, 0, 0.2)',
            transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(40px)',
            opacity: isOpen ? 1 : 0,
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Chat Header */}
          <div 
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '24px 32px',
              borderBottom: '1px solid #e5e7eb',
              background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)'
            }}
          >
            <h2 
              style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1e40af',
                margin: 0
              }}
            >
              💬 Interview Chat
            </h2>
            <button 
              onClick={onClose}
              style={{
                background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                border: '1px solid #d1d5db',
                color: '#6b7280',
                cursor: 'pointer',
                padding: '12px',
                borderRadius: '12px',
                fontSize: '18px',
                width: '44px',
                height: '44px'
              }}
            >
              ×
            </button>
          </div>

          {/* Messages Area */}
          <div 
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '24px',
              backgroundColor: '#f9fafb'
            }}
          >
            {messages.length === 0 ? (
              <div 
                style={{
                  textAlign: 'center',
                  color: '#6b7280',
                  padding: '40px',
                  fontSize: '1.1rem'
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💭</div>
                <p>Start the conversation! This is where you can discuss the project details and conduct the interview.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {messages.map((message, index) => (
                  <div 
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: message.from_user === currentUser?.id ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div 
                      style={{
                        maxWidth: '70%',
                        padding: '12px 16px',
                        borderRadius: '18px',
                        backgroundColor: message.from_user === currentUser?.id ? '#3b82f6' : 'white',
                        color: message.from_user === currentUser?.id ? 'white' : '#374151',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        wordBreak: 'break-word'
                      }}
                    >
                      <p style={{ margin: 0, lineHeight: '1.5' }}>{message.content}</p>
                      <div 
                        style={{
                          fontSize: '0.75rem',
                          opacity: 0.7,
                          marginTop: '4px',
                          textAlign: message.from_user === currentUser?.id ? 'right' : 'left'
                        }}
                      >
                        {new Date(message.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Message Input */}
          <div 
            style={{
              padding: '24px',
              borderTop: '1px solid #e5e7eb',
              backgroundColor: 'white'
            }}
          >
            <form onSubmit={sendMessage} style={{ display: 'flex', gap: '12px' }}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
              <button 
                type="submit"
                disabled={loading || !newMessage.trim()}
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  background: loading || !newMessage.trim() 
                    ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)' 
                    : 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                  color: 'white',
                  borderRadius: '12px',
                  fontWeight: '600',
                  cursor: loading || !newMessage.trim() ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '1rem'
                }}
              >
                {loading ? '⏳' : '📤'} Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
