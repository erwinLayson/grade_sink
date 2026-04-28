import app from "./app.js";

const PORT: number = Number(process.env.PORT) || 7001

const server = app;

server.listen(PORT, () => {
  console.log(`Server is running in port ${PORT}`);
})