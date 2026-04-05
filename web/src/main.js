import './tailwind.css';
import { bootstrapApp } from './app/bootstrap.js';

bootstrapApp().catch((err) => {
  console.error(err);
});
