import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import pick from '../utils/pick';
import { IOptions } from '../paginate/paginate';
import * as clubService from './club.service';
import * as userService from '../user/user.service';

export const createClub = catchAsync(async (req: Request, res: Response) => {
  req.body.user = req.user.id;
  const club = await clubService.createClub(req.body);
  await updateUserClubs(club._id, req.user.id);
  res.status(httpStatus.CREATED).send(club);
});


async function updateUserClubs (clubId: string, userId: string) {
  if (!clubId || !userId) {
    return;
  } else {
    const user = await userService.getUserById(new mongoose.Types.ObjectId(userId));
    if (user && user.clubs) {
      const actualClubs = user.clubs;
      if (actualClubs.length === 0) {
        debugger
        user.clubs.push(new mongoose.Types.ObjectId(clubId));
        user.activeClub = new mongoose.Types.ObjectId(clubId);
      } else {
        if (!user.clubs.includes(new mongoose.Types.ObjectId(clubId))) {
          user.clubs.push(new mongoose.Types.ObjectId(clubId));
        }
      }
      
      await user.save();
    }
  }
}

export const getActiveClub = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.getUserById(new mongoose.Types.ObjectId(req.user.id));
  if (user && user.clubs) {
    const club = await clubService.getClubById(new mongoose.Types.ObjectId(user.activeClub));
    res.send(club);
  } else {
    res.send(null);
  }
});


export const getClubs = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name', 'role']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  filter.user = req.user.id
  const result = await clubService.queryClubs(filter, options);
  res.send(result);
});

export const getClub = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['clubId'] === 'string') {
    const club = await clubService.getClubById(new mongoose.Types.ObjectId(req.params['clubId']));
    if (!club) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Club not found');
    }
    res.send(club);
  }
});

export const updateClub = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['clubId'] === 'string') {
    const club = await clubService.updateClubById(new mongoose.Types.ObjectId(req.params['clubId']), req.body);
    res.send(club);
  }
});

async function deleteUserClubs (clubId: string, userId: string) {
  if (!clubId || !userId) {
    return;
  } else {
    const user = await userService.getUserById(new mongoose.Types.ObjectId(userId));
    debugger
    if (user && user.clubs) {
      if (new mongoose.Types.ObjectId(user.activeClub) === new mongoose.Types.ObjectId(clubId)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Can not delete active club');
        return false
      } else {
        user.clubs.splice(user.clubs.indexOf(new mongoose.Types.ObjectId(clubId)), 1);
        await user.save();
        return true
      }
      
    }
    return false
  }
}

export const deleteClub = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['clubId'] === 'string') {
    const response = await deleteUserClubs(req.params['clubId'], req.user.id);
    if (response){
      await clubService.deleteClubById(new mongoose.Types.ObjectId(req.params['clubId']));
      res.status(httpStatus.NO_CONTENT).send();
    }
    
  }
});
