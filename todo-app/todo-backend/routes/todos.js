const express = require('express');
const { Todo } = require('../mongo');
const { getAsync, setAsync, incrAsync } = require('../redis');
const router = express.Router();

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({});
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const count = await getAsync('added_todos');
  console.log('count in router.post: ', count);
  if (!count) {
    await setAsync('added_todos', 1)
  } else {
    await incrAsync('added_todos')
  }
  const todo = await Todo.create({
    text: req.body.text,
    done: false,
  });
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params;
  req.todo = await Todo.findById(id);
  if (!req.todo) return res.sendStatus(404);

  next();
};

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete();
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  res.send(req.todo);
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  const { text, done } = req.body;

  // Update the todo item
  req.todo.text = text !== undefined ? text : req.todo.text;
  req.todo.done = done !== undefined ? done : req.todo.done;

  await req.todo.save();

  res.send(req.todo);
});

router.use('/:id', findByIdMiddleware, singleRouter);

module.exports = router;
