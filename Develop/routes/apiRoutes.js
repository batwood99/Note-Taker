const fs = require('fs');
const path = require('path');

module.exports = (app) => {
  app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, '../db/db.json'), 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to read notes data.' });
      }

      const notes = JSON.parse(data);
      res.json(notes);
    });
  });

  app.post('/api/notes', (req, res) => {
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