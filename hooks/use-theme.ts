import { useColorScheme } from 'react-native';

type GradientColors = readonly [string, string, ...string[]];

export const useTheme = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const colors = {
    // 로고 기반 브랜드 컬러
    brandBlue: '#4A90E2',      // 로고의 메인 블루
    brandYellow: '#FFD700',    // 로고의 노란 자동차 컬러
    brandNavy: '#1E3A8A',      // 로고의 진한 네이비
    brandLightBlue: '#87CEEB', // 로고 자동차 창문 컬러
    
    // 배경색
    background: isDark ? '#0F1419' : '#FEFEFE',
    surface: isDark ? '#1C252E' : '#FFFFFF',
    surfaceSecondary: isDark ? '#2A3441' : '#F8FBFF',
    
    // 텍스트
    text: isDark ? '#FFFFFF' : '#1E3A8A',
    textSecondary: isDark ? '#B0BEC5' : '#64748B',
    placeholder: isDark ? '#78909C' : '#94A3B8',
    
    // 액센트 컬러 (로고 기반)
    primary: '#4A90E2',
    primaryLight: isDark ? '#2A3441' : '#E3F2FD',
    secondary: '#FFD700',
    
    // 상태 컬러
    success: '#10B981',
    danger: '#EF4444',
    warning: '#F59E0B',
    info: '#4A90E2',
    
    // 보더
    border: isDark ? '#3A4650' : '#E1E8ED',
    borderInput: isDark ? '#4A90E2' : '#4A90E2',
    
    // 그림자
    shadow: isDark ? '#000000' : '#1E3A8A',
    
    // 메모 관련
    memoBackground: isDark ? '#2A3441' : '#FFFFFF',
    memoEditBackground: isDark ? '#1C252E' : '#F0F8FF',
    
    // 버튼
    addButtonDashed: isDark ? '#2A3441' : '#E3F2FD',
    
    // 그라데이션 컬러 (타입 명시)
    gradientPrimary: ['#4A90E2', '#87CEEB'] as GradientColors,
    gradientSecondary: ['#FFD700', '#FFA500'] as GradientColors,
    gradientDark: ['#1E3A8A', '#0F172A'] as GradientColors,
  };

  return { colors, isDark };
};
