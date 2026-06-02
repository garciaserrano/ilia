import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

const vuePlugin = vue();

export default defineConfig({
  plugins: [
    {
      ...vuePlugin,
      transform(code, id, options) {
        const transformHook = vuePlugin.transform;
        if (typeof transformHook === 'function') {
          return transformHook.call(this, code, id, options);
        }

        return transformHook?.handler.call(this, code, id, options);
      },
    },
  ],
});
