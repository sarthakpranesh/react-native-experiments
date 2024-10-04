import HoppscotchAnimatedBorder from "@/components/HoppscotchAnimatedBorder";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function Page() {
  return (
    <View style={[StyleSheet.absoluteFill, { padding: 10 }]}>
      <HoppscotchAnimatedBorder
        borderWidth={2}
      >
        <View style={{ width: 200, height: 40, backgroundColor: "pink" }} />
      </HoppscotchAnimatedBorder>
      <View style={{height: 40}} />
      <HoppscotchAnimatedBorder
        borderWidth={4}
      >
        <View style={{ width: 300, height: 200, backgroundColor: "pink" }} />
      </HoppscotchAnimatedBorder>
      <View style={{height: 40}} />
      <HoppscotchAnimatedBorder
        borderWidth={4}
      >
        <View style={{ width: 200, height: 200, backgroundColor: "pink" }} />
      </HoppscotchAnimatedBorder>
      <View style={{height: 40}} />
    </View>
  );
}
