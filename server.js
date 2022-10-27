const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();

//Interneal middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
  
  app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
  });
  
  //save note on db.json
app.post('/api/notes', (req, res) => {
    const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8') || '[]');
    const newNote = { ...req.body, id: uuidv4() };
    notes?.unshift(newNote);
    fs.writeFileSync('./db/db.json', JSON.stringify(notes));
    res.json(notes);
  });

  //get all notes form db.json
app.get('/api/notes', (req, res) => {
    const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8') || '[]');
    res.json(notes);
  });
  
  //delete single note from db.json
  app.delete('/api/notes/:id', (req, res) => {
    const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8') || '[]');
    const newNotes = notes.filter((note) => note.id !== req.params.id);
    fs.writeFileSync('./db/db.json', JSON.stringify(newNotes));
    res.json(newNotes);
  });