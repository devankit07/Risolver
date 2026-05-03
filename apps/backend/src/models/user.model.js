import bcrypt from 'bcrypt'
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'responder',
        enum: ['admin', 'manager', 'creator', 'responder'],
        required: true
    },
    inviteId: {
        type: String,
        default: null
    },
    specialization: {
        type: String,
        default: null
    },
    jobTitle: {
        type: String,
        default: null
    },
    department: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['online', 'away', 'offline'],
        default: 'offline'
    },
    lastActive: {
        type: Date,
        default: null
    },
    isInviteUser: {
        type: Boolean,
        default: false
    },
    skills: {
        type: [String],
        default: []
    },
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
    },
    tokenVersion: {
        type: Number,
        default: 0
    }

}, { timestamps: true })

userSchema.index({ organizationId: 1 })

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
})

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

const userModel = mongoose.model('User', userSchema)

export default userModel;