import React, { useEffect, useState } from 'react';

interface HistoryItemProps {
  name: string;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ name }) => {
  const [text, setText] = useState<string>('');
  useEffect(() => {
    const item = localStorage.getItem(`transcription_${name}`);
    setText(item || '');
  }, [name]);

  return (
    <div className="max-w-2xl mx-auto text-center pt-20 px-4">
      <h1 className="text-3xl font-bold text-[#191716] mb-4">{name}</h1>
      <p className="text-gray-700 whitespace-pre-wrap">{text}</p>
    </div>
  );
};