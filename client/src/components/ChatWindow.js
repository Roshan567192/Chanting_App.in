import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

export default function ChatWindow({ selectedUser, socket }) {
  const { user: currentUser } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef();

  const selectedUserRef = useRef(selectedUser);
  const currentUserRef = useRef(currentUser);

  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  const loadMessages = useCallback(async () => {
    if (!selectedUser) {
      setMessages([]);
      return;
    }
    try {
      const res = await api.get(`/messages?userId=${selectedUser._id}`);
      setMessages(res.data);
    } catch (err) {
      console.error('Error loading messages:', err);
    }
  }, [selectedUser]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    function handleIncoming(msg) {
      const sel = selectedUserRef.current;
      const cur = currentUserRef.current;

      const isRelevant =
        sel &&
        ((msg.sender === sel._id && msg.receiver === cur._id) ||
         (msg.receiver === sel._id && msg.sender === cur._id));

      if (isRelevant) {
        setMessages(prev => [...prev, msg]);
      }
    }

    socket.on('chat-message', handleIncoming);
    return () => {
      socket.off('chat-message', handleIncoming);
    };
  }, [socket]);

  const sendMessage = async () => {
    if (!input.trim() || !selectedUser) return;

    const messageText = input.trim();

    try {
      const res = await api.post('/messages', {
        to: selectedUser._id,
        message: messageText,
      });

      socket.emit('chat-message', {
        to: selectedUser._id,
        message: messageText,
      });

      setMessages(prev => [...prev, res.data]);
      setInput('');
    } catch (err) {
      console.error('Send error:', err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!selectedUser) {
    return <div style={{ padding: '2rem' }}>Select a user to start chatting</div>;
  }

  // Format timestamp to show hh:mm am/pm
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  return (
    <div style={styles.chatContainer}>
      <div style={styles.chatHeader}>
        Chat with {selectedUser.name}{' '}
        <button onClick={loadMessages} style={styles.refreshButton} title="Refresh messages">
          🔄
        </button>
      </div>

      <div style={styles.chatBox}>
        {messages.map((msg, idx) => {
          const isMe = msg.sender === currentUser._id;
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isMe ? 'flex-end' : 'flex-start',
                marginBottom: '10px',
              }}
            >
              <div
                style={{
                  ...styles.messageBubble,
                  backgroundColor: isMe ? '#dcf8c6' : '#f1f0f0',
                }}
              >
                {msg.message}
              </div>
              <small style={{ color: '#666', fontSize: '12px', marginTop: '2px' }}>
                {formatTime(msg.timestamp)}
              </small>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div style={styles.inputContainer}>
        <textarea
          style={styles.textArea}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} style={styles.sendButton}>Send</button>
      </div>
    </div>
  );
}

const styles = {
  chatContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem',
    backgroundColor: '#f7f1f1',
  },
  chatHeader: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '1rem',
    borderBottom: '1px solid #ddd',
    paddingBottom: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  refreshButton: {
    fontSize: '16px',
    cursor: 'pointer',
    border: 'none',
    background: 'none',
  },
  chatBox: {
    flex: 1,
    overflowY: 'auto',
    padding: '1rem',
    backgroundColor: '#e9e1f5',
    borderRadius: '8px',
    border: '1px solid #ccc',
    marginBottom: '1rem',
  },
  messageBubble: {
    maxWidth: '65%',
    padding: '10px 15px',
    borderRadius: '18px',
    fontSize: '15px',
    lineHeight: '1.4',
  },
  inputContainer: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },
  textArea: {
    flex: 1,
    resize: 'none',
    borderRadius: '8px',
    padding: '10px',
    fontSize: '15px',
    border: '1px solid #ccc',
  },
  sendButton: {
    padding: '10px 16px',
    borderRadius: '8px',
    backgroundColor: '#413895',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
};
