import mysql from 'mysql2/promise';
import { createRequire } from 'module'; // Bring in the ability to create the 'require' method
const require = createRequire(import.meta.url); // construct the require method
const dbOption = require('../config/config.json'); // use the require method
const db = mysql.createPool(dbOption);
export default db;
