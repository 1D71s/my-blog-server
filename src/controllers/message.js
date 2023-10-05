import { Server } from 'socket.io';
import User from "../models/User.js";
import Dialog from '../models/Message.js'

export const initSocket = (server, corsOptions) => {
    const io = new Server(server, { cors: corsOptions });

    io.on('connection', (socket) => {

        //get messages
        socket.on('connectToChat', async (data) => {
            try {
                const dialog = await Dialog.findOne({
                    participants: {
                        $all: [data.user2, data.user1]
                    }
                });
            
            
                if (dialog) {
                    socket.emit('sendAllMessage', dialog.messages);
                } 

            } catch (error) {
                console.error('Ошибка при создании/поиске диалога:', error);
            }
        });

        //send message
        socket.on('writeMessage', async (data) => {
            try {
                let dialog = await Dialog.findOne({
                    participants: {
                        $all: [data.user2, data.user1]
                    }
                });
        
                if (!dialog) {
                    dialog = new Dialog({
                        participants: [data.user2, data.user1],
                        messages: []
                    });
        
                    await dialog.save();
                }
        
                dialog.messages.push({ sender: data.user1, content: data.text });
                await dialog.save();
        
                socket.emit('sendNewMessage', dialog.messages);
            } catch (error) {
                console.error('Ошибка при создании/поиске диалога:', error);
            }
        });
        
        

    });

    return io;
};