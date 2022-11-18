import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useSelector } from 'react-redux';

let appcommands = [];
export const useSpeechSynthesis = () => {
  const [voices, setVoices] = useState([]);

  const synth = useRef();
  const updateVoices = () => {
    setVoices(synth.current.getVoices());
  };

  const appstate = useSelector(a => a.appdata.commands);
  appcommands = appstate;
  
  const speak = (text, voice, pitch = 1, rate = 1) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voices.filter(v => v.default)[0] || voices[0];
    utterance.pitch = pitch;
    utterance.volume = 1;
    utterance.rate = rate;

    const instrcution = appcommands.find(c => c.matchText.some(c => c.exec(text)));
    if (instrcution) {
      instrcution.onMatch();
    }

    synth.current.speak(utterance);
  }

  useEffect(() => {
    if (typeof window !== 'object' || !window.speechSynthesis) return;
    synth.current = window.speechSynthesis;
    synth.current.onvoiceschanged = updateVoices;
    updateVoices();

    return () => {
      synth.current.onvoiceschanged = null
    }
  }, []);

  return {
    voices,
    speak,
    isReady: appcommands?.length > 0
  }
}
