import React from "react";
import { Dimensions } from "react-native";

import {
  Vector,
  matrixVecMul4,
  processTransform3d,
  string,
  useValues,
} from "react-native-redash";
import { divide } from "react-native-reanimated";
import { SIZE } from "./constants";
import Gesture from "./gesture";
import Face from "./Face";

const backface = [
  { x: -0.5, y: -0.5, z: -0.5 },
  { x: 0.5, y: -0.5, z: -0.5 },
  { x: -0.5, y: 0.5, z: -0.5 },
  { x: 0.5, y: 0.5, z: -0.5 },
] as const;

const frontface = [
  { x: -0.5, y: -0.5, z: 0.5 },
  { x: 0.5, y: -0.5, z: 0.5 },
  { x: -0.5, y: 0.5, z: 0.5 },
  { x: 0.5, y: 0.5, z: 0.5 },
] as const;

const points3D = [...frontface, ...backface];

const AnimatedCube = () => {
  const [rotateX, rotateY] = useValues([0, 0]);
  const transform = processTransform3d([{ rotateY }, { rotateX }]);
  const points = points3D.map((p) => {
    const [x, y, z, w] = matrixVecMul4(transform, [
      p.x * SIZE,
      p.y * SIZE,
      p.z * SIZE,
      1,
    ]);
    return { x: divide(x, w), y: divide(y, w), z: divide(z, w) };
  });
  const [p1, p2, p3, p4, p5, p6, p7, p8] = points;
  return (
    <>
      <Face backgroundColor="#1abc9c" points={[p1, p2, p3, p4]} />
      <Face backgroundColor="#3498db" points={[p5, p6, p7, p8]} />
      <Face backgroundColor="#2ecc71" points={[p1, p2, p5, p6]} />
      <Face backgroundColor="#e74c3c" points={[p3, p4, p7, p8]} />
      <Face backgroundColor="#9b59b6" points={[p2, p4, p6, p8]} />
      <Face backgroundColor="#e67e22" points={[p1, p3, p5, p7]} />
      <Gesture {...{ rotateX, rotateY }} />
    </>
  );
};

export default AnimatedCube;
