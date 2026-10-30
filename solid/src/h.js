import { render, For } from "solid-js/web";
import { createSignal } from "solid-js";
import h from "solid-js/h";

function Counter() {
  const [demo, setDemo] = createSignal(1);
  const [list, setList] = createSignal([0, 1, 2]);

  return
  div([
      For(list, (item, i) =>
          div(() => demo())
  )),

    h('button', {
      onClick: () => setList([...list(), Math.random()])
    }, 'add'),

    h('button', {
      onClick: () => setDemo(demo() + 1)
    }, 'demo'),
  ])
}

render(() => <Counter />, document.getElementById("app")!);
