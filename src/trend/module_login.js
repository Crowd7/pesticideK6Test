import http from "k6/http";
import { check, fail } from "k6";
import { Trend } from "k6/metrics";
import { getAntiForgeryToken } from "../utils";
// 自行更換swagger路徑
const testUrl = 'SWLogin/Login';
const trendName = testUrl.replaceAll("/", "_").toLowerCase();
const trend = new Trend(`post_${trendName}`, true);
/**
 * 執行測試
 * @param {object} parameter
 */
function run(parameter) {
    console.log("開始登入");

    // 自行更換admin帳號
    let userInfo = {
        "account": "apptester",
        "password": "Qaz1234567890"
    };

    let res = http.post(`${parameter.baseUrl}/${testUrl}`, JSON.stringify(userInfo), {
        headers: { 'Content-Type': 'application/json' },
    });
    
    console.log(`登入成功:\n${res.json().data.token}`);

    parameter.options = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${res.json().data.token}`
        }
    }
    trend.add(res.timings.duration);
}

export default {
    trend
    , run
}
