function CardModo({ title, color, description, items, onClick }) {
  const cardStyle = {
    border: `3px solid ${color}`,
    borderRadius: 'var(--radius-xl, 16px)',
    padding: 'var(--spacing-xl, 24px)',
    minWidth: '300px',
    cursor: "pointer",
    background: "var(--white, #fff)",
    boxShadow: 'var(--shadow-md, 0 2px 8px rgba(0,0,0,0.06))',
    transition: 'var(--transition-normal, all 0.3s ease-in-out)'
  };

  const titleStyle = {
    color,
    margin: '0 0 16px 0',
    fontSize: 'var(--font-size-xl, 20px)',
    fontWeight: 'var(--font-weight-bold, 600)'
  };

  const descriptionStyle = {
    color: 'var(--gray-700, #333)',
    fontSize: 'var(--font-size-md, 16px)',
    lineHeight: 1.5,
    marginBottom: 'var(--spacing-md, 16px)'
  };

  const listStyle = {
    margin: 0,
    paddingLeft: 'var(--spacing-lg, 20px)',
    color: 'var(--gray-700, #333)',
    fontSize: 'var(--font-size-md, 16px)'
  };

  const handleMouseEnter = (e) => {
    e.currentTarget.style.transform = 'translateY(-2px)';
    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = 'var(--shadow-md, 0 2px 8px rgba(0,0,0,0.06))';
  };

  return (
    <div
      onClick={onClick}
      style={cardStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <h2 style={titleStyle}>{title}</h2>
      <p style={descriptionStyle}>{description}</p>
      <ul style={listStyle}>
        {items.map((item, idx) => (
          <li key={idx} style={{ marginBottom: 'var(--spacing-xs, 4px)' }}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CardModo;
