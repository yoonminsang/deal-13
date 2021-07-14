import express from 'express';
import db from '../db/index.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import passport from 'passport';

const router = express.Router();

router.get('/', (req, res) => {
  const { user } = req;
  if (user) return res.json({ user });
  return res.status(401).json('자동 로그인 실패');
});

router.post('/register', (req, res, next) => {
  const register = (regionId, uuid, id, password) => {
    db.query(
      `INSERT INTO region_list(region_id, user_id) VALUES('${regionId}', '${uuid}')`,
    )
      .then(() => {
        return bcrypt.hash(password, 10);
      })
      .then((hash) => {
        db.query(
          `INSERT INTO users(uuid, id, password) VALUES('${uuid}', '${id}', '${hash}')`,
        ).then(() => {
          return res.json('회원가입 완료');
        });
      })
      .catch((e) => {
        console.error(e);
      });
  };
  const { id, password, region } = req.body;
  db.query(`SELECT EXISTS (SELECT * FROM users WHERE id='${id}') as exist`)
    .then(([existRow]) => {
      if ([existRow][0].exist) {
        res.status(409).json('아이디가 존재합니다');
        throw new Error('아이디가 존재합니다');
      }
      return db.query(`SELECT id FROM regions WHERE region='${region}')`);
    })
    .then(([regRow]) => {
      const uuid = uuidv4();
      const region = regRow && regRow[0];
      if (region) {
        const regionId = region.id;
        register(regionId, uuid, id, password);
      } else {
        db.query(`INSERT INTO regions(region) VALUES('${region}')`).then(
          (insertRes) => {
            const regionId = insertRes[0].insertId;
            register(regionId, uuid, id, password);
          },
        );
      }
    })
    .catch((e) => {
      console.error(e);
    });
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(409).json('아이디 또는 비밀번호가 틀립니다');
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect('/auth');
    });
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  return res.json('로그아웃');
});

export default router;
