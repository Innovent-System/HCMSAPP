
import { utils, read, write } from 'xlsx-js-style'

const addStyles = (ws) => {
    ws['!cols'] = [];
    Object.keys(ws).filter(c => c.endsWith("1")).forEach(v => {
        if (v === '!ref') return;
        ws[v].s = {
            font: {
                name: "Calibri",
                sz: 12,
                // bold: true,
                color: { rgb: "fafafa" },
            },
            alignment: {
                vertical: 'center',
                horizontal: 'center'
            },
            fill: {
                fgColor: { rgb: '0075a2' }
            },
            border: {
                bottom: {
                    style: 'thick',
                    color: { rgb: '000' },
                },
                right: {
                    style: 'thick',
                    color: { rgb: '000' },
                },
                top: {
                    style: 'thick',
                    color: { rgb: '000' },
                },
            }
        }
        ws['!cols'].push({ wpx: 121 });
    })
}
// eslint-disable-next-line no-restricted-globals
self.onmessage = ({ data }) => {
    if (!data) throw "cant read file";
    const { action, file, a_o_a, fileName } = data;
    let result;
    if (action === "read") {
        const reader = new FileReader();
        reader.onload = function (event) {
            const workBook = read(event.target.result, { type: "binary" });
            const ws = workBook.Sheets[workBook.SheetNames[0]];
            result = utils.sheet_to_json(ws, { header: 1 });
            postMessage({ action, result });
        }
        reader.readAsBinaryString(file);
    }
    else if (action === "write") {
        const wb = utils.book_new(),
            ws = utils.aoa_to_sheet(a_o_a);
        ws['!autofilter'] = { ref: ws['!ref'] };

        addStyles(ws);
        utils.book_append_sheet(wb, ws, 'Sheet1');
        result = write(wb, { type: "array", bookType: "xlsx", });
        postMessage({ action, result });
    }

}
