import React, { useEffect, useRef, useState } from 'react'
import { KeyboardVoice, MicOff } from '../deps/ui/icons'
import { Button, TextField, IconButton, InputAdornment } from '../deps/ui'

//Controll Text Field me OnBlure on krna Jb is me kam shuru kro dubara 

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const Speech = () => {
    const resultRef = useRef(null);
    const btnRef = useRef(null);
    const [listening, setListening] = useState(false);
    const speech = useRef({
        enabled: true,
        recognition: new window.SpeechRecognition(),
        text: ''
    }).current;

    useEffect(() => {
        const resultHandler = (event) => {
            const audio = event.results[event.results.length - 1];
            speech.text = audio[0].transcript;
            const tag = document.activeElement.nodeName;

            if (tag === 'INPUT' || tag === 'TEXTAREA') {
                if (audio.isFinal) {
                    document.activeElement.value += speech.text;
                }
            }
            resultRef.current.innerText = speech.text;
        }
        if (('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
            speech.recognition.continuous = true;
            speech.recognition.interimResults = true;
            speech.recognition.lang = 'en-US';
            speech.recognition.addEventListener('result', resultHandler)
        }


        return () => {
            speech.recognition?.removeEventListener('result', resultHandler);
            speech.recognition?.stop();
        }
    }, [])
    const handleClick = () => {
        setListening(!listening);
        if (!listening) {
            speech.recognition.start();
            btnRef.current.innerText = 'Listening ...';
        }
        else {
            speech.recognition.stop();
            btnRef.current.innerText = 'Start Speech';
        }
    }

    return (
        <>
            <IconButton onClick={handleClick} color="primary">
                {listening ? <MicOff /> : <KeyboardVoice />}
            </IconButton>
            <code ref={resultRef}></code>
        </>
    )
}

export default Speech
