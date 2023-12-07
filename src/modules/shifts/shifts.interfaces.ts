import { Model, Document } from 'mongoose';
import { QueryResult } from '../paginate/paginate';


export interface IShift {
  duration: number;
  date: Date;
  start: Date;
  end: Date;
  status: {id:number,sta:string};
}

export interface IShiftDoc extends IShift, Document {
}

export interface IShiftModel extends Model<IShiftDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateShiftBody = Partial<IShift>;


export type NewCreatedShift = Partial<IShift>;


