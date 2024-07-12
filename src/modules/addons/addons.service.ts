import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Addon from './addons.model';
import ApiError from '../errors/ApiError';
import { IOptions, QueryResult } from '../paginate/paginate';
import { NewCreatedAddon, UpdateAddonBody, IAddonDoc } from './addons.interfaces';

/**
 * Create a addon
 * @param {NewCreatedAddon} addonBody
 * @returns {Promise<IAddonDoc>}
 */
export const createAddon = async (addonBody: NewCreatedAddon): Promise<IAddonDoc> => {
  return Addon.create(addonBody);
};

/**
 * Query for addons
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryAddons = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const addons = await Addon.paginate(filter, options);
  return addons;
};

/**
 * Get addon by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IAddonDoc | null>}
 */
export const getAddonById = async (id: mongoose.Types.ObjectId): Promise<IAddonDoc | null> => Addon.findById(id);

// /**
//  * Get addon by email
//  * @param {string} email
//  * @returns {Promise<IAddonDoc | null>}
//  */
// export const getAddonByEmail = async (email: string): Promise<IAddonDoc | null> => Addon.findOne({ email });

/**
 * Update addon by id
 * @param {mongoose.Types.ObjectId} addonId
 * @param {UpdateAddonBody} updateBody
 * @returns {Promise<IAddonDoc | null>}
 */
export const updateAddonById = async (
  addonId: mongoose.Types.ObjectId,
  updateBody: UpdateAddonBody
): Promise<IAddonDoc | null> => {
  const addon = await getAddonById(addonId);
  if (!addon) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Addon not found');
  }
  Object.assign(addon, updateBody);
  await addon.save();
  return addon;
};

/**
 * Delete addon by id
 * @param {mongoose.Types.ObjectId} addonId
 * @returns {Promise<IAddonDoc | null>}
 */
export const deleteAddonById = async (addonId: mongoose.Types.ObjectId): Promise<IAddonDoc | null> => {
  const addon = await getAddonById(addonId);
  if (!addon) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Addon not found');
  }
  await addon.deleteOne();
  return addon;
};
