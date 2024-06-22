import mongoose from 'mongoose';
import toJSON from '../toJSON/toJSON';
import paginate from '../paginate/paginate';
import { IConfigDoc, IConfigModel } from './config.interfaces';

const configSchema = new mongoose.Schema<IConfigDoc, IConfigModel>(
  {
   
    shiftDuration: {
      type: Number,
      required: true,
    //   trim: true,
    //   lowercase: true,
    //   validate(value: string) {
    //     if (!validator.isEmail(value)) {
    //       throw new Error('Invalid email');
    //     }
    //   },
    },
    tolerance: {
      type: Number,
      required: true,
      trim: true,
    },
    shiftsPerDay: {
        type: Number,
        required: true,
        trim: true,
    },
    
    firstShift: {
      type: Date,
      required:true,
    },
    shiftPrice: {
      type: Number,
      required:true,
    },
    operativeDays: {
      type: [Number],
      required:true,
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
configSchema.plugin(toJSON);
configSchema.plugin(paginate);


const Config = mongoose.model<IConfigDoc, IConfigModel>('Config', configSchema);

export default Config;
