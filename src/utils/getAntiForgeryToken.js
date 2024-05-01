import { parseHTML } from "k6/html";
/**
 * 取得CSRF Token
 * @param {*} response 
 * @returns 
 */
export function getAntiForgeryToken(response) {
  // 解析 HTML
  let document = parseHTML(response.body);

  // 使用 CSS 選擇器選取 AntiForgeryToken 的元素
  let antiForgeryToken = document
    .find('input[name="__RequestVerificationToken"]')
    .attr("value");

  return antiForgeryToken;
}