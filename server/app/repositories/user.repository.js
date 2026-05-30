const { User } = require('../models');

class UserRepository {
  mapRow(instance) {
    if (!instance) return null;
    const row = instance.dataValues || instance;
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role,
      email_verified_at: row.email_verified_at,
      password: row.password,
      remember_token: row.remember_token,
      created_at: row.created_at,
      updated_at: row.updated_at
    };
  }

  async findByEmail(email) {
    const instance = await User.findOne({ where: { email } });
    return this.mapRow(instance);
  }

  async findById(id) {
    const instance = await User.findByPk(id);
    return this.mapRow(instance);
  }

  async create({ name, email, password, role }) {
    const instance = await User.create({
      name,
      email,
      password,
      role: role || 'user'
    });
    return this.mapRow(instance);
  }
}

module.exports = new UserRepository();
