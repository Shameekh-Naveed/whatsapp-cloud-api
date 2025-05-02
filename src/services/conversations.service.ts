import { isValidObjectId } from 'mongoose';
import { Conversation, IConversation } from '../models/conversation.model';
import { Message, IMessage, MessageSender, MessageStatus, MessageType } from '../models/message.model';
import { Person } from '../models/person.model';
import { BadRequestResponse, NotFoundResponse } from 'http-errors-response-ts/lib';

class ConversationsService {
    constructor() { }

    async findOrCreateConversation(phoneNumber: string): Promise<IConversation> {
        // if (!isValidObjectId(personId))
        //     throw new BadRequestResponse('Invalid person ID');

        // Check if the person exists
        const person = await Person.findOne({ phoneNumber });
        if (!person) {
            throw new NotFoundResponse('Person not found');
        }

        // Find or create a conversation for this person
        let conversation = await Conversation.findOne({ person: person._id });

        if (!conversation) {
            conversation = new Conversation({
                person: person._id,
                title: person.name, // Use person's name as the default title
                unreadCount: 0,
                isActive: true
            });
            await conversation.save();
        }

        return conversation;
    }

    async getConversation(id: string): Promise<IConversation> {
        if (!isValidObjectId(id))
            throw new BadRequestResponse('Invalid conversation ID');

        const conversation = await Conversation.findById(id).populate('person');
        if (!conversation)
            throw new NotFoundResponse('Conversation not found');

        return conversation;
    }

    async getConversations(filter?: any): Promise<IConversation[]> {
        const query = { isActive: true, ...filter };
        const conversations = await Conversation.find(query)
            .populate('person')
            .sort({ lastMessageTimestamp: -1 });

        return conversations;
    }

    async archiveConversation(id: string): Promise<IConversation> {
        const conversation = await this.getConversation(id);
        conversation.isActive = false;
        await conversation.save();
        return conversation;
    }

    async markAsRead(id: string): Promise<IConversation> {
        const conversation = await this.getConversation(id);

        // Mark all unread messages as read
        await Message.updateMany(
            { conversation: id, sender: MessageSender.USER },
            { $set: { status: MessageStatus.READ } }
        );

        // Reset unread count
        conversation.unreadCount = 0;
        await conversation.save();

        return conversation;
    }

    async userSeenAllMessages(id: string): Promise<IConversation> {
        const conversation = await this.getConversation(id);

        // Mark all messages as read
        await Message.updateMany(
            { conversation: id, status: MessageStatus.SENT, sender: MessageSender.SYSTEM },
            { $set: { status: MessageStatus.READ } }
        );

        return conversation;
    }

    async addMessage(
        conversationId: string,
        sender: MessageSender,
        content: string,
        type: MessageType = MessageType.TEXT,
        mediaUrl?: string
    ): Promise<IMessage> {
        const conversation = await this.getConversation(conversationId);

        const message = new Message({
            conversation: conversationId,
            sender,
            content,
            type,
            mediaUrl,
            status: sender === MessageSender.SYSTEM ? MessageStatus.SENT : MessageStatus.SENDING,
            timestamp: new Date(),
            isRead: sender === MessageSender.SYSTEM
        });

        await message.save();
        return message;
    }

    async getMessages(conversationId: string, limit: number = 50, before?: Date): Promise<IMessage[]> {
        const query: any = { conversation: conversationId };

        if (before) {
            query.timestamp = { $lt: before };
        }

        const messages = await Message.find(query)
            .sort({ timestamp: -1 })
            .limit(limit);

        return messages.reverse();
    }
}

export { ConversationsService };