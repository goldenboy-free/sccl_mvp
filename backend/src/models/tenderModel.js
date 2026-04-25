import db from '../config/db.js';

export function createTenderTable() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS tenders (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      title        TEXT NOT NULL,
      description  TEXT,
      closing_date TEXT,
      opening_date TEXT,
      created_at   TEXT DEFAULT (datetime('now'))
    )
  `);
}

export function createTender({ title, description, closing_date, opening_date }) {
  const stmt = db.prepare(
    `INSERT INTO tenders (title, description, closing_date, opening_date)
     VALUES (?, ?, ?, ?)`
  );
  const result = stmt.run(title, description, closing_date, opening_date);
  return findTenderById(result.lastInsertRowid);
}

export function findTenderById(id) {
  return db.prepare(`SELECT * FROM tenders WHERE id = ?`).get(id) ?? null;
}

export function findAllTenders() {
  return db.prepare(`SELECT * FROM tenders ORDER BY created_at DESC`).all();
}

export function findTenderWithBids(tenderId) {
  const rows = db.prepare(`
    SELECT t.id, t.title, t.description, t.closing_date, t.opening_date,
           b.id AS bid_id, b.amount, b.status, b.user_id, b.created_at AS bid_created_at
    FROM tenders t
    LEFT JOIN bids b ON b.tender_id = t.id
    WHERE t.id = ?
  `).all(tenderId);

  if (!rows.length) return null;
  return {
    id: rows[0].id,
    title: rows[0].title,
    description: rows[0].description,
    closingDate: rows[0].closing_date,
    openingDate: rows[0].opening_date,
    bids: rows
      .filter(r => r.bid_id !== null)
      .map(r => ({ id: r.bid_id, amount: r.amount, status: r.status, userId: r.user_id, createdAt: r.bid_created_at })),
  };
}

export function updateTender(id, fields) {
  const keys = Object.keys(fields);
  const values = Object.values(fields);
  const setClause = keys.map(k => `${k} = ?`).join(', ');
  const result = db.prepare(
    `UPDATE tenders SET ${setClause} WHERE id = ?`
  ).run(...values, id);
  return result.changes > 0 ? findTenderById(id) : null;
}

export function deleteTender(id) {
  db.prepare(`DELETE FROM tenders WHERE id = ?`).run(id);
}