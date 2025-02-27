"use client";

import axios from "axios";
import { useState } from "react";
import Image from "next/image"; // Imageコンポーネントをインポート
import styles from "./global.module.css";

const nasaUrl = `https://images-api.nasa.gov/search?q=`; // NASA画像API
const marsPhotosUrl =
  "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos"; // 火星の写真API

interface NASAItem {
  data: { title: string }[];
  links: { href: string }[];
}

interface MarsPhoto {
  img_src: string;
  rover: { name: string };
  mosaic?: boolean; // モザイク画像がある場合
}

const Home = () => {
  const [searchItems, setSearchItems] = useState<NASAItem[]>([]);
  const [marsPhotos, setMarsPhotos] = useState<MarsPhoto[]>([]); // 火星の写真データを格納するstate
  const [isMarsPhotosVisible, setIsMarsPhotosVisible] = useState(false); // 火星の写真の表示状態
  const [isSpaceXVisible, setIsSpaceXVisible] = useState(false); // SpaceXの表示状態
  const [isHubbleVisible, setIsHubbleVisible] = useState(false); // ハッブル宇宙望遠鏡の表示状態
  const [isNebulaVisible, setIsNebulaVisible] = useState(false); // 星雲の表示状態

  // NASA画像の検索機能
  const handleSearch = async ({ query }: { query: string }) => {
    // 他の画像を表示していた場合、火星の写真を表示する前にクリア
    setMarsPhotos([]);

    try {
      const url = `${nasaUrl}${encodeURIComponent(query)}`;
      const response = await axios.get(url);
      const items = response.data?.collection?.items || [];
      const sliced = items.slice(0, 3);
      if (sliced) {
        setSearchItems(sliced);
      }
    } catch (error: unknown) {
      console.error("Error fetching NASA data:", error);
    }
  };

  // 火星の写真を取得
  const fetchMarsPhotos = async () => {
    setSearchItems([]);

    // すでに火星の写真が表示されている場合は非表示に
    if (isMarsPhotosVisible) {
      setMarsPhotos([]);
      setIsMarsPhotosVisible(false);
      return;
    }

    try {
      const apiKey = process.env.NEXT_PUBLIC_NASA_API_KEY;
      console.log("API Key:", apiKey);

      const sol = 3495; // 火星の日（sol）
      const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${sol}&api_key=${process.env.NEXT_PUBLIC_NASA_API_KEY}`;
      const response = await axios.get(url);
      let photos: MarsPhoto[] = response.data?.photos || [];

      photos = photos.filter(
        (value, index, self) =>
          index ===
          self.findIndex(
            (t) => t.img_src === value.img_src // img_srcで重複をチェック
          )
      );
      photos = photos.filter((photo) => !photo.mosaic);

      const validIndexes = [
        ...Array.from({ length: 29 }, (_, i) => i),
        ...Array.from({ length: 4 }, (_, i) => 42 + i),
        48,
        49,
        ...Array.from({ length: 4 }, (_, i) => 71 + i),
        88,
      ];

      const filteredPhotos = photos.filter((_, index) =>
        validIndexes.includes(index)
      );

      console.log("Filtered Mars Photos:", filteredPhotos);

      setMarsPhotos(filteredPhotos);
      setIsMarsPhotosVisible(true); // 火星の写真を表示
    } catch (error: unknown) {
      console.error("Error fetching Mars photos:", error);
    }
  };

  // SpaceXの写真を取得
  const fetchSpaceXPhotos = async () => {
    setSearchItems([]);

    // すでにSpaceXの画像が表示されている場合は非表示に
    if (isSpaceXVisible) {
      setIsSpaceXVisible(false);
      return;
    }

    handleSearch({ query: "falcon 9 launch" });
    setIsSpaceXVisible(true);
  };

  // ハッブル宇宙望遠鏡の画像を取得
  const fetchHubblePhotos = async () => {
    setSearchItems([]);

    // すでにハッブル宇宙望遠鏡の画像が表示されている場合は非表示に
    if (isHubbleVisible) {
      setIsHubbleVisible(false);
      return;
    }

    handleSearch({ query: "hubble galaxy" });
    setIsHubbleVisible(true);
  };

  // 星雲の画像を取得
  const fetchNebulaPhotos = async () => {
    setSearchItems([]);

    // すでに星雲の画像が表示されている場合は非表示に
    if (isNebulaVisible) {
      setIsNebulaVisible(false);
      return;
    }

    handleSearch({ query: "hubble nebula" });
    setIsNebulaVisible(true);
  };

  return (
    <div className={styles.Home}>
      <main>
        <h1>NASA API 🚀✨</h1>
        <div>
          <h2>
            <p>クリックするとNASA APIから取得したデータが表示されます。</p>
          </h2>
          <ul>
            <li>
              <button onClick={fetchHubblePhotos}>
                {isHubbleVisible
                  ? "ハッブル宇宙望遠鏡を閉じる"
                  : "ハッブル宇宙望遠鏡"}
              </button>
            </li>
            <li>
              <button onClick={fetchNebulaPhotos}>
                {isNebulaVisible ? "星雲を閉じる" : "星雲"}
              </button>
            </li>
            <li>
              <button onClick={fetchSpaceXPhotos}>
                {isSpaceXVisible ? "SpaceXの写真を閉じる" : "SpaceX"}
              </button>
            </li>
          </ul>
        </div>

        <div>
          <button onClick={fetchMarsPhotos}>
            {isMarsPhotosVisible ? "火星の写真を閉じる" : "火星の写真を取得"}
          </button>

          {isMarsPhotosVisible && (
            <ul>
              {marsPhotos.length > 0 &&
                marsPhotos.map((photo, index) => (
                  <li key={index}>
                    <Image
                      src={photo.img_src}
                      alt={`Mars Photo ${index}`}
                      width={800}
                      height={600}
                    />
                    <p>{`Taken by rover: ${photo.rover.name}`}</p>
                  </li>
                ))}
            </ul>
          )}
        </div>

        <div>
          <ul>
            {searchItems.length > 0 &&
              searchItems.map((item, index) => (
                <li key={index}>
                  <p>{item.data[0].title}</p>
                  <div>
                    <Image
                      src={item.links[0].href}
                      alt={item.data[0].title || "NASA image"}
                      width={800}
                      height={600}
                    />
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Home;
