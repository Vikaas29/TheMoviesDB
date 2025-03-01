import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Movie = () => {
  const { movieId } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const detailedResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.REACT_APP_TMDB_API_KEY}`
        );

        if (!detailedResponse.ok) {
          throw new Error('Failed to fetch detailed movie information');
        }

        const detailedData = await detailedResponse.json();
        setMovieDetails(detailedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoSearch = () => {
    navigate('/search');
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

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!movieDetails) {
    return <div className="text-center">Movie not found.</div>;
  }

  return (
    <div className="relative min-h-screen bg-gray-900 text-white p-8">
      {movieDetails.poster_path && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 blur-lg transition-opacity duration-500"
          style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movieDetails.poster_path})` }}
        ></div>
      )}

      <div className="relative z-10 flex flex-col md:flex-row">
        {movieDetails.poster_path && (
          <img
            src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
            alt={movieDetails.title}
            className="w-full md:w-64 mb-4 md:mb-0 md:mr-4 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
          />
        )}
        <div>
          <h1 className="text-4xl font-extrabold mb-2 transition-colors duration-300 hover:text-indigo-400">
            {movieDetails.title}
          </h1>
          {movieDetails.release_date && (
            <p className="text-gray-300 mb-2 transition-colors duration-300">
              {movieDetails.release_date} | {movieDetails.runtime} min
            </p>
          )}

          {movieDetails.overview && (
            <p className="mb-4 transition-opacity duration-300">{movieDetails.overview}</p>
          )}

          {movieDetails.genres && movieDetails.genres.length > 0 && (
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2 transition-colors duration-300 hover:text-indigo-400">
                Genres
              </h2>
              <ul className="flex flex-wrap">
                {movieDetails.genres.map((genre) => (
                  <li
                    key={genre.id}
                    className="bg-gray-800 rounded-full px-3 py-1 mr-2 mb-2 transition-colors duration-300 hover:bg-gray-700"
                  >
                    {genre.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {movieDetails.production_companies && movieDetails.production_companies.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-2 transition-colors duration-300 hover:text-indigo-400">
                Production Companies
              </h2>
              <ul className="flex flex-wrap">
                {movieDetails.production_companies.map((company) => (
                  <li
                    key={company.id}
                    className="bg-gray-800 rounded-full px-3 py-1 mr-2 mb-2 transition-colors duration-300 hover:bg-gray-700"
                  >
                    {company.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="relative z-10 mt-4 flex gap-4">
        <button
          onClick={handleGoHome}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
        >
          Go Home
        </button>
        <button
          onClick={handleGoSearch}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
        >
          Go Search
        </button>
      </div>
    </div>
  );
};

export default Movie;