export function json2file(jsonData, fileName = '') {
  const jsonString = JSON.stringify(jsonData)

  // 创建Blob对象
  const blob = new Blob([jsonString], { type: 'application/json' })

  // 创建File对象，假设文件名为"example.json"
  // const file = new File([blob], Date.now() + ".json");
  if (!fileName.endsWith('.json')) {
    fileName = !fileName ? `${Date.now()}.json` : `${fileName}.json`
  }
  const file = new File([blob], fileName)
  return file
}