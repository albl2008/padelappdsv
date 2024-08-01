import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Shift from './shifts.model';
import ApiError from '../errors/ApiError';
import { IOptions, QueryResult } from '../paginate/paginate';
import { NewCreatedShift, UpdateShiftBody, IShiftDoc } from './shifts.interfaces';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Club from '../club/club.model';
dayjs.extend(utc);

/**
 * Create a shift
 * @param {NewCreatedShift} shiftBody
 * @returns {Promise<IShiftDoc>}
 */
export const createShift = async (shiftBody: NewCreatedShift): Promise<IShiftDoc> => {
  return Shift.create(shiftBody);
};


export const createShiftsMonth = async(shifts:any):Promise<any> => {
   const shiftsCreated = await Shift.insertMany(shifts)
   return shiftsCreated
}



/**
 * Check if there are shifts for a given date
 * @param {Date} targetDate - The date to check for shifts
 * @returns {Promise<boolean>}
 */
export const doShiftsExistForDate = async (targetDate: Date, club:mongoose.Types.ObjectId): Promise<boolean> => {
  const startOfMonth = dayjs(targetDate).startOf('month');
  const endOfMonth = dayjs(targetDate).endOf('month');
  debugger
  try {
    // Query the database for shifts within the given date range
    const shifts = await Shift.find({
      date: {
        $gte: startOfMonth.toDate(),
        $lte: endOfMonth.toDate(),
      },
      club
    });
    return shifts.length > 0; // Return true if shifts exist, false otherwise
  } catch (error) {
    console.error('Error checking shifts for date:', error);
    throw error;
  }
};


export const deleteShiftsForDate = async (targetDate: Date): Promise<void> => {
  const startOfMonth = dayjs(targetDate).startOf('month');
  const endOfMonth = dayjs(targetDate).endOf('month');

  try {
    // Delete shifts within the given date range
    await Shift.deleteMany({
      date: {
        $gte: startOfMonth.toDate(),
        $lte: endOfMonth.toDate(),
      },
    });

    console.log(`Shifts for ${startOfMonth.format('MMMM YYYY')} deleted successfully.`);
  } catch (error) {
    console.error('Error deleting shifts for date:', error);
    throw error;
  }
};


/**
 * Query for shifts
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryShifts = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const shifts = await Shift.paginate(filter, options);
  return shifts;
};

/**
 * Get shift by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IShiftDoc | null>}
 */
export const getShiftById = async (id: mongoose.Types.ObjectId): Promise<IShiftDoc | null> => Shift.findById(id).populate('court').populate('addons');

// /**
//  * Get shift by email
//  * @param {string} email
//  * @returns {Promise<IShiftDoc | null>}
//  */
// export const getShiftByEmail = async (email: string): Promise<IShiftDoc | null> => Shift.findOne({ email });

/**
 * Update shift by id
 * @param {mongoose.Types.ObjectId} shiftId
 * @param {UpdateShiftBody} updateBody
 * @returns {Promise<IShiftDoc | null>}
 */
export const updateShiftById = async (
  shiftId: mongoose.Types.ObjectId,
  updateBody: UpdateShiftBody
): Promise<IShiftDoc | null> => {
  const shift = await getShiftById(shiftId);
  if (!shift) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Shift not found');
  }
  Object.assign(shift, updateBody);
  await shift.save();
  return shift;
};

/**
 * Delete shift by id
 * @param {mongoose.Types.ObjectId} shiftId
 * @returns {Promise<IShiftDoc | null>}
 */
export const deleteShiftById = async (shiftId: mongoose.Types.ObjectId): Promise<IShiftDoc | null> => {
  const shift = await getShiftById(shiftId);
  if (!shift) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Shift not found');
  }
  await shift.deleteOne();
  return shift;
};


export const getWeekShifts = async (day: Date, club: mongoose.Types.ObjectId) => {

  const dayDate  = dayjs(day).toDate()
  const weekStart = dayjs(dayDate).startOf('week').toDate()
  const weekEnd = dayjs(dayDate).endOf('week').toDate()
  const shifts = await Shift.find({
    date: {
      $gte: weekStart,
      $lte: weekEnd
    },
    club
  }).populate('court')
  return shifts
}


export const getShiftsNextDays = async (day: Date, limit:Date , club: mongoose.Types.ObjectId): Promise<IShiftDoc[] | null> => {

  const shifts = await Shift.find({
    date: {
      $gte: day,
      $lte: limit
    },
    club
  }).populate('court')
  return shifts
}


export const getShiftsMonth = async (start: Date, end: Date, courtId: mongoose.Types.ObjectId,  club: mongoose.Types.ObjectId): Promise<IShiftDoc[] | null> => {
  const shifts = await Shift.find({
    date: {
      $gte: start,
      $lte: end
    },
    court: courtId,
    club
  }).populate('court')
  return shifts
}

export const shiftsByCourt = async (courtId: mongoose.Types.ObjectId, club: mongoose.Types.ObjectId): Promise<boolean> => {

  const shifts = await Shift.find({
    court: courtId,
    club
  })
  if (shifts && shifts.length > 0) {
    return true
  }
  return false
}

export const deleteShiftsByCourt = async (courtId: mongoose.Types.ObjectId, club: mongoose.Types.ObjectId): Promise<any> => {
  return await Shift.deleteMany({
    court: courtId,
    club
  })

}

export const existsShifts = async (club: mongoose.Types.ObjectId): Promise<boolean> => {

  const shifts = await Shift.find({
    club
  })
  if (shifts && shifts.length > 0) {
    return true
  }
  return false
}

export const deleteAllShifts = async (club: mongoose.Types.ObjectId): Promise<any> => {
  return await Shift.deleteMany({
    club
  })

}


//querys for players
export const getShiftForPlayer = async (date:string,options:IOptions): Promise<any[] | null> => {
  debugger
  let now =  dayjs().subtract(3, 'hours').toDate();
  if(date != "00"){
     now =  dayjs(date).subtract(3, 'hours').toDate();
  }
  const endDay = dayjs().endOf('day').toDate();
  const page = options.page ? options.page : 1; // Current page number
  const limit = 10; // Number of clubs per page
  const aggregationPipeline :any = [
    {
      $group: {
        _id: "$club",
        shifts: { $push: "$$ROOT" }
      }
    },
    {
      $sort: { _id: 1 }
    },
    {
      $skip: (page - 1) * limit
    },
    {
      $limit: limit
    },
    {
      $unwind: "$shifts"
    },
    {
      $match: {
        "shifts.start": { $gte: now, $lte: endDay }
      }
    },
    {
      $group: {
        _id: {
          club: "$_id",
          court: "$shifts.court"
        },
        shifts: {
          $push: {
            duration: "$shifts.duration",
            date: "$shifts.date",
            start: "$shifts.start",
            end: "$shifts.end",
            tolerance: "$shifts.tolerance",
            status: "$shifts.status",
            client: "$shifts.client",
            price: "$shifts.price",
            fixed: "$shifts.fixed",
            addons: "$shifts.addons",
            court: "$shifts.court"
          }
        }
      }
    },
    {
      $group: {
        _id: "$_id.club",
        courts: {
          $push: {
            court: "$_id.court",
            shifts: "$shifts"
          }
        }
      }
    },
    {
      $lookup: {
        from: "clubs", // The name of the collection containing club details
        localField: "_id", // Field from the previous stage to match with `foreignField`
        foreignField: "_id", // Field in the clubs collection to match with `localField`
        as: "clubDetails"
      }
    },
    {
      $unwind: "$clubDetails"
    },
    {
      $project: {
        _id: 0,
        club: {
          id: "$_id",
          name: "$clubDetails.name",
          logo: "$clubDetails.logo"
        },
        courts: 1
      }
    }
  ];

  return Shift.aggregate(aggregationPipeline,{})
}

export const getShiftForPlayerAndDistance = async (date:string,options:IOptions,userLocation:{lat:number,lng:number}): Promise<any[] | null> => {
  let now = dayjs().subtract(3, 'hours').toDate();
  if (date != "00") {
    now = dayjs(date).subtract(3, 'hours').toDate();
  }
  const endDay = dayjs(now).endOf('day').toDate();
  const page = options.page ? options.page : 1; // Current page number
  const limit = 1; // Number of clubs per page
  const aggregationPipeline:any = [
    {
      $geoNear: {
        near: { type: "Point", coordinates: [userLocation.lng, userLocation.lat] },
        distanceField: "distance",
        spherical: true
      }
    },
    {
      $lookup: {
        from: "shifts",
        localField: "_id",
        foreignField: "club",
        as: "shifts"
      }
    },
    {
      $unwind: "$shifts"
    },
    {
      $match: {
        "shifts.start": { $gte: now, $lte: endDay }
      }
    },
    {
      $group: {
        _id: {
          club: "$_id",
          court: "$shifts.court"
        },
        shifts: {
          $push: {
            duration: "$shifts.duration",
            date: "$shifts.date",
            start: "$shifts.start",
            end: "$shifts.end",
            tolerance: "$shifts.tolerance",
            status: "$shifts.status",
            client: "$shifts.client",
            price: "$shifts.price",
            fixed: "$shifts.fixed",
            addons: "$shifts.addons",
            court: "$shifts.court"
          }
        },
        name: { $first: "$name" },
        logo: { $first: "$logo" },
        distance: { $first: "$distance" }
      }
    },
    {
      $group: {
        _id: "$_id.club",
        courts: {
          $push: {
            court: "$_id.court",
            shifts: "$shifts"
          }
        },
        name: { $first: "$name" },
        logo: { $first: "$logo" },
        distance: { $first: "$distance" }
      }
    },
    {
      $sort: { "distance": 1 }  // Sorting by distance
    },
    {
      $skip: (page - 1) * limit  // Ensure page is 1-based
    },
    {
      $limit: limit
    },
    {
      $project: {
        _id: 0,
        club: {
          id: "$_id",
          name: "$name",
          logo: "$logo",
          distance: "$distance"
        },
        courts: 1
      }
    }
  ];



  return Club.aggregate(aggregationPipeline).exec();
}