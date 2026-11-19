import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import Animated, {
  useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming,
} from 'react-native-reanimated';
import ScreenShell from '../components/ScreenShell';
import { colors } from '../theme';

const THRESHOLD = 1.8;   // fuerza en g (en reposo ≈ 1)
const COOLDOWN_MS = 800; // evita disparos repetidos

export default function ShakeScreen() {
  const tx = useSharedValue(0);
  const rot = useSharedValue(0);
  const [count, setCount] = useState(0);
  const lastShake = useRef(0);

  const shake = () => {
    tx.value = withSequence(
      withTiming(-18, { duration: 50 }),
      withRepeat(withTiming(18, { duration: 100 }), 7, true),
      withTiming(0, { duration: 50 })
    );
    rot.value = withSequence(
      withTiming(-12, { duration: 50 }),
      withRepeat(withTiming(12, { duration: 100 }), 7, true),
      withTiming(0, { duration: 50 })
    );
    setCount((c) => c + 1);
  };

  useEffect(() => {
    Accelerometer.setUpdateInterval(100);
    const sub = Accelerometer.addListener(({ x, y, z }) => {
      const force = Math.sqrt(x * x + y * y + z * z);
      const now = Date.now();
      if (force > THRESHOLD && now - lastShake.current > COOLDOWN_MS) {
        lastShake.current = now;
        shake();
      }
    });
    return () => sub.remove();
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }, { rotate: `${rot.value}deg` }],
  }));

  return (
    <ScreenShell title="Acelerómetro" hint="Agita el dispositivo para activar la animación.">
      <Animated.View style={[styles.shape, style]}>
        <Text style={styles.kanji}>震</Text>
      </Animated.View>
      <Text style={styles.count}>Sacudidas: {count}</Text>
      <Pressable style={styles.btn} onPress={shake}>
        <Text style={styles.btnText}>Simular sacudida</Text>
      </Pressable>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  shape: {
    alignSelf: 'center', marginTop: 120,
    width: 140, height: 140, borderRadius: 32,
    backgroundColor: colors.gold,
    alignItems: 'center', justifyContent: 'center',
  },
  kanji: { fontSize: 64, fontWeight: '900', color: colors.bg },
  count: { color: colors.text, textAlign: 'center', fontSize: 18, fontWeight: '700', marginTop: 32 },
  btn: {
    alignSelf: 'center', marginTop: 20, backgroundColor: colors.violet,
    paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24,
  },
  btnText: { color: colors.text, fontWeight: '700' },
});