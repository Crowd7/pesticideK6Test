import http from "k6/http";
import {check, fail} from "k6";
import {Trend} from 'k6/metrics';

const testUrl = `SWSamplingData/ModifyCropSamplingData`;
const getBatchNumberUrl = `SWSamplingData/GetBatchNumber`;
const uploadFileUrl = `SWUploadFile/UploadFile`;
const trendName = testUrl.replaceAll("/", "_").toLowerCase();
const trend = new Trend(`POST_${trendName}`, true);
let photoFile = open("../document/photo_3.jpg");
let signFile = open("../document/sign_3.jpg");

/**
 * 執行測試
 * @param {object} parameter
 */
function run(parameter) {
    console.log("批次上傳 開始")

    var res0 = http.get(`${parameter.baseUrl}/${getBatchNumberUrl}`, parameter.options);

    let batchNumber = parseInt(res0.json().data.id)

    var res = http.post(`${parameter.baseUrl}/${testUrl}`, BatchJson(batchNumber), parameter.options);

    const checkResult = check(res, {
        "url is correct": (r) => r.url.indexOf(testUrl) >= 0,
    });
    
    if (!checkResult) {
        console.log("批次上傳 失敗");
        fail(`unexpected response`);
    } else {
        trend.add(res.timings.duration);
    }

    let options = {
        headers: {
            "Authorization": `Bearer ${parameter.jwtToken}`
        }
    };

    for (var record in Array.from(res.json.data)) {
      for (var photo in Array.from(record.uploadFileIDs)) {
        let data = {
            uploadFile: http.file(photoFile,'photo_3.jpg')
        }

        const res = http.post(`${parameter.baseUrl}/${uploadFileUrl}?fileId=${photo.uploadFileId}` ,data ,options);
        const checkResult = check(res, {
            "url is correct": (r) => r.url.indexOf(uploadFileUrl) >= 0,
        });

        if (!checkResult) {
            console.log(photo.uploadFileId);
            console.log("上傳檔案失敗");
        } else {
            trend.add(res.timings.duration);
        }

        sleep(1);
      }

      for (var sign in Array.from(record.eSignatureIDs)) {
          let data = {
              uploadFile: http.file(signFile,'sign_3.jpg')
          }

          const res = http.post(`${parameter.baseUrl}/${uploadFileUrl}?fileId=${sign.uploadFileId}` ,data ,options);
          const checkResult = check(res, {
              "url is correct": (r) => r.url.indexOf(uploadFileUrl) >= 0,
          });

          if (!checkResult) {
              console.log(sign.uploadFileId);
              console.log("上傳檔案失敗");
          } else {
              trend.add(res.timings.duration);
          }

          sleep(1);
      }

    }

    
}

function GenerateLabel() {
    return 'xxxxxxxx-xxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function GenerateGUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
}

export default {
    trend
    , run
}

function BatchJson(batchNumberID) {
  let data = [
    {
      "id": 0,
      "samplingPlanBaseID": 11,
      "samplingDate": "2024-04-28 22:28:25",
      "projectNameID": 1,
      "samplingPlanBaseCheckMarkCategory": 1,
      "inspectionItem": [
        3
      ],
      "state": -1,
      "isDelete": false,
      "appGuid": `${GenerateGUID()}`,
      "batchNumberID": `${batchNumberID}`,
      "uploadFileCountList": [
        {
          "id": "0",
          "sourceType": 9,
          "originalName": "Android_Batch_20240428223122"
        },
        {
          "id": "0",
          "sourceType": 9,
          "originalName": "Android_Batch_20240428223122"
        },
        {
          "id": "0",
          "sourceType": 9,
          "originalName": "Android_Batch_20240428223122"
        },
        {
          "id": "0",
          "sourceType": 9,
          "originalName": "Android_Batch_20240428223122"
        },
        {
          "id": "0",
          "sourceType": 9,
          "originalName": "Android_Batch_20240428223122"
        }
      ],
      "eSignatureCountList": {
        "simpleSignatures": [
          {
            "id": "",
            "sourceType": 10
          },
          {
            "id": "",
            "sourceType": 12
          }
        ],
        "miningUnitSignatures": [
          {
            "id": 0,
            "miningUnitID": 10,
            "otherText": "",
            "isDelete": false,
            "eSignatureFile": {
              "id": "",
              "sourceType": 11
            }
          }
        ],
        "email": "",
        "contactPhone": ""
      },
      "inspectionLocation": [
        {
          "id": 0,
          "samplingRecordApplyID": 0,
          "type": 1,
          "officeAreaCode": "EA02",
          "address": "復興4路",
          "landNo": "",
          "externalLandText": "",
          "isDelete": false,
          "mapLat": 22.649296949350617,
          "mapLng": 120.26988208293913,
          "mapShape": []
        }
      ],
      "samplingRecordApplyCropForm": {
        "samplingNumber": "",
        "labelSerialNumber": `${GenerateLabel()}`,
        "code": "2404240078704549",
        "inspectionScope": 128,
        "estimatedHarvestDate": "2024/04/28 22:28",
        "originalViolationSampleNumber": "",
        "bigCode": "P99560",
        "smallCode": "",
        "shippingSaleUnit": "",
        "samplingLocation": -1,
        "knownUpstreamSupplier": "",
        "name": "陳煌霖",
        "phone": "05-5977521",
        "completeAddress": "雲林縣斗南鎮田頭里田福路35號",
        "officeAreaCode": "PC04",
        "address": "市場北路325號",
        "sampleName": "馬鈴薯--600公克",
        "originPlace": 1,
        "samplingPlanCropInspectionUnitID": 212,
        "remark": "",
        "levelType": 0
      }
    },
    {
      "id": 0,
      "samplingPlanBaseID": 11,
      "samplingDate": "2024-04-28 21:30:44",
      "projectNameID": 1,
      "samplingPlanBaseCheckMarkCategory": 1,
      "inspectionItem": [
        3
      ],
      "state": -1,
      "isDelete": false,
      "appGuid": `${GenerateGUID()}`,
      "batchNumberID": `${batchNumberID}`,
      "uploadFileCountList": [
        {
          "id": "0",
          "sourceType": 9,
          "originalName": "Android_Batch_20240428223122"
        },
        {
          "id": "0",
          "sourceType": 9,
          "originalName": "Android_Batch_20240428223122"
        },
        {
          "id": "0",
          "sourceType": 9,
          "originalName": "Android_Batch_20240428223122"
        },
        {
          "id": "0",
          "sourceType": 9,
          "originalName": "Android_Batch_20240428223122"
        },
        {
          "id": "0",
          "sourceType": 9,
          "originalName": "Android_Batch_20240428223122"
        }
      ],
      "eSignatureCountList": {
        "simpleSignatures": [
          {
            "id": "",
            "sourceType": 10
          },
          {
            "id": "",
            "sourceType": 12
          }
        ],
        "miningUnitSignatures": [
          {
            "id": 0,
            "miningUnitID": 10,
            "otherText": "",
            "isDelete": false,
            "eSignatureFile": {
              "id": "",
              "sourceType": 11
            }
          }
        ],
        "email": "",
        "contactPhone": ""
      },
      "inspectionLocation": [
        {
          "id": 0,
          "samplingRecordApplyID": 0,
          "type": 1,
          "officeAreaCode": "FE30",
          "address": "road1",
          "landNo": "",
          "externalLandText": "",
          "isDelete": false,
          "mapLat": 25.259348977755025,
          "mapLng": 121.50243423879147,
          "mapShape": []
        }
      ],
      "samplingRecordApplyCropForm": {
        "samplingNumber": "",
        "labelSerialNumber": `${GenerateLabel()}`,
        "code": "2404090414600041",
        "inspectionScope": 128,
        "estimatedHarvestDate": "2024/04/28 00:44",
        "originalViolationSampleNumber": "",
        "bigCode": "P99560",
        "smallCode": "",
        "shippingSaleUnit": "",
        "samplingLocation": -1,
        "knownUpstreamSupplier": "",
        "name": "胡智傑",
        "phone": "03-9893170",
        "completeAddress": "宜蘭縣三星鄉義德村中山路二段41號",
        "officeAreaCode": "PC04",
        "address": "市場北路325號",
        "sampleName": "青蔥--三星上將青蔥",
        "originPlace": 1,
        "samplingPlanCropInspectionUnitID": 158,
        "remark": "",
        "levelType": 0
      }
    },
      {
      "id": 0,
      "samplingPlanBaseID": 11,
      "samplingDate": "2024-04-28 21:20:32",
      "projectNameID": 1,
      "samplingPlanBaseCheckMarkCategory": 1,
      "inspectionItem": [
        3
      ],
      "state": -1,
      "isDelete": false,
      "appGuid": `${GenerateGUID()}`,
      "batchNumberID": `${batchNumberID}`,
      "uploadFileCountList": [
        {
          "id": "0",
          "sourceType": 9,
          "originalName": "Android_Batch_20240428223122"
        },
        {
          "id": "0",
          "sourceType": 9,
          "originalName": "Android_Batch_20240428223122"
        },
        {
          "id": "0",
          "sourceType": 9,
          "originalName": "Android_Batch_20240428223122"
        },
        {
          "id": "0",
          "sourceType": 9,
          "originalName": "Android_Batch_20240428223122"
        },
        {
          "id": "0",
          "sourceType": 9,
          "originalName": "Android_Batch_20240428223122"
        }
      ],
      "eSignatureCountList": {
        "simpleSignatures": [
          {
            "id": "",
            "sourceType": 10
          },
          {
            "id": "",
            "sourceType": 12
          }
        ],
        "miningUnitSignatures": [
          {
            "id": 0,
            "miningUnitID": 10,
            "otherText": "",
            "isDelete": false,
            "eSignatureFile": {
              "id": "",
              "sourceType": 11
            }
          }
        ],
        "email": "",
        "contactPhone": ""
      },
      "inspectionLocation": [
        {
          "id": 0,
          "samplingRecordApplyID": 0,
          "type": 1,
          "officeAreaCode": "CD05",
          "address": "rr",
          "landNo": "",
          "externalLandText": "",
          "isDelete": false,
          "mapLat": 25.1525979056701,
          "mapLng": 121.72524567693472,
          "mapShape": []
        }
      ],
      "samplingRecordApplyCropForm": {
        "samplingNumber": "",
        "labelSerialNumber": `${GenerateLabel()}`,
        "code": "2404090395800043",
        "inspectionScope": 128,
        "estimatedHarvestDate": "2024/04/28 01:20",
        "originalViolationSampleNumber": "",
        "bigCode": "P99560",
        "smallCode": "",
        "shippingSaleUnit": "",
        "samplingLocation": -1,
        "knownUpstreamSupplier": "",
        "name": "洪昇茂",
        "phone": "049-2567559",
        "completeAddress": "南投縣草屯鎮玉屏路38號",
        "officeAreaCode": "PC04",
        "address": "市場北路325號",
        "sampleName": "紅豆--紅豆",
        "originPlace": 1,
        "samplingPlanCropInspectionUnitID": 168,
        "remark": "",
        "levelType": 0
      }
    },
    {
      "id": 0,
      "samplingPlanBaseID": 11,
      "samplingDate": "2024-04-28 01:20:32",
      "projectNameID": 1,
      "samplingPlanBaseCheckMarkCategory": 1,
      "inspectionItem": [
        3
      ],
      "state": -1,
      "isDelete": false,
      "appGuid": `${GenerateGUID()}`,
      "batchNumberID": `${batchNumberID}`,
      "uploadFileCountList": [
        {
          "id": "0",
          "sourceType": 9,
          "originalName": "Android_Batch_20240428223122"
        },
        {
          "id": "0",
          "sourceType": 9,
          "originalName": "Android_Batch_20240428223122"
        },
        {
          "id": "0",
          "sourceType": 9,
          "originalName": "Android_Batch_20240428223122"
        },
        {
          "id": "0",
          "sourceType": 9,
          "originalName": "Android_Batch_20240428223122"
        },
        {
          "id": "0",
          "sourceType": 9,
          "originalName": "Android_Batch_20240428223122"
        }
      ],
      "eSignatureCountList": {
        "simpleSignatures": [
          {
            "id": "",
            "sourceType": 10
          },
          {
            "id": "",
            "sourceType": 12
          }
        ],
        "miningUnitSignatures": [
          {
            "id": 0,
            "miningUnitID": 10,
            "otherText": "",
            "isDelete": false,
            "eSignatureFile": {
              "id": "",
              "sourceType": 11
            }
          }
        ],
        "email": "",
        "contactPhone": ""
      },
      "inspectionLocation": [
        {
          "id": 0,
          "samplingRecordApplyID": 0,
          "type": 1,
          "officeAreaCode": "CD05",
          "address": "rr",
          "landNo": "",
          "externalLandText": "",
          "isDelete": false,
          "mapLat": 25.1525979056701,
          "mapLng": 121.72524567693472,
          "mapShape": []
        }
      ],
      "samplingRecordApplyCropForm": {
        "samplingNumber": "",
        "labelSerialNumber": `${GenerateLabel()}`,
        "code": "2404100192601139",
        "inspectionScope": 128,
        "estimatedHarvestDate": "2024/04/28 01:20",
        "originalViolationSampleNumber": "",
        "bigCode": "P99560",
        "smallCode": "",
        "shippingSaleUnit": "",
        "samplingLocation": -1,
        "knownUpstreamSupplier": "",
        "name": "黃兆桂",
        "phone": "0963-205556",
        "completeAddress": "高雄市美濃區民族路109巷35之8號",
        "officeAreaCode": "PC04",
        "address": "市場北路325號",
        "sampleName": "龍骨瓣莕菜(野蓮)--龍骨瓣莕菜(野蓮",
        "originPlace": 1,
        "samplingPlanCropInspectionUnitID": 168,
        "remark": "",
        "levelType": 0
      }
    },
      {
      "id": 0,
      "samplingPlanBaseID": 11,
      "samplingDate": "2024-04-28 01:41:44",
      "projectNameID": 1,
      "samplingPlanBaseCheckMarkCategory": 2,
      "inspectionItem": [
        3
      ],
      "state": -1,
      "isDelete": false,
      "appGuid": `${GenerateGUID()}`,
      "batchNumberID": `${batchNumberID}`,
      "uploadFileCountList": [
        {
          "id": "0",
          "sourceType": 9,
          "originalName": "Android_Batch_20240428223122"
        },
        {
          "id": "0",
          "sourceType": 9,
          "originalName": "Android_Batch_20240428223122"
        },
        {
          "id": "0",
          "sourceType": 9,
          "originalName": "Android_Batch_20240428223122"
        },
        {
          "id": "0",
          "sourceType": 9,
          "originalName": "Android_Batch_20240428223122"
        },
        {
          "id": "0",
          "sourceType": 9,
          "originalName": "Android_Batch_20240428223122"
        }
      ],
      "eSignatureCountList": {
        "simpleSignatures": [
          {
            "id": "",
            "sourceType": 10
          },
          {
            "id": "",
            "sourceType": 12
          }
        ],
        "miningUnitSignatures": [
          {
            "id": 0,
            "miningUnitID": 10,
            "otherText": "",
            "isDelete": false,
            "eSignatureFile": {
              "id": "",
              "sourceType": 11
            }
          }
        ],
        "email": "",
        "contactPhone": ""
      },
      "inspectionLocation": [
        {
          "id": 0,
          "samplingRecordApplyID": 0,
          "type": 1,
          "officeAreaCode": "CD05",
          "address": "rrr",
          "landNo": "",
          "externalLandText": "",
          "isDelete": false,
          "mapLat": 25.152590622032047,
          "mapLng": 121.72524567693472,
          "mapShape": []
        }
      ],
      "samplingRecordApplyCropForm": {
        "samplingNumber": "",
        "labelSerialNumber": `${GenerateLabel()}`,
        "code": "1-010-100214",
        "inspectionScope": 128,
        "estimatedHarvestDate": "2024/04/28 01:41",
        "originalViolationSampleNumber": "",
        "bigCode": "P99560",
        "smallCode": "",
        "shippingSaleUnit": "",
        "samplingLocation": -1,
        "knownUpstreamSupplier": "",
        "name": "林寶玲",
        "phone": "0912746576",
        "completeAddress": "屏東縣麟洛鄉新田村民族路408號",
        "officeAreaCode": "PC04",
        "address": "市場北路325號",
        "sampleName": "扁實檸檬",
        "originPlace": 1,
        "samplingPlanCropInspectionUnitID": 168,
        "remark": "",
        "levelType": 1,
        "farmType": 1
      }
    },
    {
      "id": 0,
      "samplingPlanBaseID": 11,
      "samplingDate": "2024-04-28 01:41:44",
      "projectNameID": 1,
      "samplingPlanBaseCheckMarkCategory": 2,
      "inspectionItem": [
        3
      ],
      "state": -1,
      "isDelete": false,
      "appGuid": `${GenerateGUID()}`,
      "batchNumberID": `${batchNumberID}`,
      "uploadFileCountList": [
        {
          "id": "0",
          "sourceType": 9,
          "originalName": "Android_Batch_20240428223122"
        },
        {
          "id": "0",
          "sourceType": 9,
          "originalName": "Android_Batch_20240428223122"
        },
        {
          "id": "0",
          "sourceType": 9,
          "originalName": "Android_Batch_20240428223122"
        },
        {
          "id": "0",
          "sourceType": 9,
          "originalName": "Android_Batch_20240428223122"
        },
        {
          "id": "0",
          "sourceType": 9,
          "originalName": "Android_Batch_20240428223122"
        }
      ],
      "eSignatureCountList": {
        "simpleSignatures": [
          {
            "id": "",
            "sourceType": 10
          },
          {
            "id": "",
            "sourceType": 12
          }
        ],
        "miningUnitSignatures": [
          {
            "id": 0,
            "miningUnitID": 10,
            "otherText": "",
            "isDelete": false,
            "eSignatureFile": {
              "id": "",
              "sourceType": 11
            }
          }
        ],
        "email": "",
        "contactPhone": ""
      },
      "inspectionLocation": [
        {
          "id": 0,
          "samplingRecordApplyID": 0,
          "type": 1,
          "officeAreaCode": "CD05",
          "address": "rrr",
          "landNo": "",
          "externalLandText": "",
          "isDelete": false,
          "mapLat": 25.152590622032047,
          "mapLng": 121.72524567693472,
          "mapShape": []
        }
      ],
      "samplingRecordApplyCropForm": {
        "samplingNumber": "",
        "labelSerialNumber": `${GenerateLabel()}`,
        "code": "1-010-100215",
        "inspectionScope": 128,
        "estimatedHarvestDate": "2024/04/28 01:41",
        "originalViolationSampleNumber": "",
        "bigCode": "P99560",
        "smallCode": "",
        "shippingSaleUnit": "",
        "samplingLocation": -1,
        "knownUpstreamSupplier": "",
        "name": "邱維和",
        "phone": "087971300",
        "completeAddress": "屏東縣新埤鄉新埤村文化街16號",
        "officeAreaCode": "PC04",
        "address": "市場北路325號",
        "sampleName": "香蕉",
        "originPlace": 1,
        "samplingPlanCropInspectionUnitID": 168,
        "remark": "",
        "levelType": 1,
        "farmType": 1
      }
    },
      {
      "id": 0,
      "samplingPlanBaseID": 11,
      "samplingDate": "2024-04-28 01:49:38",
      "projectNameID": 1,
      "samplingPlanBaseCheckMarkCategory": 2,
      "inspectionItem": [
        3
      ],
      "state": -1,
      "isDelete": false,
      "appGuid": `${GenerateGUID()}`,
      "batchNumberID": `${batchNumberID}`,
      "uploadFileCountList": [
        {
          "id": "0",
          "sourceType": 9,
          "originalName": "Android_Batch_20240428223122"
        },
        {
          "id": "0",
          "sourceType": 9,
          "originalName": "Android_Batch_20240428223122"
        },
        {
          "id": "0",
          "sourceType": 9,
          "originalName": "Android_Batch_20240428223122"
        },
        {
          "id": "0",
          "sourceType": 9,
          "originalName": "Android_Batch_20240428223122"
        },
        {
          "id": "0",
          "sourceType": 9,
          "originalName": "Android_Batch_20240428223122"
        }
      ],
      "eSignatureCountList": {
        "simpleSignatures": [
          {
            "id": "",
            "sourceType": 10
          },
          {
            "id": "",
            "sourceType": 12
          }
        ],
        "miningUnitSignatures": [
          {
            "id": 0,
            "miningUnitID": 10,
            "otherText": "",
            "isDelete": false,
            "eSignatureFile": {
              "id": "",
              "sourceType": 11
            }
          }
        ],
        "email": "",
        "contactPhone": ""
      },
      "inspectionLocation": [
        {
          "id": 0,
          "samplingRecordApplyID": 0,
          "type": 1,
          "officeAreaCode": "CD01",
          "address": "road1",
          "landNo": "",
          "externalLandText": "",
          "isDelete": false,
          "mapLat": 25.14900975083671,
          "mapLng": 121.77368234843016,
          "mapShape": []
        }
      ],
      "samplingRecordApplyCropForm": {
        "samplingNumber": "",
        "labelSerialNumber": `${GenerateLabel()}`,
        "code": "1-010-100206",
        "inspectionScope": 128,
        "estimatedHarvestDate": "2024/04/28 01:49",
        "originalViolationSampleNumber": "",
        "bigCode": "P99560",
        "smallCode": "",
        "shippingSaleUnit": "",
        "samplingLocation": -1,
        "knownUpstreamSupplier": "",
        "name": "陳明宏(牛頭山農場)",
        "phone": "065742012",
        "completeAddress": "臺南市玉井區玉田里中山路3巷33號",
        "officeAreaCode": "PC04",
        "address": "市場北路325號",
        "sampleName": "白菜",
        "originPlace": 1,
        "samplingPlanCropInspectionUnitID": 168,
        "remark": "",
        "levelType": 1,
        "farmType": 1
      }
    },
    {
      "id": 0,
      "samplingPlanBaseID": 11,
      "samplingDate": "2024-04-28 01:49:38",
      "projectNameID": 1,
      "samplingPlanBaseCheckMarkCategory": 2,
      "inspectionItem": [
        3
      ],
      "state": -1,
      "isDelete": false,
      "appGuid": `${GenerateGUID()}`,
      "batchNumberID": `${batchNumberID}`,
      "uploadFileCountList": [
        {
          "id": "0",
          "sourceType": 9,
          "originalName": "Android_Batch_20240428223122"
        },
        {
          "id": "0",
          "sourceType": 9,
          "originalName": "Android_Batch_20240428223122"
        },
        {
          "id": "0",
          "sourceType": 9,
          "originalName": "Android_Batch_20240428223122"
        },
        {
          "id": "0",
          "sourceType": 9,
          "originalName": "Android_Batch_20240428223122"
        },
        {
          "id": "0",
          "sourceType": 9,
          "originalName": "Android_Batch_20240428223122"
        }
      ],
      "eSignatureCountList": {
        "simpleSignatures": [
          {
            "id": "",
            "sourceType": 10
          },
          {
            "id": "",
            "sourceType": 12
          }
        ],
        "miningUnitSignatures": [
          {
            "id": 0,
            "miningUnitID": 10,
            "otherText": "",
            "isDelete": false,
            "eSignatureFile": {
              "id": "",
              "sourceType": 11
            }
          }
        ],
        "email": "",
        "contactPhone": ""
      },
      "inspectionLocation": [
        {
          "id": 0,
          "samplingRecordApplyID": 0,
          "type": 1,
          "officeAreaCode": "CD01",
          "address": "road1",
          "landNo": "",
          "externalLandText": "",
          "isDelete": false,
          "mapLat": 25.14900975083671,
          "mapLng": 121.77368234843016,
          "mapShape": []
        }
      ],
      "samplingRecordApplyCropForm": {
        "samplingNumber": "",
        "labelSerialNumber": `${GenerateLabel()}`,
        "code": "1-010-100241",
        "inspectionScope": 128,
        "estimatedHarvestDate": "2024/04/28 01:49",
        "originalViolationSampleNumber": "",
        "bigCode": "P99560",
        "smallCode": "",
        "shippingSaleUnit": "",
        "samplingLocation": -1,
        "knownUpstreamSupplier": "",
        "name": "趙令熙",
        "phone": "0911803798",
        "completeAddress": "臺中市東勢區勢林街33-1號",
        "officeAreaCode": "PC04",
        "address": "市場北路325號",
        "sampleName": "羽衣甘藍",
        "originPlace": 1,
        "samplingPlanCropInspectionUnitID": 168,
        "remark": "",
        "levelType": 1,
        "farmType": 1
      }
    },
    {
      "id" : 0,
      "state" : -1,
      "eSignatureCountList" : {
        "email" : "psyche8051@gmail.com",
        "miningUnitSignatures" : [
          {
            "isDelete" : false,
            "id" : 0,
            "miningUnitID" : 150,
            "eSignatureFile" : {
              "id" : "0",
              "sourceType" : 11
            }
          }
        ],
        "simpleSignatures" : [
          {
            "id" : "0",
            "sourceType" : 10
          },
          {
            "id" : "0",
            "sourceType" : 12
          }
        ],
        "contactPhone" : "0911000222"
      },
      "samplingDate" : "2024-04-29 00:00:00",
      "appGuid" : `${GenerateGUID()}`,
      "batchNumberID" : `${batchNumberID}`,
      "samplingRecordApplyCropForm" : {
        "inspectionScope" : 128,
        "phone" : "0928303534",
        "bigCode" : "P99560",
        "completeAddress" : "高雄市鳳山區新富路366巷3號11樓",
        "labelSerialNumber": `${GenerateLabel()}`,
        "sampleName" : "洛神葵",
        "levelType" : 0,
        "code" : "19-CS-0610-01",
        "smallCode" : "1",
        "address" : "市場北路325號",
        "originPlace" : 1,
        "samplingPlanCropInspectionUnitID" : 212,
        "officeAreaCode" : "PC04",
        "shippingSaleUnit" : "保證責任雲林縣新安果菜生產合作社",
        "name" : "李俊雲"
      },
      "samplingPlanBaseCheckMarkCategory" : 3,
      "isDelete" : false,
      "projectNameID" : 1,
      "inspectionItem" : [
        3
      ],
      "uploadFileCountList" : [
        {
          "id" : "0",
          "sourceType" : 9,
          "originalName" : "20240429003153_iOS_CA39E3D7-7"
        },
        {
          "id" : "0",
          "originalName" : "20240429003153_iOS_C366D40C-5",
          "sourceType" : 9
        },
        {
          "id" : "0",
          "originalName" : "20240429003153_iOS_A6E1B6B6-8",
          "sourceType" : 9
        },
        {
          "id" : "0",
          "originalName" : "20240429003153_iOS_F4A2CE18-8",
          "sourceType" : 9
        },
        {
          "id" : "0",
          "originalName" : "20240429003153_iOS_3EDDA73E-8",
          "sourceType" : 9
        }
      ],
      "samplingPlanBaseID" : 11,
      "inspectionLocation" : [
        {
          "mapLat" : "25.0951219",
          "address" : "100號",
          "officeAreaCode" : "AE15",
          "id" : 0,
          "samplingRecordApplyID" : 0,
          "mapShape" : [
            {
              "lat" : "22.600944180899404",
              "lng" : "120.33929157380253"
            }
          ],
          "mapLng" : "121.5246308",
          "shapeArea" : "0.0",
          "isDelete" : false,
          "type" : 1
        }
      ]
    },
      {
      "id" : 0,
      "state" : -1,
      "eSignatureCountList" : {
        "email" : "psyche8051@gmail.com",
        "miningUnitSignatures" : [
          {
            "isDelete" : false,
            "id" : 0,
            "miningUnitID" : 150,
            "eSignatureFile" : {
              "id" : "0",
              "sourceType" : 11
            }
          }
        ],
        "simpleSignatures" : [
          {
            "id" : "0",
            "sourceType" : 10
          },
          {
            "id" : "0",
            "sourceType" : 12
          }
        ],
        "contactPhone" : "0911000222"
      },
      "samplingDate" : "2024-04-29 00:00:00",
      "appGuid" : `${GenerateGUID()}`,
      "batchNumberID" : `${batchNumberID}`,
      "samplingRecordApplyCropForm" : {
        "inspectionScope" : 128,
        "phone" : "0928303534",
        "bigCode" : "P99560",
        "completeAddress" : "高雄市鳳山區新富路366巷3號11樓",
        "labelSerialNumber": `${GenerateLabel()}`,
        "sampleName" : "洛神葵",
        "levelType" : 0,
        "code" : "19-CS-0610-01",
        "smallCode" : "1",
        "address" : "市場北路325號",
        "originPlace" : 1,
        "samplingPlanCropInspectionUnitID" : 212,
        "officeAreaCode" : "PC04",
        "shippingSaleUnit" : "保證責任雲林縣新安果菜生產合作社",
        "name" : "李俊雲"
      },
      "samplingPlanBaseCheckMarkCategory" : 3,
      "isDelete" : false,
      "projectNameID" : 1,
      "inspectionItem" : [
        3
      ],
      "uploadFileCountList" : [
        {
          "id" : "0",
          "sourceType" : 9,
          "originalName" : "20240429003153_iOS_CA39E3D7-7"
        },
        {
          "id" : "0",
          "originalName" : "20240429003153_iOS_C366D40C-5",
          "sourceType" : 9
        },
        {
          "id" : "0",
          "originalName" : "20240429003153_iOS_A6E1B6B6-8",
          "sourceType" : 9
        },
        {
          "id" : "0",
          "originalName" : "20240429003153_iOS_F4A2CE18-8",
          "sourceType" : 9
        },
        {
          "id" : "0",
          "originalName" : "20240429003153_iOS_3EDDA73E-8",
          "sourceType" : 9
        }
      ],
      "samplingPlanBaseID" : 11,
      "inspectionLocation" : [
        {
          "mapLat" : "25.0951219",
          "address" : "100號",
          "officeAreaCode" : "AE15",
          "id" : 0,
          "samplingRecordApplyID" : 0,
          "mapShape" : [
            {
              "lat" : "22.600944180899404",
              "lng" : "120.33929157380253"
            }
          ],
          "mapLng" : "121.5246308",
          "shapeArea" : "0.0",
          "isDelete" : false,
          "type" : 1
        }
      ]
    },
      {
      "id" : 0,
      "state" : -1,
      "eSignatureCountList" : {
        "email" : "psyche8051@gmail.com",
        "miningUnitSignatures" : [
          {
            "isDelete" : false,
            "id" : 0,
            "miningUnitID" : 150,
            "eSignatureFile" : {
              "id" : "0",
              "sourceType" : 11
            }
          }
        ],
        "simpleSignatures" : [
          {
            "id" : "0",
            "sourceType" : 10
          },
          {
            "id" : "0",
            "sourceType" : 12
          }
        ],
        "contactPhone" : "0911000222"
      },
      "samplingDate" : "2024-04-29 00:00:00",
      "appGuid" : `${GenerateGUID()}`,
      "batchNumberID" : `${batchNumberID}`,
      "samplingRecordApplyCropForm" : {
        "inspectionScope" : 128,
        "phone" : "0928303534",
        "bigCode" : "P99560",
        "completeAddress" : "高雄市鳳山區新富路366巷3號11樓",
        "labelSerialNumber": `${GenerateLabel()}`,
        "sampleName" : "洛神葵",
        "levelType" : 0,
        "code" : "19-CS-0610-01",
        "smallCode" : "1",
        "address" : "市場北路325號",
        "originPlace" : 1,
        "samplingPlanCropInspectionUnitID" : 212,
        "officeAreaCode" : "PC04",
        "shippingSaleUnit" : "保證責任雲林縣新安果菜生產合作社",
        "name" : "李俊雲"
      },
      "samplingPlanBaseCheckMarkCategory" : 3,
      "isDelete" : false,
      "projectNameID" : 1,
      "inspectionItem" : [
        3
      ],
      "uploadFileCountList" : [
        {
          "id" : "0",
          "sourceType" : 9,
          "originalName" : "20240429003153_iOS_CA39E3D7-7"
        },
        {
          "id" : "0",
          "originalName" : "20240429003153_iOS_C366D40C-5",
          "sourceType" : 9
        },
        {
          "id" : "0",
          "originalName" : "20240429003153_iOS_A6E1B6B6-8",
          "sourceType" : 9
        },
        {
          "id" : "0",
          "originalName" : "20240429003153_iOS_F4A2CE18-8",
          "sourceType" : 9
        },
        {
          "id" : "0",
          "originalName" : "20240429003153_iOS_3EDDA73E-8",
          "sourceType" : 9
        }
      ],
      "samplingPlanBaseID" : 11,
      "inspectionLocation" : [
        {
          "mapLat" : "25.0951219",
          "address" : "100號",
          "officeAreaCode" : "AE15",
          "id" : 0,
          "samplingRecordApplyID" : 0,
          "mapShape" : [
            {
              "lat" : "22.600944180899404",
              "lng" : "120.33929157380253"
            }
          ],
          "mapLng" : "121.5246308",
          "shapeArea" : "0.0",
          "isDelete" : false,
          "type" : 1
        }
      ]
    },
      {
      "id" : 0,
      "state" : -1,
      "eSignatureCountList" : {
        "email" : "psyche8051@gmail.com",
        "miningUnitSignatures" : [
          {
            "isDelete" : false,
            "id" : 0,
            "miningUnitID" : 150,
            "eSignatureFile" : {
              "id" : "0",
              "sourceType" : 11
            }
          }
        ],
        "simpleSignatures" : [
          {
            "id" : "0",
            "sourceType" : 10
          },
          {
            "id" : "0",
            "sourceType" : 12
          }
        ],
        "contactPhone" : "0911000222"
      },
      "samplingDate" : "2024-04-29 00:00:00",
      "appGuid" : `${GenerateGUID()}`,
      "batchNumberID" : `${batchNumberID}`,
      "samplingRecordApplyCropForm" : {
        "inspectionScope" : 128,
        "phone" : "0928303534",
        "bigCode" : "P99560",
        "completeAddress" : "高雄市鳳山區新富路366巷3號11樓",
        "labelSerialNumber": `${GenerateLabel()}`,
        "sampleName" : "洛神葵",
        "levelType" : 0,
        "code" : "19-CS-0610-01",
        "smallCode" : "1",
        "address" : "市場北路325號",
        "originPlace" : 1,
        "samplingPlanCropInspectionUnitID" : 212,
        "officeAreaCode" : "PC04",
        "shippingSaleUnit" : "保證責任雲林縣新安果菜生產合作社",
        "name" : "李俊雲"
      },
      "samplingPlanBaseCheckMarkCategory" : 3,
      "isDelete" : false,
      "projectNameID" : 1,
      "inspectionItem" : [
        3
      ],
      "uploadFileCountList" : [
        {
          "id" : "0",
          "sourceType" : 9,
          "originalName" : "20240429003153_iOS_CA39E3D7-7"
        },
        {
          "id" : "0",
          "originalName" : "20240429003153_iOS_C366D40C-5",
          "sourceType" : 9
        },
        {
          "id" : "0",
          "originalName" : "20240429003153_iOS_A6E1B6B6-8",
          "sourceType" : 9
        },
        {
          "id" : "0",
          "originalName" : "20240429003153_iOS_F4A2CE18-8",
          "sourceType" : 9
        },
        {
          "id" : "0",
          "originalName" : "20240429003153_iOS_3EDDA73E-8",
          "sourceType" : 9
        }
      ],
      "samplingPlanBaseID" : 11,
      "inspectionLocation" : [
        {
          "mapLat" : "25.0951219",
          "address" : "100號",
          "officeAreaCode" : "AE15",
          "id" : 0,
          "samplingRecordApplyID" : 0,
          "mapShape" : [
            {
              "lat" : "22.600944180899404",
              "lng" : "120.33929157380253"
            }
          ],
          "mapLng" : "121.5246308",
          "shapeArea" : "0.0",
          "isDelete" : false,
          "type" : 1
        }
      ]
    },
    {
      "id" : 0,
      "state" : -1,
      "eSignatureCountList" : {
        "email" : "psyche8051@gmail.com",
        "miningUnitSignatures" : [
          {
            "isDelete" : false,
            "id" : 0,
            "miningUnitID" : 150,
            "eSignatureFile" : {
              "id" : "0",
              "sourceType" : 11
            }
          }
        ],
        "simpleSignatures" : [
          {
            "id" : "0",
            "sourceType" : 10
          },
          {
            "id" : "0",
            "sourceType" : 12
          }
        ],
        "contactPhone" : "0911000222"
      },
      "samplingDate" : "2024-04-29 00:00:00",
      "appGuid" : `${GenerateGUID()}`,
      "batchNumberID" : `${batchNumberID}`,
      "samplingRecordApplyCropForm" : {
        "shippingSaleUnit" : "保證責任雲林縣新安果菜生產合作社",
        "phone" : "0988160818",
        "sampleName" : "木瓜",
        "completeAddress" : "臺南市楠西區鹿田里鹿陶洋68-2號",
        "labelSerialNumber": `${GenerateLabel()}`,
        "bigCode" : "P99560",
        "levelType" : 0,
        "code" : "0501007530",
        "smallCode" : "2",
        "address" : "市場北路325號",
        "originPlace" : 2,
        "samplingPlanCropInspectionUnitID" : 212,
        "officeAreaCode" : "PC04",
        "inspectionScope" : 128,
        "name" : "江銘豊"
      },
      "samplingPlanBaseCheckMarkCategory" : 4,
      "projectNameID" : 1,
      "samplingPlanBaseID" : 11,
      "inspectionItem" : [
        3
      ],
      "uploadFileCountList" : [
        {
          "id" : "0",
          "originalName" : "20240429003229_iOS_7C7FF85E-2",
          "sourceType" : 9
        },
        {
          "id" : "0",
          "originalName" : "20240429003229_iOS_3A4A71D1-7",
          "sourceType" : 9
        },
        {
          "id" : "0",
          "sourceType" : 9,
          "originalName" : "20240429003229_iOS_A87F6C6E-7"
        },
        {
          "id" : "0",
          "originalName" : "20240429003229_iOS_53CE87FE-A",
          "sourceType" : 9
        },
        {
          "id" : "0",
          "originalName" : "20240429003229_iOS_E3FBF6AA-0",
          "sourceType" : 9
        }
      ],
      "isDelete" : false,
      "inspectionLocation" : [
        {
          "mapLat" : "25.0951219",
          "mapLng" : "121.5246308",
          "officeAreaCode" : "AE15",
          "id" : 0,
          "isDelete" : false,
          "mapShape" : [
            {
              "lat" : "22.600944180899404",
              "lng" : "120.33929157380253"
            }
          ],
          "samplingRecordApplyID" : 0,
          "shapeArea" : "0.0",
          "address" : "100號",
          "type" : 1
        }
      ]
    },
    {
      "id" : 0,
      "state" : -1,
      "eSignatureCountList" : {
        "email" : "psyche8051@gmail.com",
        "miningUnitSignatures" : [
          {
            "isDelete" : false,
            "id" : 0,
            "miningUnitID" : 150,
            "eSignatureFile" : {
              "id" : "0",
              "sourceType" : 11
            }
          }
        ],
        "simpleSignatures" : [
          {
            "id" : "0",
            "sourceType" : 10
          },
          {
            "id" : "0",
            "sourceType" : 12
          }
        ],
        "contactPhone" : "0911000222"
      },
      "samplingDate" : "2024-04-29 00:00:00",
      "appGuid" : `${GenerateGUID()}`,
      "batchNumberID" : `${batchNumberID}`,
      "samplingRecordApplyCropForm" : {
        "shippingSaleUnit" : "保證責任雲林縣新安果菜生產合作社",
        "phone" : "0988160818",
        "sampleName" : "木瓜",
        "completeAddress" : "臺南市楠西區鹿田里鹿陶洋68-2號",
        "labelSerialNumber": `${GenerateLabel()}`,
        "bigCode" : "P99560",
        "levelType" : 0,
        "code" : "0501007530",
        "smallCode" : "2",
        "address" : "市場北路325號",
        "originPlace" : 2,
        "samplingPlanCropInspectionUnitID" : 212,
        "officeAreaCode" : "PC04",
        "inspectionScope" : 128,
        "name" : "江銘豊"
      },
      "samplingPlanBaseCheckMarkCategory" : 4,
      "projectNameID" : 1,
      "samplingPlanBaseID" : 11,
      "inspectionItem" : [
        3
      ],
      "uploadFileCountList" : [
        {
          "id" : "0",
          "originalName" : "20240429003229_iOS_7C7FF85E-2",
          "sourceType" : 9
        },
        {
          "id" : "0",
          "originalName" : "20240429003229_iOS_3A4A71D1-7",
          "sourceType" : 9
        },
        {
          "id" : "0",
          "sourceType" : 9,
          "originalName" : "20240429003229_iOS_A87F6C6E-7"
        },
        {
          "id" : "0",
          "originalName" : "20240429003229_iOS_53CE87FE-A",
          "sourceType" : 9
        },
        {
          "id" : "0",
          "originalName" : "20240429003229_iOS_E3FBF6AA-0",
          "sourceType" : 9
        }
      ],
      "isDelete" : false,
      "inspectionLocation" : [
        {
          "mapLat" : "25.0951219",
          "mapLng" : "121.5246308",
          "officeAreaCode" : "AE15",
          "id" : 0,
          "isDelete" : false,
          "mapShape" : [
            {
              "lat" : "22.600944180899404",
              "lng" : "120.33929157380253"
            }
          ],
          "samplingRecordApplyID" : 0,
          "shapeArea" : "0.0",
          "address" : "100號",
          "type" : 1
        }
      ]
    },
    {
      "id" : 0,
      "state" : -1,
      "eSignatureCountList" : {
        "email" : "psyche8051@gmail.com",
        "miningUnitSignatures" : [
          {
            "isDelete" : false,
            "id" : 0,
            "miningUnitID" : 150,
            "eSignatureFile" : {
              "id" : "0",
              "sourceType" : 11
            }
          }
        ],
        "simpleSignatures" : [
          {
            "id" : "0",
            "sourceType" : 10
          },
          {
            "id" : "0",
            "sourceType" : 12
          }
        ],
        "contactPhone" : "0911000222"
      },
      "samplingDate" : "2024-04-29 00:00:00",
      "appGuid" : `${GenerateGUID()}`,
      "batchNumberID" : `${batchNumberID}`,
      "samplingRecordApplyCropForm" : {
        "shippingSaleUnit" : "保證責任雲林縣新安果菜生產合作社",
        "phone" : "0988160818",
        "sampleName" : "木瓜",
        "completeAddress" : "臺南市楠西區鹿田里鹿陶洋68-2號",
        "labelSerialNumber": `${GenerateLabel()}`,
        "bigCode" : "P99560",
        "levelType" : 0,
        "code" : "0501007530",
        "smallCode" : "2",
        "address" : "市場北路325號",
        "originPlace" : 2,
        "samplingPlanCropInspectionUnitID" : 212,
        "officeAreaCode" : "PC04",
        "inspectionScope" : 128,
        "name" : "江銘豊"
      },
      "samplingPlanBaseCheckMarkCategory" : 4,
      "projectNameID" : 1,
      "samplingPlanBaseID" : 11,
      "inspectionItem" : [
        3
      ],
      "uploadFileCountList" : [
        {
          "id" : "0",
          "originalName" : "20240429003229_iOS_7C7FF85E-2",
          "sourceType" : 9
        },
        {
          "id" : "0",
          "originalName" : "20240429003229_iOS_3A4A71D1-7",
          "sourceType" : 9
        },
        {
          "id" : "0",
          "sourceType" : 9,
          "originalName" : "20240429003229_iOS_A87F6C6E-7"
        },
        {
          "id" : "0",
          "originalName" : "20240429003229_iOS_53CE87FE-A",
          "sourceType" : 9
        },
        {
          "id" : "0",
          "originalName" : "20240429003229_iOS_E3FBF6AA-0",
          "sourceType" : 9
        }
      ],
      "isDelete" : false,
      "inspectionLocation" : [
        {
          "mapLat" : "25.0951219",
          "mapLng" : "121.5246308",
          "officeAreaCode" : "AE15",
          "id" : 0,
          "isDelete" : false,
          "mapShape" : [
            {
              "lat" : "22.600944180899404",
              "lng" : "120.33929157380253"
            }
          ],
          "samplingRecordApplyID" : 0,
          "shapeArea" : "0.0",
          "address" : "100號",
          "type" : 1
        }
      ]
    },
    {
      "id" : 0,
      "state" : -1,
      "eSignatureCountList" : {
        "email" : "psyche8051@gmail.com",
        "miningUnitSignatures" : [
          {
            "isDelete" : false,
            "id" : 0,
            "miningUnitID" : 150,
            "eSignatureFile" : {
              "id" : "0",
              "sourceType" : 11
            }
          }
        ],
        "simpleSignatures" : [
          {
            "id" : "0",
            "sourceType" : 10
          },
          {
            "id" : "0",
            "sourceType" : 12
          }
        ],
        "contactPhone" : "0911000222"
      },
      "samplingDate" : "2024-04-29 00:00:00",
      "appGuid" : `${GenerateGUID()}`,
      "batchNumberID" : `${batchNumberID}`,
      "samplingRecordApplyCropForm" : {
        "shippingSaleUnit" : "保證責任雲林縣新安果菜生產合作社",
        "phone" : "0988160818",
        "sampleName" : "木瓜",
        "completeAddress" : "臺南市楠西區鹿田里鹿陶洋68-2號",
        "labelSerialNumber": `${GenerateLabel()}`,
        "bigCode" : "P99560",
        "levelType" : 0,
        "code" : "0501007530",
        "smallCode" : "2",
        "address" : "市場北路325號",
        "originPlace" : 2,
        "samplingPlanCropInspectionUnitID" : 212,
        "officeAreaCode" : "PC04",
        "inspectionScope" : 128,
        "name" : "江銘豊"
      },
      "samplingPlanBaseCheckMarkCategory" : 4,
      "projectNameID" : 1,
      "samplingPlanBaseID" : 11,
      "inspectionItem" : [
        3
      ],
      "uploadFileCountList" : [
        {
          "id" : "0",
          "originalName" : "20240429003229_iOS_7C7FF85E-2",
          "sourceType" : 9
        },
        {
          "id" : "0",
          "originalName" : "20240429003229_iOS_3A4A71D1-7",
          "sourceType" : 9
        },
        {
          "id" : "0",
          "sourceType" : 9,
          "originalName" : "20240429003229_iOS_A87F6C6E-7"
        },
        {
          "id" : "0",
          "originalName" : "20240429003229_iOS_53CE87FE-A",
          "sourceType" : 9
        },
        {
          "id" : "0",
          "originalName" : "20240429003229_iOS_E3FBF6AA-0",
          "sourceType" : 9
        }
      ],
      "isDelete" : false,
      "inspectionLocation" : [
        {
          "mapLat" : "25.0951219",
          "mapLng" : "121.5246308",
          "officeAreaCode" : "AE15",
          "id" : 0,
          "isDelete" : false,
          "mapShape" : [
            {
              "lat" : "22.600944180899404",
              "lng" : "120.33929157380253"
            }
          ],
          "samplingRecordApplyID" : 0,
          "shapeArea" : "0.0",
          "address" : "100號",
          "type" : 1
        }
      ]
    },
    {
      "id" : 0,
      "state" : -1,
      "eSignatureCountList" : {
        "email" : "psyche8051@gmail.com",
        "miningUnitSignatures" : [
          {
            "isDelete" : false,
            "id" : 0,
            "miningUnitID" : 150,
            "eSignatureFile" : {
              "id" : "0",
              "sourceType" : 11
            }
          }
        ],
        "simpleSignatures" : [
          {
            "id" : "0",
            "sourceType" : 10
          },
          {
            "id" : "0",
            "sourceType" : 12
          }
        ],
        "contactPhone" : "0911000222"
      },
      "samplingDate" : "2024-04-29 00:00:00",
      "appGuid" : `${GenerateGUID()}`,
      "batchNumberID" : `${batchNumberID}`,
      "samplingRecordApplyCropForm" : {
        "shippingSaleUnit" : "保證責任雲林縣新安果菜生產合作社",
        "phone" : "0900111222",
        "sampleName" : "test",
        "bigCode" : "P99560",
        "labelSerialNumber": `${GenerateLabel()}`,
        "levelType" : 0,
        "smallCode" : "3",
        "address" : "市場北路325號",
        "originPlace" : 1,
        "samplingPlanCropInspectionUnitID" : 212,
        "officeAreaCode" : "PC04",
        "inspectionScope" : 128,
        "name" : "tester"
      },
      "samplingPlanBaseCheckMarkCategory" : 6,
      "samplingPlanBaseID" : 11,
      "projectNameID" : 1,
      "inspectionItem" : [
        3
      ],
      "uploadFileCountList" : [
        {
          "id" : "0",
          "originalName" : "20240429003242_iOS_8F74DCEC-D",
          "sourceType" : 9
        },
        {
          "id" : "0",
          "sourceType" : 9,
          "originalName" : "20240429003242_iOS_AA8C2565-5"
        },
        {
          "id" : "0",
          "sourceType" : 9,
          "originalName" : "20240429003242_iOS_6CDB2529-A"
        },
        {
          "id" : "0",
          "sourceType" : 9,
          "originalName" : "20240429003242_iOS_DB3CFEE8-5"
        },
        {
          "id" : "0",
          "sourceType" : 9,
          "originalName" : "20240429003242_iOS_C464EDC8-6"
        }
      ],
      "isDelete" : false,
      "inspectionLocation" : [
        {
          "mapLat" : "25.0951219",
          "address" : "100號",
          "officeAreaCode" : "AE15",
          "id" : 0,
          "samplingRecordApplyID" : 0,
          "mapShape" : [
            {
              "lat" : "22.600944180899404",
              "lng" : "120.33929157380253"
            }
          ],
          "mapLng" : "121.5246308",
          "shapeArea" : "0.0",
          "isDelete" : false,
          "type" : 1
        }
      ]
    },
    {
      "id" : 0,
      "state" : -1,
      "eSignatureCountList" : {
        "email" : "psyche8051@gmail.com",
        "miningUnitSignatures" : [
          {
            "isDelete" : false,
            "id" : 0,
            "miningUnitID" : 150,
            "eSignatureFile" : {
              "id" : "0",
              "sourceType" : 11
            }
          }
        ],
        "simpleSignatures" : [
          {
            "id" : "0",
            "sourceType" : 10
          },
          {
            "id" : "0",
            "sourceType" : 12
          }
        ],
        "contactPhone" : "0911000222"
      },
      "samplingDate" : "2024-04-29 00:00:00",
      "appGuid" : `${GenerateGUID()}`,
      "batchNumberID" : `${batchNumberID}`,
      "samplingRecordApplyCropForm" : {
        "shippingSaleUnit" : "保證責任雲林縣新安果菜生產合作社",
        "phone" : "0900111222",
        "sampleName" : "test",
        "bigCode" : "P99560",
        "labelSerialNumber": `${GenerateLabel()}`,
        "levelType" : 0,
        "smallCode" : "3",
        "address" : "市場北路325號",
        "originPlace" : 1,
        "samplingPlanCropInspectionUnitID" : 212,
        "officeAreaCode" : "PC04",
        "inspectionScope" : 128,
        "name" : "tester"
      },
      "samplingPlanBaseCheckMarkCategory" : 6,
      "samplingPlanBaseID" : 11,
      "projectNameID" : 1,
      "inspectionItem" : [
        3
      ],
      "uploadFileCountList" : [
        {
          "id" : "0",
          "originalName" : "20240429003242_iOS_8F74DCEC-D",
          "sourceType" : 9
        },
        {
          "id" : "0",
          "sourceType" : 9,
          "originalName" : "20240429003242_iOS_AA8C2565-5"
        },
        {
          "id" : "0",
          "sourceType" : 9,
          "originalName" : "20240429003242_iOS_6CDB2529-A"
        },
        {
          "id" : "0",
          "sourceType" : 9,
          "originalName" : "20240429003242_iOS_DB3CFEE8-5"
        },
        {
          "id" : "0",
          "sourceType" : 9,
          "originalName" : "20240429003242_iOS_C464EDC8-6"
        }
      ],
      "isDelete" : false,
      "inspectionLocation" : [
        {
          "mapLat" : "25.0951219",
          "address" : "100號",
          "officeAreaCode" : "AE15",
          "id" : 0,
          "samplingRecordApplyID" : 0,
          "mapShape" : [
            {
              "lat" : "22.600944180899404",
              "lng" : "120.33929157380253"
            }
          ],
          "mapLng" : "121.5246308",
          "shapeArea" : "0.0",
          "isDelete" : false,
          "type" : 1
        }
      ]
    },
  {
      "id" : 0,
      "state" : -1,
      "eSignatureCountList" : {
        "email" : "psyche8051@gmail.com",
        "miningUnitSignatures" : [
          {
            "isDelete" : false,
            "id" : 0,
            "miningUnitID" : 150,
            "eSignatureFile" : {
              "id" : "0",
              "sourceType" : 11
            }
          }
        ],
        "simpleSignatures" : [
          {
            "id" : "0",
            "sourceType" : 10
          },
          {
            "id" : "0",
            "sourceType" : 12
          }
        ],
        "contactPhone" : "0911000222"
      },
      "samplingDate" : "2024-04-28 00:00:00",
      "appGuid" : `${GenerateGUID()}`,
      "batchNumberID" : `${batchNumberID}`,
      "samplingRecordApplyCropForm" : {
        "name" : "黑橋牌企業股份有限公司",
        "phone" : "06-2614186",
        "sampleName" : "蒜味香腸",
        "completeAddress" : "台南市安平工業區中華西路一段103號",
        "labelSerialNumber": `${GenerateLabel()}`,
        "bigCode" : "P99560",
        "levelType" : 0,
        "code" : "010706",
        "address" : "市場北路325號",
        "smallCode" : "1",
        "originPlace" : 2,
        "samplingPlanCropInspectionUnitID" : 212,
        "officeAreaCode" : "PC04",
        "inspectionScope" : 128,
        "shippingSaleUnit" : "保證責任雲林縣新安果菜生產合作社"
      },
      "samplingPlanBaseID" : 11,
      "samplingPlanBaseCheckMarkCategory" : 5,
      "isDelete" : false,
      "inspectionItem" : [
        3
      ],
      "uploadFileCountList" : [
        {
          "id" : "0",
          "originalName" : "20240429105639_iOS_3E5C4F57-8",
          "sourceType" : 9
        },
        {
          "id" : "0",
          "sourceType" : 9,
          "originalName" : "20240429105639_iOS_621D0324-A"
        },
        {
          "id" : "0",
          "originalName" : "20240429105639_iOS_B7FE70B8-8",
          "sourceType" : 9
        },
        {
          "id" : "0",
          "sourceType" : 9,
          "originalName" : "20240429105639_iOS_EDAB928C-0"
        },
        {
          "id" : "0",
          "sourceType" : 9,
          "originalName" : "20240429105645_iOS_F6BD2C93-D"
        }
      ],
      "projectNameID" : 1,
      "inspectionLocation" : [
        {
          "address" : "100號",
          "mapLat" : "25.0951219",
          "officeAreaCode" : "AE15",
          "id" : 0,
          "samplingRecordApplyID" : 0,
          "isDelete" : false,
          "mapShape" : [
            {
              "lat" : "22.600944180899404",
              "lng" : "120.33929157380253"
            }
          ],
          "shapeArea" : "0.0",
          "mapLng" : "121.5246308",
          "type" : 1
        }
      ]
    },
    {
      "id" : 0,
      "state" : -1,
      "eSignatureCountList" : {
        "email" : "psyche8051@gmail.com",
        "miningUnitSignatures" : [
          {
            "isDelete" : false,
            "id" : 0,
            "miningUnitID" : 150,
            "eSignatureFile" : {
              "id" : "0",
              "sourceType" : 11
            }
          }
        ],
        "simpleSignatures" : [
          {
            "id" : "0",
            "sourceType" : 10
          },
          {
            "id" : "0",
            "sourceType" : 12
          }
        ],
        "contactPhone" : "0911000222"
      },
      "samplingDate" : "2024-04-28 00:00:00",
      "appGuid" : `${GenerateGUID()}`,
      "batchNumberID" : `${batchNumberID}`,
      "samplingRecordApplyCropForm" : {
        "name" : "黑橋牌企業股份有限公司",
        "phone" : "06-2614186",
        "sampleName" : "蒜味香腸",
        "completeAddress" : "台南市安平工業區中華西路一段103號",
        "labelSerialNumber": `${GenerateLabel()}`,
        "bigCode" : "P99560",
        "levelType" : 0,
        "code" : "010706",
        "address" : "市場北路325號",
        "smallCode" : "1",
        "originPlace" : 2,
        "samplingPlanCropInspectionUnitID" : 212,
        "officeAreaCode" : "PC04",
        "inspectionScope" : 128,
        "shippingSaleUnit" : "保證責任雲林縣新安果菜生產合作社"
      },
      "samplingPlanBaseID" : 11,
      "samplingPlanBaseCheckMarkCategory" : 5,
      "isDelete" : false,
      "inspectionItem" : [
        3
      ],
      "uploadFileCountList" : [
        {
          "id" : "0",
          "originalName" : "20240429105639_iOS_3E5C4F57-8",
          "sourceType" : 9
        },
        {
          "id" : "0",
          "sourceType" : 9,
          "originalName" : "20240429105639_iOS_621D0324-A"
        },
        {
          "id" : "0",
          "originalName" : "20240429105639_iOS_B7FE70B8-8",
          "sourceType" : 9
        },
        {
          "id" : "0",
          "sourceType" : 9,
          "originalName" : "20240429105639_iOS_EDAB928C-0"
        },
        {
          "id" : "0",
          "sourceType" : 9,
          "originalName" : "20240429105645_iOS_F6BD2C93-D"
        }
      ],
      "projectNameID" : 1,
      "inspectionLocation" : [
        {
          "address" : "100號",
          "mapLat" : "25.0951219",
          "officeAreaCode" : "AE15",
          "id" : 0,
          "samplingRecordApplyID" : 0,
          "isDelete" : false,
          "mapShape" : [
            {
              "lat" : "22.600944180899404",
              "lng" : "120.33929157380253"
            }
          ],
          "shapeArea" : "0.0",
          "mapLng" : "121.5246308",
          "type" : 1
        }
      ]
    }
  ]
  return JSON.stringify(data)
}