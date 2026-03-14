export default function generateRandomUUID(list=[]) {
    const generateHex = (max=8, str='', count=0) => {
        if (count === max) return str; count++;
        let val = Math.floor(Math.random() * 16);
        if (val > 9) val = String.fromCharCode(val + 55);
        str += String(val);
        return generateHex(max, str, count);
    };
    let result, count = 0;
    do {
        result = `${generateHex(8)}-${generateHex(4)}-${generateHex(4)}-${generateHex(8)}${generateHex(4)}`
        count++;
    } while (count < 100 && list.find(i => i === result));
    return result
}