import React, { useState } from 'react';
import axios from 'axios';  // Add this line to import axios
import './App.css';

function App() {
  const [song, setSong] = useState('');
  const [artist, setArtist] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [error, setError] = useState('');

  const handleSearch = async () => {
    try {
      // Clear previous error or lyrics
      setLyrics('');
      setError('');

      // Make a request to the backend API
      const response = await axios.get('http://localhost:5000/api/lyrics', {
        params: {
          song: song,
          artist: artist
        }
      });

      // Set lyrics in the state
      setLyrics(response.data.lyrics);
    } catch (err) {
      console.error('Error fetching lyrics:', err);
      setError('Error fetching lyrics. Please check the song and artist names.');
    }
  };

  return (
    <div className="App">
      {/* Wavy Background */}
      <div className="wave-container">
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
      </div>

      {/* Main content */}
      <h1>
        <i className="fas fa-music"></i> Lyrics Finder <i className="fas fa-headphones-alt"></i>
      </h1>
      
      <div>
        <input
          type="text"
          placeholder="Song"
          value={song}
          onChange={(e) => setSong(e.target.value)}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Artist"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
        />
      </div>
      <button onClick={handleSearch}>
        <i className="fas fa-search"></i> Search Lyrics
      </button>

      {error && <p>{error}</p>}
      {lyrics && <pre>{lyrics}</pre>}
    </div>
  );
}

export default App;
