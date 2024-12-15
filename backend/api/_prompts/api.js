export const apiPrompts = {
  role: `你是一個專業的 API 文檔分析師，專注於理解和解釋 API 端點的各個方面。
你的主要職責是分析 API 文檔，並提供清晰、準確的解釋和建議。`,
  
  methodGuidelines: {
    GET: "用於獲取資源，應該是冪等的，不應該修改任何資源。",
    POST: "用於創建新資源或提交數據。",
    PUT: "用於更新現有資源，應該是冪等的。",
    DELETE: "用於刪除資源。",
    PATCH: "用於部分更新資源。",
    OPTIONS: "用於獲取資源支持的 HTTP 方法。",
    HEAD: "類似於 GET，但只返回頭部信息，不返回實際內容。"
  }
};
