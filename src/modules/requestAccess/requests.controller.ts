import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import pick from '../utils/pick';
import { IOptions } from '../paginate/paginate';
import * as requestService from './requests.service';

export const createRequest = catchAsync(async (req: Request, res: Response) => {
  
  const request = await requestService.createRequest(req.body);
  
  res.status(httpStatus.CREATED).send(request);
});

export const getRequests = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name', 'role']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  
  const result = await requestService.queryRequests(filter, options);
  res.send(result);
});

export const getRequest = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['requestId'] === 'string') {
    const request = await requestService.getRequestById(new mongoose.Types.ObjectId(req.params['requestId']));
    if (!request) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
    }
    res.send(request);
  }
});

export const invite = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['requestId'] === 'string') {
    const request = await requestService.invite(new mongoose.Types.ObjectId(req.params['requestId']));
    res.send(request);
  }
});

export const updateRequest = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['requestId'] === 'string') {
    const request = await requestService.updateRequestById(new mongoose.Types.ObjectId(req.params['requestId']), req.body);
    res.send(request);
  }
});

export const deleteRequest = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['requestId'] === 'string') {
    await requestService.deleteRequestById(new mongoose.Types.ObjectId(req.params['requestId']));
    res.status(httpStatus.NO_CONTENT).send();
  }
});
