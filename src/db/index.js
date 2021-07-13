import mysql from 'mysql2/promise';
import dbOption from '../config/config.json';
const db = mysql.createPool(dbOption);
export default db;
