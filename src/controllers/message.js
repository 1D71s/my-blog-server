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

        const sendMessageToList = async (data) => {
            const userIdToFind = await User.findById(data);

            if (!userIdToFind) {
                return;
            }
    
            const dialogs = await Dialog.find({
                participants: data 
            }).populate('participants');

            const result = dialogs.map(dialog => {
                const messages = dialog.messages;
                const lastMessage = messages[messages.length - 1];
                const sender = dialog.participants.find(participant => String(participant._id) !== String(userIdToFind._id));
                
                return {
                    messages: lastMessage,
                    who: sender
                };
            });

            socket.emit('sendAllDialog', result);
        }
        
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
                sendMessageToList(data.user2)
                sendMessageToList(data.user1)
            } catch (error) {
                console.error(error);
            }
        });
        
        
        //get all dialog
        socket.on('getAllDialogs', async (data) => {
            try {
                sendMessageToList(data)
            } catch (error) {
                console.error(error);
            }
        });

    });

    return io;
};