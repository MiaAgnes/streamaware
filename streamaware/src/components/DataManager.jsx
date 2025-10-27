import React, { useState, useEffect } from 'react';
import { populateFirestoreWithSampleData, checkIfDataExists } from '../firebase/sampleData.js';
import { getAllMovies, getAllSeries, searchContent, getContentByGenre } from '../firebase/firebaseData.js';

const DataManager = () => {
  const [status, setStatus] = useState('Ready to manage Firestore data');
  const [isLoading, setIsLoading] = useState(false);
  const [dataInfo, setDataInfo] = useState({ moviesCount: 0, seriesCount: 0, hasData: false });
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    checkData();
  }, []);

  const checkData = async () => {
    try {
      const info = await checkIfDataExists();
      setDataInfo(info);
      setStatus(`Database has ${info.moviesCount} movies and ${info.seriesCount} series`);
    } catch (error) {
      setStatus(`Error checking data: ${error.message}`);
    }
  };

  const populateData = async () => {
    setIsLoading(true);
    setStatus('🔄 Populating Firestore with sample data...');
    
    try {
      await populateFirestoreWithSampleData();
      setStatus('✅ Successfully populated Firestore with sample data!');
      await checkData(); // Refresh data info
    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMovies = async () => {
    setIsLoading(true);
    try {
      const moviesList = await getAllMovies();
      setMovies(moviesList);
      setStatus(`✅ Loaded ${moviesList.length} movies`);
    } catch (error) {
      setStatus(`❌ Error loading movies: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSeries = async () => {
    setIsLoading(true);
    try {
      const seriesList = await getAllSeries();
      setSeries(seriesList);
      setStatus(`✅ Loaded ${seriesList.length} series`);
    } catch (error) {
      setStatus(`❌ Error loading series: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    try {
      const results = await searchContent(searchTerm);
      setSearchResults(results);
      setStatus(`✅ Found ${results.length} results for "${searchTerm}"`);
    } catch (error) {
      setStatus(`❌ Search error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      padding: '20px',
      border: '2px solid #4CAF50',
      borderRadius: '8px',
      margin: '20px',
      backgroundColor: '#f0f8f0'
    }}>
      <h2>🗄️ Firestore Data Manager</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <div style={{
          backgroundColor: '#f5f5f5',
          padding: '15px',
          borderRadius: '4px',
          fontFamily: 'monospace',
          marginBottom: '15px'
        }}>
          {status}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <strong>Current Database Status:</strong>
          <ul>
            <li>Movies: {dataInfo.moviesCount}</li>
            <li>Series: {dataInfo.seriesCount}</li>
            <li>Has Data: {dataInfo.hasData ? 'Yes' : 'No'}</li>
          </ul>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <button 
            onClick={checkData}
            disabled={isLoading}
            style={{
              padding: '10px 15px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            🔄 Check Data
          </button>

          <button 
            onClick={populateData}
            disabled={isLoading || dataInfo.hasData}
            style={{
              padding: '10px 15px',
              backgroundColor: dataInfo.hasData ? '#ccc' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: dataInfo.hasData ? 'not-allowed' : 'pointer',
              marginRight: '10px'
            }}
          >
            📦 {dataInfo.hasData ? 'Data Already Exists' : 'Add Sample Data'}
          </button>

          <button 
            onClick={loadMovies}
            disabled={isLoading}
            style={{
              padding: '10px 15px',
              backgroundColor: '#ff9800',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            📽️ Load Movies
          </button>

          <button 
            onClick={loadSeries}
            disabled={isLoading}
            style={{
              padding: '10px 15px',
              backgroundColor: '#9c27b0',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            📺 Load Series
          </button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <input 
            type="text"
            placeholder="Search movies and series..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '8px', marginRight: '10px', width: '200px' }}
          />
          <button 
            onClick={handleSearch}
            disabled={isLoading || !searchTerm.trim()}
            style={{
              padding: '8px 15px',
              backgroundColor: '#673ab7',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🔍 Search
          </button>
        </div>
      </div>

      {movies.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3>📽️ Movies ({movies.length})</h3>
          <div style={{ maxHeight: '200px', overflowY: 'auto', fontSize: '14px' }}>
            {movies.map(movie => (
              <div key={movie.id} style={{ padding: '5px', borderBottom: '1px solid #eee' }}>
                <strong>{movie.title}</strong> ({movie.year}) - Rating: {movie.rating}/10
                <br />
                <small>Platforms: {movie.platforms?.join(', ')}</small>
              </div>
            ))}
          </div>
        </div>
      )}

      {series.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3>📺 Series ({series.length})</h3>
          <div style={{ maxHeight: '200px', overflowY: 'auto', fontSize: '14px' }}>
            {series.map(show => (
              <div key={show.id} style={{ padding: '5px', borderBottom: '1px solid #eee' }}>
                <strong>{show.title}</strong> ({show.year}) - Rating: {show.rating}/10
                <br />
                <small>Platforms: {show.platforms?.join(', ')} | Seasons: {show.seasons}</small>
              </div>
            ))}
          </div>
        </div>
      )}

      {searchResults.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3>🔍 Search Results ({searchResults.length})</h3>
          <div style={{ maxHeight: '200px', overflowY: 'auto', fontSize: '14px' }}>
            {searchResults.map(item => (
              <div key={item.id} style={{ padding: '5px', borderBottom: '1px solid #eee' }}>
                <strong>{item.title}</strong> ({item.year}) - {item.type} - Rating: {item.rating}/10
                <br />
                <small>Platforms: {item.platforms?.join(', ')}</small>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ fontSize: '12px', color: '#666', marginTop: '20px' }}>
        <p><strong>This component helps you:</strong></p>
        <ul>
          <li>✓ Populate Firestore with sample movies and series data</li>
          <li>✓ Test data loading from Firestore</li>
          <li>✓ Test search functionality</li>
          <li>✓ View your database content</li>
        </ul>
      </div>
    </div>
  );
};

export default DataManager;
