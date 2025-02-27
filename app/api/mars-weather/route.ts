import { NextApiRequest, NextApiResponse } from "next"; // これをインポート

import axios from "axios";

async function getMarsWeatherData() {
  try {
    const marsWeatherUrl = "https://api.maas2.apis.prod.nasa.gov/weather"; // 実際のAPIエンドポイントに変更する必要あり
    const response = await axios.get(marsWeatherUrl);
    return response.data; // 取得したデータを返す
  } catch (error) {
    console.error("Error fetching Mars weather:", error);
    throw new Error("Failed to fetch Mars weather");
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // NextApiRequest と NextApiResponse を使う
  try {
    const weatherData = await getMarsWeatherData(); // getMarsWeatherDataを呼び出す
    res.status(200).json(weatherData); // 取得した天気データをレスポンスとして返す
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch Mars weather" });
  }
}
