import { Image, Pressable, StyleSheet, Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import ScreenShell from '../components/ScreenShell';
import { colors } from '../theme';

// Para usar una imagen propia: require('../../assets/mi-imagen.png')
const IMAGE = { uri: 'https://picsum.photos/id/1018/800/800' };

export default function MultitouchScreen() {
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const rot = useSharedValue(0);
  const savedRot = useSharedValue(0);

  const pan = Gesture.Pan()
    .onStart(() => {
      startX.value = tx.value;
      startY.value = ty.value;
    })
    .onUpdate((e) => {
      tx.value = startX.value + e.translationX;
      ty.value = startY.value + e.translationY;
    });

  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = Math.min(Math.max(savedScale.value * e.scale, 0.4), 5);
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const rotate = Gesture.Rotation()
    .onUpdate((e) => {
      rot.value = savedRot.value + e.rotation;
    })
    .onEnd(() => {
      savedRot.value = rot.value;
    });

  const gesture = Gesture.Simultaneous(pan, pinch, rotate);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: tx.value },
      { translateY: ty.value },
      { scale: scale.value },
      { rotateZ: `${rot.value}rad` },
    ],
  }));

  const reset = () => {
    tx.value = withSpring(0);
    ty.value = withSpring(0);
    scale.value = withSpring(1);
    rot.value = withSpring(0);
    savedScale.value = 1;
    savedRot.value = 0;
  };

  return (
    <ScreenShell title="Multitouch" hint="Pellizca para zoom, gira con dos dedos y arrastra.">
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.wrap, style]}>
          <Image source={IMAGE} style={styles.image} />
        </Animated.View>
      </GestureDetector>
      <Pressable style={styles.btn} onPress={reset}>
        <Text style={styles.btnText}>Restablecer</Text>
      </Pressable>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'center', marginTop: 60 },
  image: { width: 260, height: 260, borderRadius: 20, borderWidth: 3, borderColor: colors.accent },
  btn: {
    position: 'absolute', bottom: 32, alignSelf: 'center',
    backgroundColor: colors.violet, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24,
  },
  btnText: { color: colors.text, fontWeight: '700' },
});