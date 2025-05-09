import { useRouter } from "expo-router";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

export default function PageTwo() {
  const router = useRouter();

  const goToNextPage = () => {
    router.replace("/onboarding/three");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.messageContainer}>
        <Text style={styles.boldText}>계약 전 안전확인</Text>
        <Text style={styles.boldTextFoot}>
          집의 고도, 홍수 여부와 같은 자연재해{"\n"}
          CCTV, 유흥시설, 대피소 같은 안전시설을{"\n"}
          한번에 확인 할 수 있어요.{"\n"}
        </Text>
      </View>

      <View style={styles.illustrationContainer} />

      <View style={styles.footer}>
        <TouchableOpacity style={styles.dataButton} onPress={goToNextPage}>
          <Text style={styles.dataButtonText}>다음</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    fontSize: 16,
    lineHeight: 22,
    color: "#333",
  },
  boldText: {
    fontWeight: "bold",
    fontSize: 24,
    color: "white",
  },
  boldTextFoot: {
    color: "white",
    fontSize: 18,
    marginTop: 16,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  dataButton: {
    backgroundColor: "#F5A623",
    borderRadius: 25,
    height: 50,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  dataButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
