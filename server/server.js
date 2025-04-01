const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware to allow cross-origin requests
app.use(cors());

// Scraping function for AZLyrics using Puppeteer
const getLyricsFromAZLyrics = async (song, artist) => {
  try {
    // Format song and artist into the proper URL format
    const songQuery = song.replace(/\s+/g, '-').toLowerCase();
    const artistQuery = artist.replace(/\s+/g, '-').toLowerCase();

    // Construct the AZLyrics URL
    const url = `https://www.azlyrics.com/lyrics/${artistQuery}/${songQuery}.html`;
    console.log(`Constructed URL: ${url}`); // Log URL for debugging

    // Launch Puppeteer with the correct executablePath for Chrome on Windows
    const browser = await puppeteer.launch({
      headless: true,  // Run in headless mode (no UI)
      executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe'  // Update to the correct path to Chrome on Windows
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Extract lyrics from the page
    const lyrics = await page.evaluate(() => {
      const lyricsElement = document.querySelector('.col-xs-12.col-lg-8.text-center .lyricsh');
      return lyricsElement ? lyricsElement.textContent.trim() : null;
    });

    if (!lyrics) {
      throw new Error('Lyrics not found');
    }

    await browser.close();
    return lyrics;
  } catch (error) {
    console.error('Error fetching lyrics:', error.message);
    throw error;
  }
};

// Route to fetch lyrics
app.get('/', (req, res) => {
  res.send('Welcome to the Lyrics Finder API!');
});
app.get('/api/lyrics', async (req, res) => {
  const { song, artist } = req.query;

  // Validate the song and artist parameters
  if (!song || !artist) {
    return res.status(400).json({ message: 'Song and artist parameters are required' });
  }

  try {
    const lyrics = await getLyricsFromAZLyrics(song, artist);
    return res.json({ lyrics });
  } catch (error) {
    console.error('Error fetching lyrics:', error.message);
    if (error.message === 'Page not found') {
      return res.status(404).json({ message: 'Lyrics page not found for this song or artist' });
    }
    return res.status(500).json({ message: 'Error fetching lyrics', error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
