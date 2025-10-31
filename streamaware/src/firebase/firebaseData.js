import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  limit
} from "firebase/firestore";

// 🎬 Movies and Series Data Management

// Get all movies
export const getAllMovies = async () => {
  try {
    const moviesCollection = collection(db, "movies");
    const moviesSnapshot = await getDocs(moviesCollection);
    const moviesList = moviesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log("✅ Movies loaded:", moviesList.length);
    return moviesList;
  } catch (error) {
    console.error("❌ Error loading movies:", error);
    throw error;
  }
};

// Get all series
export const getAllSeries = async () => {
  try {
    const seriesCollection = collection(db, "series");
    const seriesSnapshot = await getDocs(seriesCollection);
    const seriesList = seriesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log("✅ Series loaded:", seriesList.length);
    return seriesList;
  } catch (error) {
    console.error("❌ Error loading series:", error);
    throw error;
  }
};

// Get movies by platform
export const getMoviesByPlatform = async (platform) => {
  try {
    const moviesCollection = collection(db, "movies");
    const q = query(moviesCollection, where("platforms", "array-contains", platform));
    const querySnapshot = await getDocs(q);
    const moviesList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log(`✅ Movies loaded for ${platform}:`, moviesList.length);
    return moviesList;
  } catch (error) {
    console.error(`❌ Error loading movies for ${platform}:`, error);
    throw error;
  }
};

// Get series by platform
export const getSeriesByPlatform = async (platform) => {
  try {
    const seriesCollection = collection(db, "series");
    const q = query(seriesCollection, where("platforms", "array-contains", platform));
    const querySnapshot = await getDocs(q);
    const seriesList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log(`✅ Series loaded for ${platform}:`, seriesList.length);
    return seriesList;
  } catch (error) {
    console.error(`❌ Error loading series for ${platform}:`, error);
    throw error;
  }
};

// Search movies and series
export const searchContent = async (searchTerm) => {
  try {
    const searchTermLower = searchTerm.toLowerCase();
    
    // Search movies
    const moviesCollection = collection(db, "movies");
    const moviesSnapshot = await getDocs(moviesCollection);
    const movies = moviesSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data(), type: 'movie' }))
      .filter(movie => 
        movie.title?.toLowerCase().includes(searchTermLower) ||
        movie.description?.toLowerCase().includes(searchTermLower) ||
        movie.genres?.some(genre => genre.toLowerCase().includes(searchTermLower))
      );

    // Search series
    const seriesCollection = collection(db, "series");
    const seriesSnapshot = await getDocs(seriesCollection);
    const series = seriesSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data(), type: 'series' }))
      .filter(show => 
        show.title?.toLowerCase().includes(searchTermLower) ||
        show.description?.toLowerCase().includes(searchTermLower) ||
        show.genres?.some(genre => genre.toLowerCase().includes(searchTermLower))
      );

    const results = [...movies, ...series];
    console.log(`✅ Search results for "${searchTerm}":`, results.length);
    return results;
  } catch (error) {
    console.error(`❌ Error searching for "${searchTerm}":`, error);
    throw error;
  }
};

// Get content by genre
export const getContentByGenre = async (genre) => {
  try {
    // Get movies by genre
    const moviesCollection = collection(db, "movies");
    const moviesQuery = query(moviesCollection, where("genres", "array-contains", genre));
    const moviesSnapshot = await getDocs(moviesQuery);
    const movies = moviesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      type: 'movie'
    }));

    // Get series by genre
    const seriesCollection = collection(db, "series");
    const seriesQuery = query(seriesCollection, where("genres", "array-contains", genre));
    const seriesSnapshot = await getDocs(seriesQuery);
    const series = seriesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      type: 'series'
    }));

    const results = [...movies, ...series];
    console.log(`✅ Content loaded for genre "${genre}":`, results.length);
    return results;
  } catch (error) {
    console.error(`❌ Error loading content for genre "${genre}":`, error);
    throw error;
  }
};

// Add a new movie
export const addMovie = async (movieData) => {
  try {
    const moviesCollection = collection(db, "movies");
    const docRef = await addDoc(moviesCollection, {
      ...movieData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log("✅ Movie added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("❌ Error adding movie:", error);
    throw error;
  }
};

// Add a new series
export const addSeries = async (seriesData) => {
  try {
    const seriesCollection = collection(db, "series");
    const docRef = await addDoc(seriesCollection, {
      ...seriesData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log("✅ Series added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("❌ Error adding series:", error);
    throw error;
  }
};

// Get trending/popular content (example implementation)
export const getTrendingContent = async (limitCount = 10) => {
  try {
    // Get popular movies (you could sort by rating, views, etc.)
    const moviesCollection = collection(db, "movies");
    const moviesQuery = query(moviesCollection, orderBy("rating", "desc"), limit(limitCount));
    const moviesSnapshot = await getDocs(moviesQuery);
    const movies = moviesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      type: 'movie'
    }));

    // Get popular series
    const seriesCollection = collection(db, "series");
    const seriesQuery = query(seriesCollection, orderBy("rating", "desc"), limit(limitCount));
    const seriesSnapshot = await getDocs(seriesQuery);
    const series = seriesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      type: 'series'
    }));

    const trending = [...movies, ...series]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limitCount);

    console.log("✅ Trending content loaded:", trending.length);
    return trending;
  } catch (error) {
    console.error("❌ Error loading trending content:", error);
    throw error;
  }
};
