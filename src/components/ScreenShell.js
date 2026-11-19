import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

export default function ScreenShell({ title, hint, children }) {
  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.hint}>{hint}</Text>
      </View>
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 20, paddingTop: 16 },
  title: { color: colors.text, fontSize: 22, fontWeight: '800' },
  hint: { color: colors.muted, fontSize: 14, marginTop: 4 },
  body: { flex: 1 },
});