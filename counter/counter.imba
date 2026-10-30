tag app-counter
	count = 0

	<self>
		<input type='number' bind=count>
		<button @click=count++> "+"
		<button @click=count--> "-"

imba.mount <app-counter>

# PLUS <script type="module" src="./src/main.imba"></script>
