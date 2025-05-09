import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Postcode from "@actbase/react-daum-postcode";
import { OnCompleteParams } from "@actbase/react-daum-postcode/lib/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const RECENT_ADDRESSES_KEY = "RECENT_ADDRESSES";

export default function SearchPage() {
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState<OnCompleteParams | null>(
    null
  );
  const [recentAddresses, setRecentAddresses] = useState<OnCompleteParams[]>(
    []
  );
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadRecentAddresses = async () => {
      try {
        const stored = await AsyncStorage.getItem(RECENT_ADDRESSES_KEY);
        if (stored) setRecentAddresses(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to load recent addresses", e);
      }
    };

    loadRecentAddresses();
  }, []);

  const onClear = () => {
    setAddress("");
    setAddressDetail(null);
  };

  const onHandle = async () => {
    if (!addressDetail) {
      return;
    }

    await saveRecentAddress(addressDetail);
    router.push({
      pathname: "/search/process",
      params: {
        fullAddress: addressDetail.address,
        gilAddress: addressDetail.roadname,
      },
    });
  };

  const onAddressSelected = (data: OnCompleteParams) => {
    setAddressDetail(data);
    setModalVisible(false);
    setAddress(data.address);
  };

  const saveRecentAddress = async (address: OnCompleteParams) => {
    try {
      const stored = await AsyncStorage.getItem(RECENT_ADDRESSES_KEY);
      const recentList: OnCompleteParams[] = stored ? JSON.parse(stored) : [];
      const updatedList = [
        address,
        ...recentList.filter((item) => item.address !== address.address),
      ].slice(0, 10);
      setRecentAddresses(recentList);
      await AsyncStorage.setItem(
        RECENT_ADDRESSES_KEY,
        JSON.stringify(updatedList)
      );
    } catch (e) {}
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <Text style={styles.title}>검사할 집의 주소를</Text>
        <Text style={styles.subtitle}>입력해주세요</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Feather
            name="search"
            size={20}
            color="#A0A0A0"
            style={styles.searchIconLeft}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="건물주소, 아파트 입력해주세요"
            placeholderTextColor="#A0A0A0"
            value={address}
            returnKeyType="search"
            onPress={() => setModalVisible(true)}
          />
          {address.length > 0 && (
            <TouchableOpacity onPress={onClear} style={styles.clearButton}>
              <View style={styles.clearIcon}>
                <Text style={styles.clearIconText}>×</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.searchButton,
            address.length > 0 ? styles.searchButtonActive : {},
          ]}
          onPress={onHandle}
          disabled={address.length === 0}
        >
          <Text style={styles.searchButtonText}>검색</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <View style={styles.recentSearchesContainer}>
        <View style={styles.recentHeader}>
          <Text style={styles.recentSearchesTitle}>최근 검색</Text>
        </View>

        {recentAddresses.map((item, idx) => (
          <TouchableOpacity key={idx} onPress={() => onAddressSelected(item)}>
            <Text style={{ fontSize: 14, color: "#333", marginVertical: 8 }}>
              {item.address}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Postcode
          style={{ width: "100%", height: 320 }}
          jsOptions={{ animation: true }}
          onError={(err: any) => console.error(err)}
          onSelected={onAddressSelected}
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: { paddingHorizontal: 20, paddingTop: 30, paddingBottom: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#333", marginBottom: 5 },
  subtitle: { fontSize: 24, fontWeight: "bold", color: "#333" },
  searchContainer: { paddingHorizontal: 20, marginBottom: 20 },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 15,
  },
  searchIconLeft: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: "#333", paddingVertical: 10 },
  clearButton: { padding: 8 },
  clearIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#CCC",
    justifyContent: "center",
    alignItems: "center",
  },
  clearIconText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
    lineHeight: 18,
  },
  searchButton: {
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  searchButtonActive: { backgroundColor: "#F5A623" },
  searchButtonText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  recentSearchesContainer: {
    paddingHorizontal: 20,
  },
  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  recentSearchesTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666666",
  },
  clearAllText: {
    fontSize: 14,
    color: "#999999",
  },
});
