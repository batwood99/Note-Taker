const router = require('express').Router();
const store = require('../db/store');

module.exports = (app) => {
  app.get('/notes', (req, res) => {
    fs.readFile(path.join(__dirname, '../db/db.json'), 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to read notes data.' });
      }

      const notes = JSON.parse(data);
      res.json(notes);
    });
  });

  app.post('/notes', (req, res) => {
    const newNote = req.body;

    fs.readFile(path.join(__dirname, '../db/db.json'), 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to read notes data.' });
      }

      const notes = JSON.parse(data);
      newNote.id = notes.length + 1;
      notes.push(newNote);

      fs.writeFile(
        path.join(__dirname, '../db/db.json'),
        JSON.stringify(notes),
        (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to save note.' });
          }

          res.json(newNote);
        }
      );
    });
  });
  app.delete('/notes/:id', (req, res) => {
    const noteId = parseInt(req.params.id);

    fs.readFile(path.join(__dirname, '../db/db.json'), 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to read notes data.' });
      }

      let notes = JSON.parse(data);
      const updatedNotes = notes.filter((note) => note.id !== noteId);

      fs.writeFile(
        path.join(__dirname, '../db/db.json'),
        JSON.stringify(updatedNotes),
        (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to delete note.' });
          }

          res.json({ message: 'Note deleted successfully.' });
        }
      );
    });
  });
};