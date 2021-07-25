import express from 'express';
import db from '../db/index.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import passport from 'passport';
const router = express.Router();

router.get('/', (req, res) => {
  const { user } = req;
  if (user) return res.json({ user });
  return res.status(401).json({ user: null, error: '자동 로그인 실패' });
});

router.post('/signup', async (req, res, next) => {
  let regionId;
  const register = async (uuid, id, password) => {
    const hash = await bcrypt.hash(password + '', 10);
    await db.query(
      `INSERT INTO user(uuid, id, password) VALUES('${uuid}', '${id}', '${hash}');`,
    );
    await db.query(
      `INSERT INTO region_list(region_id, user_id) VALUES(${regionId}, '${id}');`,
    );

    return res.json({ text: '회원가입 완료' });
  };
  const { id, password, region } = req.body;
  const [[existId]] = await db.query(
    `SELECT EXISTS (SELECT * FROM user WHERE id='${id}') as exist;`,
  );
  if (existId.exist)
    return res.status(409).json({ error: '아이디가 존재합니다' });
  const [[sRegion]] = await db.query(
    `SELECT id FROM region WHERE region='${region}' LIMIT 1;`,
  );
  const uuid = uuidv4();
  if (sRegion) {
    regionId = sRegion.id;
  } else {
    const [regionInsert] = await db.query(
      `INSERT INTO region(region) VALUES('${region}');`,
    );
    regionId = regionInsert.insertId;
  }
  register(uuid, id, password);
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user)
      return res.status(409).json({ error: '아이디 또는 비밀번호가 틀립니다' });
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
