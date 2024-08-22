import mongoose from 'mongoose';
import toJSON from '../toJSON/toJSON';
import paginate from '../paginate/paginate';
import { IRequestDoc, IRequestModel } from './requests.interface';

const requestSchema = new mongoose.Schema<IRequestDoc, IRequestModel>(
  {
    clubName: {
      type: String,
      required: true,
      trim: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: Number,
      required: true,
      trim: true,
    },
    location: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },
    address: {
      type: String,
      required: true,
    },
    courtsQuantity: {
      type: Number,
      required: true,
    },
    moreLocations: {
      type: Boolean,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    invited: {
      type: Boolean,
      default: false,
    },
    
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
requestSchema.plugin(toJSON);
requestSchema.plugin(paginate);



/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeRequestId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
requestSchema.static('isEmailTaken', async function (email: string, excludeRequestId: mongoose.ObjectId): Promise<boolean> {
    const request = await this.findOne({ email, _id: { $ne: excludeRequestId } });
    return !!request;
  });
  


const Request = mongoose.model<IRequestDoc, IRequestModel>('Request', requestSchema);

export default Request;
