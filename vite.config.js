import tailwindcss from '@tailwindcss/vite'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		proxy: {
			'/vworld-api': {
				target: 'https://api.vworld.kr',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/vworld-api/, '')
			}
		}
	}
})
