const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const User = require('../models/User');

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedTo', 'username');
    res.render('tasks/index.twig', { tasks });
  } catch (error) {
    res.status(500).render('error.twig', { error: 'Server error' });
  }
});

// Create task form
router.get('/create', async (req, res) => {
  try {
    const users = await User.find().select('username');
    res.render('tasks/create.twig', { users });
  } catch (error) {
    res.status(500).render('error.twig', { error: 'Server error' });
  }
});

// Create task
router.post('/', async (req, res) => {
  try {
    const { title, description, assignedTo, status } = req.body;
    const tasks = new Task({
      title,
      description,
      assignedTo,
      status,
    });
    
    await tasks.save();
    res.redirect('/tasks');
  } catch (error) {
    console.error(error); // Affiche l'erreur complète dans la console
    res.status(400).render('tasks/create.twig', { error: 'Invalid data: please fill out all fields correctly.' });
  }
});

// Edit task form
router.get('/:id/edit', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    const users = await User.find().select('username');
    res.render('tasks/edit.twig', { task, users });
  } catch (error) {
    res.status(404).render('error.twig', { error: 'Task not found' });
  }
});

// Update task
router.post('/:id', async (req, res) => {
  try {
    const { title, description, assignedTo, status } = req.body;
    await Task.findByIdAndUpdate(req.params.id, {
      title,
      description,
      assignedTo,
      status
    });
    res.redirect('/tasks');
  } catch (error) {
    res.status(400).render('error.twig', { error: 'Invalid data' });
  }
});

// Delete task
router.post('/:id/delete', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.redirect('/tasks');
  } catch (error) {
    res.status(500).render('error.twig', { error: 'Server error' });
  }
});

module.exports = router;