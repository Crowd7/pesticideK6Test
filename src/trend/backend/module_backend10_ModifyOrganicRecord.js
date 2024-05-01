import http from "k6/http";
import {check, fail} from "k6";
import {Trend} from 'k6/metrics';
import {sleep} from 'k6';
const testUrl = `SWSamplingData/ModifyOrganicSamplingData`;
const trendName = testUrl.replaceAll("/", "_").toLowerCase();
const trend = new Trend(`POST_${trendName}`, true);
let photoFile = open("../document/photo_1.jpg");
let signFile = open("../document/sign_1.jpg");

/**
 * 執行測試
 * @param {object} parameter
 */
function run(parameter) {
    console.log("新增有機採樣單 開始");

    var res = http.post(`${parameter.baseUrl}/${testUrl}`, BodyData(), parameter.options);

    const checkResult = check(res, {
      "status code is 200": (r) => r.status === 200 ,
      "url status is 1": (r) => r.json().status === 1
    });

    
    if (!checkResult) {
        console.log("新增有機採樣單 失敗");
        console.log(res.json())
        fail(`unexpected response`);
    } else {
        trend.add(res.timings.duration);
    }

    console.log("上傳檔案 開始");

    const uploadFileUrl = `SWUploadFile/UploadFile`;

    let options = {
        headers: {
            "Authorization": `Bearer ${parameter.jwtToken}`
        }
    };

    for (var photo in res.json.data[0].uploadFileIDs) {
        let data = {
            uploadFile: http.file(photoFile,'photo_1.jpg')
        }

        const res = http.post(`${parameter.baseUrl}/${uploadFileUrl}?fileId=${photo.uploadFileId}` ,data ,options);

        const checkResult = check(res, {
          "status code is 200": (r) => r.status === 200 ,
          "url status is 1": (r) => response.json().status === 1
        });

        if (!checkResult) {
            console.log(photo.uploadFileId);
            console.log("上傳檔案失敗");
        } else {
            trend.add(res.timings.duration);
        }
    }

    for (var sign in res.json.data[0].eSignatureIDs) {
        let data = {
            uploadFile: http.file(signFile,'sign_1.jpg')
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

function BodyData() {
  let data = [
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
      "contactPhone" : "0932891305"
    },
    "samplingRecordApplyOrganicInspectionRecord" : {
      "propagandaMatterRecord" : 67,
      "otherThingRecordOtherText" : "other",
      "isOtherThingRecordTimeCheck" : true,
      "receiptNumber" : "28143514",
      "propagandaMatterRecordOtherText" : "other",
      "importRegistrationNumber" : "X123456789",
      "otherThingRecordTimeText" : "23:23",
      "isIssueSamplingReceipt" : true,
      "farmType" : 1,
      "saleChannelSituation" : 9,
      "verificationCertNumber" : "1-019-100007",
      "verificationAgencyName" : "全民儲碳股份有限公司",
      "quantityInspectionCount" : 1,
      "name" : "陳用格",
      "isOtherThingRecordOtherCheck" : true,
      "saleChannelSituationOtherText" : "other",
      "addressType" : 1,
      "isApprovalDocument" : true,
      "phone" : "0919909769",
      "samplingProductCount" : 1,
      "contactPerson" : "Linkchain-Test01",
      "isSamplingProduct" : true,
      "mailingAddress" : "花蓮縣瑞穗鄉富源村保安路95號",
      "residenceAddress" : "花蓮縣瑞穗鄉富源村保安路95號",
      "markInspectionCount" : 1
    },
    "samplingDate" : "2024-04-28 23:21:21",
    "samplingRecordApplyOrganicSupplyFlowMainList" : [
      {
        "quantity" : "1.0",
        "id" : 0,
        "supplier" : "Linkchain",
        "productionHarvestDate" : "2024-03-27 23:30:00",
        "uploadFileList" : [

        ],
        "appGuid" : `${GenerateGUID()}`,
        "certifiedDoc" : 1,
        "quantityUnit" : 1,
        "isDelete" : false,
        "purchaseDate" : "2024-03-30 23:30:00",
        "inventoryQuantity" : "1.0",
        "remark" : "Remark",
        "certifiedDocNumber" : "1234567890",
        "inventoryQuantityUnit" : 1,
        "grade" : 1,
        "supplyFlowShipmentList" : [
          {
            "appGuid" : `${GenerateGUID()}`,
            "quantity" : 1,
            "id" : 0,
            "isDelete" : false,
            "date" : "2024-04-28 23:31:00",
            "lotNumber" : "1234567890",
            "quantityUnit" : 1,
            "docNumber" : "1234567890",
            "rawMaterialList" : [
              {
                "appGuid" : `${GenerateGUID()}`,
                "remark" : "測試",
                "supplier" : "linkchain",
                "id" : 0,
                "isDelete" : false,
                "grade" : 1,
                "inventoryQuantity" : 1,
                "certifiedDocNumber" : "1234567890",
                "harvestOutList" : [
                  {
                    "appGuid" : `${GenerateGUID()}`,
                    "harvestQuantity" : 1,
                    "id" : 0,
                    "outDocNumber" : "1234567890",
                    "isDelete" : false,
                    "harvestDocNumber" : "1234567890",
                    "outDate" : "2024-03-29 23:32:00",
                    "outQuantity" : 1,
                    "harvestDate" : "2024-03-28 23:32:00"
                  }
                ],
                "certifiedDoc" : 1,
                "name" : "test"
              }
            ]
          }
        ],
        "documentNumber" : "1234567890"
      }
    ],
    "appGuid" : `${GenerateGUID()}`,
    "samplingRecordApplyOrganicSpotCheckRecordForm" : {
      "packageUnitOtherText" : "公克",
      "rawMaterialHasVerified" : true,
      "rawMaterialNameList" : [
        {
          "id" : 0,
          "text" : "1"
        },
        {
          "id" : 0,
          "text" : "2"
        }
      ],
      "productInfoTotalCount" : 1,
      "productNumber" : "Linkchain-001",
      "inventoryUnitOtherText" : "公克",
      "productName" : "Linkchain_test",
      "inventoryUnit" : 3,
      "resultList" : [
        {
          "id" : 0,
          "type" : 5
        },
        {
          "id" : 0,
          "type" : 4
        },
        {
          "id" : 0,
          "type" : 6,
          "text" : "other"
        },
        {
          "id" : 0,
          "text" : "other",
          "type" : 3
        }
      ],
      "importCopyDocumentList" : [
        {
          "id" : 0,
          "type" : 3
        },
        {
          "id" : 0,
          "text" : "other",
          "type" : 4
        }
      ],
      "packageUnit" : 3,
      "productInfoCount" : 1,
      "inventory" : 1,
      "copyDocumentList" : [
        {
          "id" : 0,
          "type" : 7,
          "text" : "other"
        }
      ],
      "productInfoFamilyTimes" : 1
    },
    "samplingPlanBaseCheckMarkCategory" : 2,
    "projectNameID" : 3,
    "isDelete" : false,
    "inspectionItem" : [
      2,
      3,
      4
    ],
    "uploadFileCountList" : [
      {
        "serialNumber" : "1234567890",
        "id" : "0",
        "batchNumber" : "1234567890",
        "manufactureDate" : "2024-04-28 23:33:00",
        "sourceType" : 9,
        "effectiveDate" : "2024-04-28 23:33:00",
        "originalName" : "test01"
      },
      {
        "serialNumber" : "1234567890",
        "id" : "0",
        "batchNumber" : "1234567890",
        "manufactureDate" : "2024-01-01 23:33:00",
        "sourceType" : 9,
        "effectiveDate" : "2024-01-31 23:33:00",
        "originalName" : "test02"
      },
      {
        "serialNumber" : "1234567890",
        "id" : "0",
        "batchNumber" : "1234567890",
        "manufactureDate" : "2024-01-01 23:34:00",
        "sourceType" : 9,
        "originalName" : "test03",
        "effectiveDate" : "2024-04-30 23:34:00"
      },
      {
        "serialNumber" : "1234567890",
        "id" : "0",
        "batchNumber" : "1234567890",
        "manufactureDate" : "2023-04-01 23:34:00",
        "sourceType" : 9,
        "effectiveDate" : "2023-12-01 23:34:00",
        "originalName" : "test04"
      },
      {
        "serialNumber" : "1234567890",
        "id" : "0",
        "manufactureDate" : "2023-06-01 23:35:00",
        "batchNumber" : "1234567890",
        "sourceType" : 9,
        "effectiveDate" : "2023-11-01 23:35:00",
        "originalName" : "test05"
      }
    ],
    "samplingRecordApplyOrganicSamplingRecordForm" : {
      "place" : 1,
      "levelType" : 2,
      "originPlace" : 2,
      "labelSerialNumber" : `${LabelSerialNumber()}`,
      "farmType" : 1,
      "locationDisplay" : 1,
      "documentList" : [
        {
          "id" : 0,
          "type" : 1
        },
        {
          "id" : 0,
          "text" : "Taiwan",
          "type" : 16
        }
      ],
      "numberOfSample" : 1,
      "numberOfInspected" : 1,
      "originPlaceTwoSecondOption" : 1,
      "verificationAgencyName" : "全民儲碳股份有限公司",
      "productCategory" : 1,
      "name" : "陳用格",
      "verificationCertNumber" : "1-019-100007",
      "hasMaterialName" : true,
      "nationBadgeList" : [
        {
          "id" : 0,
          "type" : 1
        },
        {
          "id" : 0,
          "type" : 2
        },
        {
          "id" : 0,
          "type" : 3
        }
      ],
      "productNumber" : "1234567890",
      "isInternetSaleProduct" : true,
      "phone" : "0919909769",
      "originPlaceTwoSecondOptionCountry" : 4,
      "inspectionUnitIDList" : [
        1
      ],
      "internetSaleProductOtherRemark" : "test",
      "area" : 100,
      "samplingWeight" : 1,
      "productName" : "半結球萵苣",
      "address" : "花蓮縣瑞穗鄉富源村保安路95號"
    },
    "samplingPlanBaseID" : 13,
    "samplingRecordApplyOrganicCommonMatter" : {
      "operatorCategory" : 1
    },
    "inspectionLocation" : [
      {
        "mapLng" : "121.5246308",
        "mapLat" : "25.0951219",
        "officeAreaCode" : "AE15",
        "address" : "100號",
        "isDelete" : false,
        "mapShape" : [
          {
            "lat" : "22.600944180899404",
            "lng" : "120.33929157380253"
          }
        ],
        "samplingRecordApplyID" : 0,
        "shapeArea" : "0.0",
        "id" : 0,
        "type" : 1
      }
    ]
    }
  ]

  return JSON.stringify(data);
}

export default {
    trend
    , run
}
