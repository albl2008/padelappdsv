import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import pick from '../utils/pick';
import { IOptions } from '../paginate/paginate';
import * as configService from './config.service';
import { shiftService } from '../shifts';
import { courtService } from '../courts';

export const createConfig = catchAsync(async (req: Request, res: Response) => {
  req.body.club = req.user.activeClub;
  const config = await configService.createConfig(req.body);
  
  res.status(httpStatus.CREATED).send(config);
});

export const getConfigs = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name', 'role']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  filter.club = req.user.activeClub
  const result = await configService.queryConfigs(filter, options);
  res.send(result);
});

export const getConfig = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['configId'] === 'string') {
    const config = await configService.getConfigById(new mongoose.Types.ObjectId(req.params['configId']));
    if (!config) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Config not found');
    }
    res.send(config);
  }
});

export const updateConfig = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['configId'] === 'string') {
    const existsShifts = await shiftService.existsShifts(req.user.activeClub);
    if (existsShifts){
      await shiftService.deleteAllShifts(req.user.activeClub)
    }
    const config = await configService.updateConfigById(new mongoose.Types.ObjectId(req.params['configId']), req.body);
    res.send(config);
  }
});

export const deleteConfig = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['configId'] === 'string') {
    const existsShifts = await shiftService.existsShifts(req.user.activeClub);
    if (existsShifts){
      await shiftService.deleteAllShifts(req.user.activeClub)
    }
    await courtService.deleteAllCourts(req.user.activeClub)
    await configService.deleteConfigById(new mongoose.Types.ObjectId(req.params['configId']));
    res.status(httpStatus.NO_CONTENT).send();
  }
});
