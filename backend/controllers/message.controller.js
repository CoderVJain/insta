import Conversation from '../models/conversation.model.js';
import Message from '../models/message.model.js';
import User from '../models/user.model.js';
import { getReceiverSocketId, io } from '../socket/socket.js';

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const { message } = req.body;

        // this will check whether their is earlier conversation between sender and receiver
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        // establish the conversation if earlier conversation is not found
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            })
        };

        const newMessage = await Message.create({
            senderId: senderId,
            receiverId: receiverId,
            message
        });


        if (newMessage) conversation.messages.push(newMessage._id);


        await Promise.all([
            conversation.save(),
            newMessage.save()
        ]);

        // implement socket.io fro real time data transfer
        // one to one not group implementation

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage);
        }

        const sender = await User.findById(senderId).select('userName profilePicture');

        // emit a msg event
        const msg = {
            type: 'message',
            userId: senderId,
            userDetails: sender,
            message: `${sender.userName} messaged you`
        }
        io.to(receiverSocketId).emit('messageNotification', msg);



        return res.status(200).json({
            message: "Message sent successfully",
            newMessage,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

export const getMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate('messages');

        if (!conversation) return res.status(200).json({
            success: true,
            messages: []
        });

        return res.status(200).json({
            success: true,
            messages: conversation?.messages
        });



    } catch (error) {
        console.log(error)
    }
}