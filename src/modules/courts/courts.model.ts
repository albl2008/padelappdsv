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
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Club',
      required: true,
    },
    
  },
  {
    timestamps: true,
  }
);

courtSchema.index({ number: 1, user: 1 }, { unique: true });


// add plugin that converts mongoose to json
courtSchema.plugin(toJSON);
courtSchema.plugin(paginate);

courtSchema.static('isNumberTaken', async function (number: number, userId: mongoose.ObjectId): Promise<boolean> {
  console.log(number,userId)
  const court = await this.findOne({ number, user: userId });
  return !!court;
});



const Court = mongoose.model<ICourtDoc, ICourtModel>('Court', courtSchema);

export default Court;
