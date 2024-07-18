import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Club from './club.model';
import ApiError from '../errors/ApiError';
import { IOptions, QueryResult } from '../paginate/paginate';
import { NewCreatedClub, UpdateClubBody, IClubDoc } from './club.interfaces';

/**
 * Create a club
 * @param {NewCreatedClub} clubBody
 * @returns {Promise<IClubDoc>}
 */
export const createClub = async (clubBody: NewCreatedClub): Promise<IClubDoc> => {
  return Club.create(clubBody);
};

/**
 * Query for clubs
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryClubs = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const clubs = await Club.paginate(filter, options);
  return clubs;
};

/**
 * Get club by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IClubDoc | null>}
 */
export const getClubById = async (id: mongoose.Types.ObjectId): Promise<IClubDoc | null> => Club.findById(id);

// /**
//  * Get club by email
//  * @param {string} email
//  * @returns {Promise<IClubDoc | null>}
//  */
// export const getClubByEmail = async (email: string): Promise<IClubDoc | null> => Club.findOne({ email });

/**
 * Update club by id
 * @param {mongoose.Types.ObjectId} clubId
 * @param {UpdateClubBody} updateBody
 * @returns {Promise<IClubDoc | null>}
 */
export const updateClubById = async (
  clubId: mongoose.Types.ObjectId,
  updateBody: UpdateClubBody
): Promise<IClubDoc | null> => {
  const club = await getClubById(clubId);
  if (!club) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Club not found');
  }
  Object.assign(club, updateBody);
  await club.save();
  return club;
};

/**
 * Delete club by id
 * @param {mongoose.Types.ObjectId} clubId
 * @returns {Promise<IClubDoc | null>}
 */
export const deleteClubById = async (clubId: mongoose.Types.ObjectId): Promise<IClubDoc | null> => {
  const club = await getClubById(clubId);
  if (!club) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Club not found');
  }
  await club.deleteOne();
  return club;
};
