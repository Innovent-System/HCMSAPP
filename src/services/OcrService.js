import { createWorker } from 'tesseract.js';

const worker = createWorker({
    logger: m => console.log(m)
});

const Scan = () => {
    return new Promise(async (res, rej) => {
        await worker.load();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        const { data: { text } } = await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png');

        await worker.terminate();
        res(text);
    });
};

export default Scan;