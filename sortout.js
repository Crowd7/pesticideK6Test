const fs = require('fs');
const dayjs = require('dayjs');
const utc =  require('dayjs/plugin/utc');
dayjs.extend(utc)

function move(oldPath, newPath, callback) {

    fs.rename(oldPath, newPath, function (err) {
        if (err) {
            if (err.code === 'EXDEV') {
                copy();
            } else {
                callback(err);
            }
            return;
        }
        callback();
    });

    function copy() {
        var readStream = fs.createReadStream(oldPath);
        var writeStream = fs.createWriteStream(newPath);

        readStream.on('error', callback);
        writeStream.on('error', callback);

        readStream.on('close', function () {
            fs.unlink(oldPath, callback);
        });

        readStream.pipe(writeStream);
    }
}

const now = dayjs.utc().local().format('YYYYMMDDHHmm')

const htmlSourcePath = `test_result.html`;
try {
    if (fs.existsSync(htmlSourcePath)) {
        move(`test_result.html`, `report/${now}.html`, function () {
            console.log(`產出Html測試報告: report/${now}.html`);
        });
    }
} catch(err) {
    console.error(err)
}

const jsonSourcePath = `test_result.json`;
try {
    if (fs.existsSync(jsonSourcePath)) {
        move(`test_result.json`, `report/${now}.json`, function () {
            console.log(`產出JSON測試資料: report/${now}.json`);
        });
    }
} catch(err) {
    console.error(err)
}
