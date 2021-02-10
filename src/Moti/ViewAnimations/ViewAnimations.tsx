import React from 'react';
import {View} from 'react-native';
import { View as MotiView } from 'moti';

const ViewAnimation = () => {

  return (
    <View style={{
      flex: 1,
      backgroundColor: 'pink',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <MotiView
        style={{
          width: 100,
          height: 100,
          backgroundColor: 'red',
        }}
        from={{
          opacity: 0,
          scale: 1
        }}
        animate={{
          opacity: 1,
          scale: 1.6,
        }}
        transition={{
          type: 'spring',
          loop: true,
        }}
      />
    </View>
  );
}

export default ViewAnimation;
