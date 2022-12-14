import React, { useEffect, useState } from 'react'
import { useRef } from 'react';
import Wave from "wave-visualizer";

export const useVoiceVisualizer = () => {

    const audioStream = useRef(null);
    const [wave] = useState(new Wave())

    useEffect( () => {

        return () => {
            stopVisualization();
        }
    }, []);
    const openAudioStream = async () => {
        try {
            audioStream.current = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
        } catch (err) {
            console.error("Cannot open Audio Stream ", err);
        }
    }

    const startVisualization = async () => {
        await openAudioStream();

        wave.fromStream(audioStream.current, "output", {
            type: "bars",
            colors: ["blue", "3498db"],
            stroke: 1,
        });
    }

    const stopVisualization = () => {
        audioStream.current?.getTracks()?.forEach((track) => {
            track.stop();
        });
    }

    return{
        startVisualization,
        stopVisualization
    }

}
