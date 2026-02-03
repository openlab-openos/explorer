import axios from 'axios';

const solanaApiUrl = "https://serve-sds.faypay.com/api/openverse/transactions_by_signature";

export async function transactionRequest(requestBody) {
  if (!requestBody?.address) {
    throw new Error("address 不能为空");
  }

  try {
    const response = await axios.get(`${solanaApiUrl}/${requestBody.address}`, {
      headers: { "Content-Type": "application/json" }
    });
    return response.data;
  } catch (error) {
    console.error("获取交易记录失败：", error);
    throw error;
  }
}