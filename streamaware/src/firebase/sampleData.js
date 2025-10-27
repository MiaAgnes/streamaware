import { addMovie, addSeries } from './firebaseData.js';

// 🎬 Sample data for movies and series
// This is example data - you can modify it or add your own content

export const sampleMovies = [
  {
    title: "Inception",
    description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    genres: ["Action", "Sci-Fi", "Thriller"],
    platforms: ["Netflix", "HBO Max"],
    rating: 8.8,
    year: 2010,
    duration: "148 min",
    image: "/images/inception.jpg",
    country: "USA",
    language: "English"
  },
  {
    title: "The Dark Knight",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    genres: ["Action", "Crime", "Drama"],
    platforms: ["Netflix", "Prime Video"],
    rating: 9.0,
    year: 2008,
    duration: "152 min",
    image: "/images/dark-knight.jpg",
    country: "USA",
    language: "English"
  },
  {
    title: "Parasite",
    description: "A poor family schemes to become employed by a wealthy family and infiltrate their household by posing as unrelated, highly qualified individuals.",
    genres: ["Comedy", "Drama", "Thriller"],
    platforms: ["Disney+", "Viaplay"],
    rating: 8.6,
    year: 2019,
    duration: "132 min",
    image: "/images/parasite.jpg",
    country: "South Korea",
    language: "Korean"
  },
  {
    title: "Druk",
    description: "Four friends, all high school teachers, test a theory that they will improve their lives by maintaining a constant level of alcohol in their blood.",
    genres: ["Comedy", "Drama"],
    platforms: ["TV2 Play", "Viaplay"],
    rating: 7.7,
    year: 2020,
    duration: "117 min",
    image: "/images/druk.png",
    country: "Denmark",
    language: "Danish"
  }
];

export const sampleSeries = [
  {
    title: "Stranger Things",
    description: "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.",
    genres: ["Drama", "Fantasy", "Horror"],
    platforms: ["Netflix"],
    rating: 8.7,
    year: 2016,
    seasons: 4,
    episodes: 42,
    image: "/images/stranger-things.jpg",
    country: "USA",
    language: "English",
    status: "Ongoing"
  },
  {
    title: "The Crown",
    description: "Follows the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped the second half of the twentieth century.",
    genres: ["Biography", "Drama", "History"],
    platforms: ["Netflix"],
    rating: 8.6,
    year: 2016,
    seasons: 6,
    episodes: 60,
    image: "/images/the-crown.jpg",
    country: "UK",
    language: "English",
    status: "Completed"
  },
  {
    title: "Squid Game",
    description: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games for a tempting prize, but the stakes are deadly.",
    genres: ["Action", "Drama", "Mystery"],
    platforms: ["Netflix"],
    rating: 8.0,
    year: 2021,
    seasons: 1,
    episodes: 9,
    image: "/images/squidgame.svg",
    country: "South Korea",
    language: "Korean",
    status: "Ongoing"
  },
  {
    title: "Wednesday",
    description: "Wednesday Addams is sent to Nevermore Academy, a supernatural boarding school where she attempts to master her psychic powers, stop a monstrous killing spree of the town citizens, and solve the supernatural mystery that embroiled her parents 25 years ago.",
    genres: ["Comedy", "Crime", "Family"],
    platforms: ["Netflix"],
    rating: 8.1,
    year: 2022,
    seasons: 1,
    episodes: 8,
    image: "/images/wednesday.png",
    country: "USA",
    language: "English",
    status: "Ongoing"
  },
  {
    title: "Black Mirror",
    description: "An anthology series exploring a twisted, high-tech multiverse where humanity's greatest innovations and darkest instincts collide.",
    genres: ["Drama", "Sci-Fi", "Thriller"],
    platforms: ["Netflix"],
    rating: 8.8,
    year: 2011,
    seasons: 6,
    episodes: 27,
    image: "/images/blackmirror.svg",
    country: "UK",
    language: "English",
    status: "Ongoing"
  }
];

// Function to populate Firestore with sample data
export const populateFirestoreWithSampleData = async () => {
  try {
    console.log("🔄 Starting to populate Firestore with sample data...");
    
    // Add sample movies
    console.log("📽️ Adding sample movies...");
    for (const movie of sampleMovies) {
      await addMovie(movie);
    }
    
    // Add sample series
    console.log("📺 Adding sample series...");
    for (const series of sampleSeries) {
      await addSeries(series);
    }
    
    console.log("✅ Successfully populated Firestore with sample data!");
    console.log(`📊 Added ${sampleMovies.length} movies and ${sampleSeries.length} series`);
    
    return true;
  } catch (error) {
    console.error("❌ Error populating Firestore:", error);
    throw error;
  }
};

// Function to check if data already exists (to avoid duplicates)
export const checkIfDataExists = async () => {
  try {
    const { getAllMovies, getAllSeries } = await import('./firebaseData.js');
    const movies = await getAllMovies();
    const series = await getAllSeries();
    
    return {
      moviesCount: movies.length,
      seriesCount: series.length,
      hasData: movies.length > 0 || series.length > 0
    };
  } catch (error) {
    console.error("❌ Error checking existing data:", error);
    return { moviesCount: 0, seriesCount: 0, hasData: false };
  }
};
