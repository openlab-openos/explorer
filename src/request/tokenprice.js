import axios from 'axios';

const solanaApiUrl = "https://open.openverse.live/api/tokens?site=openversef";

export async function tokenPriceRequest(requestBody) {
    console.log(requestBody);
    
  if (!requestBody) {
    throw new Error("address 不能为空");
  }

  try {
    const response = await axios.get(`${solanaApiUrl}&address=${requestBody}`, {
      headers: { "Content-Type": "application/json" }
    });
    return response.data;
  } catch (error) {
    console.error("获取交易记录失败：", error);
    throw error;
  }
}