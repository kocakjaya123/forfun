import { useState, useEffect, useRef } from 'react';

export default function WelcomeModal({ currentUser, onClose }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    setIsAnimating(true);
    // Prevent scrolling on background when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsOpen(false);
      onClose?.();
    }, 300);
  };

  const handleScrollContent = (e) => {
    const element = e.target;
    // Check if scrolled to bottom (with 50px threshold)
    const isAtBottom = element.scrollHeight - element.scrollTop - element.clientHeight < 50;
    setScrolledToBottom(isAtBottom);
  };

  if (!isOpen || !currentUser) return null;

  return (
    <div className={`fixed inset-0 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}>
      {/* Backdrop - Cannot interact with background */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm pointer-events-auto" onClick={handleClose}></div>

      {/* Email Card - Centered with margins, stays on top and interactive */}
      <div className={`relative bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden transition-all duration-300 pointer-events-auto ${isAnimating ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}>
        {/* Gradient Border Top */}
        <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

        {/* Header Section with Gradient Background */}
        <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 px-8 py-10 overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white rounded-full blur-2xl"></div>
          </div>

          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl animate-bounce" style={{ animationDuration: '2s' }}>👋</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white">Selamat Datang!</h2>
            </div>
            <p className="text-blue-100 text-lg font-semibold">Senang bertemu denganmu, {currentUser}!</p>
          </div>
        </div>

        {/* Content Section */}
        <div 
          ref={contentRef}
          onScroll={handleScrollContent}
          className="p-8 sm:p-10 space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto relative"
        >
          {/* Down Arrow Indicator - Shows when not scrolled to bottom */}
          {!scrolledToBottom && (
            <div className="sticky bottom-0 left-0 right-0 h-16 flex items-end justify-center pointer-events-none bg-gradient-to-t from-white via-white to-transparent">
              <div className="animate-bounce mb-2">
                <p className="text-gray-500 text-xs font-semibold text-center mb-1">Scroll ke bawah</p>
                <svg className="w-5 h-5 mx-auto text-purple-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>
          )}
          {/* Greeting Card */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
            <div className="flex items-start gap-3">
              <span className="text-3xl">🎮</span>
              <div>
                <p className="font-bold text-gray-800 mb-1">Welcome to LifeQuest!</p>
                <p className="text-sm text-gray-600">
                  This game was created out of personal curiosity—a way to convey certain messages and reflections without saying them directly.
                </p>
              </div>
            </div>
          </div>

          {/* Message Body */}
          <div className="space-y-4 text-gray-700">
            <div className="flex gap-3 items-start bg-white p-4 rounded-xl border border-gray-200">
              <span className="text-2xl">💡</span>
              <p className="text-sm leading-relaxed">
                It's a journey of self-discovery through interactive challenges designed to help you explore your dreams, goals, and personal growth.
              </p>
            </div>

            <div className="flex gap-3 items-start bg-white p-4 rounded-xl border border-gray-200">
              <span className="text-2xl">🌟</span>
              <p className="text-sm leading-relaxed">
                Whether you're here to test your knowledge, challenge yourself, or simply have fun, we hope you'll find something meaningful in each game.
              </p>
            </div>

            <div className="flex gap-3 items-start bg-gradient-to-br from-pink-50 to-red-50 p-4 rounded-xl border border-pink-200">
              <span className="text-2xl">💝</span>
              <p className="text-sm leading-relaxed italic font-semibold text-pink-900">
                "Untukmu yang sedang dipeluk sepi, ketahuilah bahwa di sini ada detak jantung yang juga berirama sunyi yang sama."
              </p>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-l-4 border-purple-500 rounded-lg p-5">
            <div className="flex gap-2 items-start">
              <span className="text-2xl flex-shrink-0">💙</span>
              <div>
                <p className="font-bold text-purple-900 mb-1">A Small Request</p>
                <p className="text-sm text-purple-800">
                  To keep our community respectful and positive, please use a courteous name. This helps us maintain a welcoming space for everyone.
                </p>
              </div>
            </div>
          </div>

          {/* Signature Section */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 text-center border border-gray-200">
            <p className="text-gray-600 text-sm mb-2">Created with passion by</p>
            <p className="font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-1">
              Septian
            </p>
            <p className="text-xs text-gray-500">LifeQuest • Sebuah Petualangan Penemuan Diri</p>
            <p className="text-xs text-gray-400 mt-3">✨ Enjoy the games, learn about yourself, and have fun!</p>
          </div>
        </div>

        {/* Footer Button - Only shows when scrolled to bottom */}
        {scrolledToBottom && (
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-gray-200 sticky bottom-0 animate-in fade-in duration-300">
            {/* Checkbox */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="w-5 h-5 cursor-pointer accent-purple-600"
              />
              <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">
                Saya sudah membaca semuanya ✓
              </span>
            </label>

            {/* Button */}
            <button
              onClick={handleClose}
              disabled={!isChecked}
              className={`group relative px-10 py-3 rounded-full transition-all duration-300 transform font-black flex items-center gap-2 justify-center overflow-hidden shadow-lg ${
                isChecked
                  ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white hover:scale-110 hover:shadow-xl cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {/* Animated shine effect */}
              {isChecked && <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>}
              <span className="relative flex items-center gap-2">
                Mulai Petualangan {isChecked && <span className="animate-bounce" style={{ animationDuration: '1s' }}>🚀</span>}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
