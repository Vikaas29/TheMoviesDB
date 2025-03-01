import React, { useState, useEffect, useRef } from 'react';
import Card from './Card';
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchInputRef = useRef(null);
  const timeoutId = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 8;
  const [randomBackdrop, setRandomBackdrop] = useState('');
  const navigate = useNavigate();

  const searchMovies = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=d0bcda8ffa75a0d26760665ceca2e99f&query=${query}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }
      const data = await response.json();
      setSearchResults(data.results);
      setCurrentPage(1);

      if (data.results.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.results.length);
        setRandomBackdrop(
          `https://image.tmdb.org/t/p/original${data.results[randomIndex].backdrop_path}`
        );
      } else {
        setRandomBackdrop('');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = (query) => {
    clearTimeout(timeoutId.current);
    timeoutId.current = setTimeout(() => {
      searchMovies(query);
    }, 500);
  };

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => {
      clearTimeout(timeoutId.current);
    };
  }, [searchTerm]);

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = searchResults.slice(indexOfFirstMovie, indexOfLastMovie);

  const totalPages = Math.ceil(searchResults.length / moviesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleGoHome = () => {
    navigate('/');
  };
  return (
    <div className="relative min-h-screen bg-gray-900 text-white p-8">
      {randomBackdrop && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 blur-sm"
          style={{ backgroundImage: `url(${randomBackdrop})` }}
        ></div>
      )}
      <div className="relative z-10 flex justify-center mb-8">
        <div className="relative w-full max-w-3xl">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search for movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-5 rounded-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-2xl shadow-2xl transition-shadow duration-300 hover:shadow-xl"
          />
          <div className="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-none">
            <svg
              className="h-6 w-6 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="relative z-10">
        {isLoading && <div className="text-center">Loading...</div>}
        {error && <div className="text-center text-red-500">{error}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentMovies.map((movie) => (
            <Card key={movie.id} movie={movie} />
          ))}
        </div>

        {searchResults.length > moviesPerPage && (
          <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`mx-1 px-3 py-1 rounded-md ${
                  currentPage === pageNumber
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {pageNumber}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="relative z-10 mt-4 flex justify-center">
    <button
      onClick={handleGoHome}
      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
    >
      Go Home
    </button>
   </div>
    </div>
    
  );
};

export default Search;