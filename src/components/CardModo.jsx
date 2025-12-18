function CardModo({ title, color, description, items, onClick }) {
  const cardStyle = {
    border: `3px solid ${color}`,
    borderRadius: '16px',
    padding: '24px',
    minWidth: '300px',
    cursor: "pointer",
    background: "#fff",
    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
    transition: 'all 0.3s ease-in-out'
  };

  const titleStyle = {
    color,
    margin: '0 0 16px 0',
    fontSize: '24px',
    fontWeight: '700',
    letterSpacing: '-0.3px',
    lineHeight: 1.2
  };

  const descriptionStyle = {
    color: '#1a1a1a',
    fontSize: '15px',
    lineHeight: 1.6,
    marginBottom: '18px',
    fontWeight: '500'
  };

  const listStyle = {
    margin: 0,
    paddingLeft: '20px',
    color: '#555555',
    fontSize: '14px',
    lineHeight: 1.7,
    fontWeight: '500'
  };

  const handleMouseEnter = (e) => {
    e.currentTarget.style.transform = 'translateY(-4px)';
    e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.18)';
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)';
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
