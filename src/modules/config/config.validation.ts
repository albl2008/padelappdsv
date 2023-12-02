import Joi from 'joi';
import { objectId } from '../validate/custom.validation';
import { NewCreatedConfig } from './config.interfaces';

const createConfigBody: Record<keyof NewCreatedConfig, any> = {
  shiftPrice: Joi.number().required(),
  shiftDuration: Joi.number().required().valid(1,1.5, 2,2.5,3),
  shiftsPerDay: Joi.number().required(),
  firstShift: Joi.date().required(),
  tolerance: Joi.number().required()
//   inUse:Joi.boolean.required()
};

export const createConfig = {
  body: Joi.object().keys(createConfigBody),
};

export const getConfigs = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getConfig = {
  params: Joi.object().keys({
    configId: Joi.string().custom(objectId),
  }),
};

export const updateConfig = {
  params: Joi.object().keys({
    configId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      shiftPrice: Joi.number(),
      shiftDuration: Joi.number().valid(1,1.5, 2,2.5,3),
      shiftsPerDay: Joi.number(),
      firstShift: Joi.date(),
      tolerance: Joi.number()
    })
    .min(1),
};

export const deleteConfig = {
  params: Joi.object().keys({
    configId: Joi.string().custom(objectId),
  }),
};
