import Joi from 'joi';
import { objectId } from '../validate/custom.validation';
import { NewCreatedRequest } from './requests.interface';

const createRequestBody: Record<keyof NewCreatedRequest, any> = {
  clubName: Joi.string().required(),
  email: Joi.string().required().email(),
  phone: Joi.number().required(),
  moreLocations: Joi.boolean().required(),
  location: Joi.object().keys({
    lat: Joi.number().required(),
    lng: Joi.number().required(),
  }),
  displayName: Joi.string().required(),
  address: Joi.string().required(),
  courtsQuantity: Joi.number().required(),
  verified: Joi.boolean(),
  invited: Joi.boolean(),
};

export const createRequest = {
  body: Joi.object().keys(createRequestBody),
};

export const getRequests = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getRequest = {
  params: Joi.object().keys({
    requestId: Joi.string().custom(objectId),
  }),
};

export const invite = {
    params: Joi.object().keys({
      requestId: Joi.string().custom(objectId),
    }),
  };

export const updateRequest = {
  params: Joi.object().keys({
    requestId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      clubName: Joi.string(),
      displayName: Joi.string(),
      email: Joi.string().email(),
      phone: Joi.number(),
      moreLocations: Joi.boolean(),
      location: Joi.object().keys({
        lat: Joi.number(),
        lng: Joi.number(),
      }),
      address: Joi.string(),
      courtsQuantity: Joi.number(),
      verified: Joi.boolean(),
      invited: Joi.boolean(),
    })
    .min(1),
};

export const deleteRequest = {
  params: Joi.object().keys({
    requestId: Joi.string().custom(objectId),
  }),
};
