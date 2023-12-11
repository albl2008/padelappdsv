import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import { shiftController, shiftValidation } from '../../modules/shifts';

const router: Router = express.Router();

router
  .route('/')
  .post(auth('manageShifts'), validate(shiftValidation.createShift), shiftController.createShift)
  .get(auth('getShifts'), validate(shiftValidation.getShifts), shiftController.getShifts);


router
  .route('/:month/getMonth')
  .get(auth('getShifts'), validate(shiftValidation.getShiftsMonth), shiftController.getShiftsMonth)


router
    .route('/:month/createShiftsMonth')
    .post(auth('manageShifts'), validate(shiftValidation.createShiftsMonth), shiftController.createShiftsMonth)

router
  .route('/:shiftId')
  .get(auth('getShifts'), validate(shiftValidation.getShift), shiftController.getShift)
  .patch(auth('manageShifts'), validate(shiftValidation.updateShift), shiftController.updateShift)
  .delete(auth('manageShifts'), validate(shiftValidation.deleteShift), shiftController.deleteShift);

export default router;
