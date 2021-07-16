import express from 'express';
import db from '../db/index.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import passport from 'passport';

const router = express.Router();

router.get('/', (req, res) => {
  const { user } = req;
  if (user) return res.json({ user });
  return res.status(401).json({ user: null, text: '자동 로그인 실패' });
});

router.post('/signup', async (req, res, next) => {
  const register = async (regionId, uuid, id, password) => {
    const hash = await bcrypt.hash(password + '', 10);
    await db.query(
      `INSERT INTO users(uuid, id, password) VALUES('${uuid}', '${id}', '${hash}')`,
    );
    await db.query(
      `INSERT INTO region_list(region_id, user_id) VALUES('${regionId}', '${uuid}')`,
    );
    return res.json({ text: '회원가입 완료' });
  };

  const { id, password, region } = req.body;
  const [[existId]] = await db.query(
    `SELECT EXISTS (SELECT * FROM users WHERE id='${id}') as exist`,
  );
  if (existId.exist)
    return res.status(409).json({ text: '아이디가 존재합니다' });
  const [[regions]] = await db.query(
    `SELECT id FROM regions WHERE region='${region}' LIMIT 1`,
  );
  const uuid = uuidv4();
  let regionId;
  if (regions) {
    regionId = regions.id;
  } else {
    const [regionsInsert] = await db.query(
      `INSERT INTO regions(region) VALUES('${region}')`,
    );
    regionId = regionsInsert.insertId;
  }
  register(regionId, uuid, id, password);
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user)
      return res.status(409).json({ text: '아이디 또는 비밀번호가 틀립니다' });
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect('/api/auth');
    });
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  return res.json({ text: '로그아웃' });
});

export default router;
