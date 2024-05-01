import module_login from "./src/trend/module_login.js";

export {options} from "./src/config";
//export { handleSummary } from './src/utils'

import TrendCollection from "./src/trend";

let parameter = {
    // 自行更換
    baseUrl: `https://miis.acri.gov.tw/api`,
    shouldRunBackend: true,
    cookieObj: {},
    options : {},
    token:""
};

// once
export function setup() {
    let runTrendKeys = Object.keys(TrendCollection);
    if (!parameter.shouldRunBackend) {
        runTrendKeys = runTrendKeys.filter(x => x.indexOf("backend") < 0).sort();
    } else {
        parameter.token = module_login.run(parameter);
    }

    return { runTrendKeyArray: runTrendKeys, globalOption: parameter };
}

export default function (data) {
    data.runTrendKeyArray.forEach(key => {
        TrendCollection[key].run(data.globalOption);
    });
}

export function teardown(runTrendKeyArray) {
    // logout
}
