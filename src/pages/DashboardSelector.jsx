import React from "react";
import Dashboard from "./Dashboard";
import DashboardEntrenador from "./DashboardEntrenador";

export default function DashboardSelector() {
  const userStr = localStorage.getItem("userData");
  let user = null;
  try {
    user = JSON.parse(userStr);
  } catch {
    user = null;
  }

  if (!user || !user.rol) {
    return <div>No autorizado</div>; // O redirecciona
  }

  if (user.rol === "entrenador") {
    return <DashboardEntrenador />;
  }
  // Por defecto futbolista u otro rol
  return <Dashboard />;
}
