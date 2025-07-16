import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Helper to get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 递归遍历数据结构，为应用对象添加 iconUrl 字段。
 * @param {object|array} data - 要处理的数据（对象或数组）。
 * @returns {object|array} - 处理后的数据结构。
 */
function addIconUrlsToData(data) {
  if (Array.isArray(data)) {
    // 检查是否是应用对象数组（至少包含 name 和 url）
    if (
      data.length > 0 &&
      typeof data[0] === "object" &&
      data[0] !== null &&
      "name" in data[0] &&
      "url" in data[0]
    ) {
      return data.map((app) => {
        // 确保是有效的应用对象结构
        if (typeof app === "object" && app !== null && "name" in app && "url" in app) {
          let iconUrl = null;
          try {
            // 解析 URL 并获取 origin (e.g., "https://www.example.com")
            const urlObject = new URL(app.url);
            const origin = urlObject.origin;
            iconUrl = `${origin}/favicon.ico`;
          } catch {
            // 如果 URL 无效，打印错误并设置 iconUrl 为 null
            console.error(`处理应用 "${app.name}" 时遇到无效 URL: ${app.url}`);
            iconUrl = null; // 或者可以设置一个默认的占位图标 URL
          }
          // 返回包含 iconUrl 的新应用对象
          return { ...app, iconUrl };
        }
        // 如果数组元素不是预期的应用对象结构，则原样返回
        return app;
      });
    } else {
      // 如果是其他类型的数组（例如嵌套数组），递归处理每个元素
      return data.map((item) => addIconUrlsToData(item));
    }
  } else if (typeof data === "object" && data !== null) {
    // 如果是对象，递归处理其属性值
    const newData = {};
    for (const [key, value] of Object.entries(data)) {
      newData[key] = addIconUrlsToData(value);
    }
    return newData;
  } else {
    // 如果是原始类型（字符串、数字等），直接返回
    return data;
  }
}

// --- 使用示例 ---
// 定义 JSON 文件的路径
const jsonFilePath = path.resolve(__dirname, "../data/applications.json");
// 定义输出新 JSON 文件的路径（可选，也可以覆盖原文件）
const outputFilePath = path.resolve(__dirname, "../data/applications_with_icons.json");

try {
  // 读取原始 JSON 文件内容
  const jsonData = fs.readFileSync(jsonFilePath, "utf-8");
  // 解析 JSON 数据
  const originalData = JSON.parse(jsonData);

  // 调用函数处理数据，添加 iconUrl
  const processedData = addIconUrlsToData(originalData);

  // 将处理后的数据转换回 JSON 字符串（格式化输出）
  const outputJsonData = JSON.stringify(processedData, null, 2); // 使用 2 个空格缩进

  // 将处理后的 JSON 数据写入新文件
  fs.writeFileSync(outputFilePath, outputJsonData, "utf-8");

  console.log(`处理完成！已为所有应用添加 iconUrl，结果已保存至: ${outputFilePath}`);

  // 如果你想覆盖原文件，可以使用下面的代码替换写入新文件的代码：
  // fs.writeFileSync(jsonFilePath, outputJsonData, 'utf-8');
  // console.log(`处理完成！已为所有应用添加 iconUrl，并覆盖了原文件: ${jsonFilePath}`);
} catch (error) {
  console.error("处理 JSON 文件时出错:", error);
}
