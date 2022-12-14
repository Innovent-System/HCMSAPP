import React, { useRef } from 'react'
import { useState } from 'react';
import { wait } from '../../util/common';
import { useVoiceAssistant } from './useVoiceAssistant';
import { useVoiceVisualizer } from './useVoiceVisualizer'
import { Fab, Box } from '../../deps/ui'
import { KeyboardVoice, MicOff } from '../../deps/ui/icons'
import { useSelector } from 'react-redux';

let processingWord = null,appcommands = [];


const AISpeech = () => {
    const { startVisualization, stopVisualization } = useVoiceVisualizer();
    const { saySpeech, startAssistant, stopAssistant } = useVoiceAssistant();

    const appstate = useSelector(a => a.appdata.commands);
    appcommands = appstate;
    const [start, setStart] = useState(false);
    const startButton = useRef(null);
    const handleAssistant = async () => {
        if (!start) {
            //Start assistant
            // startButton.current.innerText = "Starting...";
            await startAssistant(onListen);
            await startVisualization();
            setStart(true);
            // startButton.current.innerText = "Stop Assistant";
        } else {
            //Stop assistant
            // startButton.current.innerText = "Stopping...";
            await stopAssistant();
            stopVisualization();
            setStart(false)
            // startButton.current.innerText = "Start Assistant";
        }
    }

    const processWord = async (word) => {
        const trigger = appcommands.find(c => c.commandName === word);
        if(trigger){
            saySpeech(trigger.speak); 
            trigger.onMatch();
            await wait(3000);
        }
        // switch (word) {
        //     case "employee_list":
        //         saySpeech("Hello Islem, How are you doing today?");
        //         await wait(3000);
        //         break;
        //     case "Weather":
        //         const location = "London";
        //         // const weather = await getWeather(location);
        //         saySpeech(
        //             `The weather for today in ${location} is  degrees`
        //         );
        //         await wait(3000);
        //         break;
        //     case "Good Morning":
        //         saySpeech(
        //             "Good Morning islem, Hope you slept well, for Today's schedule you have a meeting at 10am with you manager"
        //         );
        //         await wait(3000);
        //         break;
        //     case "employee_report":
        //         saySpeech(
        //             "We are friends in a sleeping bag splitting the heat"
        //         );
        //         saySpeech(
        //             "We have one filthy pillow to share and your lips are in my hair"
        //         );
        //         saySpeech("Someone upstairs has a rat that we laughed at");
        //         await wait(3000);
        //         break;
        // }

        processingWord = null;
    }

    function onListen(word) {
        if (processingWord) return;

        console.log("Word: ", word);
        processingWord = word;
        processWord(word);
    }
    return (
        <>
            <Box id="output" width={100} height={50} sx={{ position: 'absolute', bottom: 30, right: '50%' }} component="canvas">
            </Box>
            <Fab
                onClick={handleAssistant}
                sx={{ position: 'absolute', bottom: 16, right: 16 }}
                color="primary" aria-label="add">
                {start ? <MicOff color='secondary' /> : <KeyboardVoice color='secondary' />}
            </Fab>
        </>

    )
}

export default AISpeech