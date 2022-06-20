import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const db = await open({
    filename: 'survey.db',
    driver: sqlite3.Database
})
db.exec("PRAGMA foreign_keys = ON");
export default db;