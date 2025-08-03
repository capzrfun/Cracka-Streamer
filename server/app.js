const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// Load audio/video streams (for simplicity, assume files are stored in Google Cloud Storage)
const gcs = require('@google-cloud/storage')({
  projectId: 'your-project-id',
  keyFilename: './path/to/credentials.json'
});

app.use(express.static(__dirname + '/public'));

let videoStream;
let audioStream;

// Socket connection handling
io.on('connection', (socket) => {
  console.log('Client connected');

  // Send stream data to client when it connects
  socket.emit('stream-started', { video: videoStream, audio: audioStream });

  // Handle disconnections
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Load streams from Google Cloud Storage (for testing purposes)
const loadVideo = async () => {
  const bucketName = 'your-bucket-name';
  const fileName = 'path/to/video/file.mp4';
  const videoFile = gcs.bucket(bucketName).file(fileName);

  const videoStream = await videoFile.createReadStream();
  return videoStream;
};

const loadAudio = async () => {
  // For simplicity, use a local audio file
  const audioFile = __dirname + '/path/to/audio/file.mp3';
  const audioStream = fs.createReadStream(audioFile);
  return audioStream;
};

// Load streams and start the server
loadVideo().then((video) => {
  loadAudio().then((audio) => {
    videoStream = video;
    audioStream = audio;

    app.use(express.static(__dirname + '/public'));

    server.listen(3000, () => {
      console.log('Server started on port 3000');
    });
  });
});
