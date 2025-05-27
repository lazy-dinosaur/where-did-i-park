import { useColorScheme } from 'react-native';

export const useTheme = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const colors = {
    // 배경색
    background: isDark ? '#000000' : '#ffffff',
    surface: isDark ? '#1c1c1e' : '#ffffff',
    surfaceSecondary: isDark ? '#2c2c2e' : '#f8f9fa',
    
    // 텍스트
    text: isDark ? '#ffffff' : '#2c3e50',
    textSecondary: isDark ? '#a0a0a0' : '#7f8c8d',
    placeholder: isDark ? '#666666' : '#adb5bd',
    
    // 액센트 컬러
    primary: '#007AFF',
    primaryLight: isDark ? '#1a1a2e' : '#e3f2fd',
    
    // 상태 컬러
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ff6b6b',
    info: '#17a2b8',
    
    // 보더
    border: isDark ? '#3a3a3c' : '#e3f2fd',
    borderInput: isDark ? '#007AFF' : '#007AFF',
    
    // 그림자 (다크모드에서는 더 진하게)
    shadow: isDark ? '#000000' : '#000000',
    
    // 메모 관련
    memoBackground: isDark ? '#2c2c2e' : '#ffffff',
    memoEditBackground: isDark ? '#1a1a2e' : '#f8f9ff',
    
    // 버튼
    addButtonDashed: isDark ? '#1a1a2e' : '#e3f2fd',
  };

  return { colors, isDark };
};
