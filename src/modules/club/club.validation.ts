import Joi from 'joi';
import { objectId } from '../validate/custom.validation';
import { NewCreatedClub } from './club.interfaces';

const createClubBody: Record<keyof NewCreatedClub, any> = {
  name: Joi.string().required(),
  location: Joi.object().keys({
    coordinates: Joi.array().required(),
  }),
  address: Joi.string().required(),
  logo: Joi.string().allow(null).allow(''),
  phone: Joi.number().required(),
  user: Joi.string().custom(objectId),
  courtsQuantity: Joi.number().required(),

};

export const createClub = {
  body: Joi.object().keys(createClubBody),
};

export const getClubs = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getClub = {
  params: Joi.object().keys({
    clubId: Joi.string().custom(objectId),
  }),
};

export const updateClub = {
  params: Joi.object().keys({
    clubId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      location: Joi.object().keys({
        coordinates: Joi.array().required(),
        type: Joi.string().valid('Point'),
      }),
      address: Joi.string(),
      logo: Joi.string().allow(null).allow(''),
      phone: Joi.number(),
      courtsQuantity: Joi.number(),
    })
    .min(1),
};

export const deleteClub = {
  params: Joi.object().keys({
    clubId: Joi.string().custom(objectId),
  }),
};
