import { StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate, Extrapolation, useAnimatedStyle, useSharedValue, withSpring, withTiming,
} from 'react-native-reanimated';
import ScreenShell from '../components/ScreenShell';
import { colors } from '../theme';

export default function DragRotateScreen() {
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const tilt = useSharedValue(0);

  const pan = Gesture.Pan()
    .onStart(() => {
      startX.value = x.value;
      startY.value = y.value;
    })
    .onUpdate((e) => {
      x.value = startX.value + e.translationX;
      y.value = startY.value + e.translationY;
      tilt.value = withTiming(
        interpolate(e.velocityX, [-1500, 0, 1500], [-35, 0, 35], Extrapolation.CLAMP),
        { duration: 120 }
      );
    })
    .onEnd(() => {
      tilt.value = withSpring(0, { damping: 8 });
    });

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { rotate: `${tilt.value}deg` },
    ],
  }));

  return (
    <ScreenShell title="Arrastrar y rotar" hint="Arrastra la forma: gira según la dirección.">
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.shape, style]} />
      </GestureDetector>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  shape: {
    position: 'absolute',
    top: 180, left: '50%', marginLeft: -55,
    width: 110, height: 110,
    borderRadius: 24,
    backgroundColor: colors.accent,
    borderWidth: 4, borderColor: colors.text,
  },
});