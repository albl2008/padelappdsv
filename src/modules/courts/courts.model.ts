import mongoose from 'mongoose';
import toJSON from '../toJSON/toJSON';
import paginate from '../paginate/paginate';
import { ICourtDoc, ICourtModel } from './courts.interfaces';

const courtSchema = new mongoose.Schema<ICourtDoc, ICourtModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    number: {
      type: Number,
      required: true,
      unique: true,
    //   trim: true,
    //   lowercase: true,
    //   validate(value: string) {
    //     if (!validator.isEmail(value)) {
    //       throw new Error('Invalid email');
    //     }
    //   },
    },
    surface: {
      type: String,
      required: true,
      trim: true,
    },
    walls: {
        type: String,
        required: true,
        trim: true,
    },
    
    inUse: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
courtSchema.plugin(toJSON);
courtSchema.plugin(paginate);


const Court = mongoose.model<ICourtDoc, ICourtModel>('Court', courtSchema);

export default Court;
