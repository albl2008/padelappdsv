import { Model, Document, ObjectId } from 'mongoose';
import { QueryResult } from '../paginate/paginate';


export interface IAddon {
  price: number;
  description: string;
  unit: boolean; // $/un o $/turno
  type: boolean;  // alquiler o venta
  club: ObjectId;
}

export interface IAddonDoc extends IAddon, Document {
}

export interface IAddonModel extends Model<IAddonDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateAddonBody = Partial<IAddon>;


export type NewCreatedAddon = Partial<IAddon>;


