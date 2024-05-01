import http from "k6/http";
import {check, fail} from "k6";
import {Trend} from 'k6/metrics';

const testUrl = `SWSamplingData/ModifyFriendlySamplingData`;
const uploadFileUrl = `SWUploadFile/UploadFile`;
const trendName = testUrl.replaceAll("/", "_").toLowerCase();
const trend = new Trend(`POST_${trendName}`, true);
let photoFile = open("../document/photo_2.jpg");
let signFile = open("../document/sign_2.jpg");

/**
 * 執行測試
 * @param {object} parameter
 */
function run(parameter) {
    console.log("新增有機採樣單 開始")

    let data = [
      {
        "state" : -1,
        "id" : 0,
        "eSignatureCountList" : {
          "email" : "psyche8051@linkchain.tw",
          "miningUnitSignatures" : [
            {
              "isDelete" : false,
              "id" : 0,
              "miningUnitID" : 3,
              "miningOfficeID" : 10,
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
              "sourceType" : 13
            },
            {
              "id" : "0",
              "sourceType" : 12
            }
          ],
          "contactPhone" : "0911000222"
        },
        "samplingDate" : "2024-04-29 00:11:21",
        "samplingRecordApplyAgriItemMonitoring" : {
          "labelSerialNumber" : `${LabelSerialNumber()}`,
          "sampleName" : "番石榴",
          "operatorCategory" : 1,
          "name" : "黃大栢(大立草生農場)",
          "address" : "彰化縣埔心鄉芎蕉村員鹿路五段246巷96號"
        },
        "appGuid" : `${GenerateGUID()}`,
        "samplingPlanBaseCheckMarkCategory" : 3,
        "isDelete" : false,
        "samplingPlanBaseID" : 14,
        "inspectionItem" : [
          3
        ],
        "uploadFileCountList" : [
          {
            "id" : "0",
            "sourceType" : 9,
            "originalName" : "1"
          },
          {
            "id" : "0",
            "sourceType" : 9,
            "originalName" : "2"
          },
          {
            "id" : "0",
            "sourceType" : 9,
            "originalName" : "3"
          },
          {
            "id" : "0",
            "sourceType" : 9,
            "originalName" : "4"
          },
          {
            "id" : "0",
            "sourceType" : 9,
            "originalName" : "5"
          }
        ],
        "projectNameID" : 4,
        "samplingRecordApplyInspectionRecord" : {
          "isOtherThingRecordTimeCheck" : true,
          "otherRecordPersonName" : "test",
          "phone" : "0963104021",
          "otherRecordGroupName" : "test",
          "count" : 1,
          "otherThingRecordSecondTimeText" : "00:11",
          "numberOfSamples" : 1,
          "isAlreadyPropaganda" : true,
          "isOtherThingRecordSecondTimeCheck" : true,
          "address" : "彰化縣埔心鄉芎蕉村員鹿路五段246巷96號",
          "friendlyNumber" : "22-ZX-1203-01",
          "locationAddress" : "100號",
          "inspectionDate" : "2024-04-29 00:10:34",
          "locationOfficeAreaCode" : "AE15",
          "groupName" : "彰化縣環保酵素友善農耕協會",
          "name" : "黃大栢(大立草生農場)",
          "otherThingRecordTimeText" : "00:11"
        },
        "inspectionLocation" : [
          {
            "mapLat" : "22.60086292936261",
            "mapLng" : "120.3392331364234",
            "id" : 0,
            "samplingRecordApplyID" : 0,
            "isDelete" : false,
            "mapShape" : [
              {
                "lng" : "120.33929157380253",
                "lat" : "22.600944180899404"
              },
              {
                "lng" : "120.33937476575375",
                "lat" : "22.600859950092907"
              },
              {
                "lat" : "22.60075347227799",
                "lng" : "120.33928088843822"
              },
              {
                "lng" : "120.33913873136042",
                "lat" : "22.600795568168152"
              },
              {
                "lng" : "120.33907972276211",
                "lat" : "22.600961475374596"
              }
            ],
            "externalLandText" : "彰化縣埔心鄉霖鳳段0236-0000",
            "shapeArea" : "447.7630790949547",
            "type" : 3
          }
        ]
      }
    ]
  

    var res = http.post(`${parameter.baseUrl}/${testUrl}`, JSON.stringify(data), parameter.options);

    const checkResult = check(res, {
        "url is correct": (r) => r.url.indexOf(testUrl) >= 0,
    });
    
    if (!checkResult) {
        console.log("新增有機採樣單 失敗");
        fail(`unexpected response`);
    } else {
        trend.add(res.timings.duration);
    }

    let options = {
        headers: {
            "Authorization": `Bearer ${parameter.jwtToken}`
        }
    };

    for (var photo in Array.from(res.json.data[0].uploadFileIDs)) {
        let data = {
            uploadFile: http.file(photoFile,'photo_2.jpg')
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

    for (var sign in Array.from(res.json.data[0].eSignatureIDs)) {
        let data = {
            uploadFile: http.file(signFile,'sign_2.jpg')
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

function GenerateGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function LabelSerialNumber() {
  return 'xxxxxxxx-xxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
}

export default {
    trend
    , run
}
