import React, { useEffect, useState } from "react";
import { FaSave } from "react-icons/fa";
import TranscriptionControllers from "./TranscriptionControllers";

const RealTimeTranscription: React.FC = () => {
  const [transcript, setTranscript] = useState<string>("");
  const [delta, setDelta] = useState<string>("");
  const [transcriptionName, setTranscriptionName] = useState<string>("");
  const [isNameTaken, setIsNameTaken] = useState<boolean>(false);
  const [canBeSaved, setCanBeSaved] = useState<boolean>(false);

  const saveTranscription = () => {
    if (!transcriptionName.trim()) {
      alert("Please enter a name for the transcription.");
      return;
    }
    localStorage.setItem(`transcription_${transcriptionName}`, transcript);
    setTranscript("");
    setTranscriptionName("");
    setCanBeSaved(false);
    alert(`Saved transcription "${transcriptionName}" locally.`);
  };

  useEffect(() => {
    if (transcriptionName.trim()) {
      const exists =
        localStorage.getItem(`transcription_${transcriptionName.trim()}`) !==
        null;
      setIsNameTaken(exists);
    } else {
      setIsNameTaken(false);
    }
  }, [transcriptionName]);

  return (
    <div className="flex flex-col items-center justify-center">
      <TranscriptionControllers
        onDelta={(delta) => setDelta(delta)}
        onTranscript={(transcript) => {
          setTranscript(transcript);
        }}
        onStopTranscription={() => {
          setCanBeSaved(true);
        }}
      />
      <textarea
        className="w-full max-w-lg h-48 p-4 bg-white text-[#191716] rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#43AA8B] shadow-md resize-none"
        value={transcript + delta}
        placeholder="Start Transcription"
        readOnly
      />
      {canBeSaved && (
        <div className="flex items-center space-x-2 mt-2 w-full max-w-lg">
          <input
            type="text"
            placeholder="name of transcription"
            value={transcriptionName}
            onChange={(e) => setTranscriptionName(e.target.value)}
            className={`flex-1 px-4 py-2
              border ${isNameTaken ? "border-red-500" : "border-gray-300"}
              rounded-lg
              focus:outline-none focus:ring-2 focus:ring-[#43AA8B]
              shadow-md`}
          />
          {isNameTaken && (
            <p className="text-red-500 text-sm mt-1">Name already taken</p>
          )}
          <button
            onClick={saveTranscription}
            disabled={isNameTaken || !transcriptionName.trim()}
            className={`
              flex items-center space-x-2
              px-4 py-2
              bg-[#43AA8B] text-white
              rounded-lg
              ${
                isNameTaken || !transcriptionName.trim()
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#3a8b75] transition-transform transform hover:scale-105 active:scale-95"
              }
              shadow-md
            `}
          >
            <FaSave size={20} />
            <span>Save</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default RealTimeTranscription;
