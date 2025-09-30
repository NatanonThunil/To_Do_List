import { Request, Response } from 'express';
import { Todo } from '../models/todo';

// อ่าน Todo ทั้งหมด
export const getTodos = async (req: Request, res: Response) => {
  try {
    const todos = await Todo.findAll({ order: [['id', 'ASC']] });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// สร้าง Todo ใหม่
export const createTodo = async (req: Request, res: Response) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const todo = await Todo.create({ title, completed: false });
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// อัปเดต Todo (title / completed)
export const updateTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;

    const todo = await Todo.findByPk(id);
    if (!todo) return res.status(404).json({ message: 'Todo not found' });

    if (title !== undefined) todo.title = title;
    if (completed !== undefined) todo.completed = completed;

    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// ลบ Todo
export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Todo.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: 'Todo not found' });

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};
