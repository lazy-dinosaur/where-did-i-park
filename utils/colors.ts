// 브랜드 색상 상수 정의
export const BRAND_COLORS = {
  // 로고 기반 브랜드 컬러
  BRAND_BLUE: '#4A90E2',
  BRAND_YELLOW: '#FFD700',
  BRAND_DARK_BLUE: '#2C5282',
  BRAND_LIGHT_BLUE: '#90C2F0',
  
  // 투명도 변형
  BRAND_BLUE_20: '#4A90E233',
  BRAND_BLUE_40: '#4A90E266',
  BRAND_BLUE_60: '#4A90E299',
  BRAND_BLUE_80: '#4A90E2CC',
  
  BRAND_YELLOW_20: '#FFD70033',
  BRAND_YELLOW_40: '#FFD70066',
  BRAND_YELLOW_60: '#FFD70099',
  BRAND_YELLOW_80: '#FFD700CC',
  
  // 그라데이션 정의 (readonly tuple로 타입 보장)
  GRADIENT_PRIMARY: ['#4A90E2', '#2C5282'] as const,
  GRADIENT_SECONDARY: ['#FFD700', '#FFA500'] as const,
  GRADIENT_LIGHT: ['#ffffff', '#E6F3FF', '#90C2F0'] as const,
  GRADIENT_DARK: ['#1a1a2e', '#2C5282', '#4A90E2'] as const,
} as const;

// 색상 접근성 검증 함수
export const getContrastColor = (backgroundColor: string): string => {
  // 배경색에 따라 적절한 텍스트 색상 반환
  const darkColors = ['#2C5282', '#1a1a2e'];
  const lightColors = ['#FFD700', '#90C2F0', '#E6F3FF'];
  
  if (darkColors.includes(backgroundColor)) {
    return '#ffffff';
  } else if (lightColors.includes(backgroundColor)) {
    return '#2C5282';
  }
  
  return '#2C5282'; // 기본값
};

// 색상 유틸리티 함수
export const addOpacity = (color: string, opacity: number): string => {
  const opacityHex = Math.round(opacity * 255).toString(16).padStart(2, '0');
  return color + opacityHex;
};
