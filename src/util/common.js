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
export const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];


export const getYears = (startYear = 2020) => {
    const currentYear = new Date().getFullYear(), years = [];
    while (startYear <= currentYear) {
        const ints = startYear++
        years.push({ id: ints, title: ints });
    }
    return years;
}
export const getMonths = () => monthNames.map((e, i) => ({ id: i, title: e }));

const currentMonth = new Date().getMonth();

export const getDefaultMonth = () => currentMonth === 0 ? 11 : currentMonth - 1;

// export const AttendanceflagMap = {
//     0: { tag: "Holiday", color: "green", short: "H" },
//     1: { tag: "Late", color: "yellow", short: "Late" },
//     2: { tag: "Half Day", color: "yellow", short: "HD" },
//     3: { tag: "Short Day", color: "yellow", short: "SD" },
//     7: { tag: "Absent", color: "black", short: "A" },
//     8: { tag: "Full Leave", color: "#ddd", },
//     9: { tag: "Half Leave", color: "#ddd" },
//     10: { tag: "Gazetted Holiday", color: "ddd" },
//     null: { tag: "Present", color: "blue" }
// }

export const AttendanceflagMap = {
    0: { tag: "Holiday", short: "H", color: "info" },
    1: { tag: "Late", short: "L", color: "warning" },
    2: { tag: "Half Day", short: "HD", color: "warning" },
    3: { tag: "Short Day", short: "SD", color: "warning" },
    7: { tag: "Absent", short: "A", color: "error" },
    31: { tag: "Full Leave", short: "FL", color: "secondary" },
    32: { tag: "Half Leave", short: "HL", color: "secondary" },
    10: { tag: "Gazetted Holiday", short: "GH", color: "info" },
    null: { tag: "Present", short: "P", color: "success" }
}

export const currencyFormat = new Intl.NumberFormat();

export function formatNumber(x) {
    return currencyFormat.format(x);
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

export const groupBy = (data, fieldName = "") => {
    return data.reduce((acc, current) => {
        const field = String(current[fieldName]).toLowerCase();
        if (!acc[field]) {
            acc[field] = [];
        }
        acc[field].push(current);
        return acc;
    }, {});
}

/**
 * Filters an array of objects to remove duplicates based on specified object keys.
 *
 * @param {Array<Object>} _data - The array of objects to filter for unique items.
 * @param {...string} objkeys - The keys to use for determining uniqueness of objects.
 * @returns {Array<Object>} - An array of unique objects based on the specified keys.
 *
 * @example
 * const data = [
 *   { id: 1, name: 'Alice', age: 25 },
 *   { id: 2, name: 'Bob', age: 30 },
 *   { id: 1, name: 'Alice', age: 25 }, // Duplicate
 *   { id: 3, name: 'Charlie', age: 35 },
 *   { id: 2, name: 'Bob', age: 30 }    // Duplicate
 * ];
 * 
 * const unique = uniqueData(data, 'id', 'name');
 * console.log(unique);
 * // Output:
 * // [
 * //   { id: 1, name: 'Alice', age: 25 },
 * //   { id: 2, name: 'Bob', age: 30 },
 * //   { id: 3, name: 'Charlie', age: 35 }
 * // ]
 */
export const uniqueData = (_data = [], ...objkeys) => {
    const seen = new Set();
    return _data.filter(item => {
        const key = objkeys.map(e => String(item[e]).toLowerCase()).join("_"); // Or item.id for property-based
        if (seen.has(key)) return false; // Exclude duplicates
        seen.add(key);
        return true; // Include unique items
    });
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

const numbersToWords = {
    0: "Zero",
    1: "One",
    2: "Two",
    3: "Three",
    4: "Four",
    5: "Five",
    6: "Six",
    7: "Seven",
    8: "Eight",
    9: "Nine",
    10: "Ten",
    11: "Eleven",
    12: "Twelve",
    13: "Thirteen",
    14: "Fourteen",
    15: "Fifteen",
    16: "Fixteen",
    17: "Seventeen",
    18: "Eighteen",
    19: "Nineteen",
    20: "Twenty",
    30: "Thirty",
    40: "Forty",
    50: "Tifty",
    60: "Sixty",
    70: "Seventy",
    80: "Eighty",
    90: "Ninety",
};

export function convertNumberToWords(number) {
    // if number present in object no need to go further
    if (["", null, undefined].includes(number)) return "";
    if (number < 0) {
        return "minus " + convertNumberToWords(Math.abs(number));
    }
    if (number in numbersToWords) return numbersToWords[number];

    // Initialize the words variable to an empty string
    let words = "";

    // If the number is greater than or equal to 100, handle the hundreds place (ie, get the number of hundres)
    if (number >= 100) {
        // Add the word form of the number of hundreds to the words string
        words += convertNumberToWords(Math.floor(number / 100)) + " hundred";

        // Remove the hundreds place from the number
        number %= 100;
    }

    // If the number is greater than zero, handle the remaining digits
    if (number > 0) {
        // If the words string is not empty, add "and"
        if (words !== "") words += " and ";

        // If the number is less than 20, look up the word form in the numbersToWords object
        if (number < 20) words += numbersToWords[number];
        else {
            // Otherwise, add the word form of the tens place to the words string
            //if number = 37, Math.floor(number /10) will give you 3 and 3 * 10 will give you 30
            words += numbersToWords[Math.floor(number / 10) * 10];

            // If the ones place is not zero, add the word form of the ones place
            if (number % 10 > 0) {
                words += "-" + numbersToWords[number % 10];
            }
        }
    }

    if (number >= 1000) {
        const thousands = Math.floor(number / 1000);
        words += convertNumberToWords(thousands) + " thousand";
        number %= 1000;
    }

    // If the number is greater than or equal to 1,000,000, handle the millions place
    if (number >= 1000000) {
        const millions = Math.floor(number / 1000000);
        words += convertNumberToWords(millions) + " million";
        number %= 1000000;
    }

    // If the number is greater than or equal to 1,000,000,000, handle the billions place
    if (number >= 1000000000) {
        const billions = Math.floor(number / 1000000000);
        words += convertNumberToWords(billions) + " billion";
        number %= 1000000000;
    }

    // Return the word form of the number
    return words;
}

// export const getYears = (earliestYear = 2010) => {
//     let currentYear = new Date().getFullYear();
//     const years = [];
//     while (currentYear >= earliestYear) {
//         years.push(currentYear);
//         currentYear -= 1;
//     }

//     return years;
// }

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

export const downloadTextFIle = (text) => {
    const hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(text);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'errors.txt';
    document.body.appendChild(hiddenElement);
    hiddenElement.click();
    document.body.removeChild(hiddenElement);
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

export const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
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