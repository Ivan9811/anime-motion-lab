import { useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Extrapolation, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue,
} from 'react-native-reanimated';
import ScreenShell from '../components/ScreenShell';
import { colors } from '../theme';

const { width } = Dimensions.get('window');
const CARD_W = width * 0.72;
const GAP = 16;
const SNAP = CARD_W + GAP;
const SIDE = (width - CARD_W) / 2;

// Títulos originales de ejemplo. Para usar pósters reales, agrega un campo `image`.
const DATA = [
  { id: '1', kanji: '星', title: 'Hoshi no Kenshi', genre: 'Acción · Fantasía', eps: 24, score: 9.1, c: ['#7c5cff', '#1a1535'] },
  { id: '2', kanji: '影', title: 'Kage no Shōjo', genre: 'Misterio · Sobrenatural', eps: 12, score: 8.7, c: ['#ff4d8d', '#3b1241'] },
  { id: '3', kanji: '龍', title: 'Ryū no Yakusoku', genre: 'Aventura · Épico', eps: 26, score: 9.4, c: ['#ff7a45', '#ff2d6f'] },
  { id: '4', kanji: '桜', title: 'Sakura Gakuen', genre: 'Romance · Escolar', eps: 13, score: 8.2, c: ['#ff9ecb', '#c13f8b'] },
  { id: '5', kanji: '月', title: 'Tsuki no Rōnin', genre: 'Samurái · Drama', eps: 20, score: 8.9, c: ['#3ee0ff', '#3a5bff'] },
];

function Card({ item, index, scrollX }) {
  const [saved, setSaved] = useState(false);

  const style = useAnimatedStyle(() => {
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

  return (
    <Animated.View style={[styles.card, style]}>
      <LinearGradient colors={item.c} style={styles.gradient}>
        <View style={styles.topRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>★ {item.score}</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.eps} eps</Text>
          </View>
        </View>

        <Text style={styles.kanji}>{item.kanji}</Text>

        <View>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.genre}>{item.genre}</Text>
          <View style={styles.actions}>
            <Pressable style={styles.watchBtn}>
              <Text style={styles.watchText}>▶ Ver ahora</Text>
            </Pressable>
            <Pressable
              style={[styles.listBtn, saved && styles.listBtnOn]}
              onPress={() => setSaved((s) => !s)}
            >
              <Text style={styles.listText}>{saved ? '✓' : '+'}</Text>
            </Pressable>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

function Dot({ index, scrollX }) {
  const style = useAnimatedStyle(() => {
    const input = [(index - 1) * SNAP, index * SNAP, (index + 1) * SNAP];
    return {
      width: interpolate(scrollX.value, input, [8, 26, 8], Extrapolation.CLAMP),
      opacity: interpolate(scrollX.value, input, [0.4, 1, 0.4], Extrapolation.CLAMP),
    };
  });
  return <Animated.View style={[styles.dot, style]} />;
}

export default function CarouselScreen() {
  const scrollX = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((e) => {
    scrollX.value = e.contentOffset.x;
  });

  return (
    <ScreenShell title="Estrenos de la temporada" hint="Desliza para explorar el catálogo.">
      <View style={styles.listWrap}>
        <Animated.FlatList
          data={DATA}
          keyExtractor={(i) => i.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={SNAP}
          decelerationRate="fast"
          scrollEventThrottle={16}
          onScroll={onScroll}
          contentContainerStyle={{ paddingHorizontal: SIDE, alignItems: 'center' }}
          ItemSeparatorComponent={() => <View style={{ width: GAP }} />}
          renderItem={({ item, index }) => (
            <Card item={item} index={index} scrollX={scrollX} />
          )}
        />
      </View>

      <View style={styles.dots}>
        {DATA.map((_, i) => (
          <Dot key={i} index={i} scrollX={scrollX} />
        ))}
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  listWrap: { height: 500, marginTop: 12 },
  card: { width: CARD_W, height: 440, borderRadius: 24, overflow: 'hidden' },
  gradient: { flex: 1, padding: 18, justifyContent: 'space-between' },
  topRow: { flexDirection: 'row', justifyContent: 'space-between' },
  badge: {
    backgroundColor: 'rgba(0,0,0,0.35)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  kanji: {
    color: 'rgba(255,255,255,0.9)', fontSize: 120, fontWeight: '900', textAlign: 'center',
  },
  title: { color: '#fff', fontSize: 22, fontWeight: '800' },
  genre: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 2 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  watchBtn: {
    flex: 1, backgroundColor: '#fff', paddingVertical: 11, borderRadius: 14, alignItems: 'center',
  },
  watchText: { color: colors.bg, fontWeight: '800' },
  listBtn: {
    width: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  listBtnOn: { backgroundColor: colors.accent },
  listText: { color: '#fff', fontSize: 20, fontWeight: '800' },
  dots: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 },
  dot: { height: 8, borderRadius: 4, backgroundColor: colors.accent },
});