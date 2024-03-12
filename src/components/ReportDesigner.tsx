import { BLANK_PDF, Template } from '@pdfme/common';
import { text,image, barcodes } from '@pdfme/schemas';
import { Designer } from '@pdfme/ui';
import { useRef, useState } from 'react'

const getSampleTemplate = (): Template => ({
    columns: ['field1', 'field2'],
    sampledata: [
        {
            field1: 'bb',
            field2: 'aaaaaaaaaaaa',
        },
    ],
    basePdf: BLANK_PDF,
    schemas: [
        {
            field1: {
                type: 'text',
                position: { x: 20, y: 20 },
                width: 100,
                height: 15,
                alignment: 'left',
                fontSize: 30,
                characterSpacing: 0,
                lineHeight: 1,
            },
            field2: {
                type: 'image',
                position: { x: 20, y: 35 },
                width: 100,
                height: 40,
            },
        },
    ],
});

const headerHeight = 60;
const controllerHeight = 60;
const ReportDesigner = () => {
    const designerRef = useRef<HTMLDivElement | null>(null);
    const designer = useRef<Designer | null>(null);
    const [template, setTemplate] = useState<Template>(getSampleTemplate());
    const buildDesigner = () => {
        if (designerRef.current) {
            designer.current = new Designer({
                domContainer: designerRef.current,
                template,
                plugins: { text, image, qrcode: barcodes.qrcode },
            });
            // designer.current.onSaveTemplate(downloadTemplate);
            designer.current.onChangeTemplate(setTemplate);
        }
    };
    return (
        <>
            <div
                ref={designerRef}
                style={{ width: '100%', height: `calc(100vh - ${headerHeight + controllerHeight}px)` }}
            />
            <button onClick={buildDesigner} >Start</button>
        </>

    )
}

export default ReportDesigner