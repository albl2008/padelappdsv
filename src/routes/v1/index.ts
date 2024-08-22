import express, { Router } from 'express';
import authRoute from './auth.route';
import docsRoute from './swagger.route';
import userRoute from './user.route';
import courtsRoute from './courts.route';
import shiftsRoute from './shifts.route'
import config from '../../config/config';
import configRoute from './config.route';
import addonsRoute from './addons.route'
import clubRoute from './club.route'
import filesRoute from './upload-file.route'
import requestsAccessRoute from './requests.route'

const router = express.Router();

interface IRoute {
  path: string;
  route: Router;
}

const defaultIRoute: IRoute[] = [
  {
    path: '/request-access',
    route: requestsAccessRoute,
  },
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/config',
    route: configRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/courts',
    route: courtsRoute,
  },
  {
    path: '/shifts',
    route: shiftsRoute,
  },
  {
    path: '/addons',
    route: addonsRoute
  },
  {
    path: '/club',
    route: clubRoute
  },
  {
    path: '/files',
    route: filesRoute
  }

];

const devIRoute: IRoute[] = [
  // IRoute available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultIRoute.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devIRoute.forEach((route) => {
    router.use(route.path, route.route);
  });
}

export default router;
