/**
 * 已切换为云端 API 模式，本地服务暂时停用
 */
export const localAIService = {
  isSupported: () => false,
  generate: async () => {
    throw new Error("请使用云端生成模式");
  }
};
