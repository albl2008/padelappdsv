import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import pick from '../utils/pick';
import { IOptions } from '../paginate/paginate';
import * as courtService from './courts.service';
import Court from './courts.model';
import { getConfigById } from '../config/config.service';
import { getClubById } from '../club/club.service';
import { shiftService } from '../shifts';

export const createCourt = catchAsync(async (req: Request, res: Response) => {
  req.body.club = req.user.activeClub;
  const isTaken = await Court.isNumberTaken(req.body.number, req.body.club);
  if (isTaken) {
    throw new Error('Court number is already taken for this club');
  }
  const court = await courtService.createCourt(req.body);
  res.status(httpStatus.CREATED).send(court);
});

export const getCourts = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name', 'role']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  filter.club = req.user.activeClub
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
    const existsShifts = await shiftService.shiftsByCourt(new mongoose.Types.ObjectId(req.params['courtId']), req.user.activeClub);
    if (existsShifts){
      await shiftService.deleteShiftsByCourt(new mongoose.Types.ObjectId(req.params['courtId']), req.user.activeClub)
    }
    await courtService.deleteCourtById(new mongoose.Types.ObjectId(req.params['courtId']));
    res.status(httpStatus.NO_CONTENT).send();
  }
});


export const createAllCourts = catchAsync(async (req: Request, res: Response) => {
  debugger
  if (typeof req.params['configId'] === 'string') {
    const config = await getConfigById(new mongoose.Types.ObjectId(req.params['configId']));
    if (!config) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Config not found');
    }
    const activeClub = req.user.activeClub
    const club = await getClubById(activeClub)
    if (!club) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Club not found');
    }
    const quantity = club.courtsQuantity
    await courtService.createAllCourts(quantity, req.user.activeClub);
  }
  res.status(httpStatus.NO_CONTENT).send();
});
