const pool = require('../db/connection');

async function getTasks(req, res) {
  try {
    const [tasks] = await pool.query(
      'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.userId]
    );
    const parsed = tasks.map(t => ({
      ...t,
      tags: t.tags ? t.tags.split(',').map(s => s.trim()).filter(Boolean) : []
    }));
    return res.status(200).json(parsed);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

async function createTask(req, res) {
  const { title, description, status, priority, due_date, tags } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required.' });
  }

  try {
    const tagsValue = Array.isArray(tags) ? tags.join(',') : (tags || null);
    const [result] = await pool.query(
      'INSERT INTO tasks (user_id, title, description, status, priority, due_date, tags) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        req.user.userId,
        title,
        description || null,
        status || 'todo',
        priority || 'medium',
        due_date || null,
        tagsValue
      ]
    );
    return res.status(201).json({ id: result.insertId, message: 'Task created' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

async function updateTask(req, res) {
  const { id } = req.params;
  const { title, description, status, priority, due_date, tags } = req.body;

  try {
    const tagsValue = Array.isArray(tags) ? tags.join(',') : tags;
    const [result] = await pool.query(
      `UPDATE tasks SET
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        status = COALESCE(?, status),
        priority = COALESCE(?, priority),
        due_date = COALESCE(?, due_date),
        tags = COALESCE(?, tags)
       WHERE id = ? AND user_id = ?`,
      [title, description, status, priority, due_date, tagsValue ?? null, id, req.user.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    return res.status(200).json({ message: 'Task updated' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

async function deleteTask(req, res) {
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      'DELETE FROM tasks WHERE id = ? AND user_id = ?',
      [id, req.user.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    return res.status(200).json({ message: 'Task deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

module.exports = { getTasks, createTask, updateTask, deleteTask };
