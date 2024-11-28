// Middleware to authenticate user
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send('Access Denied');

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.userId;
      next();
  } catch (err) {
      res.status(400).send('Invalid Token');
  }
};

// Create task
app.post('/tasks', authMiddleware, async (req, res) => {
  const { title, description, deadline, priority } = req.body;
  const task = new Task({ title, description, deadline, priority, user: req.userId });
  await task.save();
  res.status(201).send('Task created');
});

// Get tasks for a user
app.get('/tasks', authMiddleware, async (req, res) => {
  const tasks = await Task.find({ user: req.userId });
  res.json(tasks);
});

// Update task
app.put('/tasks/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, description, deadline, priority } = req.body;
  const task = await Task.findById(id);
  if (!task) return res.status(404).send('Task not found');
  if (task.user.toString() !== req.userId) return res.status(403).send('Not authorized');

  task.title = title || task.title;
  task.description = description || task.description;
  task.deadline = deadline || task.deadline;
  task.priority = priority || task.priority;
  await task.save();
  res.send('Task updated');
});

// Delete task
app.delete('/tasks/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const task = await Task.findById(id);
  if (!task) return res.status(404).send('Task not found');
  if (task.user.toString() !== req.userId) return res.status(403).send('Not authorized');

  await task.remove();
  res.send('Task deleted');
});
