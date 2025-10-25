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
  return (
    <div style={{ display: "flex", gap: "28px", justifyContent: "center", marginTop: "48px" }}>
      {benefits.map((b, idx) => (
        <div key={idx} style={{
          border: `2px solid ${b.color}`,
          borderRadius: "16px",
          padding: "24px",
          minWidth: "220px",
          background: "#fff"
        }}>
          <h3 style={{ color: b.color }}>{b.title}</h3>
          <p>{b.desc}</p>
        </div>
      ))}
    </div>
  );
}
export default BenefitsBar;
