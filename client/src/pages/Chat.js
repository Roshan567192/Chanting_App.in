import React, { useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';
import UserList from '../components/UserList';
import ChatWindow from '../components/ChatWindow';

export default function Chat() {
  const { user, logout } = useContext(AuthContext);
  const [selectedUser, setSelectedUser] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user) return;

    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const token = localStorage.getItem('token');

    const newSocket = io(apiUrl, {
      auth: { token },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
    });

    newSocket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [user]);

  if (!user) return <p>Loading user data...</p>;

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <h2>Welcome, {user.name}</h2>
        <button onClick={logout} style={styles.logoutButton}>Logout</button>
        <UserList
          selectedUser={selectedUser}
          onSelectUser={setSelectedUser}
          currentUserId={user._id}
        />
      </aside>

      <main style={styles.chatWindow}>
        {socket ? (
          <ChatWindow selectedUser={selectedUser} socket={socket} />
        ) : (
          <p>Connecting to chat...</p>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: { display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' },
  sidebar: {
    width: '300px',
    borderRight: '1px solid #ddd',
    padding: '1rem',
    backgroundColor: '#ece0e0',
  },
  logoutButton: {
    marginBottom: '1rem',
    padding: '8px 12px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#dc3545',
    color: 'white',
    cursor: 'pointer',
  },
  chatWindow: { flex: 1, backgroundColor: 'white', display: 'flex', flexDirection: 'column' },
};
