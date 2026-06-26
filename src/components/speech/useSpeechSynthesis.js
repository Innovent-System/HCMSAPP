import { useState, useRef, useEffect } from "react";
import { useAppSelector } from "../../store/storehook";

/**
 * Command categories supported:
 *  - route  : navigation        ("go to payroll")
 *  - action : button triggers   ("save", "cancel", "submit", "delete")
 *  - search : search queries    ("search employee Ali")
 *  - filter : list filters      ("filter by department HR")
 *  - form   : field fill        ("set name to Ali Hassan")
 */

export const useSpeechSynthesis = () => {
  const [voices, setVoices] = useState([]);
  const [lastCommand, setLastCommand] = useState(null);
  // lastCommand shape: { text, status: 'matched'|'unmatched', category? }

  const synthRef = useRef(null);
  const appstate = useAppSelector((a) => a.appdata.commands);

  // ─── Voice loading ──────────────────────────────────────────────────────────
  const updateVoices = () => {
    if (synthRef.current) {
      setVoices(synthRef.current.getVoices());
    }
  };

  useEffect(() => {
    if (typeof window !== "object" || !window.speechSynthesis) return;
    synthRef.current = window.speechSynthesis;
    synthRef.current.onvoiceschanged = updateVoices;
    updateVoices();

    return () => {
      if (synthRef.current) synthRef.current.onvoiceschanged = null;
    };
  }, []);

  // ─── Pick best voice — prefer en-US local, fallback to default ─────────────
  const getBestVoice = (preferredLang = "en-US") => {
    return (
      voices.find((v) => v.lang === preferredLang && v.localService) ||
      voices.find((v) => v.lang === preferredLang) ||
      voices.find((v) => v.default) ||
      voices[0] ||
      null
    );
  };

  // ─── Core speak ─────────────────────────────────────────────────────────────
  const speak = (text, { pitch = 1, rate = 1, lang = "en-US" } = {}) => {
    if (!synthRef.current) return;
    console.log(synthRef)
    // Cancel any ongoing speech first
    synthRef.current.cancel();
    const normalized = text.trim().replace(/\.+$/, "") + ".";
    // Match against all registered commands
    const instruction = appstate?.find((c) =>
      c.matchText?.some((regex) => regex.exec(normalized))
    );
    console.log({ instruction });
    let responseText;

    if (instruction) {
      instruction.onMatch(text); // pass raw text — dynamic commands (search/filter/form) need it
      responseText = instruction.speak || "Done.";
      setLastCommand({ text, status: "matched", category: instruction.category });
    } else {
      responseText = "Sorry, I didn't recognise that command. Please try again.";
      setLastCommand({ text, status: "unmatched" });
    }

    const utterance = new SpeechSynthesisUtterance(responseText);
    utterance.voice = getBestVoice(lang);
    utterance.pitch = pitch;
    utterance.rate = rate;
    utterance.volume = 1;
    utterance.lang = lang;

    synthRef.current.speak(utterance);
  };

  return {
    voices,
    speak,
    lastCommand,
    isReady: Array.isArray(appstate) && appstate.length > 0,
  };
};