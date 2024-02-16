import { Designer } from '@pdfme/ui'
import { Template, BLANK_PDF, Mode } from '@pdfme/common'
import { useState } from 'react'

const template: Template = {
    basePdf: BLANK_PDF,
    schemas: [{
        a: {
            type: "text", height: 200, width: 200, position: {
                x: 200,
                y: 400
            },
            readOnlyValue: "text",
            readOnly:true,
            opacity:0.5  
        }
    }],
    


}

const domContainer = document.getElementById("pdf-designer")!;

export const usePdf = () => {
    const [designer, setDesigner] = useState(new Designer({ template, domContainer }))

    return {
        designer
    }
}