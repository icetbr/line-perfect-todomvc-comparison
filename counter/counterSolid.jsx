import { render } from "solid-js/web";
import { createSignal,Show } from "solid-js";

function Counter() {
  const [count,setCount] = createSignal(0);

  return (<>
      <button onClick={()=>setCount(count=>count-1)}>  Decrement </button>
      <button onClick={()=>setCount(count=>count+1)}>  Increment </button>
      {count()}
  </>);
}

render(() => <Counter />, document.getElementById("app")!);

