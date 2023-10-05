import { Server } from 'socket.io';
import User from "../models/User.js";


export const initSocket = (server, corsOptions) => {
    const io = new Server(server, { cors: corsOptions });

    io.on('connection', (socket) => {
        //console.log('a user connected');

        socket.on('message', (data) => {
            //console.log('Received message:', data);
        });
    });

    return io;
};