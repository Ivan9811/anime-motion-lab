import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import LoadingScreen from './src/screens/LoadingScreen';

import { colors } from './src/theme';
import DragRotateScreen from './src/screens/DragRotateScreen';
import MultitouchScreen from './src/screens/MultitouchScreen';
import BounceScreen from './src/screens/BounceScreen';
import CarouselScreen from './src/screens/CarouselScreen';
import ShakeScreen from './src/screens/ShakeScreen';
import HomeScreen from './src/screens/HomeScreen';

const Drawer = createDrawerNavigator();

const theme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: colors.bg, card: colors.surface, primary: colors.accent },
};

const screens = [
  { name: 'Home', title: 'Inicio · Catálogo', component: HomeScreen },
  { name: 'Drag', title: '1 · Arrastrar y rotar', component: DragRotateScreen },
  { name: 'Loading', title: '2 · Carga infinita', component: LoadingScreen },
  { name: 'Multitouch', title: '3 · Multitouch', component: MultitouchScreen },
  { name: 'Bounce', title: '4 · Rebote', component: BounceScreen },
  { name: 'Carousel', title: '5 · Carrusel', component: CarouselScreen },
  { name: 'Shake', title: '6 · Acelerómetro', component: ShakeScreen },
];

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer theme={theme}>
        <StatusBar style="light" />
        <Drawer.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: colors.surface },
            headerTintColor: colors.text,
            drawerStyle: { backgroundColor: colors.surface, width: 280 },
            drawerActiveTintColor: colors.accent,
            drawerInactiveTintColor: colors.muted,
            drawerActiveBackgroundColor: colors.accentSoft,
          }}
        >
          {screens.map((s) => (
            <Drawer.Screen
              key={s.name}
              name={s.name}
              component={s.component}
              options={{ title: s.title, drawerLabel: s.title }}
            />
          ))}
        </Drawer.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}