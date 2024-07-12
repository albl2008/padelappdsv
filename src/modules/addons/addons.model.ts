import mongoose from 'mongoose';
import toJSON from '../toJSON/toJSON';
import paginate from '../paginate/paginate';
import { IAddonDoc, IAddonModel } from './addons.interfaces';

const addonSchema = new mongoose.Schema<IAddonDoc, IAddonModel>(
  {
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    unit: {
      type: Boolean,
      required: true,
    },
    type: {
      type: Boolean,
      required: true,
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
addonSchema.plugin(toJSON);
addonSchema.plugin(paginate);


const Addon = mongoose.model<IAddonDoc, IAddonModel>('Addon', addonSchema);

export default Addon;
