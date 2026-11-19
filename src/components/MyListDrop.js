import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Extrapolation, interpolate, runOnJS, useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming,
} from 'react-native-reanimated';
import { colors } from '../theme';

const SIZE = 80;
const PAD = 12;
const ZONE_W = 110;
const ARENA_H = 140;

export default function MyListDrop({ featured, onLockScroll }) {
  const [count, setCount] = useState(0);
  const add = () => setCount((c) => c + 1);

  const arenaW = useSharedValue(0);
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const tilt = useSharedValue(0);
  const over = useSharedValue(0);

  const pan = Gesture.Pan()
    .onBegin(() => { runOnJS(onLockScroll)(true); })
    .onStart(() => { startX.value = x.value; startY.value = y.value; })
    .onUpdate((e) => {
      x.value = startX.value + e.translationX;
      y.value = startY.value + e.translationY;
      tilt.value = withTiming(
        interpolate(e.velocityX, [-1500, 0, 1500], [-35, 0, 35], Extrapolation.CLAMP),
        { duration: 120 }
      );
      over.value = PAD + SIZE / 2 + x.value > arenaW.value - PAD - ZONE_W ? 1 : 0;
    })
    .onEnd(() => {
      tilt.value = withSpring(0, { damping: 8 });
      if (over.value === 1) {
        // Centra el anime en la zona, suma a la lista y regresa al inicio
        x.value = withSpring(arenaW.value - PAD - ZONE_W / 2 - (PAD + SIZE / 2));
        y.value = withSpring(0);
        runOnJS(add)();
        over.value = withDelay(800, withTiming(0, { duration: 200 }));
      } else {
        x.value = withSpring(0);
        y.value = withSpring(0);
      }
    })
    .onFinalize(() => { runOnJS(onLockScroll)(false); });

  const chip = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { translateY: y.value }, { rotate: `${tilt.value}deg` }],
  }));
  const zone = useAnimatedStyle(() => ({
    backgroundColor: over.value > 0.5 ? 'rgba(255,77,141,0.35)' : 'rgba(255,77,141,0.12)',
    transform: [{ scale: 1 + over.value * 0.06 }],
  }));

  return (
    <View style={styles.arena} onLayout={(e) => { arenaW.value = e.nativeEvent.layout.width; }}>
      <Animated.View style={[styles.zone, zone]}>
        <Text style={styles.zoneTitle}>Mi lista</Text>
        <Text style={styles.zoneCount}>{count}</Text>
      </Animated.View>

      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.chip, chip]}>
          <LinearGradient colors={featured.c} style={styles.chipFill}>
            <Text style={styles.chipKanji}>{featured.kanji}</Text>
          </LinearGradient>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}


const styles = StyleSheet.create({
  arena: { height: ARENA_H, marginHorizontal: 20, backgroundColor: colors.surface, borderRadius: 20 },
  zone: {
    position: 'absolute', right: PAD, top: 20, width: ZONE_W, height: ARENA_H - 40,
    borderRadius: 16, borderWidth: 2, borderColor: colors.accent, borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center',
  },
  zoneTitle: { color: colors.text, fontWeight: '700' },
  zoneCount: { color: colors.accent, fontSize: 28, fontWeight: '900' },
  chip: {
    position: 'absolute', left: PAD, top: (ARENA_H - SIZE) / 2,
    width: SIZE, height: SIZE, borderRadius: 18, overflow: 'hidden',
  },
  chipFill: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  chipKanji: { color: '#fff', fontSize: 40, fontWeight: '900' },
});