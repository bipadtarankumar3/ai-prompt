const db = require('../config/database');

class UserRepository {
  mapRow(row) {
    if (!row) return null;
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      email_verified_at: row.email_verified_at,
      password: row.password,
      remember_token: row.remember_token,
      created_at: row.created_at,
      updated_at: row.updated_at
    };
  }

  async findByEmail(email) {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return this.mapRow(result.rows[0]);
  }

  async findById(id) {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    return this.mapRow(result.rows[0]);
  }

  async create({ name, email, password }) {
    const result = await db.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, password]
    );
    return this.mapRow(result.rows[0]);
  }
}

module.exports = new UserRepository();
