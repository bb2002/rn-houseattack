import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { StyleSheet, SafeAreaView, ImageBackground } from "react-native";
import PageOne from "./one";
import PageTwo from "./two";
import PageThree from "./three";

const Tab = createMaterialTopTabNavigator();

export default function TabsLayout() {
  return (
    <ImageBackground
      source={require("../../assets/images/intro.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <Tab.Navigator
          tabBar={() => null}
          screenOptions={{
            swipeEnabled: true,
            sceneStyle: { backgroundColor: "transparent" },
          }}
          style={styles.navigator}
        >
          <Tab.Screen name="one" component={PageOne} />
          <Tab.Screen name="two" component={PageTwo} />
          <Tab.Screen name="three" component={PageThree} />
        </Tab.Navigator>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  navigator: {
    flex: 1,
  },
});
