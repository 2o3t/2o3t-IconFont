const fs = require('fs');
const path = require('path');

const pkgPath = path.resolve(process.cwd(), './package.json');
const pkgJson = JSON.parse(fs.readFileSync(pkgPath).toString());
console.log(pkgJson);

const version = pkgJson.version;
if (version) {
    const attrs = version.split('.');
    const lastIndex = attrs.length - 1;
    attrs[lastIndex] = (parseInt(attrs[lastIndex])) + 1;

    const newVersion = attrs.join('.');
    console.log(newVersion);
    pkgJson.version = newVersion;

    try {
        pkgJson.devDependencies[pkgJson.name] = `^${newVersion}`;
        // 写回去
        fs.writeFileSync(pkgPath, JSON.stringify(pkgJson, null, 4));
    } catch (error) {
        throw error;
    }
}
