import mongoose, { Schema, Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

export interface IPerson extends Document {
    name: string;
    phoneNumber: string;
    email?: string;
    tags?: string[];
    createdAt: Date;
    updatedAt: Date;
}

const PersonSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true
        },
        phoneNumber: {
            type: String,
            required: [true, 'Phone number is required'],
            unique: true,
            trim: true,
            // WhatsApp numbers should start with country code and be 12 digits
            validate: {
                validator: (value: string) => {
                    return /^\d{12}$/.test(value) && value.startsWith('92');
                },
                message: 'Phone number must be 12 digits and start with 92'
            }
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            required: false,
            validate: {
                validator: (value: string) => {
                    return !value || /^\S+@\S+\.\S+$/.test(value);
                },
                message: 'Invalid email format'
            }
        },
        tags: [String]
    },
    {
        timestamps: true
    }
);

// Apply the uniqueValidator plugin
PersonSchema.plugin(uniqueValidator, { message: '{PATH} already exists' });

export const Person = mongoose.model<IPerson>('Person', PersonSchema);