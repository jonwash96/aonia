String.prototype._ellipses = function(maxChars=80) {
	return maxChars && this.length > maxChars 
      ? this.substring(0,maxChars)+"..." 
      : this;
}

String.prototype._toTitleCase = function() {
    const words = this.split(' ');
    return words.map(word => {
        if (word.charAt(0).match(/\*/)) return word.replace('*', '')
        else return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
    }).join(' ').trim();
}

String.prototype._pluralize = function() {
    if (this.match(/s$/i)) return this + "'"
    else return this.match(/[a-z]/) 
        ? this + "s" 
        : this + "S";
}

String.prototype._camelToTitle = function() {
    let str = this.split('');
    for (let i=(str.length-2); i>=0; i--) {
        if (str[i+1].match(/[A-Z]/)) {
            str.splice(i, 1, [str[i]," "]);
            i--;
        };
    };
    const strWithSpaces = str.flat().join('');
    str = strWithSpaces.split(' ');
    str[0] = str[0]._toTitleCase();
    return str.join(' ');
}

String.prototype._normalizeCSV = function() {
    if (this.match(/\,\S/g)) {
        return this.replaceAll(/\,/g, ', ')
    } else return this
}

String.prototype._epochTo = epochTo;
Number.prototype._epochTo = epochTo;
function epochTo(format) {
    if (!new Date(this)) return;
    try {
        const date = new Date(this);
        const diff = Date.now() - Number(this);
        const oneDay = 86400000;
        const oneHour = 3600000;
        const sixHours = 21600000;
        switch (format) {
            case 'recent': {
                if (diff < oneHour) {
                    return Math.floor(diff / (sixHours / 6 / 60))+" minutes ago";
                } else if (diff < sixHours) {
                    return Math.floor(diff / (sixHours / 6))+" hours ago";
                } else if (diff <  oneDay*2) {
                    return "Yesterday at "+date.toLocaleTimeString().replace(/:\d\d?\s/, ' ');
                } else if (diff < oneDay * 6) {
                    return String(date).split(' ')[0]+" at"+date.toLocaleTimeString().replace(/:\d\d?\s/, ' ');
                } else {
                    return date.toLocaleDateString();
                }
            }
        }
    } catch (err) {
        console.warn("epochTo encountered a non-fatal error.", err);
        return this;
    }
}

String.prototype._toOrdered = toOrdered;
Number.prototype._toOrdered = toOrdered;
function toOrdered(which=0) {
    if (!/\d/g.test(this)) return;
    let num;
    if (typeof which === 'number') num = String(this).match(/\d+/g)[which]
    if (typeof which === 'string') num = String(this).match(/\d+/g).join('');

    if (num == 11) return '11th'
    if (/\d*1$/g.test(num)) return num+'st'
    if (num == 2) return '2nd'
    if (num == 3) return '3rd'
    if (num == 3) return '3rd'
    return num+'th'
}

String.prototype._imperialScum = imperialScum;
Number.prototype._imperialScum = imperialScum;
function imperialScum(unit='f', units=true, fixed=2, factor=1, both=false) {
    if (!/\d/g.test(this)) return;

    const num = Number.parseFloat(this);
    const c = (num - 32) * (5/9) * factor;
    const f = (((9/5) * num) + 32) * factor;
    let result;
    result = /f/i.test(unit) ? f : c;
    result = both ? [result, num] : result;

    return units 
        ? Array.isArray(result) 
            ? result[0] === f ? `${f.toFixed(fixed)}°F  (${result[1].toFixed(fixed)}°C)` : `${c.toFixed(fixed)}°C  (${result[1].toFixed(fixed)}°F)`
            : result === f ? `${f.toFixed(fixed)}°F` : `${c.toFixed(fixed)}°C`
        : result
}

String.prototype._cfk = cfk;
Number.prototype._cfk = cfk;
export function cfk(from, onto, units=1, fixed=2) {
	let result, c;
	
	if (/c/i.test(from)) c = this;
	else if (/f/i.test(from)) c = (this - 32) * (5 / 9);
	else if (/k/i.test(from)) c = this - 273.15;

	if (/c/i.test(onto)) result = c;
	else if (/f/i.test(onto)) result = (c * 9 / 5) + 32;
	else if (/k/i.test(onto)) result = c + 273.15;

	return units 
        ? result.toFixed(fixed)+'°'+onto
		: result.toFixed(fixed);
}

String.prototype._toRoman = toRoman;
Number.prototype._toRoman = toRoman;
function toRoman(uppercase=true) {
    if (!/\d/g.test(this)) return;
    let num = this;
    if (num <= 0 || num > 3999) return this;

    const map = [
        ['M', 1000], ['CM', 900], ['D', 500], ['CD', 400],
        ['C', 100],  ['XC', 90],  ['L', 50],  ['XL', 40],
        ['X', 10],   ['IX', 9],   ['V', 5],   ['IV', 4],
        ['I', 1]
    ];

    let result = '';

    for (const [letter, value] of map) {
        while (num >= value) {
            result += letter;
            num -= value;
        }
    }

    return uppercase ? result : result.toLowerCase();
}