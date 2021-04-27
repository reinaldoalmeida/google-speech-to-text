// Imports the Google Cloud client library.
const speech = require("@google-cloud/speech");
const path = require("path");
const process = require("process");
const fs = require("fs");
// need to get credentials.json
require("dotenv").config();

async function main() {
    // The name of the audio file to transcribe
    const fileName = path.join(process.cwd(), "audios", "audio@48kHz-20s.mp3");

    // Reads a local audio file and converts it to base64
    const file = fs.readFileSync(fileName);
    const audioBytes = file.toString("base64");

    // The audio file's encoding, sample rate in hertz, and BCP-47 language code
    const audio = {
        content: audioBytes,
    };
    const config = {
        encoding: "MP3", // "LINEAR16",
        sampleRateHertz: 48000, //16000,
        languageCode: "pt-BR",
    };
    const request = {
        audio: audio,
        config: config,
    };

    try {
        const client = new speech.SpeechClient();
        // Detects speech in the audio file
        const [response] = await client.recognize(request);
        const transcription = response.results
            .map((result) => result.alternatives[0].transcript)
            .join("\n");
        console.log(`Transcription: ${transcription}`);
    } catch (e) {
        throw new Error(e.details);
    }
}
main().catch(console.error);
