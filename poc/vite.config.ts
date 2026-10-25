import {defineConfig} from 'vite';
export default defineConfig({
  build: {manifest: true, rolldownOptions: {input: {main: 'index.html', diagnostic: 'tests/fixture.html'}}},
});
