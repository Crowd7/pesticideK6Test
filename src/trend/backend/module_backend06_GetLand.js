import http from "k6/http";
import {check, fail} from "k6";
import {Trend} from 'k6/metrics';

const testUrl = `SWCombo/GISJsonUrl`;
const trendName = testUrl.replaceAll("/", "_").toLowerCase();
const trend = new Trend(`POST_${trendName}`, true);

/**
 * 執行測試
 * @param {object} parameter
 */
function run(parameter) {
    console.log("地籍下載 開始");
    
    let data = {
        "countyCode": "T" 
    }

    console.log(JSON.stringify(data));

    let res1 = http.post(`${parameter.baseUrl}/${testUrl}`, JSON.stringify(data), parameter.options);

    var checkResult = check(res1, {
        "url is correct": (r) => r.url.indexOf(testUrl) >= 0,
    });

    if (!checkResult) {
        fail(`unexpected response`);
    } else {
        trend.add(res1.timings.duration);
    }
    
    const url = res1.json().data.url

    console.log(`${url}`)

    let res2 = http.get(`${url}`);

    checkResult = check(res2, {
        "url is correct": (r) => r.url.indexOf(url) >= 0,
    });
    
    if (!checkResult) {
        fail(`unexpected response`);
    } else {
        trend.add(res2.timings.duration);
    }
}

export default {
    trend
    , run
}
