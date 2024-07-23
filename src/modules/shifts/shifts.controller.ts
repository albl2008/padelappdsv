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
  filter.club = req.user.activeClub
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
  
  debugger
  const created = await shiftService.doShiftsExistForDate(month,req.user.activeClub)

  res.send(created)

})


export const getShiftsNextDays = catchAsync(async(req:Request, res: Response)=> {
  const { today, limit } = req.body
  const todayDate = dayjs(today).toDate()
  const limitDate = dayjs(today).add(limit, 'day').toDate()

  const shifts = await shiftService.getShiftsNextDays(todayDate, limitDate, req.user.activeClub)
  res.send(shifts)

})

export const createShiftsMonth = catchAsync(async (req:Request, res:Response) => {
  try {
    const configData = req.body;
    const club = req.user.activeClub
    const month = dayjs(req.params['month']).toDate()
    

    const created = await shiftService.doShiftsExistForDate(month,req.user.activeClub)
    if (created) {
      await shiftService.deleteShiftsForDate(month)
    }
    debugger
    // Generate shifts based on configData
    if (month){
        const shifts = await generateShifts(month,configData,club);
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


const generateShifts = async (month: Date, configData: any, club: mongoose.Types.ObjectId) => {
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
        const court = await courtService.getCourtByNumber(k + 1, club);
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
          club: club,
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
    debugger
    const fixed = req.body.fixed
    if (fixed) {
      const start = dayjs(req.body.start).toDate()
      const day = dayjs(start).day()
      const firstDayOfMonth = dayjs(req.body.start).startOf('month').toDate();
      const lastDayOfMonth = dayjs(req.body.start).endOf('month').toDate();
      const monthlyShifts = await shiftService.getShiftsMonth(firstDayOfMonth, lastDayOfMonth,new mongoose.Types.ObjectId(req.body.court), req.user.activeClub)
      if (!monthlyShifts) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Shifts not found');
      }
      const sameDayShifts = monthlyShifts.filter(shift => {
        const dayDate = dayjs(shift.date).day()
        if (dayDate === day) {
        const startHour = dayjs(shift.start).hour()
        return startHour === dayjs(start).hour()
        }
        return false
      })

      if (sameDayShifts.length > 0) {
        for (const shift of sameDayShifts) {
          shift.status = { id: 1, sta: 'booked' }
          req.body = {
            ...shiftToAssing,
            status: shift.status
          }
          await shiftService.updateShiftById(new mongoose.Types.ObjectId(shift.id), req.body);
        }
        res.send(sameDayShifts)
      }
    } else {
      shiftToAssing.status = { id: 1, sta: 'booked' }
      const shift = await shiftService.updateShiftById(new mongoose.Types.ObjectId(req.params['shiftId']), req.body);
      res.send(shift);
    }
    
  }
});

export const deleteShift = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['shiftId'] === 'string') {
    await shiftService.deleteShiftById(new mongoose.Types.ObjectId(req.params['shiftId']));
    res.status(httpStatus.NO_CONTENT).send();
  }
});

export const getWeekShifts = catchAsync(async (req: Request, res: Response) => {
  const club = req.user.activeClub
  const day = dayjs(req.params['day']).toDate()

  const shifts = await shiftService.getWeekShifts(day,club)
  res.send(shifts)
})


