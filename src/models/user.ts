import { Schema, model } from 'mongoose';

interface IUser { 
    name: string;
    email: string;
    password: string;
    roles: string[];
}

const userSchema = new Schema<IUser>({
    name: { type: String, required: [true, 'Name is required'] },
    email: { type: String, required: [true, 'Email is required'], unique: true },
    password: { type: String, required: [true, 'Password is required'] },
    roles: { type: [String], required: true, enum: ['ADMIN_ROLE', 'EDITOR_ROLE', 'USER_ROLE'] }
});

userSchema.methods.toJSON = function () {
    const { __v, password, ...user } = this.toObject();
    return user;
}

export default model<IUser>('User', userSchema);