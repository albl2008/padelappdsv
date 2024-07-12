import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import pick from '../utils/pick';
import { IOptions } from '../paginate/paginate';
import * as addonService from './addons.service';

export const createAddon = catchAsync(async (req: Request, res: Response) => {
  req.body.user = req.user.id;
  const addon = await addonService.createAddon(req.body);
  
  res.status(httpStatus.CREATED).send(addon);
});

export const getAddons = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name', 'role']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  filter.user = req.user.id
  const result = await addonService.queryAddons(filter, options);
  res.send(result);
});

export const getAddon = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['addonId'] === 'string') {
    const addon = await addonService.getAddonById(new mongoose.Types.ObjectId(req.params['addonId']));
    if (!addon) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Addon not found');
    }
    res.send(addon);
  }
});

export const updateAddon = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['addonId'] === 'string') {
    const addon = await addonService.updateAddonById(new mongoose.Types.ObjectId(req.params['addonId']), req.body);
    res.send(addon);
  }
});

export const deleteAddon = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['addonId'] === 'string') {
    await addonService.deleteAddonById(new mongoose.Types.ObjectId(req.params['addonId']));
    res.status(httpStatus.NO_CONTENT).send();
  }
});
