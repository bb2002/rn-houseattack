import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Image,
  ImageBackground,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ResultPage() {
  const {
    flooding,
    cctvCount,
    fullAddress,
    gilAddress,
    totalScore,
    roomCount,
    elevation,
    shelters,
  } = useLocalSearchParams();
  const router = useRouter();

  const shelterArray = ((shelters as string) || "").split(",");

  const openNaverMap = async (keyword: string) => {
    const q = encodeURIComponent(keyword);
    const appUrl = `nmap://search?query=${q}`;
    const webUrl = `https://map.naver.com/v5/search/${q}`;

    try {
      const supported = await Linking.canOpenURL(appUrl);
      await Linking.openURL(supported ? appUrl : webUrl);
    } catch {
      await Linking.openURL(webUrl);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.replace("/search")}>
        <LinearGradient
          colors={["#fafafa", "#eaeaea"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.addressContainer}
        >
          <View style={styles.addressLeft}>
            <Ionicons name="location-sharp" size={20} color="#333" />
            <View style={{ marginLeft: 6 }}>
              <Text style={styles.addressTitle}>{gilAddress}</Text>
              <Text style={styles.addressSubtitle}>{fullAddress}</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.container2}>
        <View style={{ ...styles.container2Vertical, marginRight: 12 }}>
          <LinearGradient
            colors={["#3d7aff", "#82a9ff"]}
            style={styles.safeScoreContainer}
          >
            <Text style={styles.commonLabel}>안전점수</Text>
            <View style={styles.commonRow}>
              <Text style={styles.commonScoreValue}>{totalScore}</Text>
              <Text style={styles.commonUnit}>점</Text>
            </View>
          </LinearGradient>

          <ImageBackground
            style={styles.cctvScoreContainer}
            source={require("../../assets/images/cctv_bg.png")}
            imageStyle={{ borderRadius: 20 }}
            resizeMode="cover"
          >
            <View style={styles.commonRow}>
              <Text style={styles.commonScoreValue}>{cctvCount}</Text>
              <Text style={styles.commonUnit}>대</Text>
            </View>
            <Text style={styles.commonLabel}>집 주변 CCTV</Text>
          </ImageBackground>

          <LinearGradient
            colors={["#3d7aff", "#82aaff"]}
            style={styles.floodContainer}
          >
            <Text style={styles.floodLabel}>침수 여부</Text>
            <Text style={styles.floodValue}>
              {flooding?.length === 0 ? "기록 없음" : `${flooding.length}건`}
            </Text>
            <Image
              source={require("../../assets/images/icons/smile.png")}
              style={styles.floodIcon}
            />
          </LinearGradient>
        </View>

        <View style={{ ...styles.container2Vertical, marginLeft: 12 }}>
          <View style={styles.sheltersContainer}>
            <Text style={styles.sheltersTitle}>
              주변 대피소 {shelterArray.length}곳
            </Text>
            <ScrollView style={styles.shelterList}>
              {shelterArray.slice(0, 7).map((name, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.shelterItem}
                  onPress={() => {
                    openNaverMap(name);
                  }}
                >
                  <Text style={styles.shelterText}>{name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <ImageBackground
            style={styles.heightContainer}
            source={require("../../assets/images/height.png")}
            imageStyle={{ borderRadius: 20 }}
            resizeMode="cover"
          >
            <Text style={styles.commonLabel}>평균 고도</Text>
            <View style={{ ...styles.commonRow, marginTop: 12 }}>
              <Text style={{ ...styles.commonScoreValue, fontSize: 32 }}>
                {elevation}
              </Text>
              <Text style={{ ...styles.commonUnit, fontSize: 18 }}>m</Text>
            </View>
          </ImageBackground>

          <ImageBackground
            style={styles.roomContainer}
            source={require("../../assets/images/beer.png")}
            imageStyle={{ borderRadius: 20 }}
            resizeMode="cover"
          >
            <Text style={styles.commonLabel}>주변 유흥업소</Text>
            <View style={styles.commonRow}>
              <Text style={styles.commonScoreValue}>{roomCount}</Text>
              <Text style={styles.commonUnit}>개</Text>
            </View>
          </ImageBackground>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    padding: 16,
    backgroundColor: "white",
  },
  addressContainer: {
    width: "100%",
    height: 80,
    borderRadius: 999,
    paddingLeft: 24,
    paddingRight: 24,
  },
  addressLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  addressTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#222",
  },
  addressSubtitle: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  addressRight: {
    flex: 1,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  noticeContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  noticeIcon: {
    marginRight: 40,
  },
  noticeText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  container2: {
    flex: 1,
    flexDirection: "row",
  },
  container2Vertical: {
    flex: 1,
    flexDirection: "column",
    marginVertical: 16,
  },
  safeScoreContainer: {
    width: "100%",
    height: 150,
    borderRadius: 20,
    padding: 16,
    justifyContent: "space-between",
  },
  commonLabel: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  commonRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  commonScoreValue: {
    fontSize: 64,
    fontWeight: "bold",
    color: "white",
    marginLeft: "auto",
  },
  commonUnit: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 6,
    marginLeft: 2,
  },
  cctvScoreContainer: {
    minWidth: "100%",
    height: 150,
    padding: 16,
    justifyContent: "space-between",
    overflow: "hidden",
    marginTop: 16,
  },
  roomContainer: {
    minWidth: "100%",
    height: 150,
    padding: 16,
    justifyContent: "space-between",
    overflow: "hidden",
    marginTop: 16,
  },
  heightContainer: {
    minWidth: "100%",
    height: 100,
    padding: 16,
    justifyContent: "space-between",
    overflow: "hidden",
    marginTop: 16,
  },
  floodContainer: {
    width: "100%",
    height: 150,
    borderRadius: 20,
    marginTop: 16,
  },
  floodValue: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginHorizontal: 16,
  },
  floodLabel: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 16,
    marginTop: 16,
  },
  floodIcon: {
    marginLeft: "auto",
    marginTop: 16,
  },
  sheltersContainer: {
    backgroundColor: "#f2f2f2",
    borderRadius: 16,
    padding: 16,
    width: "100%",
  },
  sheltersTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 12,
    color: "#222",
  },
  shelterItem: {
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 999,
    marginBottom: 8,
    alignItems: "center",
  },
  shelterText: {
    color: "#333",
    fontSize: 14,
  },
  rainContainer: {
    minWidth: "100%",
    height: 300,
    padding: 16,
    marginTop: 16,
  },
  rainOverlay: {
    flex: 1,
  },
  rainTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 12,
  },
  rainRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  rainLabelDanger: {
    color: "#ff4444",
    fontWeight: "bold",
    fontSize: 18,
  },
  rainLabelWarning: {
    color: "#ff9900",
    fontWeight: "bold",
    fontSize: 18,
  },
  rainLabelSafe: {
    color: "#33cc66",
    fontWeight: "bold",
    fontSize: 18,
  },
  rainValue: {
    color: "white",
    fontWeight: "bold",
    fontSize: 40,
  },
  rainUnit: {
    fontSize: 14,
    color: "white",
    fontWeight: "normal",
  },
  shelterList: {
    maxHeight: 200, // 최대 7개 정도 보이도록 제한
  },
});
