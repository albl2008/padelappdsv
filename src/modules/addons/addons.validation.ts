import Joi from 'joi';
import { objectId } from '../validate/custom.validation';
import { NewCreatedAddon } from './addons.interfaces';

const createAddonBody: Record<keyof NewCreatedAddon, any> = {
  price: Joi.number().required(),
  description: Joi.string().required(),
  unit: Joi.boolean().required(),
  type: Joi.boolean().required(),
  club: Joi.string().custom(objectId),

//   inUse:Joi.boolean.required()
};

export const createAddon = {
  body: Joi.object().keys(createAddonBody),
};

export const getAddons = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getAddon = {
  params: Joi.object().keys({
    addonId: Joi.string().custom(objectId),
  }),
};

export const updateAddon = {
  params: Joi.object().keys({
    addonId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      price: Joi.number(),
      description: Joi.string(),
      unit: Joi.boolean(),
      type: Joi.boolean(),
    })
    .min(1),
};

export const deleteAddon = {
  params: Joi.object().keys({
    addonId: Joi.string().custom(objectId),
  }),
};
