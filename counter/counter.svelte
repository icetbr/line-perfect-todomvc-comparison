<script>
	let count = $state(0);
</script>

<button onclick={() => count++}>+</button>
<button onclick={() => count--}>-</button>
clicks: {count}

<!-- plus <script scr="bundle.js" /> -->
