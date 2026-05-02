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
        default: 'buyer',
        enum: ['admin', 'manager', 'creator', 'responder'],
        required: true
    },
    specialization: {
        type: String,
        default: null
    },
    jobTitle: {
        type: String,
        default: null
    },
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
    }
    ,
    tokenVersion: {
        type: Number,
        default: 0
    }

}, { timestamps: true })

//indexing in future for faster search
userSchema.index({ organizationId: 1})

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