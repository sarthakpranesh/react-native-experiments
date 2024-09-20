import React from "react";
import { StyleSheet, View } from "react-native";
import Random from "@/components/Random";

export default function Page() {
  return (
    <View style={[StyleSheet.absoluteFill]}>
      <Random />
    </View>
  );
}
