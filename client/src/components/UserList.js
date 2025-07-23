import React, { useEffect, useState } from 'react';
import api from '../utils/api';

export default function UserList({ selectedUser, onSelectUser, currentUserId }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get('/users').then(res => {
      const filteredUsers = res.data.filter(user => user._id !== currentUserId);
      setUsers(filteredUsers);
    });
  }, [currentUserId]);

  return (
    <div>
      <h4>Users</h4>
      {users.map(user => (
        <div
          key={user._id}
          onClick={() => onSelectUser(user)}
          style={{
            padding: '8px',
            cursor: 'pointer',
            backgroundColor: selectedUser?._id === user._id ? '#ddd' : 'transparent',
          }}
        >
          {user.name}
        </div>
      ))}
    </div>
  );
}
