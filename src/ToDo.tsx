import { useState } from "react";

export function ToDo() {

    const [todos, setTodos] = useState<string[]>([]);
    const [value, setValue] = useState('');

    const addTodo = () => {
        setTodos([...todos, value]);
        setValue('');
    }

    const deleteToDo = (index: number) => {
        setTodos(todos.filter((_, i) => i !== index));
    }

/*
javascript map functions:
.map
.filter
.find
*/

    return <div> 
        <h4> My ToDos: {todos.length} </h4> 
        <ul>
            {todos.map((todo, index) => <li key={index}>
                {todo} <button onClick={() => deleteToDo(index)}> Delete </button> 
                </li>)}
        </ul>

        <div>
            <input type="text" value={value} onChange={e => setValue(e.target.value)}>
            </input>
            <button onClick={addTodo}> Add ToDo </button>
        </div>
    </div>
}