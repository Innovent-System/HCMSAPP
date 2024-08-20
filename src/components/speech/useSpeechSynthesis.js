import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useAppSelector } from "../../store/storehook";

// let appcommands = [];
export const useSpeechSynthesis = () => {
  const [voices, setVoices] = useState([]);

  const synth = useRef();
  const updateVoices = () => {
    setVoices(synth.current.getVoices());
  };

  const appstate = useAppSelector(a => a.appdata.commands);
  // appcommands = appstate;
  
  const speak = (text, voice, pitch = 1, rate = 1) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voices.filter(v => v.default)[0] || voices[0];
    
    utterance.pitch = pitch;
    utterance.volume = 1;
    utterance.rate = rate;

    const instrcution = appstate.find(c => c.matchText.some(c => c.exec(text)));
    if (instrcution) {
      instrcution.onMatch();
    }
    else{
      utterance.text = "Sorry! I apologize, i am a predefine AI Model with restricted rules and regulation"
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
    isReady: appstate?.length > 0
  }
}
