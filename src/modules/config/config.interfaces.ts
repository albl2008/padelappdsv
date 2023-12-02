import { Model, Document } from 'mongoose';
import { QueryResult } from '../paginate/paginate';


export interface IConfig {
  shiftDuration: number;
  shiftPrice: number;
  tolerance: number;
  firstShift: Date;
  shiftsPerDay: number;
}

export interface IConfigDoc extends IConfig, Document {
}

export interface IConfigModel extends Model<IConfigDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateConfigBody = Partial<IConfig>;


export type NewCreatedConfig = Partial<IConfig>;


