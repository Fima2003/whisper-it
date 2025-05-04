export const prerender = false;

export async function GET({ request }: any): Promise<Response> {
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);
  const lang = params.get("lang");
  const sessionConfig = {
    input_audio_transcription: {
      model: "whisper-1",
      language: lang,
    },
    turn_detection: {
      type: "server_vad",
    },
  };
  const r = await fetch(
    "https://api.openai.com/v1/realtime/transcription_sessions",
    {
      method: "POST",
      body: JSON.stringify(sessionConfig),
      headers: {
        Authorization: `Bearer ${import.meta.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        "openai-beta": "realtime-v1",
      },
    }
  );
  const data = await r.json();
  return Response.json(data);
}
