<script>
	let { children } = $props()
	import '../app.css'

	export const prerender = true
</script>

{@render children()}


