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

## react-router-dom
### 사용법
```js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```
```js
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;
```
### 페이지 이동 방법
`<a>`는 페이지가 새로고침 되기 때문에 절대 사용하면 안된다.
```js
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h1>HOME</h1>
      <Link to="/login">로그인하러 가기</Link>
    </div>
  );
}
```
### 코드로 페이지 이동하기 (useNavigate)
```js
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  return (
    <>
      <h1>Login</h1>
      <button onClick={goHome}>홈으로 이동</button>
    </>
  );
}
```
