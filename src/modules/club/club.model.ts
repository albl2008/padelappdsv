import mongoose from 'mongoose';
import toJSON from '../toJSON/toJSON';
import paginate from '../paginate/paginate';
import { IClubDoc, IClubModel } from './club.interfaces';

const clubSchema = new mongoose.Schema<IClubDoc, IClubModel>(
  {
   
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: { type: String, default: 'Point' },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    logo: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    courtsQuantity: {
      type: Number,
      default: 1,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
clubSchema.plugin(toJSON);
clubSchema.plugin(paginate);


const Club = mongoose.model<IClubDoc, IClubModel>('Club', clubSchema);

export default Club;
