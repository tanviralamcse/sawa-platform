import React, { useState, useEffect } from 'react';
import MessagingThread from '../components/MessagingThread';
import { buildApiUrl } from '../config/api';

export default function Messages() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(buildApiUrl('chat/conversations/'), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setConversations(data.results || data);
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.other_participant?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.other_participant?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.last_message?.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ConversationItem = ({ conversation }) => {
    const isSelected = selectedConversation?.id === conversation.id;
    const otherParticipant = conversation.other_participant;
    const lastMessage = conversation.last_message;
    const isUnread = conversation.unread_count > 0;

    return (
      <div 
        className={`conversation-item ${isSelected ? 'selected' : ''} ${isUnread ? 'unread' : ''}`}
        onClick={() => setSelectedConversation(conversation)}
      >
        <div className="conversation-avatar">
          <div className="avatar-circle">
            {otherParticipant?.first_name?.[0] || 'U'}
          </div>
          {isUnread && <div className="unread-indicator"></div>}
        </div>
        
        <div className="conversation-content">
          <div className="conversation-header">
            <h4 className="participant-name">
              {otherParticipant?.first_name} {otherParticipant?.last_name}
            </h4>
            <span className="conversation-time">
              {lastMessage && new Date(lastMessage.created_at).toLocaleDateString()}
            </span>
          </div>
          
          <div className="conversation-preview">
            <p className="last-message">
              {lastMessage?.content || 'No messages yet'}
            </p>
            {isUnread && (
              <span className="unread-count">{conversation.unread_count}</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (selectedConversation) {
    return (
      <div className="messages-page with-thread">
        <div className="messages-sidebar">
          <div className="sidebar-header">
            <button 
              className="btn-back mobile-only"
              onClick={() => setSelectedConversation(null)}
            >
              ← Back
            </button>
            <h2>Messages</h2>
          </div>
          
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="conversations-list">
            {filteredConversations.map(conversation => (
              <ConversationItem 
                key={conversation.id} 
                conversation={conversation} 
              />
            ))}
          </div>
        </div>

        <div className="messages-main">
          <MessagingThread 
            conversation={selectedConversation}
            onClose={() => setSelectedConversation(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="messages-page">
      <div className="page-header">
        <h1>Messages</h1>
        <button className="btn-primary">
          + New Message
        </button>
      </div>

      <div className="page-content">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="conversations-content">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading conversations...</p>
            </div>
          ) : filteredConversations.length > 0 ? (
            <div className="conversations-list">
              {filteredConversations.map(conversation => (
                <ConversationItem 
                  key={conversation.id} 
                  conversation={conversation} 
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">💬</div>
              <h3>No conversations yet</h3>
              <p>
                Start connecting with other users by applying to requests or responding to applications.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
