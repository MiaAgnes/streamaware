import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  doc,
  updateDoc
} from "firebase/firestore";


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


export const searchContent = async (searchTerm) => {
  try {
    console.log('🔍 Progressive search for:', searchTerm);
    const searchTermLower = searchTerm.toLowerCase().trim();
    

    if (!searchTermLower) {
      return [];
    }
    

    const moviesRef = collection(db, "movies");
    const moviesSnap = await getDocs(moviesRef);
    

    const seriesRef = collection(db, "series");
    const seriesSnap = await getDocs(seriesRef);
    

    const allContent = [];
    

    moviesSnap.docs.forEach(doc => {
      const data = doc.data();
      if (data.title) {
        allContent.push({
          id: doc.id,
          type: 'movie',
          title: data.title,
          year: data.year || '',
          image: data.image || '/images/placeholder.png',
          description: data.description || '',
          genres: data.genres || [],
          platforms: data.platforms || [],
          ...data
        });
      }
    });
    

    seriesSnap.docs.forEach(doc => {
      const data = doc.data();
      if (data.title) {
        allContent.push({
          id: doc.id,
          type: 'series', 
          title: data.title,
          year: data.year || '',
          image: data.image || '/images/placeholder.png',
          description: data.description || '',
          genres: data.genres || [],
          platforms: data.platforms || [],
          ...data
        });
      }
    });

    console.log('🎬 Total content items available:', allContent.length);

  
    const results = allContent.filter(item => {
      const titleLower = item.title.toLowerCase();
   
      return titleLower.startsWith(searchTermLower);
    });


    results.sort((a, b) => a.title.localeCompare(b.title));

    console.log(`🎯 Progressive search results for "${searchTerm}":`, results.length);
    

    if (results.length > 0) {
      console.log('📋 Matching titles:', results.map(r => r.title));
    }
    
    return results;
  } catch (error) {
    console.error(`❌ Error in progressive search for "${searchTerm}":`, error);
    throw error;
  }
};


export const getContentByGenre = async (genre) => {
  try {

    const moviesCollection = collection(db, "movies");
    const moviesQuery = query(moviesCollection, where("genres", "array-contains", genre));
    const moviesSnapshot = await getDocs(moviesQuery);
    const movies = moviesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      type: 'movie'
    }));

   
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


export const getTrendingContent = async (limitCount = 10) => {
  try {

    const moviesCollection = collection(db, "movies");
    const moviesQuery = query(moviesCollection, orderBy("rating", "desc"), limit(limitCount));
    const moviesSnapshot = await getDocs(moviesQuery);
    const movies = moviesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      type: 'movie'
    }));


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


export const addLanguagesAndSubtitlesToContent = async () => {
  try {
    console.log("🔄 Starting to add languages and subtitles to existing content...");
    
    // Sample languages and subtitles data for different content
    const languageAndSubtitleData = {
      // Popular US content
      'Wednesday': {
        languages: ['English'],
        subtitles: ['English', 'Spanish', 'French', 'German', 'Danish', 'Swedish', 'Norwegian']
      },
      'Stranger Things': {
        languages: ['English'],
        subtitles: ['English', 'Spanish', 'French', 'German', 'Danish', 'Swedish', 'Norwegian']
      },
      'The Witcher': {
        languages: ['English'],
        subtitles: ['English', 'Spanish', 'French', 'German', 'Danish', 'Swedish', 'Norwegian']
      },
      'Breaking Bad': {
        languages: ['English'],
        subtitles: ['English', 'Spanish', 'French', 'German', 'Danish', 'Swedish', 'Norwegian']
      },
      'The Office': {
        languages: ['English'],
        subtitles: ['English', 'Spanish', 'French', 'German', 'Danish', 'Swedish', 'Norwegian']
      },
      'Avatar': {
        languages: ['English'],
        subtitles: ['English', 'Spanish', 'French', 'German', 'Danish', 'Swedish', 'Norwegian']
      },
      // European content
      'Dark': {
        languages: ['German'],
        subtitles: ['English', 'Spanish', 'French', 'German', 'Danish', 'Swedish', 'Norwegian']
      },
      'Money Heist': {
        languages: ['Spanish'],
        subtitles: ['English', 'Spanish', 'French', 'German', 'Danish', 'Swedish', 'Norwegian']
      },
      'Elite': {
        languages: ['Spanish'],
        subtitles: ['English', 'Spanish', 'French', 'German', 'Danish', 'Swedish', 'Norwegian']
      },
      'Lupin': {
        languages: ['French'],
        subtitles: ['English', 'Spanish', 'French', 'German', 'Danish', 'Swedish', 'Norwegian']
      },
      // Nordic content
      'The Bridge': {
        languages: ['Danish', 'Swedish'],
        subtitles: ['English', 'Danish', 'Swedish', 'Norwegian']
      },
      'Borgen': {
        languages: ['Danish'],
        subtitles: ['English', 'Danish', 'Swedish', 'Norwegian']
      },
      'Ragnarok': {
        languages: ['Norwegian'],
        subtitles: ['English', 'Danish', 'Swedish', 'Norwegian']
      }
    };

    let updatedCount = 0;


    const movies = await getAllMovies();
    for (const movie of movies) {
      const langData = languageAndSubtitleData[movie.title];
      if (langData && (!movie.languages || !movie.subtitles)) {
        const movieRef = doc(db, 'movies', movie.id);
        await updateDoc(movieRef, {
          languages: langData.languages,
          subtitles: langData.subtitles,
          updatedAt: new Date()
        });
        console.log(`✅ Updated movie: ${movie.title}`);
        updatedCount++;
      }
    }


    const series = await getAllSeries();
    for (const show of series) {
      const langData = languageAndSubtitleData[show.title];
      if (langData && (!show.languages || !show.subtitles)) {
        const seriesRef = doc(db, 'series', show.id);
        await updateDoc(seriesRef, {
          languages: langData.languages,
          subtitles: langData.subtitles,
          updatedAt: new Date()
        });
        console.log(`✅ Updated series: ${show.title}`);
        updatedCount++;
      }
    }

    console.log(`✅ Successfully updated ${updatedCount} items with languages and subtitles!`);
    return updatedCount;
  } catch (error) {
    console.error("❌ Error adding languages and subtitles:", error);
    throw error;
  }
};

// Add default languages and subtitles to content without specific data
export const addDefaultLanguagesAndSubtitles = async () => {
  try {
    console.log("🔄 Adding default languages and subtitles to remaining content...");
    
    const defaultData = {
      languages: ['English'],
      subtitles: ['English', 'Danish', 'Swedish', 'Norwegian']
    };

    let updatedCount = 0;

    // Update movies without languages/subtitles
    const movies = await getAllMovies();
    for (const movie of movies) {
      if (!movie.languages || !movie.subtitles) {
        const movieRef = doc(db, 'movies', movie.id);
        await updateDoc(movieRef, {
          languages: movie.languages || defaultData.languages,
          subtitles: movie.subtitles || defaultData.subtitles,
          updatedAt: new Date()
        });
        console.log(`✅ Added default data to movie: ${movie.title}`);
        updatedCount++;
      }
    }

    // Update series without languages/subtitles
    const series = await getAllSeries();
    for (const show of series) {
      if (!show.languages || !show.subtitles) {
        const seriesRef = doc(db, 'series', show.id);
        await updateDoc(seriesRef, {
          languages: show.languages || defaultData.languages,
          subtitles: show.subtitles || defaultData.subtitles,
          updatedAt: new Date()
        });
        console.log(`✅ Added default data to series: ${show.title}`);
        updatedCount++;
      }
    }

    console.log(`✅ Successfully added default data to ${updatedCount} items!`);
    return updatedCount;
  } catch (error) {
    console.error("❌ Error adding default languages and subtitles:", error);
    throw error;
  }
};
