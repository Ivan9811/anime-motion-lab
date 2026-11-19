import { StyleSheet, Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import ScreenShell from '../components/ScreenShell';
import { colors } from '../theme';

export default function BounceScreen() {
  const scale = useSharedValue(1);

  const press = Gesture.Tap()
    .maxDuration(60000)
    .onBegin(() => {
      scale.value = withTiming(0.6, { duration: 120 });
    })
    .onFinalize(() => {
      scale.value = withSpring(1, { damping: 3.5, stiffness: 220, mass: 0.8 });
    });

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <ScreenShell title="Rebote" hint="Mantén presionado para encoger; suelta para el rebote.">
      <GestureDetector gesture={press}>
        <Animated.View style={[styles.shape, style]}>
          <Text style={styles.kanji}>押</Text>
        </Animated.View>
      </GestureDetector>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  shape: {
    alignSelf: 'center', marginTop: 180,
    width: 150, height: 150, borderRadius: 75,
    backgroundColor: colors.violet,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 4, borderColor: colors.cyan,
  },
  kanji: { color: colors.text, fontSize: 64, fontWeight: '900' },
});