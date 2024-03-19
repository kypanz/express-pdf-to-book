import mongoose, { Schema } from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

export enum StatusDiary { Pending, Acepted, Done }


// Interfaces
export interface IUser {
    name: string;
    lastname: string;
    age: Date;
    username: string;
    email: string;
    role: string;
}

// Database Schemas
const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    age: { type: Date, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true },
}, { timestamps: true });


// Plugins
userSchema.plugin(passportLocalMongoose);

// Database Models
export const model_user = mongoose.model('user', userSchema);
export const model_chat_saved = mongoose.model('chat_saved', chatSavedSchema);
export const model_scheduled = mongoose.model('scheduled', scheduledSchema);
export const model_specialist = mongoose.model('specialist', specialistSchema);