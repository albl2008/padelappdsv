import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import pick from '../utils/pick';
import { IOptions } from '../paginate/paginate';
import * as courtService from './courts.service';

export const createCourt = catchAsync(async (req: Request, res: Response) => {
  const court = await courtService.createCourt(req.body);
  res.status(httpStatus.CREATED).send(court);
});

export const getCourts = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name', 'role']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  const result = await courtService.queryCourts(filter, options);
  res.send(result);
});

export const getCourt = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['courtId'] === 'string') {
    const court = await courtService.getCourtById(new mongoose.Types.ObjectId(req.params['courtId']));
    if (!court) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Court not found');
    }
    res.send(court);
  }
});

export const updateCourt = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['courtId'] === 'string') {
    const court = await courtService.updateCourtById(new mongoose.Types.ObjectId(req.params['courtId']), req.body);
    res.send(court);
  }
});

export const deleteCourt = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['courtId'] === 'string') {
    await courtService.deleteCourtById(new mongoose.Types.ObjectId(req.params['courtId']));
    res.status(httpStatus.NO_CONTENT).send();
  }
});
