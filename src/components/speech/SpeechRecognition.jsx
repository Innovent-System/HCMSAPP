import React, { useEffect, useRef, useState } from "react";
import { KeyboardVoice, MicOff } from "../../deps/ui/icons";
import { Fab, Box } from "../../deps/ui";
import { useSpeechSynthesis } from "./useSpeechSynthesis";

window.SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

const SUPPORTED =
    "SpeechRecognition" in window || "webkitSpeechRecognition" in window;

// ─── Waveform bars ────────────────────────────────────────────────────────────
const WaveBar = ({ delay }) => (
    <span
        style={{
            display: "inline-block",
            width: 3,
            borderRadius: 2,
            background: "currentColor",
            marginRight: 2,
            animation: "waveAnim 0.7s ease-in-out infinite alternate",
            animationDelay: delay,
            height: 14,
        }}
    />
);

const Waveform = () => (
    <Box
        sx={{
            display: "flex",
            alignItems: "center",
            color: "primary.main",
            "@keyframes waveAnim": {
                from: { transform: "scaleY(0.3)" },
                to: { transform: "scaleY(1.4)" },
            },
        }}
    >
        {["0s", "0.1s", "0.2s", "0.1s", "0s"].map((d, i) => (
            <WaveBar key={i} delay={d} />
        ))}
    </Box>
);

// ─── Status pill ──────────────────────────────────────────────────────────────
const StatusPill = ({ lastCommand, interim }) => {
    if (!interim && !lastCommand) return null;

    const isListening = !!interim;
    const isMatched = lastCommand?.status === "matched";

    const bg = isListening
        ? "rgba(33,150,243,0.12)"
        : isMatched
            ? "rgba(76,175,80,0.12)"
            : "rgba(244,67,54,0.12)";

    const color = isListening ? "#1976d2" : isMatched ? "#388e3c" : "#d32f2f";

    const label = isListening
        ? interim
        : isMatched
            ? `✓ ${lastCommand.text}`
            : `✗ "${lastCommand.text}" — not recognised`;

    const categoryBadge =
        !isListening && isMatched && lastCommand.category
            ? ` [${lastCommand.category}]`
            : "";

    return (
        <Box
            sx={{
                position: "fixed",
                bottom: 80,
                right: 16,
                maxWidth: 320,
                px: 1.5,
                py: 0.75,
                borderRadius: "20px",
                background: bg,
                color,
                fontSize: "0.78rem",
                fontWeight: 500,
                fontFamily: "monospace",
                boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                display: "flex",
                alignItems: "center",
                gap: 1,
                transition: "all 0.2s ease",
                backdropFilter: "blur(6px)",
                border: `1px solid ${color}30`,
                zIndex: 1300,
                userSelect: "none",
            }}
        >
            {isListening && <Waveform />}
            <span
                style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                }}
            >
                {label}
                {categoryBadge}
            </span>
        </Box>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const Speech = ({ mode = "write" }) => {
    const [listening, setListening] = useState(false);
    const [interimText, setInterimText] = useState("");

    const recognitionRef = useRef(null);
    const { speak, lastCommand, isReady } = useSpeechSynthesis();

    // Mode aur speak functions ko mutable refs me rakhein taake useEffect trigger na ho
    const speakRef = useRef(speak);

    useEffect(() => {
        speakRef.current = speak;
    }, [mode, speak]);

    // Init recognition once with mobile specific flags
    const getRecognition = () => {
        if (!recognitionRef.current && SUPPORTED) {
            recognitionRef.current = new window.SpeechRecognition();
            
            // Mobile Optimization: continuous true aur interim false karne se stability aati h
            recognitionRef.current.continuous = true; 
            recognitionRef.current.interimResults = false; 
            recognitionRef.current.lang = "en-US";
        }
        return recognitionRef.current;
    };

    useEffect(() => {
        if (!SUPPORTED) return;

        const recognition = getRecognition();

        const onResult = (event) => {
            // Mobile Chrome compatibility fix for result extraction
            const currentResultIndex = event.resultIndex;
            const result = event.results[currentResultIndex];
            if (!result) return;
            
            const transcript = result[0].transcript.trim();
            
            // UI update karein text ke sath
            setInterimText(transcript);

            if (result.isFinal) {
                if (mode === "write") {
                    const tag = document.activeElement?.nodeName;
                    if (tag === "INPUT" || tag === "TEXTAREA") {
                        document.activeElement.value += transcript;
                    }
                }

                // Choti si delay taake user ko status pill me text dikhe
                setTimeout(() => {
                    setInterimText("");
                    setListening(false);
                    recognition.stop(); 
                    speakRef.current(transcript);
                }, 800);
            }
        };

        const onEnd = () => {
            setListening(false);
            setInterimText("");
        };

        const onError = (e) => {
            console.warn("Speech recognition error:", e.error);
            if (e.error === "not-allowed") {
                alert("Mic permission denied. Please allow microphone access.");
            } else if (e.error === "network") {
                alert("Network error. Mobile Speech API needs a stable internet connection.");
            }
            setListening(false);
            setInterimText("");
        };

        recognition.addEventListener("result", onResult);
        recognition.addEventListener("end", onEnd);
        recognition.addEventListener("error", onError);

        return () => {
            recognition.removeEventListener("result", onResult);
            recognition.removeEventListener("end", onEnd);
            recognition.removeEventListener("error", onError);
            try { recognition.stop(); } catch (err) {}
        };
    }, []); // Dependency array empty rakha h taake component level par event re-attach na ho

    const handleClick = async () => {
        const recognition = getRecognition();
        if (!recognition) return;

        if (listening) {
            recognition.stop();
            setListening(false);
        } else {
            try {
                // Mobile Chrome stream conflict fix:
                // Pehle check karein permission h ya nahi, stream khuli na chodein
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                stream.getTracks().forEach(track => track.stop()); // Stream foran close karein taake recognition lock na ho
                
                setInterimText("Listening..."); // Mobile par user feedback zaroori h
                setListening(true);
                recognition.start();
            } catch (err) {
                console.warn("Mic permission denied or busy device", err);
                alert("Microphone permission required.");
            }
        }
    };

    if (!SUPPORTED || !isReady) return null;

    return (
        <>
            <StatusPill lastCommand={lastCommand} interim={interimText} />

            <Fab
                onClick={handleClick}
                sx={{
                    position: "fixed",
                    bottom: 16,
                    right: 16,
                    zIndex: 1300,
                    transition: "box-shadow 0.2s ease",
                    ...(listening && {
                        boxShadow:
                            "0 0 0 6px rgba(33,150,243,0.2), 0 0 0 12px rgba(33,150,243,0.08)",
                    }),
                }}
                color="primary"
                aria-label={listening ? "Stop listening" : "Start voice command"}
                title={listening ? "Listening… click to stop" : "Click to speak a command"}
            >
                {listening ? (
                    <MicOff color="secondary" />
                ) : (
                    <KeyboardVoice color="secondary" />
                )}
            </Fab>
        </>
    );
};

export default Speech;
