import express, { Request, Response } from 'express';
import http from 'http';
import { Server as SocketIoServer, Socket } from 'socket.io';
import cron from 'node-cron';
import controler from './controllers/service/controler cron ';
import auth from './middleware/auth';
import cors from 'cors';
import userRoute from './routes/user.routes';
import memberRoute from './routes/member.routes';
import db from './models';
import path from 'path';
const app = express();
app.options('*', cors());
const server = http.createServer(app);
const io = new SocketIoServer(server);
const port = process.env.PORT || 4000;
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html as the default page
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Socket.IO handling
io.on('connection', (socket: Socket) => {
  console.log(`User connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });

  
  socket.on('chat message', (message) => {
    io.emit('chat message', message);
    console.log(message,'shiva')
   
  });
});

export{io}
// Add your middleware and routes here
app.use(express.json());
app.use(express.static('resources'));
app.use("/profile", express.static(__dirname + "/profile"));
app.use('/api/v1/auth', userRoute);
app.use('/api/v1/member', auth, memberRoute);
app.get("/api/v1/welcome", auth, (req: Request, res: Response) => {
  res.status(200).send("data get successfully");
});

// Error handling middleware
app.use((err, req: Request, res: Response, next) => {
  const status = err.status || 500;
  res.status(status).json({ error: { message: err.message } });
});

// Sync database and start server
db.sequelize.sync().then(() => {
  server.listen(port, () => {
    console.log(`Server started on port ${port}`);
    
    // Add your cron jobs here
    cron.schedule('* * * * *', async () => {
      console.log('Running a task every 1 min');
      await controler.cron();
    });

    cron.schedule('*/1 * * * *', async () => {
      console.log('Running a task every 1 min');
      await controler.scheduleUpdateAfter24Hours();
    });
  });
});
