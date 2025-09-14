import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Container, PrivateRoute } from "src/components";
import Login from "src/pages/Login";
import LivroCaixa from "./pages/LivroCaixa";
import Usuarios from "./pages/Usuarios";
import Pessoas from "./pages/Pessoas";
import ContasPagar from "./pages/ContasPagar";
import ContasReceber from "./pages/ContasReceber";
import PlanoContas from "./pages/PlanoContas";
import CaixaDiario from "./pages/CaixaDiario";
import Dashboard from "./pages/Dashboard";
import Inicio from "./pages/Inicio";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Container>
        <Routes>
          <Route path="/" element={<Navigate to="/inicio" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/inicio" element={<PrivateRoute Element={<Inicio />} />} />
          <Route path="/livro-caixa" element={<PrivateRoute Element={<LivroCaixa />} />} />
          <Route path="/caixa-diario" element={<PrivateRoute Element={<CaixaDiario />} />} />
          <Route path="/dashboard" element={<PrivateRoute Element={<Dashboard />} />} />
          <Route path="/usuarios" element={<PrivateRoute Element={<Usuarios />} />} />
          <Route path="/usuarios/:id" element={<PrivateRoute Element={<Usuarios />} />} />
          <Route path="/pessoas" element={<PrivateRoute Element={<Pessoas />} />} />
          <Route path="/pessoas/:id" element={<PrivateRoute Element={<Pessoas />} />} />
          <Route path="/contas-pagar" element={<PrivateRoute Element={<ContasPagar />} />} />
          <Route path="/contas-pagar/:id" element={<PrivateRoute Element={<ContasPagar />} />} />
          <Route path="/contas-receber" element={<PrivateRoute Element={<ContasReceber />} />} />
          <Route path="/contas-receber/:id" element={<PrivateRoute Element={<ContasReceber />} />} />
          <Route path="/plano-contas" element={<PrivateRoute Element={<PlanoContas />} />} />
          <Route path="/plano-contas/:id" element={<PrivateRoute Element={<PlanoContas />} />} />
          <Route path="/plano-contas/editar/:id" element={<PrivateRoute Element={<PlanoContas />} />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default AppRoutes;
