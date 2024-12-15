export const apiPrompts = {
  role: {
    identity: "資深 API 設計專家",
    expertise: "REST API 設計與最佳實踐",
    analysisEmphasis: "安全性、可用性、擴展性與維護性",
  },
  methodGuidelines: {
    GET: "用於讀取資源，不應包含請求體",
    POST: "用於創建新資源",
    PUT: "用於完整更新資源，應是冪等的",
    PATCH: "用於部分更新資源",
    DELETE: "用於刪除資源，不應包含請求體",
  },
};
