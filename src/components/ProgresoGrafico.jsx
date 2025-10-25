import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function getHistorico() {
  return JSON.parse(localStorage.getItem('historicoMindSport') || '[]');
}

function ProgresoGrafico({ testType = 'IED' }) {
  const historico = getHistorico().filter((h) => h.test === testType);

  const ultimos = historico.slice(-8);
  if (ultimos.length < 2) {
    return (
      <div style={{ marginTop: 24, textAlign: 'center', color: '#999' }}>
        <p>Aún no tienes intentos suficientes para visualizar tu progreso.</p>
        <p>Completa el test varias veces para ver la evolución aquí.</p>
      </div>
    );
  }

  const fortalezas = Object.keys(ultimos[0].puntajes);

  const fechas = ultimos.map((h) =>
    new Date(h.fecha).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'short',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  );

  // Paleta de colores mejor diferenciada para hasta 10 líneas
  const palette = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
    '#9966FF', '#FF9F40', '#E7E9ED', '#76B041',
    '#C94C4C', '#55B0AE'
  ];

  const datasets = fortalezas.map((fortaleza, idx) => ({
    label: fortaleza.charAt(0).toUpperCase() + fortaleza.slice(1),
    data: ultimos.map((h) => h.puntajes[fortaleza]),
    fill: false,
    borderColor: palette[idx % palette.length],
    backgroundColor: palette[idx % palette.length],
    tension: 0.3,
    borderWidth: 3,
    pointRadius: 6,
    pointHoverRadius: 8,
    pointBackgroundColor: '#fff',
    pointBorderWidth: 2,
    pointBorderColor: palette[idx % palette.length],
  }));

  const data = {
    labels: fechas,
    datasets,
  };

  const options = {
    maintainAspectRatio: false,
    aspectRatio: 2,
    plugins: {
      legend: { display: true, labels: { boxWidth: 18, padding: 6 } },
      title: { display: true, text: `Evolución del test ${testType}`, font: { size: 20 } },
      tooltip: { mode: 'index', intersect: false },
    },
    interaction: { mode: 'nearest', axis: 'x', intersect: false },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
        title: { display: true, text: 'Puntaje', font: { size: 14 } },
        maxTicksLimit: 10,
      },
      x: {
        title: { display: true, text: 'Fecha', font: { size: 14 } },
        ticks: {
          maxRotation: 45,
          minRotation: 30,
          autoSkipPadding: 12,
          maxTicksLimit: 8,
        },
      },
    },
  };

  return (
    <div style={{ marginTop: 24, height: '400px' }}>
      <Line data={data} options={options} />
    </div>
  );
}

export default ProgresoGrafico;
