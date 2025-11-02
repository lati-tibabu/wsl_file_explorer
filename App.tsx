import React from 'react';
import FileExplorer from './components/FileExplorer';

const App: React.FC = () => {
  return (
    <div className="flex flex-col h-screen font-sans bg-gray-900 text-gray-200">
      <header className="bg-gray-800 border-b border-gray-700 p-2 flex items-center shadow-md shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
        </svg>
        <h1 className="text-xl font-semibold">WSL File Explorer</h1>
        <span className="text-xs ml-2 bg-green-500 text-black px-2 py-0.5 rounded-full font-bold">Ubuntu</span>
      </header>
      <main className="flex-grow overflow-hidden">
        <FileExplorer />
      </main>
      {/* Footer removed as connection status is now handled within FileExplorer */}
    </div>
  );
};

export default App;
