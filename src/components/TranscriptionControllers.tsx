import React, { useEffect, useRef, useState } from "react";
import { Session } from "../scripts/session";
import { FaMicrophone, FaPause, FaPlay, FaSpinner } from "react-icons/fa";
import { FaStop } from "react-icons/fa";

interface Language {
  code: string;
  name: string;
}

const WHISPER_LANGUAGES: Language[] = [
  { code: "af", name: "Afrikaans" },
  { code: "am", name: "Amharic" },
  { code: "ar", name: "Arabic" },
  { code: "as", name: "Assamese" },
  { code: "az", name: "Azerbaijani" },
  { code: "ba", name: "Bashkir" },
  { code: "be", name: "Belarusian" },
  { code: "bg", name: "Bulgarian" },
  { code: "bn", name: "Bengali" },
  { code: "bo", name: "Tibetan" },
  { code: "br", name: "Breton" },
  { code: "bs", name: "Bosnian" },
  { code: "ca", name: "Catalan" },
  { code: "cs", name: "Czech" },
  { code: "cy", name: "Welsh" },
  { code: "da", name: "Danish" },
  { code: "de", name: "German" },
  { code: "el", name: "Greek" },
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "et", name: "Estonian" },
  { code: "eu", name: "Basque" },
  { code: "fa", name: "Persian" },
  { code: "fi", name: "Finnish" },
  { code: "fo", name: "Faroese" },
  { code: "fr", name: "French" },
  { code: "gl", name: "Galician" },
  { code: "gu", name: "Gujarati" },
  { code: "ha", name: "Hausa" },
  { code: "haw", name: "Hawaiian" },
  { code: "he", name: "Hebrew" },
  { code: "hi", name: "Hindi" },
  { code: "hr", name: "Croatian" },
  { code: "ht", name: "Haitian" },
  { code: "hu", name: "Hungarian" },
  { code: "hy", name: "Armenian" },
  { code: "id", name: "Indonesian" },
  { code: "is", name: "Icelandic" },
  { code: "it", name: "Italian" },
  { code: "ja", name: "Japanese" },
  { code: "jw", name: "Javanese" },
  { code: "ka", name: "Georgian" },
  { code: "kk", name: "Kazakh" },
  { code: "km", name: "Central Khmer" },
  { code: "kn", name: "Kannada" },
  { code: "ko", name: "Korean" },
  { code: "la", name: "Latin" },
  { code: "lb", name: "Luxembourgish" },
  { code: "ln", name: "Lingala" },
  { code: "lo", name: "Lao" },
  { code: "lt", name: "Lithuanian" },
  { code: "lv", name: "Latvian" },
  { code: "mg", name: "Malagasy" },
  { code: "mi", name: "Maori" },
  { code: "mk", name: "Macedonian" },
  { code: "ml", name: "Malayalam" },
  { code: "mn", name: "Mongolian" },
  { code: "mr", name: "Marathi" },
  { code: "ms", name: "Malay" },
  { code: "mt", name: "Maltese" },
  { code: "my", name: "Burmese" },
  { code: "ne", name: "Nepali" },
  { code: "nl", name: "Dutch" },
  { code: "nn", name: "Norwegian Nynorsk" },
  { code: "no", name: "Norwegian" },
  { code: "oc", name: "Occitan" },
  { code: "pa", name: "Panjabi" },
  { code: "pl", name: "Polish" },
  { code: "ps", name: "Pushto" },
  { code: "pt", name: "Portuguese" },
  { code: "ro", name: "Romanian" },
  { code: "ru", name: "Russian" },
  { code: "sa", name: "Sanskrit" },
  { code: "sd", name: "Sindhi" },
  { code: "si", name: "Sinhala" },
  { code: "sk", name: "Slovak" },
  { code: "sl", name: "Slovenian" },
  { code: "sn", name: "Shona" },
  { code: "so", name: "Somali" },
  { code: "sq", name: "Albanian" },
  { code: "sr", name: "Serbian" },
  { code: "su", name: "Sundanese" },
  { code: "sv", name: "Swedish" },
  { code: "sw", name: "Swahili" },
  { code: "ta", name: "Tamil" },
  { code: "te", name: "Telugu" },
  { code: "tg", name: "Tajik" },
  { code: "th", name: "Thai" },
  { code: "tk", name: "Turkmen" },
  { code: "tl", name: "Tagalog" },
  { code: "tr", name: "Turkish" },
  { code: "tt", name: "Tatar" },
  { code: "uk", name: "Ukrainian" },
  { code: "ur", name: "Urdu" },
  { code: "uz", name: "Uzbek" },
  { code: "vi", name: "Vietnamese" },
  { code: "yi", name: "Yiddish" },
  { code: "yo", name: "Yoruba" },
  { code: "yue", name: "Cantonese" },
  { code: "zh", name: "Chinese" },
];

interface TranscriptionEvent {
  type: string;
  event_id: string;
  item_id?: string;
  previous_item_id?: string; // conversation.item.created; input_audio_buffer.committed;
  session?: {
    // transcription_session.created
    client_secret: string | null;
    expires_at: number;
    id: string;
    include: any;
    input_audio_format: string;
    input_audio_noise_reduction: any;
    input_audio_transcription: {
      model: string;
      language: string;
      prompt: string;
    };
  };
  delta?: string; // conversation.item.input_audio_transcription.delta
  content_index?: number; // conversation.item.input_audio_transcription.delta
  transcript?: string; // conversation.item.input_audio_transcription.completed
}

type RecordingType =
  | "ready"
  | "initializing"
  | "running"
  | "paused"
  | "stopped"
  | "error";

interface IRealTimeTranscription {
  onDelta: (delta: string) => void;
  onTranscript: (transcript: string) => void;
  onStopTranscription: () => void;
}

const TranscriptionControllers: React.FC<IRealTimeTranscription> = ({
  onDelta,
  onTranscript,
  onStopTranscription,
}) => {
  const [finalTranscript, setFinalTranscript] = useState<string>("");
  const [delta, setDelta] = useState<string>("");
  const [recording, setRecording] = useState<RecordingType>("ready");
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("he");
  const [shouldTranslate, setShouldTranslate] = useState<boolean>(true);
  const sessionRef = useRef<Session | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      sessionRef.current?.stop();
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    onDelta(delta);
  }, [delta]);

  useEffect(() => {
    onTranscript(finalTranscript);
  }, [finalTranscript]);

  const startTranscription = async () => {
    setError(null);
    setFinalTranscript("");
    setRecording("initializing");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const session = new Session();
      sessionRef.current = session;

      session.onopen = () => {
        console.log("Session opened (Data Channel)");
        setRecording("running");
      };

      session.onmessage = (eventData: TranscriptionEvent) => {
        console.log("Received event:", eventData);
        if (
          eventData.type ===
            "conversation.item.input_audio_transcription.completed" &&
          eventData.transcript
        ) {
          setDelta("");
          shouldTranslate
            ? fetch(
                `/api/translate?text=${eventData.transcript}&from=${selectedLanguage}`
              ).then(async (result) => {
                const translation = (await result.json())["translations"][0];
                setFinalTranscript(
                  (prev) => prev + (prev ? " " : "") + translation
                );
              })
            : setFinalTranscript(
                (prev) => prev + (prev ? " " : "") + eventData.transcript
              );
        } else if (
          eventData.type ===
            "conversation.item.input_audio_transcription.delta" &&
          eventData.delta
        ) {
          setDelta((delta) => delta + eventData.delta);
        }
      };

      session.onerror = (err: Error) => {
        console.error("Session error:", err);
        setError(`Session error: ${err.message}`);
        stopTranscription();
        setRecording("error");
      };

      session.onconnectionstatechange = (state: RTCPeerConnectionState) => {
        console.log(`Connection State: ${state}`);
        if (
          state === "failed" ||
          state === "closed" ||
          state === "disconnected"
        ) {
          console.log(
            `Stopping transcription due to connection state: ${state}`
          );
          if (recording) {
            stopTranscription();
          }
        }
      };

      await session.startTranscription(stream, selectedLanguage);
    } catch (err: any) {
      console.error("Error starting transcription:", err);
      setError(`Error starting transcription: ${err.message}`);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      sessionRef.current?.stop();
      sessionRef.current = null;
      setRecording("error");
    }
  };

  const pauseTranscription = () => {
    if (sessionRef.current) {
      sessionRef.current.mute(true); // Use session's mute method
      setRecording("paused");
      console.log("Transcription paused via session mute");
    }
  };

  const resumeTranscription = () => {
    if (sessionRef.current) {
      sessionRef.current.mute(false); // Use session's mute method
      setRecording("running");
      console.log("Transcription resumed via session mute");
    }
  };

  const stopTranscription = () => {
    setRecording("stopped");
    if (sessionRef.current) {
      sessionRef.current.stop();
      sessionRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setRecording("stopped");
    onStopTranscription();
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-44 mb-2">
        {recording === "ready" && (
          <ReadyButton
            onClick={() => {
              startTranscription();
            }}
          />
        )}
        {recording === "initializing" && <InitializingButton />}
        {recording === "running" && (
          <RunningControls
            onStop={() => stopTranscription()}
            onPause={() => pauseTranscription()}
          />
        )}
        {recording === "paused" && (
          <PausedControls
            onStop={() => stopTranscription()}
            onContinue={() => resumeTranscription()}
          />
        )}
        {recording === "stopped" && (
          <ReadyButton
            onClick={() => {
              startTranscription();
            }}
          />
        )}
        {recording === "error" && (
          <ErrorButton
            onClick={() => {
              setError("");
              startTranscription();
            }}
          />
        )}
      </div>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <div className="w-full max-w-lg mb-4">
        <label htmlFor="language" className="block mb-1 text-[#191716]">
          Language:
        </label>
        <select
          id="language"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          disabled={!["ready", "stopped", "error"].includes(recording)}
          className="
            w-full px-4 py-2
            bg-white text-[#191716]
            border border-gray-300 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-[#43AA8B]
            shadow-md
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {WHISPER_LANGUAGES.map(({ code, name }) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <div className="w-full max-w-lg mb-4 flex items-center justify-between">
        <label htmlFor="translate-toggle" className="text-[#191716] font-medium">
          Translate output
        </label>
        <button
          id="translate-toggle"
          type="button"
          role="switch"
          aria-checked={shouldTranslate}
          onClick={() => setShouldTranslate((v) => !v)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#43AA8B] shadow-md
            ${shouldTranslate ? 'bg-[#43AA8B]' : 'bg-gray-300'}`}
          disabled={!["ready", "stopped", "error", "paused"].includes(recording)}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
              ${shouldTranslate ? 'translate-x-6' : 'translate-x-1'}`}
          />
        </button>
      </div>
    </div>
  );
};

const ReadyButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="
      flex items-center space-x-2
      px-4 py-2
      bg-[#43AA8B] text-white
      rounded-lg
      hover:bg-[#3a8b75]
      transition-transform transform hover:scale-105
      active:scale-95
      shadow-md
    "
  >
    <FaMicrophone size={20} />
    <span>Start Listening</span>
  </button>
);

const InitializingButton: React.FC = () => (
  <button
    className="
      flex items-center space-x-2
      px-4 py-2
      bg-[#F4AC32] text-[#191716]
      rounded-lg
      hover:bg-[#dfa22b]
      transition-transform transform hover:scale-105
      active:scale-95
      shadow-md
    "
  >
    <FaSpinner size={20} className="animate-spin" />
    <span>Initializing</span>
  </button>
);

const RunningControls: React.FC<{
  onStop: () => void;
  onPause: () => void;
}> = ({ onStop, onPause }) => (
  <div className="flex space-x-4">
    <button
      onClick={onStop}
      className="
        flex flex-1 items-center space-x-2
        px-4 py-2
        bg-[#191716] text-white
        rounded-lg
        hover:bg-[#000000]
        transition-transform transform hover:scale-105
        active:scale-95
        shadow-md
      "
    >
      <FaStop size={18} />
      <span>Stop</span>
    </button>
    <button
      onClick={onPause}
      className="
        flex items-center space-x-2
        px-4 py-2
        bg-[#DB504A] text-white
        rounded-lg
        hover:bg-[#c1443e]
        transition-transform transform hover:scale-105
        active:scale-95
        shadow-md
      "
    >
      <FaPause size={18} />
    </button>
  </div>
);

const PausedControls: React.FC<{
  onStop: () => void;
  onContinue: () => void;
}> = ({ onStop, onContinue }) => (
  <div className="flex space-x-4">
    <button
      onClick={onStop}
      className="
        flex flex-1 items-center space-x-2
        px-4 py-2
        bg-[#191716] text-white
        rounded-lg
        hover:bg-[#000000]
        transition-transform transform hover:scale-105
        active:scale-95
        shadow-md
      "
    >
      <FaStop size={18} />
      <span>Stop</span>
    </button>
    <button
      onClick={onContinue}
      className="
        flex items-center space-x-2
        px-4 py-2
        bg-[#43AA8B] text-white
        rounded-lg
        hover:bg-[#3a8b75]
        transition-transform transform hover:scale-105
        active:scale-95
        shadow-md
      "
    >
      <FaPlay size={18} />
    </button>
  </div>
);

const ErrorButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="
      flex items-center space-x-2
      px-4 py-2
      bg-[#DB504A] text-white
      rounded-lg
      hover:bg-[#c1443e]
      transition-transform transform hover:scale-105
      active:scale-95
      shadow-md
    "
  >
    <FaMicrophone size={20} />
    <span>Restart Listening</span>
  </button>
);

export default TranscriptionControllers;
