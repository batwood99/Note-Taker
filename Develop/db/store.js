const fs = require('fs').promises;
const path = require('path');
const { v1: uuidv1 } = require('uuid');

class Store {
  async read() {
    try {
      const filePath = path.join(__dirname, 'db/db.json');
      const data = await fs.readFile(filePath, 'utf8');
      return data;
    } catch (err) {
      throw new Error('Failed to read notes data.');
    }
  }

  async write(note) {
    try {
      const filePath = path.join(__dirname, 'db/db.json');
      await fs.writeFile(filePath, JSON.stringify(note));
    } catch (err) {
      throw new Error('Failed to write notes data.');
    }
  }

  async getNotes() {
    try {
      const notes = await this.read();
      const parsedNotes = JSON.parse(notes);
      if (!Array.isArray(parsedNotes)) {
        return [];
      }
      return parsedNotes;
    } catch (err) {
      throw new Error('Failed to retrieve notes.');
    }
  }

  async addNote(note) {
    const { title, text } = note;

    if (!title || !text) {
      throw new Error("Note 'title' and 'text' cannot be blank");
    }

    const newNote = { title, text, id: uuidv1() };

    try {
      const notes = await this.getNotes();
      const updatedNotes = [...notes, newNote];
      await this.write(updatedNotes);
      return newNote;
    } catch (err) {
      throw new Error('Failed to add note.');
    }
  }

  async removeNote(id) {
    try {
      const notes = await this.getNotes();
      const filteredNotes = notes.filter((note) => note.id !== id);
      await this.write(filteredNotes);
    } catch (err) {
      throw new Error('Failed to remove note.');
    }
  }
}

module.exports = new Store();
