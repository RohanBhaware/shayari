
import mongoose, { Schema, model, models } from 'mongoose';

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    display_name: { type: String },
    bio: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Hashed password
    avatar_url: { type: String },
    created_at: { type: Date, default: Date.now },
});

const shayariSchema = new Schema({
    content: { type: String, required: true },
    mood: { type: String, required: true },
    language: { type: String, default: 'Hindi' },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    created_at: { type: Date, default: Date.now },
    // We can track counts here or aggregate on the fly. Storing counts is faster for reads.
    likes_count: { type: Number, default: 0 },
    comments_count: { type: Number, default: 0 },
});

const commentSchema = new Schema({
    content: { type: String, required: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    shayari_id: { type: Schema.Types.ObjectId, ref: 'Shayari', required: true },
    created_at: { type: Date, default: Date.now },
});

const likeSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    shayari_id: { type: Schema.Types.ObjectId, ref: 'Shayari', required: true },
    created_at: { type: Date, default: Date.now },
});

// Compound index to ensure unique likes per user per shayari
likeSchema.index({ user_id: 1, shayari_id: 1 }, { unique: true });

const saveSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    shayari_id: { type: Schema.Types.ObjectId, ref: 'Shayari', required: true },
    created_at: { type: Date, default: Date.now },
});

saveSchema.index({ user_id: 1, shayari_id: 1 }, { unique: true });

const followerSchema = new Schema({
    follower_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    following_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    created_at: { type: Date, default: Date.now },
});

followerSchema.index({ follower_id: 1, following_id: 1 }, { unique: true });

const notificationSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Recipient
    actor_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Who triggered it
    type: { type: String, required: true }, // 'like', 'comment', 'follow'
    shayari_id: { type: Schema.Types.ObjectId, ref: 'Shayari' }, // Optional, for like/comment
    read: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
});

// Export models, preventing overwrite during hot reload
export const User = models.User || model('User', userSchema);
export const Shayari = models.Shayari || model('Shayari', shayariSchema);
export const Comment = models.Comment || model('Comment', commentSchema);
export const Like = models.Like || model('Like', likeSchema);
export const Save = models.Save || model('Save', saveSchema);
export const Follower = models.Follower || model('Follower', followerSchema);
export const Notification = models.Notification || model('Notification', notificationSchema);
