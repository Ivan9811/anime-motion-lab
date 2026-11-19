# Anime Motion Lab

Aplicación móvil con temática anime, desarrollada con **Expo** y **React Native Reanimated**. Reúne seis ejercicios de animación y gestos, accesibles desde un menú lateral.

## Ejercicios

| # | Ejercicio | Técnica |
|---|-----------|---------|
| 1 | Arrastrar y rotar | `Gesture.Pan` y rotación según la velocidad horizontal |
| 2 | Carga infinita | `withRepeat` para spinner y barra de progreso |
| 3 | Multitouch | `Pan`, `Pinch` y `Rotation` simultáneos |
| 4 | Rebote | `withTiming` al presionar y `withSpring` al soltar |
| 5 | Carrusel animado | `useAnimatedScrollHandler` e `interpolate` |
| 6 | Acelerómetro | `expo-sensors` y animación de sacudida |
| 7 | Drawer Navigation | `@react-navigation/drawer` |

## Tecnologías

- Expo
- React Native Reanimated
- React Native Gesture Handler
- React Navigation (Drawer)
- Expo Sensors
- Expo Linear Gradient

## Instalación

```bash
git clone https://github.com/<usuario>/anime-motion-lab.git
cd anime-motion-lab
npm install
npx expo start
```

Escanea el código QR con **Expo Go** desde un dispositivo físico. El acelerómetro y los gestos de dos dedos no funcionan correctamente en emuladores.

## Estructura

```
├── App.js                # Drawer Navigation
├── src/
│   ├── theme.js          # Paleta de colores
│   ├── components/       # Componentes compartidos
│   └── screens/          # Un archivo por ejercicio
```

## Autor

ivan Dario Ramirez