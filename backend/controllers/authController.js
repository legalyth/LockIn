const pool = require('../db/connection');
const { hashPassword, verifyPassword } = require('../utils/hash');
const { generateToken } = require('../utils/jwt');

async function register(req, res) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  try {
    const hashed = await hashPassword(password);
    await pool.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashed]
    );
    return res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Username or email already exists.' });
    }
    console.error(err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const user = rows[0];
    const valid = await verifyPassword(password, user.password);

    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = generateToken(user.id, user.email);
    return res.status(200).json({ token, userId: user.id, username: user.username });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

async function updateProfile(req, res) {
  const { username, password } = req.body;

  if (!username && !password) {
    return res.status(400).json({ error: 'Provide at least a new username or password.' });
  }

  try {
    if (username) {
      await pool.query('UPDATE users SET username = ? WHERE id = ?', [username, req.user.userId]);
    }
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters.' });
      }
      const hashed = await hashPassword(password);
      await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashed, req.user.userId]);
    }
    return res.status(200).json({ message: 'Profile updated successfully.' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Username already taken.' });
    }
    console.error(err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

module.exports = { register, login, updateProfile };
