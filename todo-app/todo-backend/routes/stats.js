const express = require('express');
const { getAsync } = require('../redis');
const router = express.Router();

router.get('/', async (req, res) => {
  const count = await getAsync('added_todos');
  console.log('count:', count)
  return res.json({ added_todos: Number(count) || '0' });
});

module.exports = router;
