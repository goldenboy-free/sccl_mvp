import db from '../config/db.js';

export function createAuditTable() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS audits (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      action     TEXT NOT NULL,
      details    TEXT,
      user_id    INTEGER REFERENCES users(id) ON DELETE SET NULL,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
}

export function log({ action, details, user_id = null }) {
  const stmt = db.prepare(
      `INSERT INTO audits (action, details, user_id) VALUES (?, ?, ?)`
  );
  const result = stmt.run(action, details, user_id);
  return db.prepare(`SELECT * FROM audits WHERE id = ?`).get(result.lastInsertRowid);
}

export function findAll({ limit = 100, offset = 0 } = {}) {
  return db.prepare(`
    SELECT a.*, u.username
    FROM audits a
    LEFT JOIN users u ON u.id = a.user_id
    ORDER BY a.created_at DESC
    LIMIT ? OFFSET ?
  `).all(limit, offset);
}

export function findByUser(userId) {
  return db.prepare(
      `SELECT * FROM audits WHERE user_id = ? ORDER BY created_at DESC`
  ).all(userId);
}