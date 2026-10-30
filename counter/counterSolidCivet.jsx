Counter()
  let count = createMutable(0);

  <button onClick={()=>setCount(c => c - 1)}>Decrement</button>
  <button onClick={()=>setCount(c => c + 1)}>Increment</button>
  {count()}

render(() => <Counter />, document.getElementById("app")!);

