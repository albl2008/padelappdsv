import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Court from './courts.model';
import ApiError from '../errors/ApiError';
import { IOptions, QueryResult } from '../paginate/paginate';
import { NewCreatedCourt, UpdateCourtBody, ICourtDoc, ICourt } from './courts.interfaces';

/**
 * Create a court
 * @param {NewCreatedCourt} courtBody
 * @returns {Promise<ICourtDoc>}
 */
export const createCourt = async (courtBody: NewCreatedCourt): Promise<ICourtDoc> => {
  return Court.create(courtBody);
};

/**
 * Query for courts
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryCourts = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const courts = await Court.paginate(filter, options);
  return courts;
};

/**
 * Get court by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<ICourtDoc | null>}
 */
export const getCourtById = async (id: mongoose.Types.ObjectId): Promise<ICourtDoc | null> => Court.findById(id);

// /**
//  * Get court by email
//  * @param {string} email
//  * @returns {Promise<ICourtDoc | null>}
//  */
// export const getCourtByEmail = async (email: string): Promise<ICourtDoc | null> => Court.findOne({ email });

/**
 * Update court by id
 * @param {mongoose.Types.ObjectId} courtId
 * @param {UpdateCourtBody} updateBody
 * @returns {Promise<ICourtDoc | null>}
 */
export const updateCourtById = async (
  courtId: mongoose.Types.ObjectId,
  updateBody: UpdateCourtBody
): Promise<ICourtDoc | null> => {
  const court = await getCourtById(courtId);
  if (!court) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Court not found');
  }
  Object.assign(court, updateBody);
  await court.save();
  return court;
};

/**
 * Delete court by id
 * @param {mongoose.Types.ObjectId} courtId
 * @returns {Promise<ICourtDoc | null>}
 */
export const deleteCourtById = async (courtId: mongoose.Types.ObjectId): Promise<ICourtDoc | null> => {
  const court = await getCourtById(courtId);
  if (!court) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Court not found');
  }
  await court.deleteOne();
  return court;
};


export const getCourtByNumber = async (number: number, club: mongoose.Types.ObjectId): Promise<ICourtDoc | null> => {
  const court = await Court.findOne({ number, club });
  return court;
}


export const createAllCourts = async (quantity:number, club: mongoose.Types.ObjectId) => {
  const courtsArray: ICourt[] = []

  for (let i = 0; i < quantity; i++) {
    courtsArray.push({
      name: `C ${i + 1}`,
      number: i + 1,
      surface: 'completar',
      walls: 'completar',
      club: club,
      inUse: false
    })
  }

  await Court.insertMany(courtsArray)
}