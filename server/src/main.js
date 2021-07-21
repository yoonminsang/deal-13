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

import ejs from 'ejs';

dotenv.config();

const corsOption = {
  origin: 'https://s3.console.aws.amazon.com:3000/',
};
const app = express();

app.set('views', path.join(__dirname, '../', '../', 'client', '/dist'));
app.set('view engine', 'ejs');
app.engine('html', ejs.renderFile);

app.set('port', process.env.PORT || 3000);

passportConfig();

app.use(cors());
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
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

// app.use(
//   '/',
//   express.static(path.join(__dirname, '../', '../', 'client', '/dist')),
// );
// app.get('*', (req, res) => {
//   res.render('index.html');
// });

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
  console.log(app.get('port'), '번 포트에서 대기 중');
});

// "start": "nodemon --experimental-json-modules src/main.js"
