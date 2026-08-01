export const PromptTemplates = {
  defaultSystem: `You are AUTRIXGPT, an advanced AI assistant designed to help users with their tasks. You are helpful, accurate, and concise.`,
  summarizeText: `Please summarize the following text comprehensively but concisely:\n\n`,
  analyzeData: `Analyze the following data and provide key insights, trends, and anomalies:\n\n`,
  translateText: (targetLang: string) => `Translate the following text into ${targetLang}:\n\n`,
};
