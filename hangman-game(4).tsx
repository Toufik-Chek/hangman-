import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, 
  Keyboard, 
  ListPlus, 
  Save, 
  Users,
  Minus,
  Plus 
} from 'lucide-react';

const HangmanGame = () => {
  const [wordList, setWordList] = useState('apple,banana,computer,hangman,python');
  const [isWordListVisible, setIsWordListVisible] = useState(false);
  const [words, setWords] = useState([]);
  const [currentWord, setCurrentWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameStatus, setGameStatus] = useState('playing');
  const [currentTeam, setCurrentTeam] = useState(1);
  const [teamScores, setTeamScores] = useState([0, 0]);
  const [isEditing, setIsEditing] = useState(false);

  const MAX_WRONG_GUESSES = 6;

  useEffect(() => {
    resetGame();
  }, [wordList]);

  const resetGame = () => {
    const splitWords = wordList.split(',').map(word => word.trim().toUpperCase());
    setWords(splitWords);
    const randomWord = splitWords[Math.floor(Math.random() * splitWords.length)];
    setCurrentWord(randomWord);
    setGuessedLetters([]);
    setWrongGuesses(0);
    setGameStatus('playing');
  };

  const handleKeyPress = (letter) => {
    if (gameStatus !== 'playing' || guessedLetters.includes(letter)) return;

    const newGuessedLetters = [...guessedLetters, letter];
    setGuessedLetters(newGuessedLetters);

    if (!currentWord.includes(letter)) {
      const newWrongGuesses = wrongGuesses + 1;
      setWrongGuesses(newWrongGuesses);

      if (newWrongGuesses >= MAX_WRONG_GUESSES) {
        setGameStatus('lost');
        const newScores = [...teamScores];
        newScores[currentTeam - 1] -= 1;
        setTeamScores(newScores);
        setCurrentTeam(currentTeam === 1 ? 2 : 1);
      }
    }

    if (currentWord.split('').every(char => 
      newGuessedLetters.includes(char) || char === ' '
    )) {
      setGameStatus('won');
      const newScores = [...teamScores];
      newScores[currentTeam - 1] += 1;
      setTeamScores(newScores);
      setCurrentTeam(currentTeam === 1 ? 2 : 1);
    }
  };

  const renderWord = () => {
    return currentWord.split('').map((letter, index) => (
      <span 
        key={index} 
        className={`
          w-10 h-12 mx-1 border-b-4 flex items-center justify-center text-2xl font-bold
          ${letter === ' ' ? 'border-transparent' : 'border-gray-500'}
        `}
      >
        {letter === ' ' || guessedLetters.includes(letter) ? letter : '_'}
      </span>
    ));
  };

  const renderKeyboard = () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    return (
      <div className="grid grid-cols-9 gap-1 w-full max-w-xl mx-auto">
        {alphabet.map(letter => (
          <button
            key={letter}
            onClick={() => handleKeyPress(letter)}
            disabled={guessedLetters.includes(letter) || gameStatus !== 'playing'}
            className={`
              p-2 bg-blue-500 text-white rounded
              ${guessedLetters.includes(letter) ? 'opacity-50' : 'hover:bg-blue-600'}
              ${!guessedLetters.includes(letter) && gameStatus === 'playing' ? 'cursor-pointer' : 'cursor-not-allowed'}
            `}
          >
            {letter}
          </button>
        ))}
      </div>
    );
  };

  const renderHangman = () => {
    const parts = [
      // Base
      <line key="base" x1="20%" y1="90%" x2="80%" y2="90%" stroke="black" strokeWidth="4" />,
      // Vertical post
      <line key="post" x1="50%" y1="90%" x2="50%" y2="20%" stroke="black" strokeWidth="4" />,
      // Horizontal beam
      <line key="beam" x1="50%" y1="20%" x2="70%" y2="20%" stroke="black" strokeWidth="4" />,
      // Rope
      <line key="rope" x1="70%" y1="20%" x2="70%" y2="30%" stroke="black" strokeWidth="4" />,
      // Head
      <circle key="head" cx="70%" cy="35%" r="5%" fill="none" stroke="black" strokeWidth="4" />,
      // Body
      <line key="body" x1="70%" y1="40%" x2="70%" y2="65%" stroke="black" strokeWidth="4" />,
      // Arms and legs
      <line key="left-arm" x1="70%" y1="45%" x2="60%" y2="55%" stroke="black" strokeWidth="4" />,
      <line key="right-arm" x1="70%" y1="45%" x2="80%" y2="55%" stroke="black" strokeWidth="4" />,
      <line key="left-leg" x1="70%" y1="65%" x2="60%" y2="75%" stroke="black" strokeWidth="4" />,
      <line key="right-leg" x1="70%" y1="65%" x2="80%" y2="75%" stroke="black" strokeWidth="4" />
    ];

    return (
      <svg viewBox="0 0 100 100" className="w-48 h-48 mx-auto">
        {parts.slice(0, wrongGuesses + 4)}
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl">
        {/* Team Scores and Current Team */}
        <div className="flex justify-between mb-4">
          <div className={`
            p-2 rounded ${currentTeam === 1 ? 'bg-blue-200' : 'bg-gray-100'}
          `}>
            <span className="font-bold">Team 1: {teamScores[0]} Points</span>
          </div>
          <div className={`
            p-2 rounded ${currentTeam === 2 ? 'bg-green-200' : 'bg-gray-100'}
          `}>
            <span className="font-bold">Team 2: {teamScores[1]} Points</span>
          </div>
        </div>

        {/* Word List Management */}
        <div className="mb-4">
          <div className="flex items-center">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="mr-2 p-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              {isEditing ? <Minus /> : <ListPlus />}
            </button>
            <button 
              onClick={() => setIsWordListVisible(!isWordListVisible)}
              className="mr-2 p-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              {isWordListVisible ? 'Hide' : 'Show'} Word List
            </button>
          </div>

          {isEditing && (
            <div className="mt-2">
              <textarea 
                value={wordList}
                onChange={(e) => setWordList(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter words separated by commas"
                rows={3}
              />
              <button 
                onClick={() => setIsEditing(false)}
                className="mt-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save List
              </button>
            </div>
          )}

          {isWordListVisible && !isEditing && (
            <div className="mt-2 p-2 bg-gray-100 rounded">
              {wordList}
            </div>
          )}
        </div>

        {/* Game Area */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            Team {currentTeam}'s Turn
          </h2>

          {renderHangman()}

          <div className="flex justify-center mb-4">
            {renderWord()}
          </div>

          <div className="mb-4">
            <span className="font-bold">Guesses Left: {MAX_WRONG_GUESSES - wrongGuesses}</span>
          </div>

          {gameStatus !== 'playing' && (
            <div className={`
              p-4 rounded mb-4 
              ${gameStatus === 'won' ? 'bg-green-200' : 'bg-red-200'}
            `}>
              {gameStatus === 'won' 
                ? `Congratulations! Team ${currentTeam} won!` 
                : `Game Over! The word was ${currentWord}`}
              <button 
                onClick={resetGame}
                className="ml-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Play Again
              </button>
            </div>
          )}

          {renderKeyboard()}
        </div>
      </div>
    </div>
  );
};

export default HangmanGame;
