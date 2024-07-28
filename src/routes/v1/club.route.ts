import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import { clubController, clubValidation } from '../../modules/club';

const router: Router = express.Router();

router
  .route('/')
  .post(auth('manageClub'), validate(clubValidation.createClub), clubController.createClub)
  .get(auth('getClub'), validate(clubValidation.getClubs), clubController.getClubs);

router
  .route('/:clubId')
  .get(auth('getClub'), validate(clubValidation.getClub), clubController.getClub)
  .patch(auth('manageClub'), validate(clubValidation.updateClub), clubController.updateClub)
  .delete(auth('manageClub'), validate(clubValidation.deleteClub), clubController.deleteClub);

router
  .route('/club/active')
  .get(auth('getClub'), clubController.getActiveClub);

export default router;
