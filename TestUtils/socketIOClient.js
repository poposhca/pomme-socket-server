const io = require('socket.io-client');

const port = process.env.PORT || 3000;
const socket = io(`http://localhost:${port}`, {
  extraHeaders: {
    'Authorization': '44',
  },
});

socket.on('connect', () => {
  console.log('Connected to the server');
});

socket.on('sendQuizPosition', (msg) => {
    console.log(`Received quiz position`);
    console.log(msg);
});

socket.on('disconnect', () => {
  console.log('Disconnected from the server');
});

socket.emit('joinQuiz', {
    quizId: '112',
    adminId: '466',
});
