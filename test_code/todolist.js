const express = require('express');
const app = express();
const PORT = 3000;

// JSON 데이터 파싱 미들웨어
app.use(express.json());

// 메모리에 저장할 Todo 목록
let todos = ['study' ,'health'];
let idCounter = 1;

// 1. 전체 조회 (GET /todos)
app.get('/todos', (req, res) => {
  res.json(todos);
});

// 2. 생성 (POST /todos)
app.post('/todos', (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  const newTodo = {
    id: idCounter++,
    title,
    completed: false
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// 3. 수정 (PUT /todos/:id)
app.put('/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  const { title, completed } = req.body;
  const todo = todos.find(t => t.id === id);

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  if (title !== undefined) todo.title = title;
  if (completed !== undefined) todo.completed = completed;

  res.json(todo);
});

// 4. 삭제 (DELETE /todos/:id)
app.delete('/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = todos.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  const deletedTodo = todos.splice(index, 1);
  res.json(deletedTodo);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
