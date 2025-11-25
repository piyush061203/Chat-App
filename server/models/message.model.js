import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  
    senderID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
      
    },  
    media:{
        type:String
    }
}, {
    timestamps: true
});

export const Message = mongoose.model("Message", messageSchema);