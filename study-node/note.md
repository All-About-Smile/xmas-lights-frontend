## state
### modify 함수
```js
const [counter, setCounter] = React.useState(0);
const onClick = () => {
    // setCounter(5);
    setCounter((current) => cruuent + 1);
};

```

### state는 절대 mutate(수정)하면 안 됨
React 상태 업데이트의 공식 규칙
state는 절대 mutate(수정)하면 안 됨
항상 새로운 값을 만든 후 setState로 넣어야 함
```js
setToDos((current) => current.push(toDo)); // X
setToDos((current) => [...current, toDo]); // O
```

## useEffect
### 주시하고 있는 게 없으면, 한번만 실행됨
```js
    useEffect(() => {

    }, []);
```