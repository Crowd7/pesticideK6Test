import http from "k6/http";
import {check, fail} from "k6";
import {Trend} from 'k6/metrics';

const testUrl = `SWSamplingData/ModifyTaftSamplingData`;
const trendName = "backend14_save_taft_samplingrecord";
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

    let req = [{"id":0,"samplingPlanBaseID":12,"samplingDate":"2024-04-30 14:22:53","samplingPlanBaseCheckMarkCategory":1,"projectNameID":2,"inspectionItem":[1,2,3],"state":-1,"isDelete":false,"appGuid":`${guid}`,
    "uploadFileCountList":[{"id":"0","sourceType":6,"originalName":""},{"id":"0","sourceType":7,"originalName":""},{"id":"0","sourceType":8,"originalName":""}],"eSignatureCountList":{"simpleSignatures":[{"id":"","sourceType":10},{"id":"","sourceType":12}],
    "miningUnitSignatures":[{"id":0,"miningUnitID":19,"otherText":"","isDelete":false,"eSignatureFile":{"id":"","sourceType":11}}],"email":"","contactPhone":"0929110953"},"inspectionLocation":[],
    "samplingRecordApplyTAFTCommonMatter":{"samplingNumber":"","inspectionScope":1,"inspectionCategory":1,"countyCode":"","officeAreaCode":"","address":"","url":"","isOtherThingRecordTimeCheck":false,"otherThingRecordTimeText":"","isOtherThingRecordOtherCheck":false,"otherThingRecordOtherText":"","checkType":1,"orgNumber":"137566","orgNumberFarmer":"呂重勝","orgNumberItem":"香蕉","orgNumberLandList":[{"samplingRecordApplyID":55,"completeLandText":"高雄市旗山區旗尾段二小段2357-0000","landPartInfoID":15173,"landNo":"2357-0000"}]},"samplingRecordApplyRecordCheck":{"orgNumber":"137566","verifiedOperatorName":"保證責任台灣省青果運銷合作社高雄分社","producerName":"呂重勝","verificationItemName":"香蕉","isFieldCheck":false,"hasTGAPRelatedRecord":true,"hasTGAPVerifyRelatedForm":true,"hasVoucher":true,"hasDataSavedOverThreeYears":true,"checkResult":true,"checkResultReason":""},
    "samplingRecordApplyMarkCheck":{"tgapCode":"2404080048522176","hasTGAPBadge":true,"isTgapBadgeInSize":true,"productName":"香蕉--香蕉(產銷履歷)","isProductNameSame":1,"productNameOtherText":"","weightCapacityQuantity":"1公斤/包","isWeightCapacityQuantitySame":1,"weightCapacityQuantityOtherText":"","agriProductOperatorName":"保證責任台灣省青果運銷合作社高雄分社","isAgriProductOperatorNameSame":1,"agriProductOperatorNameOtherText":"","agriProductOperatorPhone":"07-6661667","isAgriProductOperatorPhoneSame":1,"agriProductOperatorPhoneOtherText":"","agriProductOperatorAddress":"高雄市旗山區華興街41號","isAgriProductOperatorAddressSame":1,"agriProductOperatorAddressOtherText":"","contactAddress":"高雄市旗山區華興街41號","isContactAddressSame":1,"contactAddressOtherText":"","verificationAgencyName":"成大智研國際驗證股份有限公司","isVerificationAgencyNameSame":1,"verificationAgencyNameOtherText":"","informationOpenMethod":1,"informationOpenMethodOtherText":"","otherRemark":"","checkResult":true,"checkResultReason":""},
    "samplingRecordApplyQualityInspection":{"codeType":2,"organicNumber":"","tgapCode":"2404080048522176","labelSerialNumber":`${label}`,"verifiedOperatorName":"保證責任台灣省青果運銷合作社高雄分社","producerName":"呂重勝","itemName":"香蕉--香蕉(產銷履歷)","samplingNumber":1,"totalWeight":1.0,"isHighPriceProduct":false,"otherRemark":""}}]
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
