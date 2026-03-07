import { Server } from 'socket.io';

let io = null;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: true,
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    socket.on('join-exam', (examId) => {
      socket.join(`exam-${examId}`);
    });

    socket.on('leave-exam', (examId) => {
      socket.leave(`exam-${examId}`);
    });

    socket.on('disconnect', () => {});
  });

  return io;
};

export const getIO = () => io;
