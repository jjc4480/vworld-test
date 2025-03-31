<script>
	import { modeStore } from '$lib/stores/mode'
</script>

<div
	class="absolute top-10 left-0 z-10 flex h-10 w-full items-center justify-center gap-10 bg-transparent px-4"
>
	<button
		type="button"
		onclick={() => ($modeStore = 'DEFAULT')}
		class="h-10 w-32 cursor-pointer rounded-xl bg-white">기본 모드</button
	>
	<button
		type="button"
		onclick={() => ($modeStore = 'SIMULATION')}
		class="h-10 w-32 cursor-pointer rounded-xl bg-white">시뮬레이션 모드</button
	>
</div>
