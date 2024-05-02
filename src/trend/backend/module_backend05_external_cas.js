import http from "k6/http";
import {check, fail} from "k6";
import {Trend} from 'k6/metrics';

const testUrl = `SWExternalData/GetDataByType`;
const trendName = "backend05_external_cas";
const trend = new Trend(`GET_${trendName}`, true);

/**
 * 執行測試
 * @param {object} parameter
 */
function run(parameter) {

    console.log("外部CAS資料下載 開始");

    let req = {
        "type":1,
        "searchUpdatedDate":"",
        "orgNumber":"",
        "tgapCode":"",
        "dataCount":50,
        "page":1
    };

    const response = http.post(`${parameter.baseUrl}/${testUrl}`, JSON.stringify(req), parameter.options);
    //console.log(response.json());
    let totalCount = response.json().data.totalPageCount

    const checkResult = check(response, {
        "url is correct": (r) => r.url.indexOf(testUrl) >= 0,
    });
    
    if (!checkResult) {
        fail(`unexpected response`);
    } else {
        trend.add(response.timings.duration);
    }

    for (let i = 2; i <= totalCount; i++) {
        let req2 = {
            "type":1,
            "searchUpdatedDate":"",
            "orgNumber":"",
            "tgapCode":"",
            "dataCount":50,
            "page":`${i}`
        };
    
        const res2 = http.post(`${parameter.baseUrl}/${testUrl}`, JSON.stringify(req2), parameter.options);

        console.log("external cas, i="+i+", total="+res2.json().data.totalPageCount);

        const checkResult2 = check(res2, {
            "url is correct": (r) => r.url.indexOf(testUrl) >= 0,
        });
        
        if (!checkResult2) {
            fail(`unexpected response`);
        } else {
            trend.add(res2.timings.duration);
        }
      }

    console.log("外部CAS資料下載---END");
}

export default {
    trend
    , run
}
