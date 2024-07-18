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

// add plugin that converts mongoose to json
addonSchema.plugin(toJSON);
addonSchema.plugin(paginate);


const Addon = mongoose.model<IAddonDoc, IAddonModel>('Addon', addonSchema);

export default Addon;
