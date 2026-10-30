import { deepSignal } from 'alien-deepsignals';
const state = deepSignal({
  count: 0,
  name: 'John',
  nested: {
    deep: 'value',
  },
  array: [1, 2, 3],
});
// console.log(state)
// state.count++;
// console.log(state)
// state.nested.deep = 'new value';
// console.log(state)
state.array.push(4);
console.log(state)
