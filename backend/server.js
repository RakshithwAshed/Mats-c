require('dotenv').config();

const adminRoutes = require('./routes/admin');
const Message = require('./models/Message');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');


const { Server } = require('socket.io');

const authRoutes = require('./routes/auth');

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://matscc.vercel.app/"
    ],
    methods: ["GET", "POST"]
  }
});


// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://matscc.vercel.app/"
  ],
  methods: ["GET", "POST", "PUT"],
  credentials: true
}));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);


// Test route
app.get('/', (req, res) => {
  res.send('Server is running 🚀');
});


// SOCKET.IO
io.on("connection", async (socket) => {

  console.log("User connected:", socket.id);

  // SEND OLD MESSAGES
  const oldMessages = await Message.find().sort({ createdAt: 1 });

  socket.emit("load_messages", oldMessages);


  // RECEIVE NEW MESSAGE
  socket.on("send_message", async (data) => {

    console.log(data);

    // SAVE TO DATABASE
    const newMessage = await Message.create({
  text: data.text,
  username: data.username
});
    // SEND TO EVERYONE
    io.emit("receive_message", newMessage);

  });


  socket.on("disconnect", () => {

    console.log("User disconnected");

  });

});

// MongoDB
mongoose.connect(process.env.MONGO_URI)

.then(() => {

  console.log('MongoDB connected');

  server.listen(5000, () => {
    console.log('Server running on port 5000');
  });

})

.catch((err) => {
  console.log(err);
});