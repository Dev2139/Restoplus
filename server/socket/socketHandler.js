let io;

module.exports = {
  init: (httpServer) => {
    io = require('socket.io')(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    io.on('connection', (socket) => {
      console.log('New client connected:', socket.id);

      socket.on('join_table', (tableNumber) => {
        socket.join(`table_${tableNumber}`);
        console.log(`Socket ${socket.id} joined table_${tableNumber}`);
      });

      socket.on('join_admin', () => {
        socket.join('admin_kitchen');
        console.log(`Socket ${socket.id} joined admin_kitchen`);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }
    return io;
  }
};
