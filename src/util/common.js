import Chart from 'chart.js';

export const MimeTypesMap = {
    png: 'image/png',
    gif: 'image/gif',
    jpg: 'image/jpg',
    jpeg: 'image/jpeg',
    pdf: 'application/pdf',
    mp4: 'video/mp4',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ppt: 'application/vnd.ms-powerpoint',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
};

export function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const sort_by = (field, reverse, primer) => {

    const key = primer ?
        function (x) {
            return primer(x[field])
        } :
        function (x) {
            return x[field]
        };

    reverse = !reverse ? 1 : -1;
    // Sort by price high to low
    //console.log(array.sort(sort_by('price', true, parseInt)));

    // Sort by city, case-insensitive, A-Z
    //console.log(array.sort(sort_by('city', false, (a) =>  a.toUpperCase())));

    return function (a, b) {
        return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
    }
}



export const groupBySum = (arr = [], groupby = "", fieldtosum = "") => {
    const result = [];
    if (!Array.isArray(arr)) return;
    arr.reduce(function (res, value) {
        if (!res[value[groupby]]) {
            res[value[groupby]] = { ...value, [fieldtosum]: 0 };
            result.push(res[value[groupby]])
        }
        res[value[groupby]][fieldtosum] += parseInt(value[fieldtosum]);
        return res;
    }, {});

    return result;
}

// export const debounce = (func, wait, immediate) => {
//     let timeout;
//     return function () {
//         const later = () => {
//             timeout = null;
//             if (!immediate) func.apply(this, arguments);
//         };
//         const callNow = immediate && !timeout;
//         clearTimeout(timeout);
//         timeout = setTimeout(later, wait);
//         if (callNow) func.apply(this, arguments);
//     };
// };


export const debounce = (func, delay) => {
    let debounceHandler;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(debounceHandler);
        debounceHandler = setTimeout(() => func.apply(context, args), delay);
    };
};

export const throttle = (func, limit) => {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
};

export class WorkerBuilder extends Worker {
    constructor(worker) {
        const code = worker.toString();
        const blob = new Blob([`(${code})()`], { type: "text/javascript" });
        return new Worker(URL.createObjectURL(blob), { type: "module" });
    }
}


const optionalParam = /\s*\((.*?)\)\s*/g
const optionalRegex = /(\(\?:[^)]+\))\?/g
const namedParam = /(\(\?)?:\w+/g
const splatParam = /\*/g
const escapeRegExp = /[-{}[\]+?.,\\^$|#]/g
export const commandToRegExp = (command) => {
    if (command instanceof RegExp) {
        return new RegExp(command.source, 'i')
    }
    command = command
        .replace(escapeRegExp, '\\$&')
        .replace(optionalParam, '(?:$1)?')
        .replace(namedParam, (match, optional) => {
            return optional ? match : '([^\\s]+)'
        })
        .replace(splatParam, '(.*?)')
        .replace(optionalRegex, '\\s*$1?\\s*')
    return new RegExp('^' + command + '$', 'i')
}

export const wait = (s) => new Promise((rs) => setTimeout(rs, s));

export function pluralize( /* n, [ n2, n3, ... ] str */) {
    var n = Array.prototype.slice.call(arguments);
    var str = n.pop(), iMax = n.length - 1, i = -1, j;
    str = str.replace(/\$\$|\$(\d+)/g,
        function (m, p1) { return m == '$$' ? '$' : n[+p1 - 1] }
    );
    return str.replace(/[(](.*?)([+-])(\d*)(?:,([^,)]*))?(?:,([^)]*))?[)]/g,
        function (match, one, sign, abs, not1, zero) {
            // if abs, use indicated element in the array of numbers
            // instead of using the next element in sequence
            if (abs)
                (j = +abs - 1)
            else if (i < iMax) {
                i++;
                j = i;
            }

            if (zero != undefined && n[j] == 0) return zero;
            return (n[j] != 1) == (sign == '+') ? (not1 || 's') : one;
        }
    );
}

export const getYears = (earliestYear = 2010) => {
    let currentYear = new Date().getFullYear();
    const years = [];
    while (currentYear >= earliestYear) {
        years.push(currentYear);
        currentYear -= 1;
    }

    return years;
}

/**
 * console.log( pluralize( 1, 'the cat(+) live(-) outside' ) ) ;
 the cat lives outside
console.log( pluralize( 2, 'the child(+,ren) (is+,are) inside' ) ) ;
    the children are inside
console.log( pluralize( 0, '$1 dog(+), ($1+,$1,no) dog(+), ($1+,$1,no) dog(+,,)' ) ) ;
 0 dogs, no dogs, no dog
console.log( pluralize( 100, 1, '$1 penn(y+,ies) make(-1) $$$2' ) ) ;
 100 pennies make $1
console.log( pluralize( 1, 0.01, '$1 penn(y+,ies) make(-1) $$$2' ) ) ;
 * 
 */

// 1 penny makes $0.01


const validateBase64String = str => {
    return /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/.test(str);
}

export function ValidateSize(file) {
    const FileSize = file.files[0].size / 1024 / 1024; // in MB
    if (FileSize > 24) {
        alert('File size exceeds 24 MB');
        // $(file).val(''); //for clearing with Jquery
    } else {

    }
}


export const downloadAndViewFile = (base64, fileName = 'test1', ext = 'pdf', isDownload = true, isNameWithNumber = false) => {
    if (!validateBase64String(base64)) return console.log("base64 string in not valid");
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const url = window.URL || window.webkitURL;
    const blob = new Blob([byteArray], { type: MimeTypesMap[ext.toLowerCase()] });
    const fileurl = url.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = fileurl;
    if (isDownload) {
        const file = !isNameWithNumber ? fileName.replace(/[0-9]/g, "").replace(/[^\w\s]/gi, '') : fileName;
        a.download = `${file}.${ext}`;
        a.target = '_self';
    }
    else {
        a.target = '_blank';
    }

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}


const colorGenerator = (internalData) => {
    const graphColors = [];
    const graphOutlines = [];
    const hoverColor = [];

    const internalDataLength = internalData.length;
    let i = 0;
    while (i <= internalDataLength) {
        const randomR = Math.floor((Math.random() * 256) + 100);
        const randomG = Math.floor((Math.random() * 256) + 100);
        const randomB = Math.floor((Math.random() * 256) + 100);

        const graphBackground = `rgb(${randomR} , ${randomG}, ${randomB})`;
        graphColors.push(graphBackground);

        const graphOutline = `rgb(${randomR - 80},${randomG - 80},${randomB - 80})`;
        graphOutlines.push(graphOutline);

        const hoverColors = `rgb(${randomR + 25},${randomG + 25},${randomB + 25})`;
        hoverColor.push(hoverColors);

        i++;
    }
    return {
        "bgColor": graphColors,
        "bdColor": graphOutlines,
        "hoverColor": hoverColor
    }
}

Chart.plugins.register({
    afterDraw: function (chart) {
        if (chart.data.datasets[0].data.every(item => item === 0)) {
            let ctx = chart.chart.ctx;
            let width = chart.chart.width;
            let height = chart.chart.height;
            chart.clear();
            ctx.save();
            ctx.globalAlpha = 0.4;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('No record found', width / 2, height / 2);
            ctx.restore();
        }
    },
});

function commonBars(chartObject, dataSetArray, type = "bar") {
    let objectbar = {};
    const { bgColor, bdColor } = colorGenerator(dataSetArray);
    objectbar.label = chartObject;
    objectbar.data = dataSetArray;
    objectbar.backgroundColor = bgColor;
    objectbar.borderColor = bdColor;
    objectbar.borderWidth = type === "pie" ? 0 : 2;
    // objectbar.radius = 0,
    // objectbar.pointStyle = 'line';
    //objectbar.fill = false;
    //objectbar.borderDash = [5, 5];


    return objectbar;
}

export const createChart = (chartId, type, parentLabel, data, options) => {
    if (typeof (chartId) !== 'string' &&
        typeof (type) !== 'string' &&
        typeof (parentLabel) !== 'string' &&
        !Array.isArray(data) &&
        typeof (options) !== 'object'
    ) return console.log("param type not valid");
    const getContext2d = document.getElementById(chartId).getContext('2d');
    return new Chart(getContext2d, {
        type: type,
        data: {
            labels: parentLabel,
            datasets: data.map(d => (commonBars(d.label, d.data, type)))
        },
        options: options,
    });
}