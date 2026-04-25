import db from '../config/db.js';
import bcrypt from 'bcrypt';

export function createUserTable() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      username   TEXT UNIQUE NOT NULL,
      password   TEXT NOT NULL,
      role       TEXT NOT NULL CHECK (role IN ('admin', 'bidder')),
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
}

export async function createUser({ username, password, role }) {
  const hash = await bcrypt.hash(password, 10);
  const stmt = db.prepare(
    `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`
  );
  const result = stmt.run(username, hash, role);
  return findUserById(result.lastInsertRowid);
}

export function findUserById(id) {
  return db.prepare(
    `SELECT id, username, role, created_at FROM users WHERE id = ?`
  ).get(id) ?? null;
}

export function findUserByUsername(username) {
  return db.prepare(
    `SELECT * FROM users WHERE username = ?`
  ).get(username) ?? null;
}

export function findUserWithBids(userId) {
  const rows = db.prepare(`
    SELECT u.id, u.username, u.role,
           b.id AS bid_id, b.amount, b.created_at AS bid_created_at
    FROM users u
    LEFT JOIN bids b ON b.user_id = u.id
    WHERE u.id = ?
  `).all(userId);

  if (!rows.length) return null;
  return {
    id: rows[0].id,
    username: rows[0].username,
    role: rows[0].role,
    bids: rows
      .filter(r => r.bid_id !== null)
      .map(r => ({ id: r.bid_id, amount: r.amount, createdAt: r.bid_created_at })),
  };
}