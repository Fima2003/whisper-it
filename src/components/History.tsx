import React, { useEffect, useState } from 'react';

interface Entry {
  name: string;
  text: string;
}

export const History: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    const items: Entry[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('transcription_')) {
        const name = key.replace('transcription_', '');
        const text = localStorage.getItem(key) || '';
        items.push({ name, text });
      }
    }
    setEntries(items);
  }, []);

  const getSnippet = (text: string, maxLength = 100) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  return (
    <div className="px-4">
      <h2 className="text-2xl font-bold text-[#191716] text-center mb-4">
        Transcription History
      </h2>
      {entries.length === 0 ? (
        <p className="text-gray-500 text-center">No transcriptions saved.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mx-auto max-w-3xl">
          {entries.map((entry) => (
            <a
              key={entry.name}
              href={`/history/${entry.name}`}
              className="block w-full max-w-xs aspect-square p-4 bg-white rounded-lg border border-gray-300 shadow-md hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold text-[#191716] mb-2">{entry.name}</h3>
              <p className="text-gray-700">{getSnippet(entry.text)}</p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
