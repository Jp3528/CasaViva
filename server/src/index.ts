import { app } from './app';

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🌿 Servidor CasaViva ejecutándose en:`);
  console.log(`👉 http://localhost:${PORT}`);
  console.log(`👉 API Healthcheck: http://localhost:${PORT}/api/health`);
  console.log(`=========================================`);
});
