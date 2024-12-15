export const methodAnalysisTemplate = `
分析此 API 的 HTTP 方法使用，請嚴格按照以下格式回答：
規則：
1. 請只要分析這個 HTTP 方法的使用是不是符合 description 與 RESTful 原則就好，不需要分析其他細節(path、query、body等)
2. 若符合規範，請直接回答「符合規範」，不需要詳細說明
3. 若有問題，才需要列出具體問題點

方法：{method}
路徑：{path}
描述：{description}

• 問題：
[若有問題才列出，否則回答「符合規範」]

• 建議：
[若有問題才提供建議，否則不需回答]
`;
