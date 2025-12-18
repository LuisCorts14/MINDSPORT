function BenefitsBar() {
  const benefits = [
    {
      color: "#ff931e",
      title: "Tests Científicos",
      desc: "Evaluaciones basadas en metodologías validadas de psicología deportiva",
    },
    {
      color: "#8f4aff",
      title: "Análisis Personalizado",
      desc: "Resultados detallados y recomendaciones específicas para cada jugador",
    },
    {
      color: "#fc3443",
      title: "Mejora Continua",
      desc: "Seguimiento del progreso y estrategias para fortalecer áreas débiles",
    },
  ];

  const containerStyle = {
    display: "flex",
    gap: "24px",
    justifyContent: "center",
    marginTop: "48px",
    flexWrap: "wrap",
    padding: "0 20px"
  };

  const cardStyle = (color) => ({
    border: "none",
    borderRadius: "12px",
    padding: "28px 24px",
    minWidth: "260px",
    background: "#fff",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
    borderLeft: `5px solid ${color}`,
    transition: "all 0.3s ease",
    cursor: "pointer"
  });

  const cardHoverStyle = {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)"
  };

  const titleStyle = (color) => ({
    color: color,
    fontSize: "18px",
    fontWeight: "700",
    margin: "0 0 12px 0",
    letterSpacing: "-0.3px"
  });

  const descStyle = {
    color: "#666",
    fontSize: "14px",
    margin: 0,
    lineHeight: "1.6",
    fontWeight: "500"
  };

  return (
    <div style={containerStyle}>
      {benefits.map((b, idx) => (
        <div 
          key={idx}
          style={cardStyle(b.color)}
          onMouseEnter={(e) => {
            Object.assign(e.currentTarget.style, cardHoverStyle);
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.08)";
          }}
        >
          <h3 style={titleStyle(b.color)}>{b.title}</h3>
          <p style={descStyle}>{b.desc}</p>
        </div>
      ))}
    </div>
  );
}
export default BenefitsBar;
