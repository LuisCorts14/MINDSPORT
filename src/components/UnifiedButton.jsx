import React from 'react';

const UnifiedButton = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  loading = false, 
  onClick, 
  type = 'button',
  style = {}
}) => {
  
  // Paleta de colores unificada (manteniendo los existentes)
  const colors = {
    primary: {
      bg: '#009688', // Color principal de tu app
      bgHover: '#007d6e',
      bgDisabled: '#b3d9d4',
      color: '#fff'
    },
    secondary: {
      bg: '#007bff',
      bgHover: '#0056b3', 
      bgDisabled: '#b3d1ff',
      color: '#fff'
    },
    success: {
      bg: '#4CAF50',
      bgHover: '#45a049',
      bgDisabled: '#b8e6ba',
      color: '#fff'
    },
    warning: {
      bg: '#ff9800',
      bgHover: '#e68900',
      bgDisabled: '#ffcc80',
      color: '#fff'
    },
    danger: {
      bg: '#e74c3c',
      bgHover: '#c0392b',
      bgDisabled: '#f5b7b1',
      color: '#fff'
    },
    outline: {
      bg: 'transparent',
      bgHover: '#f8f9fa',
      bgDisabled: '#f8f9fa',
      color: '#009688',
      border: '2px solid #009688'
    }
  };

  const sizes = {
    small: {
      padding: '6px 12px',
      fontSize: '14px',
      borderRadius: '4px'
    },
    medium: {
      padding: '10px 20px',
      fontSize: '16px',
      borderRadius: '6px'
    },
    large: {
      padding: '12px 24px',
      fontSize: '18px',
      borderRadius: '8px'
    }
  };

  const colorTheme = colors[variant] || colors.primary;
  const sizeTheme = sizes[size] || sizes.medium;
  
  const isDisabled = disabled || loading;
  
  const buttonStyle = {
    backgroundColor: isDisabled ? colorTheme.bgDisabled : colorTheme.bg,
    color: colorTheme.color,
    border: colorTheme.border || 'none',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    fontWeight: '500',
    fontFamily: 'inherit',
    transition: 'all 0.2s ease-in-out',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    opacity: isDisabled ? 0.7 : 1,
    boxShadow: isDisabled ? 'none' : '0 2px 4px rgba(0,0,0,0.1)',
    ...sizeTheme,
    ...style
  };

  const handleClick = (e) => {
    if (isDisabled) return;
    onClick && onClick(e);
  };

  const handleMouseEnter = (e) => {
    if (!isDisabled) {
      e.target.style.backgroundColor = colorTheme.bgHover;
      e.target.style.transform = 'translateY(-1px)';
      e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
    }
  };

  const handleMouseLeave = (e) => {
    if (!isDisabled) {
      e.target.style.backgroundColor = colorTheme.bg;
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    }
  };

  return (
    <button
      type={type}
      style={buttonStyle}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={isDisabled}
    >
      {loading && (
        <div style={{
          width: '16px',
          height: '16px',
          border: '2px solid transparent',
          borderTop: '2px solid currentColor',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      )}
      {children}
      
      {loading && (
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      )}
    </button>
  );
};

export default UnifiedButton;