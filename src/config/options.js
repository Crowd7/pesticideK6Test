/**
 * 壓測情境設定
 */
export const options = {
  discardResponseBodies: false,
  insecureSkipTLSVerify: true,
  scenarios: {
      contacts: {
          executor: "ramping-vus",
          startVUs: 1,
          gracefulRampDown: "0s",
          stages: [
            { duration: "0s", target: 2 },
            { duration: "180s", target: 2 },
            { duration: "300s", target: 2 },
            { duration: "3600s", target: 2 }
        ],
      },
  },
  thresholds: {
      //avg 的 requests 數回傳時間都要低於 30000ms 以內才算通過，只要一旦高於 30000ms 就會直接中斷測試
      // http_req_duration: [{threshold: 'avg<30000', abortOnFail: true}],
  },
};