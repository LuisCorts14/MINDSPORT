import React from 'react';

const InfoCard = ({ 
  children, 
  variant = 'info', 
  title, 
  className = '',
  style = {}
}) => {
  
  const variants = {
    info: {
      background: 'var(--bg-primary-light, #f6fafd)',
      border: '1px solid var(--gray-200, #e3f2fd)',
      titleColor: 'var(--primary-color, #009688)'
    },
    success: {
      background: 'var(--bg-success-light, #e8f5e8)',
      border: '1px solid var(--success-color, #4CAF50)',
      titleColor: 'var(--success-color, #4CAF50)'
    },
    warning: {
      background: 'var(--bg-warning-light, #fff8e1)',
      border: '1px solid var(--warning-color, #ff9800)',
      titleColor: 'var(--warning-color, #ff9800)'
    },
    danger: {
      background: 'var(--bg-danger-light, #ffeaea)',
      border: '1px solid var(--danger-color, #e74c3c)',
      titleColor: 'var(--danger-color, #e74c3c)'
    }
  };

  const variantStyle = variants[variant] || variants.info;
  
  const cardStyle = {
    background: variantStyle.background,
    border: variantStyle.border,
    borderRadius: 'var(--radius-xl, 12px)',
    padding: 'var(--spacing-lg, 20px)',
    boxShadow: 'var(--shadow-md, 0 2px 8px rgba(0,0,0,0.06))',
    margin: '0',
    ...style
  };

  const titleStyle = {
    margin: '0 0 16px 0',
    color: variantStyle.titleColor,
    fontSize: 'var(--font-size-lg, 18px)',
    fontWeight: 'var(--font-weight-bold, 600)'
  };

  const contentStyle = {
    color: 'var(--gray-700, #333)',
    fontSize: 'var(--font-size-md, 16px)',
    lineHeight: 1.5,
    margin: 0
  };

  return (
    <div className={`info-card ${className}`} style={cardStyle}>
      {title && <h4 style={titleStyle}>{title}</h4>}
      <div style={contentStyle}>
        {children}
      </div>
    </div>
  );
};

export default InfoCard;