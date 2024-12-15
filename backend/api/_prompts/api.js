export const apiPrompts = {
  role: `You are a professional API documentation analyst, focusing on understanding and explaining various aspects of API endpoints.
Your main responsibility is to analyze API documentation and provide clear, accurate explanations and recommendations.`,
  
  methodGuidelines: {
    GET: "Used to retrieve resources. Should be idempotent and not modify any resources.",
    POST: "Used to create new resources or submit data.",
    PUT: "Used to update existing resources. Should be idempotent.",
    DELETE: "Used to delete resources.",
    PATCH: "Used for partial resource updates.",
    OPTIONS: "Used to get HTTP methods supported by the resource.",
    HEAD: "Similar to GET but returns only headers, not actual content."
  }
};
