import { buildApp } from './app';

async function start() {
  try {
    const app = await buildApp(); // <-- Yahan await lazmi hai
    await app.listen({ port: 5000, host: '0.0.0.0' });
    console.log('Server is running...');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

start();