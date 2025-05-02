import mongoose, { Schema, Document } from 'mongoose';
import { IPerson } from './person.model';

export interface IConversation extends Document {
    person: mongoose.Types.ObjectId | IPerson;
    title?: string;
    lastMessage?: string;
    lastMessageTimestamp?: Date;
    unreadCount: number;
    isActive: boolean;
    tags?: string[];
    createdAt: Date;
    updatedAt: Date;
}

const ConversationSchema: Schema = new Schema(
    {
        person: {
            type: Schema.Types.ObjectId,
            ref: 'Person',
            required: [true, 'Person is required']
        },
        title: {
            type: String,
            trim: true
        },
        lastMessage: {
            type: String,
            trim: true
        },
        lastMessageTimestamp: {
            type: Date
        },
        unreadCount: {
            type: Number,
            default: 0
        },
        isActive: {
            type: Boolean,
            default: true
        },
        tags: [String]
    },
    {
        timestamps: true
    }
);

// Index for faster queries
// ConversationSchema.index({ person: 1 });
ConversationSchema.index({ isActive: 1 });
ConversationSchema.index({ lastMessageTimestamp: -1 });

export const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema);