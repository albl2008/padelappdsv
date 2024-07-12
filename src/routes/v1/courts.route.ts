import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import { courtController, courtValidation } from '../../modules/courts';

const router: Router = express.Router();

router
  .route('/')
  .post(auth('manageCourts'), validate(courtValidation.createCourt), courtController.createCourt)
  .get(auth('getCourts'), validate(courtValidation.getCourts), courtController.getCourts);

router
  .route('/create-all/:configId')
  .post(auth('manageCourts'), validate(courtValidation.createAllCourts), courtController.createAllCourts);

router
  .route('/:courtId')
  .get(auth('getCourts'), validate(courtValidation.getCourt), courtController.getCourt)
  .patch(auth('manageCourts'), validate(courtValidation.updateCourt), courtController.updateCourt)
  .delete(auth('manageCourts'), validate(courtValidation.deleteCourt), courtController.deleteCourt);

export default router;
