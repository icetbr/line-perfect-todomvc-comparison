const STORAGE_KEY = "todos-imba"

tag todo-app
	prop filter = "all"
	prop editingIndex = null
	prop todos = JSON.parse(localStorage.getItem(STORAGE_KEY) or "[]")

	def setup
		window.addEventListener "hashchange" do updateView!
		updateView!

	def mount
		watchTodos!

	def watchTodos
		localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))

	def filters
		{
			all: do(todos) todos
			active: do(todos) todos.filter(do(todo) !todo.completed)
			completed: do(todos) todos.filter(do(todo) todo.completed)
		}

	get filteredTodos
		filters[filter](todos)

	get remainingCount
		todos.filter(do(todo) !todo.completed).length

	def create title
		todos.push({ id: Date.now!, title: title, completed: false })
		watchTodos!

	def toggleAll event
		for todo in todos
			todo.completed = event.target.checked
		watchTodos!

	def remove index
		todos.splice(index, 1)
		watchTodos!

	def edit index
		editingIndex = index

	def cancel
		editingIndex = null

	def update title
		if title
			todos[editingIndex].title = title
		else
			remove(editingIndex)
		editingIndex = null
		watchTodos!

	def updateView
		filter = location.hash.slice(2) or "all"
		imba.commit!

	def handleNewTodo event
		if event.key === "Enter"
			const value = event.target.value.trim!
			if value and event.target.checkValidity!
				create(value)
				event.target.value = ""

	def handleEdit event, index
		if event.key === "Enter"
			update(event.target.value.trim!)
		elif event.key === "Escape"
			cancel!

	def handleBlur event
		update(event.target.value.trim!)

	def mounted el
		el.focus!

	<self>
		<section.todoapp>
			<header.header>
				<h1> "todos"
				<input.new-todo autofocus placeholder="What needs to be done?" required pattern=".*\\S+.*"
					@keydown=handleNewTodo>

			<section.main .hidden=(todos.length === 0)>
				<input#toggle-all.toggle-all type="checkbox" checked=(!remainingCount) @change=toggleAll>
				<label for="toggle-all"> "Mark all as complete"
				<ul.todo-list>
					for todo, index in filteredTodos
						<li.todo .completed=todo.completed .editing=(editingIndex === index) key=todo.id>
							<div.view>
								<input.toggle type="checkbox" bind=todo.completed @change=watchTodos>
								<label @dblclick=edit(index)> todo.title
								<button.destroy @click=remove(index)>
							if editingIndex === index
								<input.edit value=todo.title @mounted=mounted
									@keydown=handleEdit($event, index)
									@blur=handleBlur>

			<footer.footer .hidden=(todos.length === 0)>
				<span.todo-count>
					<strong> remainingCount
					" {remainingCount === 1 ? "item" : "items"} left"
				<ul.filters>
					<li> <a href="#/all" .selected=(filter === "all")> "All"
					<li> <a href="#/active" .selected=(filter === "active")> "Active"
					<li> <a href="#/completed" .selected=(filter === "completed")> "Completed"
				<button.clear-completed @click=clearCompleted .hidden=(remainingCount !== 0)> "Clear completed"

imba.mount <todo-app>
