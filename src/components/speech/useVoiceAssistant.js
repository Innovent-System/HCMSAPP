import React, { useEffect, useRef } from 'react'
// import * as tf from "@tensorflow/tfjs";
// import * as SpeechCommands from "@tensorflow-models/speech-commands";
import VoiceModel from "./AIModel/model.json";
import VoiceModelMetadata from "./AIModel/metadata.json";

const options = {
    includeSpectogram: true,
    overlapFactor: 0.5,
    invokeCallbackOnNoiseAndUnkown: false,
    probabilityThershold: 0.75,
}

export const useVoiceAssistant = () => {

    const recognizer = useRef(null);
    // useEffect(async () => {
    //     recognizer.current = SpeechCommands.create(
    //         "BROWSER_FFT",
    //         undefined,
    //         VoiceModel,
    //         VoiceModelMetadata
    //     );

    //     await recognizer.current.ensureModelLoaded();
    // }, [])

    const startAssistant = async (onListen) => {

        const classLabels = recognizer.current.wordLabels();
console.log(classLabels)
        recognizer.current.listen((result) => {
            const scores = result.scores;

            const wordScore = scores.reduce((previousValue, value) => {
                if (previousValue) {
                    if (previousValue > value) return previousValue;
                }
                return value;
            });

            const wordIdx = scores.findIndex((v) => v === wordScore);
            const word = classLabels[wordIdx];

            if (onListen) onListen(word);
        }, options);
    }

    const stopAssistant = async () => {
        await recognizer.current.stopListening();
    }

    const saySpeech = (text) => {
        const speech = new window.SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(speech);
    }


    return {
        startAssistant,
        stopAssistant,
        saySpeech
    }
}