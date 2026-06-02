import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import './assets/styles.css';

import { createApp } from 'vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi';

import App from './App.vue';
import { iliaTheme } from './constants/theme';

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'iliaTheme',
    themes: {
      iliaTheme,
    },
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
});

createApp(App).use(vuetify).mount('#app');
