import express from 'express';
import db from '../db/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const [category] = await db.query(`SELECT * from category`);
  return res.json({ category });
});

export default router;
