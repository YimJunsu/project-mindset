function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 to-yellow-500 text-white flex items-center justify-center">
      <div className="text-center space-y-6 p-8 rounded-xl shadow-2xl bg-white bg-opacity-10 backdrop-blur-sm">
        <h1 className="text-5xl font-extrabold">테일윈드 작동 테스트 🔥</h1>
        <p className="text-lg text-gray-200">Tailwind가 잘 적용되고 있나요?</p>
        <button className="bg-white text-red-600 font-semibold px-6 py-3 rounded-full hover:bg-red-700 hover:text-white transition-all duration-300">
          토큰 제거
        </button>
      </div>
    </div>
  );
}

export default App;
