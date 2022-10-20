
import { utils, read, write } from 'xlsx'

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
        utils.book_append_sheet(wb, ws, fileName);
        result = write(wb, { type: "array", bookType: "xlsx" });
        postMessage({ action, result });
    }

}
