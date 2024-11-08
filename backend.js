const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5001;
const SAVE_DIR = path.join(__dirname, 'saved_files');

// Middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(bodyParser.json());

// Ensure the save directory exists
if (!fs.existsSync(SAVE_DIR)) {
  fs.mkdirSync(SAVE_DIR);
}

// Endpoint to save a markdown file
app.post('/api/save', (req, res) => {
  const { filename, content } = req.body;
  if (!filename || !content) {
    return res.status(400).send('Filename and content are required.');
  }

  fs.writeFile(path.join(SAVE_DIR, filename), content, (err) => {
    if (err) {
      console.error('Error saving file:', err);
      return res.status(500).send('Error saving file.');
    }
    res.status(200).send('File saved successfully.');
  });
});

// Endpoint to get the list of saved files
app.get('/api/files', (req, res) => {
  fs.readdir(SAVE_DIR, (err, files) => {
    if (err) {
      console.error('Error reading files:', err);
      return res.status(500).send('Error reading files.');
    }
    res.json(files);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
