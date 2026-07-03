import React from 'react';
import './ThemeSwitch.css';

interface ThemeSwitchProps {
  isDark: boolean;
  onToggle: () => void;
}

const ThemeSwitch: React.FC<ThemeSwitchProps> = ({ isDark, onToggle }) => {
  return (
    <div className="theme-switch-wrapper">
      <label className="theme-switch">
        <input
          type="checkbox"
          className="theme-switch__checkbox"
          checked={isDark}
          onChange={onToggle}
        />
        <div className="theme-switch__container">
          <div className="theme-switch__circle-container">
            <div className="theme-switch__sun-moon-container">
              <div className="theme-switch__moon">
                <div className="theme-switch__spot"></div>
                <div className="theme-switch__spot"></div>
                <div className="theme-switch__spot"></div>
              </div>
            </div>
          </div>
          <div className="theme-switch__clouds"></div>
          <div className="theme-switch__stars-container">
            <svg viewBox="0 0 40 20" xmlns="http://www.w3.org/2000/svg">
              <circle cx="6" cy="5" r="1.5" fill="currentColor" />
              <circle cx="14" cy="3" r="1" fill="currentColor" />
              <circle cx="22" cy="6" r="1.5" fill="currentColor" />
              <circle cx="30" cy="4" r="1" fill="currentColor" />
              <circle cx="36" cy="8" r="1.5" fill="currentColor" />
              <circle cx="10" cy="12" r="0.8" fill="currentColor" />
              <circle cx="18" cy="14" r="0.8" fill="currentColor" />
              <circle cx="26" cy="11" r="0.8" fill="currentColor" />
              <circle cx="34" cy="13" r="0.8" fill="currentColor" />
            </svg>
          </div>
        </div>
      </label>
    </div>
  );
};

export default ThemeSwitch;