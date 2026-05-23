require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');

const { Server } = require('socket.io');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

const Message = require('./models/Message');

const app = express();

const server = http.createServer(app);


// SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});


// MIDDLEWARE
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT"],
}));

app.use(express.json());


// ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);


// TEST ROUTE
app.get('/', (req, res) => {
  res.send('Server is running 🚀');
});


// SOCKET CONNECTION
io.on("connection", async (socket) => {

  console.log("User connected:", socket.id);

  try {

    // LOAD OLD MESSAGES
    const oldMessages = await Message.find().sort({
      createdAt: 1
    });

    socket.emit("load_messages", oldMessages);

  }

  catch(err){
    console.log(err);
  }


  // RECEIVE MESSAGE
  socket.on("send_message", async (data) => {

    try {

      console.log(data);

      // SAVE MESSAGE
      const newMessage = await Message.create({
        text: data.text,
        username: data.username
      });

      // SEND TO ALL USERS
      io.emit("receive_message", newMessage);

    }

    catch(err){

      console.log(err);

    }

  });


  socket.on("disconnect", () => {

    console.log("User disconnected");

  });

});


// DATABASE
mongoose.connect(process.env.MONGO_URI)

.then(() => {

  console.log('MongoDB connected');

  server.listen(process.env.PORT || 5000, () => {
    console.log('Server running');
  });

})

.catch((err) => {
  console.log(err);
});