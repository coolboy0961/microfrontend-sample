// src/ExposedVueApp.js
import { createApp } from 'vue';
import App from './App.vue';

export function mountVueApp(elSelector) {
  createApp(App).mount(elSelector);
}