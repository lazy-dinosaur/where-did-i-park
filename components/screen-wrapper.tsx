import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, StatusBar } from "react-native";
import { useColorScheme } from 'react-native';

export default function ScreenWrapper({
  children,
  backgroundColor,
}: {
  children: React.ReactNode;
  backgroundColor?: string;
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const defaultBg = backgroundColor || (isDark ? '#000000' : '#ffffff');
  
  return (
    <>
      <StatusBar 
        barStyle={isDark ? "light-content" : "dark-content"} 
        backgroundColor={defaultBg} 
      />
      <SafeAreaView style={[styles.container, { backgroundColor: defaultBg }]}>
        {children}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
});
