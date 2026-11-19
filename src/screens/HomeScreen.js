import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { colors } from '../theme';
import { ANIMES } from '../data/animes';
import SplashLoader from '../components/SplashLoader';
import AnimeCard, { GAP, SIDE, SNAP } from '../components/AnimeCard';
import PosterViewer from '../components/PosterViewer';
import MyListDrop from '../components/MyListDrop';
import ShakePick from '../components/ShakePick';

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const scrollX = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((e) => { scrollX.value = e.contentOffset.x; });

  return (
    <View style={styles.root}>
      <ScrollView scrollEnabled={scrollEnabled} contentContainerStyle={styles.content}>
        <Text style={styles.h1}>Estrenos de la temporada</Text>
        <Text style={styles.sub}>Desliza y toca una tarjeta para ver el póster.</Text>

        <View style={styles.listWrap}>
          <Animated.FlatList
            data={ANIMES}
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
              <AnimeCard item={item} index={index} scrollX={scrollX} onPress={setSelected} />
            )}
          />
        </View>

        <Text style={styles.h2}>Recomendación sorpresa</Text>
        <ShakePick animes={ANIMES} />

        <Text style={[styles.h2, { marginTop: 28 }]}>Mi lista</Text>
        <Text style={styles.subPad}>Arrastra el anime hasta la zona rosa para guardarlo.</Text>
        <MyListDrop featured={ANIMES[2]} onLockScroll={(lock) => setScrollEnabled(!lock)} />
      </ScrollView>

      {selected && <PosterViewer anime={selected} onClose={() => setSelected(null)} />}
      {loading && <SplashLoader onDone={() => setLoading(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { paddingTop: 16, paddingBottom: 48 },
  h1: { color: colors.text, fontSize: 24, fontWeight: '800', paddingHorizontal: 20 },
  h2: { color: colors.text, fontSize: 20, fontWeight: '800', paddingHorizontal: 20, marginBottom: 10 },
  sub: { color: colors.muted, fontSize: 14, paddingHorizontal: 20, marginTop: 4 },
  subPad: { color: colors.muted, fontSize: 14, paddingHorizontal: 20, marginBottom: 12, marginTop: -4 },
  listWrap: { height: 470, marginTop: 8, marginBottom: 12 },
});