import http from "k6/http";
import {check, fail} from "k6";
import {Trend} from 'k6/metrics';

const testUrl = `SWExternalData/GetOfflineMapDataUrl`;
const trendName = testUrl.replaceAll("/", "_").toLowerCase();
const trend = new Trend(`POST_${trendName}`, true);

/**
 * 執行測試
 * @param {object} parameter
 */
function run(parameter) {
    console.log("離線圖資下載 開始");

    var hadFail = false

    for (var i in Array.from(Array(26))) {
        let res = http.get(`${parameter.baseUrl}/${testUrl}?officeAreaCode=NA14`, parameter.options);

        var checkResult = check(res, {
            "url is correct": (r) => r.url.indexOf(testUrl) >= 0,
        });

        if (!checkResult) {
            console.log("離線圖資下載 失敗");
            hadFail = true;
        } else {
            trend.add(res.timings.duration);
        }
    }

    console.log("下載檔案");

    for (var i in Array.from(Array(26))) {
        let url = "https://coagis.colife.org.tw/OffLineMap/download/20240429/20240429_102435_.zip"

        let res = http.get(`${url}`);
    
        var checkResult = check(res, {
            "url is correct": (r) => r.url.indexOf(url) >= 0,
        });
        
        if (!checkResult) {
            console.log("離線圖資下載 失敗");
            hadFail = true;
        } else {
            trend.add(res.timings.duration);
        }
    }

    if (hadFail) {
        fail(`unexpected response`);
    }
}

export default {
    trend
    , run
}
