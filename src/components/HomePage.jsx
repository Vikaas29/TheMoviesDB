import React, { useState, useEffect } from 'react';
import Card from './Card';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [randomBackdrop, setRandomBackdrop] = useState('');
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 8;
  const [darkMode, setDarkMode] = useState(false);

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
  const paginationButtonBg = darkMode ? 'bg-indigo-600' : 'bg-gray-200';
  const paginationButtonText = darkMode ? 'text-white' : 'text-gray-800';

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const remainingMovies = trendingMovies.slice(1);
  const currentMovies = remainingMovies.slice(indexOfFirstMovie, indexOfLastMovie);

  const totalPages = Math.ceil(remainingMovies.length / moviesPerPage);

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
    <div className={`relative min-h-screen ${bgColor} ${textColor} overflow-hidden`}>
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
            className={`bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded`}
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </header>
      <main className="relative p-4 z-10">
        {trendingMovies.length > 0 && (
          <div className="mb-4 w-full relative overflow-hidden rounded-xl shadow-lg">
            <div
              className="group relative transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
              onClick={() => navigate(`/movie/${trendingMovies[0].id}`)}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${trendingMovies[0].poster_path}`}
                alt={trendingMovies[0].title}
                className="w-full h-[500px] object-cover rounded-t-xl"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-b from-transparent to-black">
                <h3 className="text-3xl font-bold mb-2 text-white drop-shadow-lg">
                  {trendingMovies[0].title}
                </h3>
                <p className="text-lg text-gray-300 drop-shadow-md">
                  Rating: {trendingMovies[0].vote_average}
                </p>
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-10 group-hover:opacity-30 transition-opacity duration-300 blur-sm"
                  style={{
                    backgroundImage: `url(https://image.tmdb.org/t/p/w500${trendingMovies[0].backdrop_path})`,
                  }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
              </div>
            </div>
          </div>
        )}
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
                  : `${paginationButtonBg} ${paginationButtonText}`
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