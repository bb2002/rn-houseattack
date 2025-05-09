import { useRouter } from "expo-router";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

export default function PageOne() {
  const router = useRouter();

  const goToNextPage = () => {
    router.replace("/onboarding/two");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.messageContainer}>
        <Text style={styles.boldText}>계속되는 자연재해</Text>
        <Text style={styles.boldTextFoot}>
          자연재해로부터 안전하게 {"\n"}
          대피할 수 있는 정보를{"\n"}
          확인해보세요{"\n"}
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
    marginTop: 72,
    paddingHorizontal: 32,
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
