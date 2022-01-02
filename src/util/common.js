import Chart from 'chart.js';

const MimeTypesMap = {
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

export const debounce = (func, wait, immediate) => {
    let timeout;
    return function () {
        const later = () => {
            timeout = null;
            if (!immediate) func.apply(this, arguments);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(this, arguments);
    };
};

// const nativeMax = Math.max;
// const nativeMin = Math.min;
// const FUNC_ERROR_TEXT = "something went wrong"
// export function debounce(func, wait, options) {
//   let lastArgs,
//     lastThis,
//     maxWait,
//     result,
//     timerId,
//     lastCallTime,
//     lastInvokeTime = 0,
//     leading = false,
//     maxing = false,
//     trailing = true;
//   if (typeof func !== 'function') {
//     throw new TypeError(FUNC_ERROR_TEXT);
//   }
//   wait = Number(wait) || 0;
//   if (typeof options === 'object') {
//     leading = !!options.leading;
//     maxing = 'maxWait' in options;
//     maxWait = maxing
//       ? nativeMax(Number(options.maxWait) || 0, wait)
//       : maxWait;
//     trailing = 'trailing' in options
//       ? !!options.trailing
//       : trailing;
//   }

//   function invokeFunc(time) {
//     let args = lastArgs,
//       thisArg = lastThis;

//     lastArgs = lastThis = undefined;
//     lastInvokeTime = time;
//     result = func.apply(thisArg, args);
//     return result;
//   }

//   function leadingEdge(time) {
//     // Reset any `maxWait` timer.
//     lastInvokeTime = time;
//     // Start the timer for the trailing edge.
//     timerId = setTimeout(timerExpired, wait);
//     // Invoke the leading edge.
//     return leading
//       ? invokeFunc(time)
//       : result;
//   }

//   function remainingWait(time) {
//     let timeSinceLastCall = time - lastCallTime,
//       timeSinceLastInvoke = time - lastInvokeTime,
//       result = wait - timeSinceLastCall;
//     console.log('remainingWait');
//     return maxing
//       ? nativeMin(result, maxWait - timeSinceLastInvoke)
//       : result;
//   }

//   function shouldInvoke(time) {
//     let timeSinceLastCall = time - lastCallTime,
//       timeSinceLastInvoke = time - lastInvokeTime;
//     // Either this is the first call, activity has stopped and we're at the trailing
//     // edge, the system time has gone backwards and we're treating it as the
//     // trailing edge, or we've hit the `maxWait` limit.
//     return (lastCallTime === undefined || (timeSinceLastCall >= wait) || (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
//   }

//   function timerExpired() {
//     const time = Date.now();
//     if (shouldInvoke(time)) {
//       return trailingEdge(time);
//     }
//     // Restart the timer.
//     timerId = setTimeout(timerExpired, remainingWait(time));
//   }

//   function trailingEdge(time) {
//     timerId = undefined;

//     // Only invoke if we have `lastArgs` which means `func` has been debounced at
//     // least once.
//     if (trailing && lastArgs) {
//       return invokeFunc(time);
//     }
//     lastArgs = lastThis = undefined;
//     return result;
//   }

//   function cancel() {
//     if (timerId !== undefined) {
//       clearTimeout(timerId);
//     }
//     lastInvokeTime = 0;
//     lastArgs = lastCallTime = lastThis = timerId = undefined;
//   }

//   function flush() {
//     return timerId === undefined
//       ? result
//       : trailingEdge(Date.now());
//   }

//   function debounced() {
//     let time = Date.now(),
//       isInvoking = shouldInvoke(time);
//     lastArgs = arguments;
//     lastThis = this;
//     lastCallTime = time;

//     if (isInvoking) {
//       if (timerId === undefined) {
//         return leadingEdge(lastCallTime);
//       }
//       if (maxing) {
//         // Handle invocations in a tight loop.
//         timerId = setTimeout(timerExpired, wait);
//         return invokeFunc(lastCallTime);
//       }
//     }
//     if (timerId === undefined) {
//       timerId = setTimeout(timerExpired, wait);
//     }
//     return result;
//   }
//   debounced.cancel = cancel;
//   debounced.flush = flush;
//   return debounced;
// }

// function throttle(func, wait, options) {
//   let leading = true,
//     trailing = true;

//   if (typeof func !== 'function') {
//     throw new TypeError(FUNC_ERROR_TEXT);
//   }
//   if (typeof options === 'object') {
//     leading = 'leading' in options
//       ? !!options.leading
//       : leading;
//     trailing = 'trailing' in options
//       ? !!options.trailing
//       : trailing;
//   }
//   return debounce(func, wait, {
//     leading,
//     maxWait: wait,
//     trailing,
//   });
// }

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


const colorGenerator = (internalData) =>{
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
    return{
      "bgColor":graphColors,
      "bdColor":graphOutlines,
      "hoverColor":hoverColor
    }
} 

  Chart.plugins.register({
    afterDraw: function(chart) {
        if (chart.data.datasets[0].data.every(item => item === 0)) 
        {
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

function commonBars(chartObject,dataSetArray,type = "bar") {
  let objectbar = {};
  const { bgColor,bdColor } = colorGenerator(dataSetArray);
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

export const createChart = (chartId,type,parentLabel,data,options) => {
  if(typeof(chartId) !== 'string' && 
     typeof(type) !== 'string' && 
     typeof(parentLabel) !== 'string' &&
     !Array.isArray(data) && 
     typeof(options) !== 'object'
     ) return console.log("param type not valid");
  const getContext2d = document.getElementById(chartId).getContext('2d');
  return new Chart(getContext2d,{
    type:type,
    data:{
      labels:parentLabel,
      datasets:data.map(d => (commonBars(d.label,d.data,type)))
    },
    options:options,
  }); 
}