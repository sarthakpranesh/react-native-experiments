import React from "react";
import { Pressable, StyleSheet, View, Text } from "react-native";
import { Link } from "expo-router";

export default function Page() {
  return (
    <View style={StyleSheet.absoluteFill}>
      <Link href="/star" asChild>
        <Pressable>
          <Text>Star Background</Text>
        </Pressable>
      </Link>
      <Link href="/car_animation" asChild>
        <Pressable>
          <Text>Car Animation</Text>
        </Pressable>
      </Link>
      <Link href="/skia_test" asChild>
        <Pressable>
          <Text>Skia test</Text>
        </Pressable>
      </Link>
      <Link href="/rnrc" asChild>
        <Pressable>
          <Text>RNRC</Text>
        </Pressable>
      </Link>
      <Link href="/carousel" asChild>
        <Pressable>
          <Text>carousel</Text>
        </Pressable>
      </Link>
      <Link href="/infiniteCarousel" asChild>
        <Pressable>
          <Text>infinite carousel</Text>
        </Pressable>
      </Link>
      <Link href="/animatedBorderBox" asChild>
        <Pressable>
          <Text>Animated border using box</Text>
        </Pressable>
      </Link>
      <Link href="/animatedBorderPath" asChild>
        <Pressable>
          <Text>Animated border using Path</Text>
        </Pressable>
      </Link>
      <Link href="/star_animated_back" asChild>
        <Pressable>
          <Text>Star Background with Animated back</Text>
        </Pressable>
      </Link>
      <Link href="/animatedBorderSvg" asChild>
        <Pressable>
          <Text>Hoppscotch Animated Border</Text>
        </Pressable>
      </Link>
    </View>
  );
}
