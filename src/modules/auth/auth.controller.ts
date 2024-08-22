import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { tokenService } from '../token';
import { userService } from '../user';
import * as authService from './auth.service';
import { emailService } from '../email';
import { ApiError } from '../errors';

export const register = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.registerUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  const userCreated = await userService.getUserByEmail(req.body.email);
  if(!userCreated){
    throw new ApiError(httpStatus.NOT_FOUND, 'No se encontro el usuario')
  }
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(userCreated);
  await emailService.sendVerificationEmailUser(userCreated.email, verifyEmailToken, userCreated.name);

  res.status(httpStatus.CREATED).send({ user, tokens });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

export const refreshTokens = catchAsync(async (req: Request, res: Response) => {
  const userWithTokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...userWithTokens });
});

export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  await authService.resetPassword(req.query['token'], req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

export const sendVerificationEmail = catchAsync(async (req: Request, res: Response) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken, req.user.name);
  res.status(httpStatus.NO_CONTENT).send();
});


export const sendVerificationEmailUser = catchAsync(async (req: Request, res: Response) => {

  const user = await userService.getUserByEmail(req.body.email);
  if(!user){
    throw new ApiError(httpStatus.NOT_FOUND, 'No se encontro el usuario')
  }

  const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);
  await emailService.sendVerificationEmailUser(user.email, verifyEmailToken, user.name);
  res.status(httpStatus.NO_CONTENT).send();
});

export const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  console.log(req.query['token'])
  debugger
  let user = await authService.verifyEmail(req.query['token']);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No se encontro el usuario')
  }
  user.password = req.body.password;
  await userService.updateUserById(user._id, user);
  res.status(httpStatus.NO_CONTENT).send();
});
