import { Modal, Pressable, StyleSheet, Text } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { colors } from '../theme';

export default function PosterViewer({ anime, onClose }) {
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const rot = useSharedValue(0);
  const savedRot = useSharedValue(0);

  const pan = Gesture.Pan()
    .onStart(() => { startX.value = tx.value; startY.value = ty.value; })
    .onUpdate((e) => { tx.value = startX.value + e.translationX; ty.value = startY.value + e.translationY; });

  const pinch = Gesture.Pinch()
    .onUpdate((e) => { scale.value = Math.min(Math.max(savedScale.value * e.scale, 0.5), 4); })
    .onEnd(() => { savedScale.value = scale.value; });

  const rotate = Gesture.Rotation()
    .onUpdate((e) => { rot.value = savedRot.value + e.rotation; })
    .onEnd(() => { savedRot.value = rot.value; });

  const gesture = Gesture.Simultaneous(pan, pinch, rotate);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: tx.value }, { translateY: ty.value },
      { scale: scale.value }, { rotateZ: `${rot.value}rad` },
    ],
  }));

  return (
    <Modal visible animationType="fade" transparent onRequestClose={onClose}>
      <GestureHandlerRootView style={styles.backdrop}>
        <Text style={styles.title}>{anime.title}</Text>
        <Text style={styles.synopsis}>{anime.synopsis}</Text>
        <GestureDetector gesture={gesture}>
          <Animated.View style={[styles.poster, style]}>
            <LinearGradient colors={anime.c} style={styles.fill}>
              <Text style={styles.kanji}>{anime.kanji}</Text>
            </LinearGradient>
          </Animated.View>
        </GestureDetector>
        <Text style={styles.hint}>Pellizca para zoom, gira con dos dedos y arrastra</Text>
        <Pressable style={styles.close} onPress={onClose}>
          <Text style={styles.closeText}>Cerrar</Text>
        </Pressable>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(8,6,20,0.96)', alignItems: 'center', justifyContent: 'center' },
  title: { color: colors.text, fontSize: 22, fontWeight: '800', marginBottom: 6 },
  synopsis: { color: colors.muted, fontSize: 14, textAlign: 'center', paddingHorizontal: 40, marginBottom: 24 },
  poster: { width: 230, height: 330, borderRadius: 20, overflow: 'hidden' },
  fill: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  kanji: { color: 'rgba(255,255,255,0.92)', fontSize: 130, fontWeight: '900' },
  hint: { color: colors.muted, fontSize: 13, marginTop: 28 },
  close: { position: 'absolute', bottom: 40, backgroundColor: colors.accent, paddingHorizontal: 28, paddingVertical: 12, borderRadius: 24 },
  closeText: { color: '#fff', fontWeight: '800' },
});