import mongoose, { Model, Document, ObjectId } from 'mongoose';
import { QueryResult } from '../paginate/paginate';


export interface ICourt {
  name: string;
  number: number;
  surface: string;
  walls: string;
  inUse: boolean;
  club: mongoose.Types.ObjectId;
 
}

export interface ICourtDoc extends ICourt, Document {
}

export interface ICourtModel extends Model<ICourtDoc> {
  isNumberTaken(number: number, clubId: ObjectId): Promise<boolean>;
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateCourtBody = Partial<ICourt>;


export type NewCreatedCourt = Omit<ICourt, 'inUse' >;


