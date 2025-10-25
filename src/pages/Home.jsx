// src/pages/Home.jsx
import Header from '../components/Header';
import CardModo from '../components/CardModo';
import BenefitsBar from '../components/BenefitsBar';
import { useNavigate } from 'react-router-dom';
import fotoproyectoImg from '../assets/fotoproyecto.jpg';

function Home() {
  const navigate = useNavigate();
  return (
    <>
      <Header showLogout={false}/>
      {/* Imagen destacada */}
      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <img
          src={fotoproyectoImg}
          alt="Futbolistas jóvenes"
          style={{
            maxWidth: '620px',
            width: '90%',
            borderRadius: '18px',
            boxShadow: '0 2px 12px rgba(50,50,50,0.12)',
            display: 'inline-block',
          }}
        />
      </div>


      <main style={{ paddingTop: 40 }}>
        <section style={{ display: 'flex', justifyContent: 'center', gap: 40 }}>
          <CardModo
            title="Modo Futbolista"
            color="#1abc53"
            description="Realiza tests personalizados y descubre tus fortalezas mentales"
            items={[
              "Tests de personalidad deportiva",
              "Resultados personalizados y detallados",
              "Recomendaciones para mejorar",
              "Seguimiento de progreso"
            ]}
            onClick={() => navigate("/login-futbolista")}
          />
          <CardModo
            title="Modo Entrenador"
            color="#2779fc"
            description="Gestiona y analiza los resultados de tu equipo"
            items={[
              "Vista global del equipo",
              "Comparativas entre jugadores",
              "Estadísticas y tendencias",
              "Reportes detallados"
            ]}
            onClick={() => navigate("/login-entrenador")}
          />
        </section>
        <BenefitsBar />
      </main>
    </>
  );
}

export default Home;
