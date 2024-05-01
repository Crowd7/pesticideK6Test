import http from "k6/http";
import {check, fail} from "k6";
import {Trend} from 'k6/metrics';

const testUrl = `SWSamplingData/ModifyCropSamplingData`;
const trendName = "backend15_save_crop_sampling_record";
const trend = new Trend(`GET_${trendName}`, true);

/**
 * 執行測試
 * @param {object} parameter
 */
function run(parameter) {
    let ops = {
        headers: {
            "Content-Type": 'application/json',
            "Authorization": `Bearer ${parameter.token}`
        }
    };

    //console.log(`Bearer ${parameter.token}`);

    const guid = generateGuid()
    const label = generateLabel()

    let req = [{"id":0,"samplingPlanBaseID":11,"samplingDate":"2024-04-30 14:06:33","projectNameID":1,"samplingPlanBaseCheckMarkCategory":4,"inspectionItem":[3],"state":-1,"isDelete":false,
    "appGuid":`${guid}`,"inspectionLocation":[{"id":0,"samplingRecordApplyID":0,"type":2,"officeAreaCode":"","address":"","landPartInfoID":1174,"landNo":"road1","externalLandText":"","isDelete":false,"mapLat":22.601887417544603,"mapLng":120.30081516131759,"shapeArea":21395.219899677133,"mapShape":[{"lat":22.60037801351167,"lng":120.29994461685419},{"lat":22.601502529576237,"lng":120.30168570578098},{"lat":22.60339682157754,"lng":120.30128505080937}]}],
    "samplingRecordApplyCropForm":{"samplingNumber":"","labelSerialNumber":`${label}`,"code":"1204000011","inspectionScope":64,"estimatedHarvestDate":"2024/04/30 14:06","originalViolationSampleNumber":"","bigCode":"","smallCode":"","shippingSaleUnit":"","samplingLocation":-1,"knownUpstreamSupplier":"","name":"保證責任雲林縣鹿場果菜生產合作社(雲林縣西螺鎮)","phone":"055881755","completeAddress":"雲林縣西螺鎮鹿場里永興路10號","officeAreaCode":"","address":"","sampleName":"扁豆","originPlace":1,"samplingPlanCropInspectionUnitID":213,"remark":"","levelType":0}}]
    console.log(req);

    const response = http.post(`${parameter.baseUrl}/${testUrl}`, JSON.stringify(req), parameter.options);
    console.log("reponse="+response.json());

    const checkResult = check(response, {
        "url is correct": (r) => r.url.indexOf(testUrl) >= 0,
    });
    
    if (!checkResult) {
        fail(`unexpected response`);
    } else {
        trend.add(response.timings.duration);
    }

}

function generateGuid(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    
        var r = Math.random() * 16 | 0,
    
            v = c == 'x' ? r : (r & 0x3 | 0x8);
    
        return v.toString(16);
    
    });
}

function generateLabel(){
    return '0430xxxxxxxx-xxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    
        var r = Math.random() * 16 | 0,
    
            v = c == 'x' ? r : (r & 0x3 | 0x8);
    
        return v.toString(16);
    
    });
}

export default {
    trend
    , run
}
