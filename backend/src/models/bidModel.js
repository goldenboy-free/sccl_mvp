import db from '../config/db.js';

export function createBidTable() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS bids (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      amount     REAL NOT NULL,
      status     TEXT NOT NULL DEFAULT 'pending',
      user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      tender_id  INTEGER NOT NULL REFERENCES tenders(id) ON DELETE CASCADE,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
}

export function createBid({ amount, user_id, tender_id }) {
  const stmt = db.prepare(
    `INSERT INTO bids (amount, user_id, tender_id) VALUES (?, ?, ?)`
  );
  const result = stmt.run(amount, user_id, tender_id);
  return findBidById(result.lastInsertRowid);
}

export function findBidById(id) {
  return db.prepare(`SELECT * FROM bids WHERE id = ?`).get(id) ?? null;
}

export function findBidsByUser(userId) {
  return db.prepare(`
    SELECT b.*, t.title AS tender_title
    FROM bids b
    JOIN tenders t ON t.id = b.tender_id
    WHERE b.user_id = ?
    ORDER BY b.created_at DESC
  `).all(userId);
}

export function findBidsByTender(tenderId) {
  return db.prepare(`
    SELECT b.*, u.username
    FROM bids b
    JOIN users u ON u.id = b.user_id
    WHERE b.tender_id = ?
    ORDER BY b.amount ASC
  `).all(tenderId);
}

export function updateBidStatus(id, status) {
  db.prepare(`UPDATE bids SET status = ? WHERE id = ?`).run(status, id);
  return findBidById(id);
}

export function deleteBid(id) {
  db.prepare(`DELETE FROM bids WHERE id = ?`).run(id);
}