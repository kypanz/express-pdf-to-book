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

export interface IChatSaved {
    user_id: string;
    thread_id: string;
    initial_message: string;
}

export interface IDiary {
    regular_user_id: string;
    assigned_medic_id: string;
    name_medic: string;
    name_regular_user: string;
    request_thread_id: string;
    description_thread: string;
    specialization_name: string;
    date_scheduled: string;
    meeting_url: string;
    status: StatusDiary;
}

export interface ISpecialist {
    user_id: string;
    name: string;
    tag_name: string;
}

export interface ISavedMessage {
    user_id: string;
    message_encrypted: string;
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

const chatSavedSchema = new Schema<IChatSaved>({
    user_id: { type: String, required: true },
    thread_id: { type: String, required: true },
    initial_message: { type: String, required: true }
}, { timestamps: true });

const scheduledSchema = new Schema<IDiary>({
    regular_user_id: { type: String, required: true },
    assigned_medic_id: { type: String, required: true },
    name_medic: { type: String, required: true },
    name_regular_user: { type: String, required: true },
    request_thread_id: { type: String, required: true },
    description_thread: { type: String, required: true },
    specialization_name: { type: String, required: true },
    date_scheduled: { type: String, required: false },
    meeting_url: { type: String, required: false },
    status: { type: Number, required: true }
}, { timestamps: true });

const specialistSchema = new Schema<ISpecialist>({
    user_id: { type: String, required: true },
    name: { type: String, required: true },
    tag_name: { type: String, required: true },
}, { timestamps: true });

// Plugins
userSchema.plugin(passportLocalMongoose);

// Database Models
export const model_user = mongoose.model('user', userSchema);
export const model_chat_saved = mongoose.model('chat_saved', chatSavedSchema);
export const model_scheduled = mongoose.model('scheduled', scheduledSchema);
export const model_specialist = mongoose.model('specialist', specialistSchema);