import { mount } from 'svelte';
import App from './App.svelte';

import 'carbon-components-svelte/css/white.css';

let app = mount(App, {
    target: document.body,
});

export default app;
