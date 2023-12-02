import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Config from './config.model';
import ApiError from '../errors/ApiError';
import { IOptions, QueryResult } from '../paginate/paginate';
import { NewCreatedConfig, UpdateConfigBody, IConfigDoc } from './config.interfaces';

/**
 * Create a config
 * @param {NewCreatedConfig} configBody
 * @returns {Promise<IConfigDoc>}
 */
export const createConfig = async (configBody: NewCreatedConfig): Promise<IConfigDoc> => {
  return Config.create(configBody);
};

/**
 * Query for configs
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryConfigs = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const configs = await Config.paginate(filter, options);
  return configs;
};

/**
 * Get config by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IConfigDoc | null>}
 */
export const getConfigById = async (id: mongoose.Types.ObjectId): Promise<IConfigDoc | null> => Config.findById(id);

// /**
//  * Get config by email
//  * @param {string} email
//  * @returns {Promise<IConfigDoc | null>}
//  */
// export const getConfigByEmail = async (email: string): Promise<IConfigDoc | null> => Config.findOne({ email });

/**
 * Update config by id
 * @param {mongoose.Types.ObjectId} configId
 * @param {UpdateConfigBody} updateBody
 * @returns {Promise<IConfigDoc | null>}
 */
export const updateConfigById = async (
  configId: mongoose.Types.ObjectId,
  updateBody: UpdateConfigBody
): Promise<IConfigDoc | null> => {
  const config = await getConfigById(configId);
  if (!config) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Config not found');
  }
  Object.assign(config, updateBody);
  await config.save();
  return config;
};

/**
 * Delete config by id
 * @param {mongoose.Types.ObjectId} configId
 * @returns {Promise<IConfigDoc | null>}
 */
export const deleteConfigById = async (configId: mongoose.Types.ObjectId): Promise<IConfigDoc | null> => {
  const config = await getConfigById(configId);
  if (!config) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Config not found');
  }
  await config.deleteOne();
  return config;
};
