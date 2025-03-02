import React from 'react';
import { useNavigate } from 'react-router-dom';

const Card = ({ movie }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div
      key={movie.id}
      className="group relative overflow-hidden rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
      onClick={handleClick}
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="w-full h-64 object-cover rounded-t-xl"
      />
      <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-b from-transparent to-black">
        <h3 className="text-xl font-semibold mb-2 text-white drop-shadow-lg">
          {movie.title}
        </h3>
        <p className="text-md text-gray-300 drop-shadow-md">
          Rating: {movie.vote_average}
        </p>
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10 group-hover:opacity-30 transition-opacity duration-300 blur-sm"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/w500${movie.backdrop_path})`,
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
      </div>
    </div>
  );
};

export default Card;