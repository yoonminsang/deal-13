import express from 'express';
import db from '../db/index.js';

const router = express.Router();

router.use((req, res, next) => {
  if (!req.user)
    return res.status(403).json({ error: '로그인 되어있지 않습니다.' });
  else next();
});

router.get('/', (req, res) => {
  const { user } = req;
  if (user) return res.json({ user });
  return res.status(401).json({ user: null, error: '자동 로그인 실패' });
});

router.post('/create', async (req, res) => {
  const { region } = req.body;
  const [[regions]] = await db.query(
    `SELECT id FROM regions WHERE region='${region}' LIMIT 1`,
  );
  let regionId;
  if (regions) {
    regionId = regions.id;
  } else {
    const [regionsInsert] = await db.query(
      `INSERT INTO regions(region) VALUES('${region}')`,
    );
    regionId = regionsInsert.insertId;
  }
  await db.query(
    `INSERT INTO region_list(region_id, user_id) VALUES('${regionId}', '${req.user.uuid}')`,
  );
  return res.json({ text: '동네 추가 완료' });
});

router.post('/delete', async (req, res) => {
  if (!req.user)
    return res.status(403).json({ error: '로그인 되어있지 않습니다.' });
  const { region } = req.body;
});

export default router;
