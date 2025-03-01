import React, { useState, useEffect } from 'react';
import Card from './Card';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [randomBackdrop, setRandomBackdrop] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 8; // Adjust as needed

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/trending/movie/week?api_key=d0bcda8ffa75a0d26760665ceca2e99f`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch trending movies');
        }
        const data = await response.json();
        setTrendingMovies(data.results);

        if (data.results.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.results.length);
          setRandomBackdrop(
            `https://image.tmdb.org/t/p/original${data.results[randomIndex].backdrop_path}`
          );
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingMovies();
  }, []);

  const handleSearchNavigation = () => {
    navigate('/search');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const bgColor = darkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const buttonBg = darkMode ? 'bg-indigo-600' : 'bg-blue-600';
  const buttonHoverBg = darkMode ? 'hover:bg-indigo-700' : 'hover:bg-blue-700';
  const gradientFrom = darkMode ? 'from-indigo-400' : 'from-blue-400';
  const gradientTo = darkMode ? 'to-purple-600' : 'to-purple-600';
  const trendingGradientFrom = darkMode ? 'from-purple-400' : 'from-purple-400';
  const trendingGradientTo = darkMode ? 'to-pink-600' : 'to-pink-600';
  const toggleButtonBg = darkMode ? 'bg-gray-400' : 'bg-gray-700';
  const toggleButtonHover = darkMode ? 'hover:bg-gray-300' : 'hover:bg-gray-600';

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = trendingMovies.slice(indexOfFirstMovie, indexOfLastMovie);

  const totalPages = Math.ceil(trendingMovies.length / moviesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if(isLoading){
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
            <p className="text-lg text-gray-300">Loading...</p>
        </div>
        </div>
    )
  }

  return (
    <div className={`relative min-h-screen ${bgColor} ${textColor}`}>
      {randomBackdrop && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 blur-sm"
          style={{ backgroundImage: `url(${randomBackdrop})` }}
        ></div>
      )}
      <header className="relative p-4 flex justify-between items-center z-10">
        <h1
          className={`text-3xl font-extrabold tracking-tight leading-tight md:ml-4 text-gradient bg-clip-text text-transparent bg-gradient-to-r ${gradientFrom} ${gradientTo}`}
        >
          MovieDB
        </h1>
        <div className="flex items-center">
          <button
            onClick={handleSearchNavigation}
            className={`${buttonBg} ${buttonHoverBg} text-white p-2 rounded-md mr-2`}
          >
            Search
          </button>
          <button
            onClick={toggleDarkMode}
            className={`${toggleButtonBg} ${toggleButtonHover} text-gray-800 dark:text-white p-2 rounded-md`}
          >
            {darkMode ? 'Light' : 'Dark'}
          </button>
        </div>
      </header>
      <main className="relative p-4 z-10">
        <h2
          className={`text-2xl font-semibold mb-4 text-gradient bg-clip-text text-transparent bg-gradient-to-r ${trendingGradientFrom} ${trendingGradientTo}`}
        >
          Trending Movies
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentMovies.map((movie) => (
            <Card key={movie.id} movie={movie} />
          ))}
        </div>
        <div className="flex justify-center mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={`mx-1 px-3 py-1 rounded-md ${
                currentPage === pageNumber
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
              }`}
            >
              {pageNumber}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default HomePage;