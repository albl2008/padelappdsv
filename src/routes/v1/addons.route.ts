import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import { addonController, addonValidation } from '../../modules/addons';

const router: Router = express.Router();

router
  .route('/')
  .post(auth('manageAddon'), validate(addonValidation.createAddon), addonController.createAddon)
  .get(auth('getAddon'), validate(addonValidation.getAddons), addonController.getAddons);

router
  .route('/:addonId')
  .get(auth('getAddon'), validate(addonValidation.getAddon), addonController.getAddon)
  .patch(auth('manageAddon'), validate(addonValidation.updateAddon), addonController.updateAddon)
  .delete(auth('manageAddon'), validate(addonValidation.deleteAddon), addonController.deleteAddon);

export default router;
