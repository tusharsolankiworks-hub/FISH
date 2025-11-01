
import React, { useState, useCallback } from 'react';
import { generateImage } from './services/geminiService';
import Spinner from './components/Spinner';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateImage = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }

    setIsLoading(true);
    setImageUrl(null);
    setError(null);

    try {
      const base64Image = await generateImage(prompt);
      const dataUrl = `data:image/jpeg;base64,${base64Image}`;
      setImageUrl(dataUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [prompt]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleGenerateImage();
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl flex flex-col items-center">
        <header className="text-center my-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            AI Image Generator
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            Turn your ideas into stunning visuals with the power of Gemini.
          </p>
        </header>

        <main className="w-full mt-8">
          <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl border border-gray-700">
            <div className="flex flex-col sm:flex-row gap-4">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g., A futuristic cityscape at sunset with flying cars, photorealistic..."
                className="flex-grow bg-gray-700 text-white rounded-lg p-4 focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none transition-all duration-300 h-24 sm:h-auto"
                rows={3}
                disabled={isLoading}
              />
              <button
                onClick={handleGenerateImage}
                disabled={isLoading}
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg shadow-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500"
              >
                {isLoading ? (
                  <>
                    <Spinner />
                    Generating...
                  </>
                ) : (
                  <>
                    <SparklesIcon />
                    Generate
                  </>
                )}
              </button>
            </div>
            {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
          </div>

          <div className="mt-8 w-full aspect-square bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-700 flex items-center justify-center overflow-hidden">
            {isLoading && (
              <div className="flex flex-col items-center text-gray-400">
                <Spinner size="lg" />
                <p className="mt-4 text-lg">Conjuring your masterpiece...</p>
              </div>
            )}
            {!isLoading && imageUrl && (
              <img
                src={imageUrl}
                alt={prompt}
                className="w-full h-full object-contain transition-opacity duration-500 animate-fade-in"
              />
            )}
            {!isLoading && !imageUrl && (
              <div className="text-center text-gray-500 flex flex-col items-center">
                 <ImageIcon />
                <p className="mt-2">Your generated image will appear here.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};


const SparklesIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 mr-2"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
    />
  </svg>
);

const ImageIcon: React.FC = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-16 w-16 text-gray-600" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth={1}>
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);


export default App;
