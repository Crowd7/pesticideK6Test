import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.3/index.js";
import dayjs from 'dayjs'
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc)
dayjs.extend(timezone)
/**
 * 處理報告
 * @param {*} data
 * @returns
 */
export function handleSummary(data) {      
    console.log(dayjs.utc().local().format())
    const now = dayjs.utc().local()
    const nowDateStr = now.format('YYYY/MM/DD')
    const nowDateTimeStr = now.format('YYYY/MM/DD HH:mm:ss')
    const reportPath = `report/${now.format('YYYYMMDD')}`
    
    return {
        [`${reportPath}.html`]: htmlReport(data, { title: `${nowDateTimeStr}` }), // 產生 HTML 報告
        [`${reportPath}.json`]: JSON.stringify(data), // 產生 HTML 報告    
        stdout: textSummary(data, { indent: " ", enableColors: true }), // 產生 Console 報告
    };
}