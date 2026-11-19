import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { colors } from '../theme';

const THRESHOLD = 1.8;
const COOLDOWN_MS = 800;

export default function ShakePick({ animes }) {
  const [pick, setPick] = useState(null);
  const tx = useSharedValue(0);
  const rot = useSharedValue(0);
  const last = useRef(0);

  const shake = () => {
    tx.value = withSequence(
      withTiming(-18, { duration: 50 }),
      withRepeat(withTiming(18, { duration: 100 }), 7, true),
      withTiming(0, { duration: 50 })
    );
    rot.value = withSequence(
      withTiming(-8, { duration: 50 }),
      withRepeat(withTiming(8, { duration: 100 }), 7, true),
      withTiming(0, { duration: 50 })
    );
    setPick(animes[Math.floor(Math.random() * animes.length)]);
  };

  useEffect(() => {
    Accelerometer.setUpdateInterval(100);
    const sub = Accelerometer.addListener(({ x, y, z }) => {
      const force = Math.sqrt(x * x + y * y + z * z);
      const now = Date.now();
      if (force > THRESHOLD && now - last.current > COOLDOWN_MS) {
        last.current = now;
        shake();
      }
    });
    return () => sub.remove();
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }, { rotate: `${rot.value}deg` }],
  }));

  return (
    <View style={styles.wrap}>
      <Animated.View style={[styles.card, style]}>
        <Text style={styles.kanji}>{pick ? pick.kanji : '震'}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{pick ? pick.title : 'Sacude el teléfono'}</Text>
          <Text style={styles.sub}>{pick ? pick.genre : 'Recibe una recomendación sorpresa'}</Text>
        </View>
      </Animated.View>
      <Pressable style={styles.btn} onPress={shake}>
        <Text style={styles.btnText}>Simular sacudida</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginHorizontal: 20 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: colors.gold, borderRadius: 20, padding: 18 },
  kanji: { fontSize: 48, fontWeight: '900', color: colors.bg },
  title: { fontSize: 18, fontWeight: '800', color: colors.bg },
  sub: { fontSize: 13, color: colors.bg, opacity: 0.75, marginTop: 2 },
  btn: { alignSelf: 'center', marginTop: 12, backgroundColor: colors.violet, paddingHorizontal: 22, paddingVertical: 10, borderRadius: 22 },
  btnText: { color: colors.text, fontWeight: '700' },
});