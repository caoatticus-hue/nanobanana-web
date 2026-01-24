/**
 * 纯云端免费 AI 生成逻辑 - Hugging Face 版
 * 适用场景：个人频繁使用（免费额度内非常充足）
 */

// 1. 请在此处填入你的 Hugging Face Token (https://huggingface.co/settings/tokens)
const HF_TOKEN = "hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"; 

export const generateImage = async (prompt: string) => {
  // 使用质量极高的 FLUX.1 或 SDXL 模型
  const model = "black-forest-labs/FLUX.1-dev"; 

  const response = await fetch(
    `https://api-inference.huggingface.co/models/${model}`,
    {
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ 
        inputs: prompt,
        parameters: {
            guidance_scale: 3.5,
            num_inference_steps: 28
        }
      }),
    }
  );

  // 如果模型正在加载，Hugging Face 会返回 503，这里需要处理一下
  if (response.status === 503) {
    throw new Error("AI 模型正在后台启动，请 30 秒后重试。");
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "生成失败，请检查网络或 Token");
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob); 
};
