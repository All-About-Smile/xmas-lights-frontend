import { useState } from 'react'

function ToDo() {
  const [toDo, setToDo] = useState('')
  const [toDos, setToDos] = useState([])
  const onChange = (event) => setToDo(event.target.value);
  const onSubmit = (event) => {
    event.preventDefault();
    if(toDo === ""){
      return;
    }
    //setToDos((current) => current.push(toDo));
    setToDos((current) => [toDo, ...current]);
    setToDo("");
    console.log(toDos);
  };


  return (
    <>
      <h1>my todo length{toDos.length}</h1>
      <form onSubmit={onSubmit}>
        <input value={toDo} onChange={onChange} type="text" placeholder='Write your to do...' />
        <button>Submit</button>
      </form>

      {toDos.map((item, index) => <li key={index}>{item}</li>)}
    </>
  )
}

export default ToDo