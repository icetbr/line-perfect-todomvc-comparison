<section class="todoapp">
  <header class="header">
    <h1>todos</h1>
    <input class="new-todo" autofocus placeholder="What needs to be done?" required pattern=".*\S+.*"
      onkeydown={e => e.key ==='Enter' && e.target.checkValidity() && create(e.target.value.trim())}
      onkeyup={e => e.key ==='Enter' ? e.target.value = '' : ''}>
  </header>

  {#if todos.length}
    <section class="main">
      <input id="toggle-all" class="toggle-all" type="checkbox" checked={!remainingCount} onchange={e => toggleAll(e.target.checked)}>
      <label for="toggle-all">Mark all as complete</label>

      <ul class="todo-list">
        {#each filteredTodos as todo, index (todo.id)}
          <li class="todo" class:completed={todo.completed} class:editing={editingIndex === index}>

            <div class="view">
              <input class="toggle" type="checkbox" bind:checked={todo.completed}>
              <label ondblclick={() => edit(index)}>{todo.title}</label>
              <button class="destroy" onclick={() => remove(index)} ></button>
            </div>

            {#if editingIndex === index}
              <input class="edit" value={todo.title} autofocus
                onkeydown={e =>
                  e.key ==='Enter' ? update(e.target.value.trim()) :
                  e.key ==='Escape' && cancel()}
                onblur={e => update(e.target.value.trim())}>
            {/if}
          </li>
        {/each}
      </ul>
    </section>

    <footer class="footer">
      <span class="todo-count">
        <strong>{remainingCount}</strong> {remainingCount === 1 ? "item" : "items"} left
      </span>

      <ul class="filters">
        <li><a href="#/all" class:selected={filter === 'all'}>All</a></li>
        <li><a href="#/active" class:selected={filter === 'active'}>Active</a></li>
        <li><a href="#/completed" class:selected={filter === 'completed'}>Completed</a></li>
      </ul>
      {#if !remainingCount}
        <button class="clear-completed" onclick={clearCompleted}>Clear completed</button>
      {/if}
    </footer>
  {/if}
</section>

<svelte:window onhashchange={updateView} />

<script>
  const STORAGE_KEY = "todos-svelte";

  let filter = $state("all");
  let editingIndex = $state();
  let todos = $state(JSON.parse(localStorage.getItem(STORAGE_KEY)) || []);

  $effect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(todos)));

  const filters = {
    all: (todos) => todos,
    active: (todos) => todos.filter((todo) => !todo.completed),
    completed: (todos) => todos.filter((todo) => todo.completed)
  };

  let filteredTodos = $derived(filters[filter](todos));
  let remainingCount = $derived(filters.active(todos).length);

  const clearCompleted = ()        => todos = filters.active(todos);
  const toggleAll      = (checked) => todos.forEach((todo) => todo.completed = checked);
  const remove         = (index)   => todos.splice(index, 1);
  const edit           = (index)   => editingIndex = index;
  const cancel         = ()        => editingIndex = null;
  const create         = (title)   => todos.push({ id: Date.now(), title, completed: false });
  const updateView     = ()        => filter = location.hash.slice(2) || "all";
  const update         = (title)   => (title ? todos[editingIndex].title = title : remove(editingIndex), editingIndex = null);
</script>
