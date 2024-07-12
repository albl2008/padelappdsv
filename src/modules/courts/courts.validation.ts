import Joi from 'joi';
import { objectId } from '../validate/custom.validation';
import { NewCreatedCourt } from './courts.interfaces';

const createCourtBody: Record<keyof NewCreatedCourt, any> = {
  name: Joi.string().required(),
  number: Joi.number().required(),
  surface: Joi.string().required(),
  walls: Joi.string().required().valid('cemento', 'blindex'),
 
//   inUse:Joi.boolean.required()
};

export const createCourt = {
  body: Joi.object().keys(createCourtBody),
};

export const getCourts = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getCourt = {
  params: Joi.object().keys({
    courtId: Joi.string().custom(objectId),
  }),
};

export const updateCourt = {
  params: Joi.object().keys({
    courtId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
        name: Joi.string(),
        number: Joi.number(),
        surface: Joi.string().valid('cemento', 'sintetico'),
        walls: Joi.string().valid('cemento', 'blindex'),
        
    })
    .min(1),
};

export const deleteCourt = {
  params: Joi.object().keys({
    courtId: Joi.string().custom(objectId),
  }),
};

export const createAllCourts = {
  params: Joi.object().keys({
    configId: Joi.string().custom(objectId),
  })
}
