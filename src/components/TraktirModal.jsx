export default function TraktirModal({ onAccept, onDecline }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-pink-200 via-purple-100 to-pink-100 rounded-3xl p-8 max-w-md mx-4 shadow-2xl border-4 border-pink-400 animate-bounce">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-float-heart">🥺</div>
          
          <h3 className="text-2xl font-bold text-pink-700 mb-4">
            Hint udah habis nih...
          </h3>
          
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Traktir Septian makan dulu yuk biar otaknya jalan lagi! 🍜
          </p>
          
          <div className="flex gap-3 justify-center">
            <button
              onClick={onAccept}
              className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg text-lg"
            >
              ✅ Oke deh, mau traktir! 🎉
            </button>
            
            <button
              onClick={onDecline}
              className="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg text-lg"
            >
              ❌ Ga mau ah 😤
            </button>
          </div>
        </div>
        
        <div className="flex justify-center gap-2 mt-6 text-2xl">
          <span className="animate-float-heart">💕</span>
          <span className="animate-float-heart" style={{ animationDelay: '0.2s' }}>🍜</span>
          <span className="animate-float-heart" style={{ animationDelay: '0.4s' }}>💕</span>
        </div>
      </div>
    </div>
  );
}
