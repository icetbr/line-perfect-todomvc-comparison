<script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js"></script>

<div x-data="{ count: 0 }">
  <button x-on:click="count++">Increment</button>
  <button x-on:click="count--">Decrement</button>
  <span x-text="count"></span>
</div>
