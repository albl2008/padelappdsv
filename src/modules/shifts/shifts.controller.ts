import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import pick from '../utils/pick';
import { IOptions } from '../paginate/paginate';
import * as shiftService from './shifts.service';

export const createShift = catchAsync(async (req: Request, res: Response) => {
  const shift = await shiftService.createShift(req.body);
  res.status(httpStatus.CREATED).send(shift);
});

export const getShifts = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name', 'role']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  options.limit = 200
  const result = await shiftService.queryShifts(filter, options);
  res.send(result);
});

export const getShift = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['shiftId'] === 'string') {
    const shift = await shiftService.getShiftById(new mongoose.Types.ObjectId(req.params['shiftId']));
    if (!shift) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Shift not found');
    }
    res.send(shift);
  }
});

export const createShiftsMonth = catchAsync(async (req:Request, res:Response) => {
  try {
    const configData = req.body;

    // Generate shifts based on configData
    const shifts = generateShifts(configData);

    // Save shifts to the database
    await shiftService.createShiftsMonth(shifts);

    res.status(200).json({ message: 'Shifts created successfully' });
  } catch (error) {
    console.error('Error creating shifts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


const generateShifts = (configData:any) => {
  const { shiftDuration, shiftsPerDay, firstShift } = configData;
  const shifts = [];

  // Get the first day of the current month
  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  // Loop through all days of the month
  for (let i = 0; i < new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate(); i++) {
    const currentDate = new Date(firstDayOfMonth);
    currentDate.setDate(firstDayOfMonth.getDate() + i);

    // Generate shifts for each day based on the configuration
    for (let j = 0; j < shiftsPerDay; j++) {
      const startHour = new Date(firstShift).getUTCHours() + j * shiftDuration;
      const endHour = startHour + shiftDuration;

      const startDate = new Date(currentDate);
      startDate.setUTCHours(startHour, 0, 0, 0);

      const endDate = new Date(currentDate);
      endDate.setUTCHours(endHour, 0, 0, 0);

      shifts.push({
        duration: shiftDuration,
        date: currentDate,
        start: startDate,
        end: endDate,
        status: { id: 0, sta: 'available' },
        // Add other properties as needed
      });
    }
  }

  return shifts;
};

export const updateShift = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['shiftId'] === 'string') {
    const shift = await shiftService.updateShiftById(new mongoose.Types.ObjectId(req.params['shiftId']), req.body);
    res.send(shift);
  }
});

export const deleteShift = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['shiftId'] === 'string') {
    await shiftService.deleteShiftById(new mongoose.Types.ObjectId(req.params['shiftId']));
    res.status(httpStatus.NO_CONTENT).send();
  }
});
