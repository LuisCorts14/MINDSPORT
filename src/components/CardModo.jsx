function CardModo({ title, color, description, items, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        border: `2px solid ${color}`,
        borderRadius: 16,
        padding: 24,
        minWidth: 300,
        cursor: "pointer",
        background: "#fff",
        boxShadow: "0 2px 8px rgba(50,50,50,0.06)"
      }}
    >
      <h2 style={{ color }}>{title}</h2>
      <p>{description}</p>
      <ul>
        {items.map((item, idx) => <li key={idx}>{item}</li>)}
      </ul>
    </div>
  );
}

export default CardModo;
