############### svelte
<ul>
    {#each colors as color (color)}
      <li>{color}</li>
    {/each}
</ul>

############### marko
<ul>
    <for|color| of=colors>
      <li>${color}</li>
    </for>
</ul>

############### vue
<ul>
    <li v-for="color in colors" :key="color">
        {{ color }}
    </li>
</ul>

############### react
<ul>
    {colors.map((color) => (
        <li key={color}>{color}</li>
    ))}
</ul>

############### solid
<ul>
    <For each={colors}>{(color) =>
        <li>{color}</li>}
    </For>
</ul>

############### imba
<ul> for color in colors
    <li> color

############### pug vue
ul
    li(v-for="color in colors" :key="color")
        {{color}}

############### ideal
  ul for color in colors
      li color}</li>
  ))}
  ul

############### hyper react
ul(
    colors.map(c =>
        li({key: c}, c)
    )
)

## unkeying
ul(
    colors.map(
        li(color => color)
    )
)

ul(colors.map(li(color => color)}))
ul(colors.map(li(color(() => color))));
ul(colors.map(li((color) => color)));


ul colors.map (c) =>
    li c

ul colors.map c
    li c

ul for c in colors
    li c

ul
    li c for c in colors

ul
    colors.map
        li color => color

  ul {colors.map
      <li key={.color}>{.color}</li>
  }
  ul

<For each=items()> (it) =>
   <li>{it}


return div(
    For({ each: list}, (item, i) => (
        div(() => demo())
    ))
)

div
  For list, (item, i) =>
    div () => demo()

ul For colors, (color) =>
    li color
