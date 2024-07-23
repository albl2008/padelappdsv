import express, { Router } from 'express';
import { uploadFileController } from '../../modules/uploadFile';
import upload from '../../modules/uploadFile/multer'
// import { auth } from '../../modules/auth';

const router: Router = express.Router();

router
  .route('/upload')
  .post(upload.single('file'), uploadFileController.createFiles)

router
  .route('/get/:url')
  .get(uploadFileController.getFile)


export default router