import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: ['Work', 'Home', 'Personal'],
      required: true,
      default: 'Personal',
    },
  },
  { timestamps: true },
);

export const contactModel = mongoose.model('Contact', contactSchema);
