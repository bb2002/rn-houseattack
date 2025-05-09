import { Slot, useRouter } from "expo-router";
import React, { ReactNode } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";

export default function SearchLayout() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => router.replace("/search")}
      >
        <Image source={require("../../assets/houseattack.png")} />
      </TouchableOpacity>
      <Slot />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 12,
    backgroundColor: "#fff",
  },
  logo: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#F5A623",
  },
  content: {
    flex: 1,
  },
});
