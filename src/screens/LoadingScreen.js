import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing, cancelAnimation, useAnimatedStyle, useSharedValue, withRepeat, withTiming,
} from 'react-native-reanimated';
import ScreenShell from '../components/ScreenShell';
import { colors } from '../theme';

export default function LoadingScreen() {
  const rotation = useSharedValue(0);
  const progress = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 1000, easing: Easing.linear }), -1, false
    );
    progress.value = withRepeat(
      withTiming(100, { duration: 3000, easing: Easing.inOut(Easing.quad) }), -1, false
    );
    return () => {
      cancelAnimation(rotation);
      cancelAnimation(progress);
    };
  }, []);

  const spinner = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));
  const bar = useAnimatedStyle(() => ({ width: `${progress.value}%` }));

  return (
    <ScreenShell title="Carga infinita" hint="Spinner y barra de progreso se inician al montar.">
      <View style={styles.center}>
        <Animated.View style={[styles.spinner, spinner]} />
        <Text style={styles.label}>Invocando poder…</Text>
        <View style={styles.track}>
          <Animated.View style={[styles.fill, bar]} />
        </View>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  spinner: {
    width: 96, height: 96, borderRadius: 48,
    borderWidth: 8,
    borderColor: colors.accentSoft,
    borderTopColor: colors.accent,
    borderRightColor: colors.violet,
  },
  label: { color: colors.text, fontSize: 16, fontWeight: '600', marginTop: 28, marginBottom: 16 },
  track: { width: '100%', height: 14, borderRadius: 7, backgroundColor: colors.surface, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 7, backgroundColor: colors.cyan },
});