import { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { toast } from "react-toastify";

export default function Notes() {
  const [notes, setNotes] = useState([
    {
      title: "",
      content: "",
    },
  ]);
  const [note, setNote] = useState({
    title: "",
    content: "",
  });

  const addTodo = () => {
    if (note.title.trim() === "" || note.content.trim() === "") {
      toast.error("Title and content cannot be empty!");
      return;
    }
    localStorage.setItem("notes", JSON.stringify([...notes, note]));
    setNotes([...notes, { title: note.title, content: note.content }]);
    setNote({
      title: "",
      content: "",
    });
    toast.success("Note added successfully!");
  };

  const removeNote = (index: number) => {
    const newTodos = notes.filter((_, i) => i !== index);
    localStorage.setItem("notes", JSON.stringify(newTodos));
    setNotes(newTodos);
    toast.error("Note removed successfully!");
  };

  useEffect(() => {
    try {
      const data = localStorage.getItem("notes");
      setNotes(data ? JSON.parse(data) : []);
    } catch (error) {
      toast.error("Failed to load notes!");
      console.error(error);
    }
  }, []);

  return (
    <div className="flex w-full md:w-1/2 min-h-[300px] lg:h-full flex-col items-center p-2 md:p-4 space-y-3 md:space-y-4">
      <h2 className="text-2xl md:text-3xl font-semibold">Notes</h2>
      <div className="flex space-y-2 w-full items-center justify-center flex-col px-2 md:px-4">
        <input
          type="text"
          placeholder="Enter title of your note..."
          className="bg-slate-50 rounded-xl p-2 w-full sm:w-[50%] text-black border border-white"
          value={note.title}
          onChange={(e) => setNote({ ...note, title: e.target.value })}
        />
        <textarea
          placeholder="Enter content of your note..."
          rows={4}
          cols={10}
          className="bg-slate-50 rounded-xl p-2 w-full sm:w-[50%] text-black border border-white resize-y min-h-[100px]"
          value={note.content}
          onChange={(e) => setNote({ ...note, content: e.target.value })}
        />
        <button
          className="w-full sm:w-auto !p-2 !bg-blue-400 hover:!bg-blue-700"
          onClick={addTodo}
        >
          Add Note
        </button>
      </div>
      <div className="w-full p-2 flex flex-col items-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-semibold">Your Notes</h2>
        {notes.length === 0 ? (
          <div className="flex items-center justify-center text-xl md:text-2xl font-semibold">
            No notes
          </div>
        ) : (
          notes.map((note_item, index) => {
            return (
              <div
                key={index}
                className="w-full p-2 rounded-xl flex flex-row items-center justify-around gap-2"
              >
                <div className="w-full max-w-full sm:max-w-[75%] text-black p-2 rounded-xl bg-white flex-1">
                  <details className="break-words">
                    <summary className="cursor-pointer hover:text-gray-600">
                      {note_item.title}
                    </summary>
                    <p className="mt-2 whitespace-pre-wrap">
                      {note_item.content}
                    </p>
                  </details>
                </div>
                <button
                  className="!bg-red-400 hover:!bg-red-600 self-center"
                  onClick={() => removeNote(index)}
                >
                  <RxCross1 />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
