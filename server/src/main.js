import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import passport from 'passport';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import passportConfig from './passport/index.js';
import authRouter from './routes/auth.js';
import regionRouter from './routes/region.js';
import categoryRouter from './routes/category.js';
import goodsRouter from './routes/goods.js';
import goodsPhotoRouter from './routes/goods-photo.js';
import goodsWishRouter from './routes/goods-wish.js';
import goodsChattingRouter from './routes/goods-chatting.js';

import helmet from 'helmet';
import expressMysqlSession from 'express-mysql-session';
const MySQLStore = expressMysqlSession(session);

dotenv.config();

const corsOption = {
  origin: 'https://deal-13.s3.ap-northeast-2.amazonaws.com/',
};

const app = express();

app.set('port', process.env.PORT || 3000);

import { createRequire } from 'module'; // Bring in the ability to create the 'require' method
const require = createRequire(import.meta.url); // construct the require method
const options = require('./config/config.json'); // use the require method

passportConfig();

app.use(cors(corsOption));
if (process.env.NODE_ENV === 'production') {
  console.log('production mode');
  app.use(morgan('combined'));
  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );
} else {
  console.log('development mode');
  app.use(morgan('dev'));
}

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    store: new MySQLStore(options),
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24, // 1일
    },
    name: 'baemin-cookie',
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRouter);
app.use('/api/region', regionRouter);
app.use('/api/category', categoryRouter);
app.use('/api/goods', goodsRouter);
app.use('/api/goods-photo', goodsPhotoRouter);
app.use('/api/goods-wish', goodsWishRouter);
app.use('/api/goods-chatting', goodsChattingRouter);

app.use('/', express.static(path.join(__dirname, '../../client/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  console.error(err);
  return res.status(err.status || 500).json(err);
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});
