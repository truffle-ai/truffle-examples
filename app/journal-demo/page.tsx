'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Moon,
  Sun,
  Plus,
  Save,
  ArrowLeft,
  Search,
  Calendar,
  Trash2,
  AlertCircle,
} from 'lucide-react';

interface JournalEntry {
  id: number | null;
  title: string;
  content: string;
  date: string;
  lastModified: string | null;
}

const JournalDemo = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [view, setView] = useState('list');
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    const savedEntries = localStorage.getItem('journalEntries');
    setEntries(savedEntries ? JSON.parse(savedEntries) : []);
  }, []);

  const [currentEntry, setCurrentEntry] = useState<JournalEntry>({
    id: null,
    title: '',
    content: '',
    date: new Date().toLocaleDateString(),
    lastModified: new Date().toISOString(),
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  // States for AI Suggestion
  const [suggestion, setSuggestion] = useState('');
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Refs for Textarea and Ghost Div
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('journalEntries', JSON.stringify(entries));
  }, [entries]);

  const baseTheme = isDarkMode
    ? 'bg-neutral-950 text-orange-50 dark-texture'
    : 'bg-orange-50 text-slate-800 light-texture';

  const cardTheme = isDarkMode
    ? 'bg-neutral-900/90 hover:bg-neutral-800/90 border border-neutral-800 card-texture-dark'
    : 'bg-white/90 hover:bg-orange-50/90 card-texture-light';

  const buttonTheme = isDarkMode
    ? 'bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-orange-100'
    : 'bg-orange-100 hover:bg-orange-200';

  const inputTheme = isDarkMode
    ? 'placeholder:text-neutral-500'
    : 'placeholder:text-slate-400';

  const createNewEntry = () => {
    setCurrentEntry({
      id: null,
      title: '',
      content: '',
      date: new Date().toLocaleDateString(),
      lastModified: new Date().toISOString(),
    });
    setView('editor');
  };

  const saveEntry = () => {
    if (!currentEntry.title.trim()) {
      showAlert('Please add a title for your entry', 'error');
      return;
    }

    const updatedEntry = {
      ...currentEntry,
      lastModified: new Date().toISOString(),
    };

    if (currentEntry.id) {
      setEntries(
        entries.map((entry) =>
          entry.id === currentEntry.id ? updatedEntry : entry
        )
      );
    } else {
      const newEntry = {
        ...updatedEntry,
        id: Date.now(),
      };
      setEntries([newEntry, ...entries]);
    }

    showAlert('Entry saved successfully', 'success');
    setView('list');
  };

  const deleteEntry = (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      setEntries(entries.filter((entry) => entry.id !== id));
      showAlert('Entry deleted', 'success');
    }
  };

  const editEntry = (entry) => {
    setCurrentEntry(entry);
    setView('editor');
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
  };

  const filteredEntries = entries.filter(
    (entry) =>
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle Content Change with AI Suggestion
  const handleContentChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setCurrentEntry({ ...currentEntry, content: newContent });

    // Detect if the user has started a new line
    const cursorPosition = e.target.selectionStart;
    const textBeforeCursor = newContent.slice(0, cursorPosition);
    const lastChar = textBeforeCursor.slice(-1);

    if (lastChar === '\n') {
      setIsLoading(true);
      try {
        const response = await fetch('/journal-demo/api/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: textBeforeCursor }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch suggestion');
        }

        const data = await response.json();
        setSuggestion(data.suggestion);
        setShowSuggestion(true);
      } catch (error) {
        console.error('Error fetching suggestion:', error);
        showAlert('Failed to get suggestion', 'error');
      } finally {
        setIsLoading(false);
      }
    } else {
      setShowSuggestion(false);
      setSuggestion('');
    }
  };

  // Apply the Suggestion
  const applySuggestion = () => {
    if (!suggestion || !textareaRef.current) return;

    const textarea = textareaRef.current;
    const cursorPosition = textarea.selectionStart;
    const textBeforeCursor = currentEntry.content.slice(0, cursorPosition);
    const textAfterCursor = currentEntry.content.slice(cursorPosition);

    // Insert the suggestion
    const newContent = `${textBeforeCursor}${suggestion}\n${textAfterCursor}`;
    setCurrentEntry({ ...currentEntry, content: newContent });
    setShowSuggestion(false);
    setSuggestion('');

    // Move cursor to the end of the inserted suggestion
    setTimeout(() => {
      if (!textarea) return;
      textarea.focus();
      const newPosition = cursorPosition + suggestion.length + 1;
      textarea.selectionStart = textarea.selectionEnd = newPosition;
    }, 0);
  };

  // Handle Key Presses for Suggestion
  const handleKeyDown = (e) => {
    if (showSuggestion && e.key === 'Tab') {
      e.preventDefault();
      applySuggestion();
    } else if (showSuggestion && e.key === 'Escape') {
      e.preventDefault();
      setShowSuggestion(false);
      setSuggestion('');
    }
  };

  return (
    <div
      className={`min-h-screen p-4 transition-colors duration-200 relative ${baseTheme}`}
    >
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Alert */}
        {alert.show && (
          <div
            className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
              alert.type === 'error'
                ? 'bg-red-100 border border-red-200 text-red-700'
                : 'bg-green-100 border border-green-200 text-green-700'
            }`}
          >
            <AlertCircle className="h-4 w-4" />
            <span>{alert.message}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold">AI-Powered Journal</h1>
          <button
            className={`p-2 rounded-full transition-colors duration-200 backdrop-blur-sm ${buttonTheme}`}
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? (
              <Sun size={20} className="text-orange-100" />
            ) : (
              <Moon size={20} />
            )}
          </button>
        </div>

        {view === 'list' ? (
          <>
            <div className="flex gap-4 mb-6">
              <div
                className={`flex-1 flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 backdrop-blur-sm ${cardTheme}`}
              >
                <Search
                  size={20}
                  className={isDarkMode ? 'text-neutral-500' : 'text-slate-400'}
                />
                <input
                  placeholder="Search your entries..."
                  className={`bg-transparent w-full focus:outline-none ${inputTheme}`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 backdrop-blur-sm ${buttonTheme}`}
                onClick={createNewEntry}
              >
                <Plus size={20} />
                New Entry
              </button>
            </div>

            <div className="space-y-4">
              {filteredEntries.length === 0 && (
                <div
                  className={`p-8 text-center ${
                    isDarkMode ? 'text-neutral-400' : 'text-slate-500'
                  }`}
                >
                  {searchQuery
                    ? 'No entries found matching your search'
                    : 'Start writing your first entry!'}
                </div>
              )}
              {filteredEntries.map((entry) => (
                <div
                  key={entry.id}
                  onClick={() => editEntry(entry)}
                  className={`p-4 rounded-lg cursor-pointer transition-colors duration-200 backdrop-blur-sm ${cardTheme} hover:shadow-lg`}
                >
                  <div className="flex justify-between mb-2">
                    <h3
                      className={`font-semibold ${
                        isDarkMode ? 'text-white' : null
                      } hover:text-orange-600`}
                    >
                      {entry.title}
                    </h3>
                    <div className="flex items-center gap-4">
                      <span
                        className={
                          isDarkMode ? 'text-neutral-400' : 'text-slate-500'
                        }
                      >
                        {entry.date}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteEntry(entry.id);
                        }}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p
                    className={
                      isDarkMode ? 'text-neutral-400' : 'text-slate-500'
                    }
                  >
                    {entry.content.slice(0, 150)}...
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-4 relative">
            {/* Editor Header */}
            <div className="flex items-center gap-4 mb-6">
              <button
                className={`p-2 rounded-lg transition-colors duration-200 backdrop-blur-sm ${buttonTheme}`}
                onClick={() => setView('list')}
              >
                <ArrowLeft size={20} />
              </button>
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 backdrop-blur-sm ${buttonTheme}`}
                onClick={saveEntry}
              >
                <Save size={20} />
                Save
              </button>
              <span
                className={`flex items-center gap-2 px-4 py-2 ${
                  isDarkMode ? 'text-neutral-400' : 'text-slate-500'
                }`}
              >
                <Calendar size={20} />
                {currentEntry.date || new Date().toLocaleDateString()}
              </span>
            </div>

            {/* Title Input */}
            <input
              placeholder="Title"
              className={`w-full p-4 rounded-lg text-xl font-semibold transition-colors duration-200 backdrop-blur-sm ${cardTheme} ${inputTheme}`}
              value={currentEntry.title}
              onChange={(e) =>
                setCurrentEntry({ ...currentEntry, title: e.target.value })
              }
            />

            {/* Container for Textarea and Ghost Div */}
            <div className="relative">
              {/* Ghost Div */}
              <div
                ref={ghostRef}
                className={`absolute top-0 left-0 w-full h-full p-4 rounded-lg resize-none transition-colors duration-200 backdrop-blur-sm pointer-events-none ${cardTheme} ${inputTheme}`}
                style={{
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(100, 100, 100, 0.5)',
                }}
              >
                {currentEntry.content}
                {showSuggestion && suggestion && '\n' + suggestion}
              </div>

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                placeholder="Write your thoughts..."
                className={`w-full h-96 p-4 rounded-lg resize-none bg-transparent focus:outline-none relative z-20`}
                value={currentEntry.content}
                onChange={handleContentChange}
                onKeyDown={handleKeyDown}
                style={{
                  background: 'transparent',
                  color: isDarkMode ? 'white' : 'black',
                }}
              />
            </div>

            {/* Loading Indicator */}
            {isLoading && (
              <div className={`p-2 rounded-lg ${cardTheme}`}>
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-orange-500 border-t-transparent"></div>
                  <span className="text-sm">Getting suggestion...</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalDemo; 