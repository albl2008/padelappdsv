import mongoose, { Model, Document } from 'mongoose';
import { QueryResult } from '../paginate/paginate';


export interface IRequest {
    clubName: string;
    displayName: string
    location: {lat: number, lng: number}
    address: string
    email: string
    phone: number
    courtsQuantity: number;
    moreLocations: boolean
    verified: boolean
    invited: boolean
}

export interface IRequestDoc extends IRequest, Document {
}

export interface IRequestModel extends Model<IRequestDoc> {
  isEmailTaken(email: string, excludeRequestId?: mongoose.Types.ObjectId): Promise<boolean>;
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateRequestBody = Partial<IRequest>;


export type NewCreatedRequest = IRequest;


