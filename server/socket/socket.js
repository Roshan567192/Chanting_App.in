import jwt from 'jsonwebtoken';

export default function setupSocket(io) {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error('No token'));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;

      next();
    } catch (err) {
      console.error('Socket auth error:', err.message);
      return next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    console.log('✅ User connected:', socket.userId);

    // Join room named by userId (important)
    socket.join(socket.userId);

    socket.on('chat-message', (data) => {
      const message = {
        sender: socket.userId,
        receiver: data.to,
        message: data.message,
        timestamp: new Date(),
      };

      console.log(`💬 Message from ${message.sender} to ${message.receiver}: ${message.message}`);

      // Emit to receiver only
      io.to(data.to).emit('chat-message', message);
      // Also emit back to sender to confirm sending (optional but useful)
      socket.emit('chat-message', message);
    });

    socket.on('disconnect', () => {
      console.log('❌ User disconnected:', socket.userId);
    });
  });
}
