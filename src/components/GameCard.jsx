import { Link } from 'react-router-dom';

export default function GameCard({ id, title, description, emoji, route }) {
  return (
    <Link to={route}>
      <div className="bg-gradient-to-br from-pink-200 to-purple-200 rounded-3xl p-6 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer h-full border-4 border-pink-300 group">
        <div className="text-6xl mb-4 transform group-hover:scale-125 transition-transform duration-300">
          {emoji}
        </div>
        
        <h3 className="text-2xl font-bold text-pink-700 mb-2 group-hover:text-pink-900">
          {title}
        </h3>
        
        <p className="text-gray-700 mb-4 text-sm leading-relaxed">
          {description}
        </p>
        
        <button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold py-3 px-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md">
          Main Sekarang ▶️
        </button>
        
        <div className="mt-4 flex justify-center gap-2">
          <span className="text-lg">❤️</span>
          <span className="text-lg">💕</span>
          <span className="text-lg">💖</span>
        </div>
      </div>
    </Link>
  );
}
