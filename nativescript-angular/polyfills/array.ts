if (!(<any>Array.prototype).fill)  {
  (<any>Array.prototype).fill = function(value) {

    let O = Object(this);
    let len = parseInt(O.length, 10);
    let start = arguments[1];
    let relativeStart = parseInt(start, 10) || 0;
    let k = relativeStart < 0
            ? Math.max( len + relativeStart, 0)
            : Math.min( relativeStart, len );
    let end = arguments[2];
    let relativeEnd = end === undefined
                      ? len
                      : (parseInt(end, 10) || 0) ;
    let final = relativeEnd < 0
                ? Math.max(len + relativeEnd, 0)
                : Math.min(relativeEnd, len);

    for (; k < final; k++) {
        O[k] = value;
    }

    return O;
  };
}

if (!(<any>Array).from) {
    (<any>Array).from = function(iterable, mapFn, thisArg) {
        let results: Array<any> = [];

        if (iterable.next) {
            // Iterator objects
            for (let step = null; ; step = iterable.next()) {
                if (step.done) {
                    break;
                } else {
                    results.push(step.value);
                }
            }
        } else {
            // Array-like objects
            results = [].slice.call(iterable);
        }

        if (mapFn) {
            results = <Array<any>><any>results.forEach(mapFn, thisArg);
        }
        return results;
    };
}
