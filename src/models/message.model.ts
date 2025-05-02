import mongoose, { Schema, Document } from 'mongoose';
import { IConversation } from './conversation.model';

export enum MessageSender {
    SYSTEM = 'system',
    USER = 'user'
}

export enum MessageStatus {
    SENDING = 'sending',
    SENT = 'sent',
    DELIVERED = 'delivered',
    READ = 'read',
    FAILED = 'failed'
}

export enum MessageType {
    TEXT = 'text',
    IMAGE = 'image',
    AUDIO = 'audio',
    VIDEO = 'video',
    DOCUMENT = 'document',
    LOCATION = 'location',
    TEMPLATE = 'template',
    INTERACTIVE = 'interactive'
}

export interface IMessage extends Document {
    conversation: mongoose.Types.ObjectId | IConversation;
    sender: MessageSender;
    type: MessageType;
    content: string;
    mediaUrl?: string;
    status: MessageStatus;
    metadata?: any;
    timestamp: Date;
    // isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const MessageSchema: Schema = new Schema(
    {
        conversation: {
            type: Schema.Types.ObjectId,
            ref: 'Conversation',
            required: [true, 'Conversation is required'],
            index: true
        },
        sender: {
            type: String,
            enum: Object.values(MessageSender),
            required: [true, 'Sender is required']
        },
        type: {
            type: String,
            enum: Object.values(MessageType),
            default: MessageType.TEXT
        },
        content: {
            type: String,
            required: [true, 'Content is required']
        },
        mediaUrl: {
            type: String,
            trim: true
        },
        status: {
            type: String,
            enum: Object.values(MessageStatus),
            default: MessageStatus.SENDING
        },
        metadata: {
            type: Schema.Types.Mixed
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        // isRead: {
        //     type: Boolean,
        //     default: false
        // }
    },
    {
        timestamps: true
    }
);

// Indexes for faster queries
// MessageSchema.index({ conversation: 1, timestamp: -1 });
MessageSchema.index({ timestamp: -1 });
// MessageSchema.index({ isRead: 1 });
MessageSchema.index({ status: 1 });
// MessageSchema.index({ sender: 1 });

// Pre-save hook to update conversation's lastMessage and lastMessageTimestamp
MessageSchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            // Update the conversation with last message details
            await mongoose.model('Conversation').findByIdAndUpdate(
                this.conversation,
                {
                    lastMessage: this.content.substring(0, 50) + (this.content.length > 50 ? '...' : ''),
                    lastMessageTimestamp: this.timestamp,
                    $inc: { unreadCount: this.sender === MessageSender.USER ? 1 : 0 }
                }
            );
        } catch (error) {
            console.error('Error updating conversation:', error);
        }
    }
    next();
});

export const Message = mongoose.model<IMessage>('Message', MessageSchema);