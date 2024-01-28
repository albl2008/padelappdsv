import mongoose, { Schema } from 'mongoose';
import toJSON from '../toJSON/toJSON';
import paginate from '../paginate/paginate';
import { IShiftDoc, IShiftModel } from './shifts.interfaces';

const shiftSchema = new mongoose.Schema<IShiftDoc, IShiftModel>(
  {
   
    duration: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required:true,
    },
    start: {
      type: Date,
      required:true,
    },
    end: {
      type: Date,
      required:true,
    },
    tolerance: {
      type: Number,
      required:true,
    },
    status: {
      id: {
        type: Number,
        required:true,
      },
      sta: {
        type: String,
        required:true,
      }
    },
    client: {
      type: String,
    },
    court:{
      type: Schema.Types.ObjectId,
      ref:'Court'
    },
    price: {
      type: Number
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
shiftSchema.plugin(toJSON);
shiftSchema.plugin(paginate);


const Shift = mongoose.model<IShiftDoc, IShiftModel>('Shift', shiftSchema);

export default Shift;
