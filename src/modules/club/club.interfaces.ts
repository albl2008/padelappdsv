import mongoose, { Model, Document } from 'mongoose';
import { QueryResult } from '../paginate/paginate';


export interface IClub {
  name: string;
  location: {lat: number, lng: number}
  address: string
  logo: string;
  phone: number
  courtsQuantity: number;
  user:mongoose.Types.ObjectId;
}

export interface IClubDoc extends IClub, Document {
}

export interface IClubModel extends Model<IClubDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateClubBody = Partial<IClub>;


export type NewCreatedClub = Partial<IClub>;


