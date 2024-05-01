import express from 'express';
import bodyParser from 'body-parser';
import runMongoose from './src/config/database';
import session from 'express-session';
import passport from 'passport';
import passport_local from 'passport-local';
import userRouter from './src/routes/users';
import { model_user } from './src/models/database';
import cors from 'cors';
import http from 'http';
import https from 'https';
import fs from 'fs';
import socketIO, { Server } from 'socket.io';
import dotenv from 'dotenv';

// Getting env variables
dotenv.config();
const { HTTPS } = process.env;
const isSecure = (HTTPS === 'true') ? true : false;
const sameSite = (HTTPS === 'true') ? 'none' : 'lax';

const LocalStrategy = passport_local.Strategy;

// Database
runMongoose();

const app: express.Application = express();
const port: number = 3000;


// Https server options
console.log('HTTPS is enabled ? => ', HTTPS);
let server: http.Server | https.Server;
if (HTTPS == 'true') {
  const optionsServer = {
    key: fs.readFileSync('privkey.pem'),
    cert: fs.readFileSync('fullchain.pem')
  }
  server = https.createServer(optionsServer, app);
} else {
  server = http.createServer(app);
}

export const io: Server = new socketIO.Server(server, { cors: { origin: '*' } });
export let client_users: any = [];

io.on("connection", (socket) => {

  console.log('frontend socket connected => ', socket.id);

  socket.on('define-user', (data) => {
    const exist = client_users.find((user: any) => user.id_socket == socket.id);
    if (exist) return;
    client_users.push({ id_socket: socket.id, id_account: data.id_account });
    console.log('[ websocket | join ] users connected => ', client_users);
  });

  socket.on('disconnect', () => {
    client_users = client_users.filter((user: any) => user.id_socket !== socket.id);
    console.log('[ websocket | leave ] users connected => ', client_users);
    console.log('user disconnected !');
  });

});


app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'proyecto-ky-secret-14-mar-2024',
  resave: true,
  saveUninitialized: true,
  cookie: { httpOnly: false, secure: isSecure, sameSite: sameSite }
}));
app.use(passport.initialize());
app.use(passport.session());


// Passport
passport.use(new LocalStrategy(model_user.authenticate()));
passport.serializeUser((model_user as any).serializeUser());
passport.deserializeUser(model_user.deserializeUser());

// Routes
app.use('/users', userRouter);

app.get('/', (_req, _res) => {
  _res.send("...");
});

server.listen(port, () => {
  console.log(`TypeScript with Express => ${(HTTPS == 'true') ? 'https' : 'http'}://localhost:${port}/`);
});

export default server;
