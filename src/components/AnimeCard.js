import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Extrapolation, interpolate, useAnimatedStyle, useSharedValue, withSpring, withTiming,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
export const CARD_W = width * 0.7;
export const GAP = 16;
export const SNAP = CARD_W + GAP;
export const SIDE = (width - CARD_W) / 2;

export default function AnimeCard({ item, index, scrollX, onPress }) {
  const bounce = useSharedValue(1);

  // Efecto del carrusel (ejercicio 5)
  const scrollStyle = useAnimatedStyle(() => {
    const input = [(index - 1) * SNAP, index * SNAP, (index + 1) * SNAP];
    return {
      opacity: interpolate(scrollX.value, input, [0.5, 1, 0.5], Extrapolation.CLAMP),
      transform: [
        { scale: interpolate(scrollX.value, input, [0.82, 1, 0.82], Extrapolation.CLAMP) },
        { rotateZ: `${interpolate(scrollX.value, input, [8, 0, -8], Extrapolation.CLAMP)}deg` },
        { translateY: interpolate(scrollX.value, input, [24, 0, 24], Extrapolation.CLAMP) },
      ],
    };
  });

  // Efecto de rebote al presionar (ejercicio 4)
  const pressStyle = useAnimatedStyle(() => ({ transform: [{ scale: bounce.value }] }));

  return (
    <Animated.View style={[styles.card, scrollStyle]}>
      <Pressable
        style={{ flex: 1 }}
        onPress={() => onPress(item)}
        onPressIn={() => { bounce.value = withTiming(0.9, { duration: 100 }); }}
        onPressOut={() => { bounce.value = withSpring(1, { damping: 3.5, stiffness: 220, mass: 0.8 }); }}
      >
        <Animated.View style={[styles.inner, pressStyle]}>
          <LinearGradient colors={item.c} style={styles.gradient}>
            <View style={styles.topRow}>
              <View style={styles.badge}><Text style={styles.badgeText}>★ {item.score}</Text></View>
              <View style={styles.badge}><Text style={styles.badgeText}>{item.eps} eps</Text></View>
            </View>
            <Text style={styles.kanji}>{item.kanji}</Text>
            <View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.genre}>{item.genre}</Text>
              <Text style={styles.tap}>Toca para ver el póster</Text>
            </View>
          </LinearGradient>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: { width: CARD_W, height: 400 },
  inner: { flex: 1, borderRadius: 24, overflow: 'hidden' },
  gradient: { flex: 1, padding: 18, justifyContent: 'space-between' },
  topRow: { flexDirection: 'row', justifyContent: 'space-between' },
  badge: { backgroundColor: 'rgba(0,0,0,0.35)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  kanji: { color: 'rgba(255,255,255,0.9)', fontSize: 110, fontWeight: '900', textAlign: 'center' },
  title: { color: '#fff', fontSize: 22, fontWeight: '800' },
  genre: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 2 },
  tap: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 10 },
});