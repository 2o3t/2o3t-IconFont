
function mix(color1, color2, pre) {
    if (!color1 || !/^[#]?[0-9A-F]{6}$/ig.test(color1)) {
        console.warn('color is error!! ', color1);
        return null;
    }
    if (!color2 || !/^[#]?[0-9A-F]{6}$/ig.test(color2)) {
        console.warn('color is error!! ', color2);
        return null;
    }
    if (color1.length === 7) {
        color1 = color1.substr(1);
    }
    if (color2.length === 7) {
        color2 = color2.substr(1);
    }
    const result = [];
    for (let i = 0; i < 6; i += 2) {
        const v1 = Number.parseInt(color1[i] + color1[i + 1], 16);
        const v2 = Number.parseInt(color2[i] + color2[i + 1], 16);
        let c = Math.round(v1 * pre + v2 * (1 - pre)).toString(16);
        let len = c.length;
        while (2 - len) {
            c = '0' + c;
            len = c.length;
        }
        result.push(c);
    }
    return `#${result.join('')}`;
}

function random() {
    const result = [];
    for (let i = 0; i < 6; i++) {
        result[i] = Math.ceil(0xf * Math.random()).toString(16);
    }
    return `#${result.join('')}`;
}

/**
 * hex to rgba
 * @param  {*} hex 例如:"#23ff45"
 * @param  {*} opacity 透明度
 * @return {string} rgba
 */
function hexToRgba(hex, opacity = 1) {
    return 'rgba(' + parseInt('0x' + hex.slice(1, 3)) + ',' + parseInt('0x' + hex.slice(3, 5)) + ',' + parseInt('0x' + hex.slice(5, 7)) + ',' + opacity + ')';
}


export default {
    mix, random, hexToRgba,
};
