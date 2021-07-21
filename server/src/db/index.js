import mysql from 'mysql2/promise';
import dbOption from '../config/config.json';
const db = mysql.createPool(dbOption);

export const selectQuery = async (query) => {
  const _conn = await db.getConnection();
  try {
    const [row, _] = await _conn.query(query);
    return JSON.parse(JSON.stringify(row));
  } catch (err) {
    console.error(err);
  } finally {
    _conn.release();
  }
};

export const execQuery = async (query) => {
  const _conn = await db.getConnection();
  try {
    await _conn.beginTransaction();
    const [row, _] = await _conn.query(query);
    await _conn.commit();
    return JSON.parse(JSON.stringify(row));
  } catch (err) {
    console.error(err);
  } finally {
    _conn.release();
  }
};

export default db;
