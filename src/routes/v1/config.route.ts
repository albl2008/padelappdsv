import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import { configController, configValidation } from '../../modules/config';

const router: Router = express.Router();

router
  .route('/')
  .post(auth('manageConfig'), validate(configValidation.createConfig), configController.createConfig)
  .get(auth('getConfig'), validate(configValidation.getConfigs), configController.getConfigs);

router
  .route('/:configId')
  .get(auth('getConfig'), validate(configValidation.getConfig), configController.getConfig)
  .patch(auth('manageConfig'), validate(configValidation.updateConfig), configController.updateConfig)
  .delete(auth('manageConfig'), validate(configValidation.deleteConfig), configController.deleteConfig);

export default router;
