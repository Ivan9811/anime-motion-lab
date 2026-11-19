import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing, cancelAnimation, useAnimatedStyle, useSharedValue, withRepeat, withTiming,
} from 'react-native-reanimated';
import { colors } from '../theme';

export default function SplashLoader({ onDone, duration = 2800 }) {
  const rotation = useSharedValue(0);
  const progress = useSharedValue(0);
  const fade = useSharedValue(1);

  useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: 1000, easing: Easing.linear }), -1, false);
    progress.value = withTiming(100, { duration, easing: Easing.inOut(Easing.quad) });
    const t1 = setTimeout(() => { fade.value = withTiming(0, { duration: 400 }); }, duration);
    const t2 = setTimeout(onDone, duration + 400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      cancelAnimation(rotation);
      cancelAnimation(progress);
    };
  }, []);

  const spinner = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotation.value}deg` }] }));
  const bar = useAnimatedStyle(() => ({ width: `${progress.value}%` }));
  const overlay = useAnimatedStyle(() => ({ opacity: fade.value }));

  return (
    <Animated.View style={[styles.overlay, overlay]}>
      <Animated.View style={[styles.spinner, spinner]} />
      <Text style={styles.label}>Cargando catálogo…</Text>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, bar]} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject, zIndex: 10, backgroundColor: colors.bg,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40,
  },
  spinner: {
    width: 80, height: 80, borderRadius: 40, borderWidth: 7,
    borderColor: colors.accentSoft, borderTopColor: colors.accent, borderRightColor: colors.violet,
  },
  label: { color: colors.text, fontSize: 16, fontWeight: '600', marginTop: 24, marginBottom: 14 },
  track: { width: '100%', height: 12, borderRadius: 6, backgroundColor: colors.surface, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 6, backgroundColor: colors.cyan },
});