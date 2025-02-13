const express = require('express');
const { nanoid } = require('nanoid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const urlMap = {};

// Serve a basic HTML form at the home route (GET /)
app.get('/', (req, res) => {
  res.send(`
    <h2>Enter a URL to shorten</h2>
    <form method="POST" action="/shorten">
      <input type="text" name="longUrl" placeholder="https://example.com" required>
      <button type="submit">Shorten</button>
    </form>
  `);
});

// Handle URL shortening (POST /shorten)
app.post('/shorten', (req, res) => {
  const longUrl = req.body.longUrl;

  // Simple validation: check if a URL was provided
  if (!longUrl) {
    return res.status(400).send('Error: No URL provided.');
  }

  // Generate a unique short code using nanoid
  const shortCode = nanoid(6); // 6-character ID

  // Store the mapping
  urlMap[shortCode] = longUrl;

  // Construct the shortened URL
  const shortUrl = `${req.protocol}://${req.get('host')}/${shortCode}`;
  res.send(`Your shortened URL: <a href="${shortUrl}">${shortUrl}</a>`);
});

// Handle redirection (GET /:shortCode)
app.get('/:shortCode', (req, res) => {
  const shortCode = req.params.shortCode;
  const longUrl = urlMap[shortCode];

  if (longUrl) {
    // Redirect to the original URL
    return res.redirect(longUrl);
  } else {
    // If no mapping found, return a 404
    return res.status(404).send('Invalid short URL.');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
