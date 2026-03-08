export function cfk(temp, from, onto, units=0, fixed=2) {
	let result, c;
	
	if (/c/i.test(from)) c = temp;
	else if (/f/i.test(from)) c = (temp - 32) * (5 / 9);
	else if (/k/i.test(from)) c = temp - 273.15;

	if (/c/i.test(onto)) result = c;
	else if (/f/i.test(onto)) result = (c * 9 / 5) + 32;
	else if (/k/i.test(onto)) result = c + 273.15;

	return units 
		? result.toFixed(fixed)
		: result.toFixed(fixed)+'°'+onto;
}



export function toRoman(num, uppercase = true) {
    if (num <= 0 || num > 3999) return "N/A";

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



export function quickSort(array) {
	if (array.length <= 1) return array;
	const lt = [];
	const eq = [];
	const gt = [];
	const pv = array[Math.floor(array.length/2)];
	for (const num of array) {
		num < pv && lt.push(num)
		num == pv && eq.push(num)
		num > pv && gt.push(num)
	}
	return [...quickSort(lt), ...eq, ...quickSort(gt)]
};