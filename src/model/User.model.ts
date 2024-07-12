import mongoose, { Schema } from "mongoose";

const userSchema =  new Schema({
    name: {
        type: String,
        required: [true, 'A User must have a name'],
    },
})
const User = mongoose.model('User', userSchema)

export default User;