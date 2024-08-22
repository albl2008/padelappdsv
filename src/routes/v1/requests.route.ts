import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { requestValidation, requestController } from '../../modules/requestAccess';

const router: Router = express.Router();

router
  .route('/')
  .post(validate(requestValidation.createRequest), requestController.createRequest)
  .get(validate(requestValidation.getRequests), requestController.getRequests);

router
  .route('/:requestId')
  .get(validate(requestValidation.getRequest), requestController.getRequest)
  .patch(validate(requestValidation.updateRequest), requestController.updateRequest)
  .delete(validate(requestValidation.deleteRequest), requestController.deleteRequest);

router
  .route('/verify/:requestId')
  .patch(validate(requestValidation.updateRequest), requestController.updateRequest);

router
  .route('/invite/:requestId')
  .post(validate(requestValidation.invite), requestController.invite);


router.post('/new', validate(requestValidation.createRequest), requestController.createRequest);


export default router;