import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Request from './requests.model';
import ApiError from '../errors/ApiError';
import { IOptions, QueryResult } from '../paginate/paginate';
import { NewCreatedRequest, UpdateRequestBody, IRequestDoc } from './requests.interface';
import { emailService } from '../email';
import { clubService } from '../club';
import { userService } from '../user';
import { tokenService } from '../token';

/**
 * Create a request
 * @param {NewCreatedRequest} requestBody
 * @returns {Promise<IRequestDoc>}
 */
export const createRequest = async (requestBody: NewCreatedRequest): Promise<IRequestDoc> => {
  if (await Request.isEmailTaken(requestBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Ya se ha solicitado con este correo');
  }
  return Request.create(requestBody);
};

/**
 * Query for requests
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryRequests = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const requests = await Request.paginate(filter, options);
  return requests;
};

/**
 * Get request by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IRequestDoc | null>}
 */
export const getRequestById = async (id: mongoose.Types.ObjectId): Promise<IRequestDoc | null> => Request.findById(id);

// /**
//  * Get request by email
//  * @param {string} email
//  * @returns {Promise<IRequestDoc | null>}
//  */
// export const getRequestByEmail = async (email: string): Promise<IRequestDoc | null> => Request.findOne({ email });

/**
 * Update request by id
 * @param {mongoose.Types.ObjectId} requestId
 * @param {UpdateRequestBody} updateBody
 * @returns {Promise<IRequestDoc | null>}
 */
export const updateRequestById = async (
  requestId: mongoose.Types.ObjectId,
  updateBody: UpdateRequestBody
): Promise<IRequestDoc | null> => {
  const request = await getRequestById(requestId);
  if (!request) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
  }
  Object.assign(request, updateBody);
  await request.save();
  return request;
};

/**
 * Delete request by id
 * @param {mongoose.Types.ObjectId} requestId
 * @returns {Promise<IRequestDoc | null>}
 */
export const deleteRequestById = async (requestId: mongoose.Types.ObjectId): Promise<IRequestDoc | null> => {
  const request = await getRequestById(requestId);
  if (!request) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
  }
  await request.deleteOne();
  return request;
};


export const invite = async (requestId: mongoose.Types.ObjectId) => {

  const request = await getRequestById(requestId);
  if (!request) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
  }
  const { displayName, email, clubName, location, address, courtsQuantity, phone  } = request;

  // create club, after that createUser and assing that club, finally send the email for verification
  
  const user = {
    name: displayName,
    email,
    verified: false,
    isEmailVerified: false,
    role: 'admin'

  }
  const userCreated = await userService.createUser(user);

  if(!userCreated){
    throw new ApiError(httpStatus.NOT_FOUND, 'No se encontro el usuario')
  }

  const point = {
    type: 'Point' as const,
    coordinates: [location.lng, location.lat] as [number, number] 
  };

  const newClub = {
    name: clubName,
    location: point,
    address,
    courtsQuantity,
    phone,
    user: userCreated._id
  }

  const createdClub = await clubService.createClub(newClub);
  if (!createdClub) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Club not found');
  }

  const userUpdated = {
    activeClub: createdClub._id,
    clubs: [createdClub._id]
  }

  await userService.updateUserById(userCreated._id, userUpdated);

  
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(userCreated);
  await emailService.sendVerificationEmailUser(userCreated.email, verifyEmailToken, userCreated.name);

  request.invited = true;
  
  await request.save();
  return request;

}