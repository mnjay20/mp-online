import React, { createContext, useContext, useState, useEffect } from 'react';

export type UiTheme = 'light' | 'dark' | 'midnight';
export type UiDensity = 'compact' | 'normal' | 'spacious';
export type UiFontSize = 'sm' | 'md' | 'lg';
export type UiGlassEffect = 'full' | 'subtle' | 'flat';

interface DynamicUiContextType {
  theme: UiTheme;
  setTheme: (theme: UiTheme) => void;
  density: UiDensity;
  setDensity: (density: UiDensity) => void;
  fontSize: UiFontSize;
  setFontSize: (size: UiFontSize) => void;
  glassEffect: UiGlassEffect;
  setGlassEffect: (effect: UiGlassEffect) => void;
  isAdjusterOpen: boolean;
  setIsAdjusterOpen: (open: boolean) => void;
  toggleAdjuster: () => void;
  triggerStartupLoading: () => void;
  showStartupLoading: boolean;
  setShowStartupLoading: (show: boolean) => void;
}

const DynamicUiContext = createContext<DynamicUiContextType | undefined>(undefined);

export const DynamicUiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<UiTheme>(() => {
    return (localStorage.getItem('c2c_theme') as UiTheme) || 'light';
  });

  const [density, setDensityState] = useState<UiDensity>(() => {
    return (localStorage.getItem('c2c_density') as UiDensity) || 'normal';
  });

  const [fontSize, setFontSizeState] = useState<UiFontSize>(() => {
    return (localStorage.getItem('c2c_fontsize') as UiFontSize) || 'md';
  });

  const [glassEffect, setGlassEffectState] = useState<UiGlassEffect>(() => {
    return (localStorage.getItem('c2c_glasseffect') as UiGlassEffect) || 'full';
  });

  const [isAdjusterOpen, setIsAdjusterOpen] = useState(false);
  const [showStartupLoading, setShowStartupLoading] = useState(true);

  const setTheme = (newTheme: UiTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('c2c_theme', newTheme);
  };

  const setDensity = (newDensity: UiDensity) => {
    setDensityState(newDensity);
    localStorage.setItem('c2c_density', newDensity);
  };

  const setFontSize = (newSize: UiFontSize) => {
    setFontSizeState(newSize);
    localStorage.setItem('c2c_fontsize', newSize);
  };

  const setGlassEffect = (newEffect: UiGlassEffect) => {
    setGlassEffectState(newEffect);
    localStorage.setItem('c2c_glasseffect', newEffect);
  };

  const toggleAdjuster = () => {
    setIsAdjusterOpen((prev) => !prev);
  };

  const triggerStartupLoading = () => {
    setShowStartupLoading(true);
  };

  // Sync state to HTML attributes for instant dynamic CSS updates
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-density', density);
    root.setAttribute('data-font-size', fontSize);
    root.setAttribute('data-glass', glassEffect);
  }, [theme, density, fontSize, glassEffect]);

  return (
    <DynamicUiContext.Provider
      value={{
        theme,
        setTheme,
        density,
        setDensity,
        fontSize,
        setFontSize,
        glassEffect,
        setGlassEffect,
        isAdjusterOpen,
        setIsAdjusterOpen,
        toggleAdjuster,
        triggerStartupLoading,
        showStartupLoading,
        setShowStartupLoading,
      }}
    >
      {children}
    </DynamicUiContext.Provider>
  );
};

export const useDynamicUi = () => {
  const context = useContext(DynamicUiContext);
  if (!context) {
    throw new Error('useDynamicUi must be used within a DynamicUiProvider');
  }
  return context;
};
