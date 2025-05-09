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
    router.replace("/search");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.messageContainer}>
        <Text style={styles.boldText}>주소 입력만으로 OK</Text>
        <Text style={styles.boldTextFoot}>
          복잡하게 여러 사이트에서 확인하지 마세요.{"\n"}
          집공략이 주거 환경의 안전을 공략합니다.
        </Text>
      </View>

      <View style={styles.illustrationContainer} />

      <View style={styles.footer}>
        <TouchableOpacity style={styles.dataButton} onPress={goToNextPage}>
          <Text style={styles.dataButtonText}>시작하기</Text>
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
