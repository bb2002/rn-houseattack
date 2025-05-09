import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Dimensions,
  SafeAreaView,
} from "react-native";
import axios from "axios";
import * as turf from "@turf/turf";
import wellknown from "wellknown";

const { width, height } = Dimensions.get("window");

interface Message {
  text: string;
  fontSize: number;
  xPos: number;
  color: string;
  fontWeight: "normal" | "bold" | "500" | "600" | "700";
}

const OPENAI_KEY = "MY_ACCESS_TOKEN";

export default function App() {
  const { fullAddress, gilAddress } = useLocalSearchParams();
  const router = useRouter();

  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });
  const [elevation, setElevation] = useState<number>(NaN);
  const [flooding, setFlooding] = useState<string[]>([]);
  const [cctvCount, setCCTVCounts] = useState<number>(NaN);
  const [roomCount, setRoomCount] = useState<number>(NaN);
  const [shelters, setShelters] = useState<string[]>([]);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [complete, setComplete] = useState(false);

  const gotoSearch = () => {
    router.replace("/search");
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get<any>(
          "https://api.vworld.kr/req/address",
          {
            params: {
              service: "address",
              request: "getcoord",
              version: "2.0",
              crs: "epsg:4326",
              address: fullAddress,
              refine: "true",
              simple: "false",
              format: "json",
              type: "road",
              key: "",
            },
          }
        );

        if (data.response.refined.structure.level1 !== "서울특별시") {
          alert("이 서비스는 서울만 지원합니다.");
          gotoSearch();
          return;
        }

        setPosition({
          latitude: Number(data.response.result.point.y),
          longitude: Number(data.response.result.point.x),
        });
      } catch (err) {
        alert("좌표 변환에 실패했습니다.");
        gotoSearch();
      }
    };

    fetch();
  }, [fullAddress]);

  // 데이터 조회 → 점수 산출
  useEffect(() => {
    if (position.latitude === 0 && position.longitude === 0) return;

    const loadAndFindPogo = async () => {
      try {
        const res = await fetch(
          "https://kr.object.ncloudstorage.com/houseattack-assets/seoul_pogo.csv"
        );
        const text = await res.text();
        const rows = text.trim().split("\n").slice(1);
        let minDist = Infinity;
        let nearestNUME: string | null = null;
        for (const row of rows) {
          const [xStr, yStr, , , nume] = row.split(",");
          const x = parseFloat(xStr),
            y = parseFloat(yStr);
          const d =
            (position.longitude - x) ** 2 + (position.latitude - y) ** 2;
          if (d < minDist) {
            minDist = d;
            nearestNUME = nume;
          }
        }
        setElevation(Number(nearestNUME));
      } catch {
        alert("지대 파악에 실패했습니다.");
        gotoSearch();
      }
    };

    const checkFloodHistory = async () => {
      try {
        const res = await fetch(
          "https://kr.object.ncloudstorage.com/houseattack-assets/seoul_flooding.csv"
        );
        const text = await res.text();
        const rows = text.trim().split("\n");
        const headers = rows[0].split(",");
        const wktIdx = headers.indexOf("WKT");
        const reasonIdx = headers.indexOf("F_DISA_NM");
        const pt = turf.point([position.longitude, position.latitude]);
        const reasons = new Set<string>();

        for (let i = 1; i < rows.length; i++) {
          const cols = rows[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
          let wkt = cols[wktIdx].replace(/^"+|"+$/g, "");
          const geom: any = wellknown.parse(wkt);
          if (!geom || !geom.type || !geom.coordinates) continue;

          const polys =
            geom.type === "Polygon"
              ? [geom.coordinates]
              : geom.type === "MultiPolygon"
              ? geom.coordinates
              : [];
          for (const coords of polys) {
            if (coords.every((ring: any) => ring.length >= 4)) {
              const turfPoly = turf.polygon(coords);
              if (turf.booleanPointInPolygon(pt, turfPoly)) {
                reasons.add(cols[reasonIdx]);
              }
            }
          }
        }

        setFlooding([...reasons]);
      } catch {
        alert("침수여부 확인에 실패했습니다.");
        gotoSearch();
      }
    };

    const countCCTV = async () => {
      try {
        const res = await fetch(
          "https://kr.object.ncloudstorage.com/houseattack-assets/seoul_cctv.csv"
        );
        const text = await res.text();
        const rows = text.trim().split("\n").slice(1);
        const pt = turf.point([position.longitude, position.latitude]);
        let total = 0;
        for (const row of rows) {
          const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
          const lat = parseFloat(cols[4]),
            lon = parseFloat(cols[5]);
          const qty = parseInt(cols[6]) || 0;
          if (
            !isNaN(lat) &&
            !isNaN(lon) &&
            turf.distance(pt, turf.point([lon, lat]), { units: "meters" }) <=
              300
          ) {
            total += qty;
          }
        }
        setCCTVCounts(total);
      } catch {
        alert("CCTV 확인에 실패했습니다.");
        gotoSearch();
      }
    };

    const countNearbyRooms = async () => {
      try {
        const res = await fetch(
          "https://kr.object.ncloudstorage.com/houseattack-assets/seoul_roomsalon.csv"
        );
        const text = await res.text();
        const rows = text.trim().split("\n").slice(1);
        const pt = turf.point([position.longitude, position.latitude]);
        let cnt = 0;
        for (const row of rows) {
          const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
          const lon = parseFloat(cols[cols.length - 2]),
            lat = parseFloat(cols[cols.length - 1]);
          if (
            !isNaN(lat) &&
            !isNaN(lon) &&
            turf.distance(pt, turf.point([lon, lat]), {
              units: "meters",
            }) <= 500
          ) {
            cnt++;
          }
        }
        setRoomCount(cnt);
      } catch {
        alert("유흥업소 확인에 실패했습니다.");
        gotoSearch();
      }
    };

    const findNearbyShelterNames = async () => {
      try {
        const res = await fetch(
          "https://kr.object.ncloudstorage.com/houseattack-assets/seoul_exitlist.csv"
        );
        const text = await res.text();
        const rows = text.trim().split("\n").slice(1);
        const pt = turf.point([position.longitude, position.latitude]);
        const names: string[] = [];
        for (const row of rows) {
          const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
          const lon = parseFloat(cols[14]),
            lat = parseFloat(cols[15]);
          const name = cols[7];
          if (
            !isNaN(lat) &&
            !isNaN(lon) &&
            turf.distance(pt, turf.point([lon, lat]), {
              units: "meters",
            }) <= 1000
          ) {
            names.push(name);
          }
        }
        setShelters(names);
      } catch {
        alert("대피소 확인에 실패했습니다.");
        gotoSearch();
      }
    };

    Promise.all([
      loadAndFindPogo(),
      checkFloodHistory(),
      countCCTV(),
      countNearbyRooms(),
      findNearbyShelterNames(),
    ])
      .then(async () => {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4.1-nano",
            messages: [
              {
                role: "system",
                content: `
건물의 주소와 위도, 경도를 받으면 그 건물이 얼마나 안전한지 점수를 매기는 앱을 만들고 있어.
사용자는 건물의 주소, 위도와 경도, 건물이 침수된 기록, 주변 300미터 부근 CCTV 대수, 건물의 지대 높이,
주변 500미터 부근 유흥업소 갯수, 주변 1000미터 부근 안전 대피소 갯수를 전달할게.
그 건물이 얼마나 안전한지 점수를 0~100점 사이로 매겨줘.
너의 응답은 컴퓨터 프로그램이 파싱하기 때문에 숫자만 반환 해.
              `,
              },
              {
                role: "user",
                content: `
건물의 주소: ${fullAddress}
위도: ${position.latitude}
경도: ${position.longitude}
침수 기록: ${flooding.length === 0 ? "없음" : flooding.join(", ")}
300미터 부근 CCTV 대수: ${cctvCount}
지대 높이: ${elevation}미터
500미터 부근 유흥업소 갯수: ${roomCount}곳
1000미터 부근 대피소 갯수: ${shelters.length}곳
              `,
              },
            ],
          }),
        });
        const json = await res.json();
        const raw = json.choices?.[0]?.message?.content?.trim() || "";
        const score = parseInt(raw, 10);
        setTotalScore(score >= 0 && score <= 100 ? score : 50);
      })
      .then(() => setComplete(true));
  }, [position]);

  // 결과 페이지로 이동
  useEffect(() => {
    if (!complete) return;
    router.replace({
      pathname: "/search/result",
      params: {
        flooding,
        cctvCount,
        fullAddress,
        gilAddress,
        totalScore,
        roomCount,
        shelters,
        elevation,
      },
    });
  }, [complete]);

  // 애니메이션 메시지 정의
  const messages: Message[] = [
    {
      text: "",
      fontSize: 24,
      xPos: width / 2 - 120,
      color: "#333333",
      fontWeight: "bold",
    },
    {
      text: "CCTV 확인중..",
      fontSize: 18,
      xPos: width / 4,
      color: "#555555",
      fontWeight: "500",
    },
    {
      text: "집 확인중..",
      fontSize: 16,
      xPos: width * 0.45,
      color: "#666666",
      fontWeight: "normal",
    },
    {
      text: "범죄자 확인중..",
      fontSize: 20,
      xPos: width / 3,
      color: "#444444",
      fontWeight: "600",
    },
    {
      text: "가로등 설치 확인중..",
      fontSize: 18,
      xPos: width * 0.55,
      color: "#555555",
      fontWeight: "normal",
    },
    {
      text: "주변 사건 확인중..",
      fontSize: 18,
      xPos: width / 2 - 80,
      color: "#555555",
      fontWeight: "500",
    },
  ];

  const animatedValues = useRef(
    messages.map(() => new Animated.ValueXY({ x: 0, y: height }))
  ).current;
  const [visibleMessages, setVisibleMessages] = useState<number[]>([]);
  const [animationCycle, setAnimationCycle] = useState(0);
  const isAnimating = useRef(false);

  const resetAnimations = () => {
    animatedValues.forEach((anim) => anim.setValue({ x: 0, y: height }));
    setVisibleMessages([]);
  };

  const startAnimationSequence = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    resetAnimations();

    messages.forEach((_, i) => {
      setTimeout(() => {
        setVisibleMessages((prev) => [...prev, i]);
        const toY = i === 0 ? -(height / 2 - 100) : -((i + 1) * 50);
        const anim = Animated.spring(animatedValues[i], {
          toValue: { x: 0, y: toY },
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        });
        if (i === messages.length - 1) {
          anim.start(() => {
            setTimeout(() => {
              isAnimating.current = false;
              setAnimationCycle((c) => c + 1);
            }, 3000);
          });
        } else {
          anim.start();
        }
      }, 1000 * i);
    });
  };

  useEffect(startAnimationSequence, []);
  useEffect(() => {
    if (animationCycle > 0) startAnimationSequence();
  }, [animationCycle]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.indicator} />

      {/* 화면 중앙에 고정 오버레이 */}
      <View style={styles.centeredOverlay}>
        <Text style={styles.centerOverlayText}>집을 공략 하고 있어요.</Text>
      </View>

      {/* 기존 애니메이션 뷰 */}
      {visibleMessages.map((index) => {
        const msg = messages[index];
        return (
          <Animated.View
            key={`${index}-${animationCycle}`}
            style={[
              styles.bubble,
              {
                left: msg.xPos,
                bottom: index === 0 ? height / 2 : 50,
                transform: [
                  { translateY: animatedValues[index].y },
                  { translateX: animatedValues[index].x },
                ],
              },
            ]}
          >
            <Text
              style={{
                fontSize: msg.fontSize,
                color: msg.color,
                fontWeight: msg.fontWeight,
                textAlign: "center",
              }}
            >
              {msg.text}
            </Text>
          </Animated.View>
        );
      })}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    position: "relative",
  },
  indicator: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 10,
    height: 10,
    backgroundColor: "#FFCC00",
    borderRadius: 5,
  },
  centeredOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "none",
  },
  centerOverlayText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
    backgroundColor: "rgba(255,255,255,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  bubble: {
    position: "absolute",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "transparent",
    alignItems: "center",
    minWidth: 100,
  },
});
