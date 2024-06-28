import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import pick from '../utils/pick';
import { IOptions } from '../paginate/paginate';
import * as shiftService from './shifts.service';
import dayjs from 'dayjs';
import { courtService } from '../courts';

export const createShift = catchAsync(async (req: Request, res: Response) => {
  const shift = await shiftService.createShift(req.body);
  res.status(httpStatus.CREATED).send(shift);
});

export const getShifts = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name', 'role']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  options.limit = 2000
  options.populate = 'court'
  filter.user = req.user.id
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

export const getShiftsMonth = catchAsync(async(req:Request, res: Response)=> {
  const month = dayjs(req.params['month']).toDate()
  month.setMonth(month.getMonth()-1)
  debugger
  const created = await shiftService.doShiftsExistForDate(month,req.user.id)

  res.send(created)

})

export const createShiftsMonth = catchAsync(async (req:Request, res:Response) => {
  try {
    const configData = req.body;
    const user = req.user.id
    const month = dayjs(req.params['month']).toDate()
    month.setMonth(month.getMonth()-1)

    const created = await shiftService.doShiftsExistForDate(month,req.user.id)
    if (created) {
      await shiftService.deleteShiftsForDate(month)
    }
    debugger
    // Generate shifts based on configData
    if (month){
        const shifts = await generateShifts(month,configData,user);
        debugger
        await shiftService.createShiftsMonth(shifts);
        res.status(200).json({ message: 'Shifts created successfully' });
    }

    // Save shifts to the database

  } catch (error) {
    console.error('Error creating shifts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


const generateShifts = async (month: Date, configData: any, user: mongoose.Types.ObjectId) => {
  const { shiftDuration, shiftsPerDay, firstShift, tolerance, operativeDays, courtsQuantity } = configData;
  const shifts = [];

  // Get the first day of the current month
  const firstDayOfMonth = dayjs(month).startOf('month');
  const lastDayOfMonth = dayjs(month).endOf('month');

  // Loop through all days of the month
  for (let i = firstDayOfMonth.date(); i <= lastDayOfMonth.date(); i++) {
    const currentDate = dayjs(firstDayOfMonth).set('date', i);
    if (!operativeDays.includes(currentDate.day())) {
      continue;
    }
    for (let j = 0; j < shiftsPerDay; j++) {
      for (let k = 0; k < courtsQuantity; k++) {
        const court = await courtService.getCourtByNumber(k + 1, user);
        if (!court) {
          throw new ApiError(httpStatus.NOT_FOUND, 'Court not found');
        }
        const startShift = dayjs(firstShift).add(j * shiftDuration, 'hour')
        const endShift = startShift.add(shiftDuration, 'hour')

        const startDate = currentDate
          .set('hour', startShift.hour())
          .set('minute', startShift.minute())
          .startOf('minute');

        const endDate = currentDate
          .set('hour', endShift.hour())
          .set('minute', endShift.minute())
          .startOf('minute');

        shifts.push({
          duration: shiftDuration,
          date: currentDate.toDate(),
          start: startDate.toDate(),
          end: endDate.toDate(),
          tolerance: tolerance,
          status: { id: 0, sta: 'available' },
          user: user,
          court: court.id,
        });
      }
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

export const bookingShift = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['shiftId'] === 'string') {
    const shiftToAssing = req.body
    shiftToAssing.status = { id: 1, sta: 'booked' }
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

export const getWeekShifts = catchAsync(async (req: Request, res: Response) => {
  const user = req.user.id
  const day = dayjs(req.params['day']).toDate()

  const shifts = await shiftService.getWeekShifts(day,user)
  res.send(shifts)
})
