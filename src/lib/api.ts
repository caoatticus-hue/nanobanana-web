/**
 * 纯云端免费 AI 生成逻辑
 * 使用 Hugging Face Inference API
 * 提示：正式部署时建议将 TOKEN 放入环境变量以保安全
 */

// 请在此处替换为你从 Hugging Face 申请的免费 Token
const HF_TOKEN = "hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"; 

export const generateImage = async (prompt: string) => {
  // 使用当前开源界最强的 SDXL 模型
  const model = "stabilityai/stable-diffusion-xl-base-1.0";

  const response = await fetch(
    `https://api-inference.huggingface.co/models/${model}`,
    {
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ inputs: prompt }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "API 请求失败，请检查 Token 或网络");
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob); 
};
