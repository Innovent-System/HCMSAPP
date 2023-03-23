import React, { useEffect, useRef, useState } from 'react'
import { KeyboardVoice, MicOff } from '../../deps/ui/icons'
import { Fab, Box } from '../../deps/ui'
import { useSpeechSynthesis } from './useSpeechSynthesis';


//Controll Text Field me OnBlure on krna Jb is me kam shuru kro dubara 
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const Speech = ({ mode = "write" }) => {
    const resultRef = useRef(null);

    const [listening, setListening] = useState(false);

    const speech = useRef({
        enabled: true,
        recognition: new window.SpeechRecognition(),
        text: ''
    }).current;
    const { speak, voices, isReady } = useSpeechSynthesis();

    useEffect(() => {

        const resultHandler = (event) => {

            const audio = event.results[event.results.length - 1];
            speech.text = audio[0].transcript;
            if (mode === "write") {
                const tag = document.activeElement.nodeName;
                if (tag === 'INPUT' || tag === 'TEXTAREA') {
                    if (audio.isFinal) {
                        document.activeElement.value += speech.text;
                    }
                }
            }

            resultRef.current.innerText = speech.text;
            if (audio.isFinal) {
                speak(speech.text)
                setListening(false);
            }

        }
        if (('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
            speech.recognition.continuous = false;
            speech.recognition.interimResults = true;
            speech.recognition.lang = 'en-US';
            speech.recognition.addEventListener('result', resultHandler)
            speech.recognition.onend = () => setListening(false);
        }

        return () => {
            speech.recognition?.removeEventListener('result', resultHandler);
            speech.recognition?.stop();
            speech.recognition.onend = null;
        }
    }, [])

    const handleClick = () => {
        setListening(!listening);
        if (!listening) {
            speech.recognition.start();
            //btnRef.current.innerText = 'Listening ...';
        }
        else {
            speech.recognition.stop();
            //btnRef.current.innerText = 'Start Speech';
        }
    }

    return (
        <>

            <Box ref={resultRef} sx={{ position: 'absolute', bottom: 30, right: '50%' }} component="code">
               
            </Box>
            <Fab
                onClick={handleClick}
                sx={{ position: 'absolute', bottom: 16, right: 16 }}
                hidden={!isReady} color="primary" aria-label="add">
                {listening ? <MicOff color='secondary' /> : <KeyboardVoice color='secondary' />}
            </Fab>
        </>
    )
}

export default Speech
