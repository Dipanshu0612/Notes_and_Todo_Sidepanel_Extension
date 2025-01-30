import { useEffect, useState } from "react";
import { MdOutlineDone } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";

export default function Todos() {
  const [todos, setTodos] = useState([
    {
      title: "",
      completed: false,
    },
  ]);
  const [todo, setTodo] = useState("");

  const addTodo = () => {
    if (todo.trim() === "") return;
    localStorage.setItem("todos", JSON.stringify([...todos, todo]));
    setTodos([...todos, { title: todo, completed: false }]);
    setTodo("");
  };

  const removeTodo = (index: number) => {
    const newTodos = todos.filter((_, i) => i !== index);
    localStorage.setItem("todos", JSON.stringify(newTodos));
    setTodos(newTodos);
  };

  const completedTodo = (index: number) => {
    const newTodos = [...todos];
    newTodos[index].completed = true;
    localStorage.setItem("todos", JSON.stringify(newTodos));
    setTodos(newTodos);
  };

  useEffect(() => {
    const data = localStorage.getItem("todos");
    setTodos(data ? JSON.parse(data) : []);
  }, []);

  return (
    <div className="flex w-full md:w-1/2 min-h-[300px] lg:h-full flex-col items-center p-2 md:p-4 space-y-3 md:space-y-4">
      <h2 className="text-2xl md:text-3xl font-semibold">Todos</h2>
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full items-center justify-center px-2 md:px-4">
        <input
          type="text"
          placeholder="Add your to do..."
          className="bg-slate-50 rounded-xl p-2 w-full sm:w-[50%] text-black border border-white"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
        />
        <button
          className="w-full sm:w-auto !p-2 !bg-blue-400 hover:!bg-blue-700"
          onClick={addTodo}
        >
          Add To Do
        </button>
      </div>
      <div className="w-full p-2 flex flex-col items-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-semibold">Your Todos</h2>
        {todos.length === 0 ? (
          <div className="flex items-center justify-center text-xl md:text-2xl font-semibold">
            No todos
          </div>
        ) : (
          todos.map((todo_item, index) => {
            return (
              <div
                key={index}
                className="w-full p-2 rounded-xl flex flex-row items-center justify-around gap-2"
              >
                <div
                  className={`w-full sm:w-[75%] text-black p-2 rounded-xl break-words ${
                    todo_item.completed ? "bg-green-300" : "bg-white"
                  }`}
                >
                  {todo_item.completed
                    ? todo_item.title + " (Completed)"
                    : todo_item.title}
                </div>
                <div className="flex gap-2">
                  <button
                    className={`!bg-green-400 hover:!bg-green-600 ${
                      todo_item.completed ? "!cursor-not-allowed" : ""
                    }`}
                    onClick={() => completedTodo(index)}
                    disabled={todo_item.completed}
                  >
                    <MdOutlineDone />
                  </button>
                  <button
                    className="!bg-red-400 hover:!bg-red-600"
                    onClick={() => removeTodo(index)}
                  >
                    <RxCross1 />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
