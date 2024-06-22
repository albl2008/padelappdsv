import mongoose, { Model, Document } from 'mongoose';
import { QueryResult } from '../paginate/paginate';


export interface ICourt {
  name: string;
  number: number;
  surface: string;
  walls: string;
  inUse: boolean;
  user: mongoose.Types.ObjectId;
}

export interface ICourtDoc extends ICourt, Document {
}

export interface ICourtModel extends Model<ICourtDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateCourtBody = Partial<ICourt>;


export type NewCreatedCourt = Omit<ICourt, 'inUse' | 'user'>;


