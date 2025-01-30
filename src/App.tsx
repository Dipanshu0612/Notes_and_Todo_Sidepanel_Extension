import Footer from "./components/Footer";
import Notes from "./components/Notes";
import Todos from "./components/Todos";

function App() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen w-full">
        <div className="flex flex-col items-center justify-center space-y-3 w-full p-4 md:p-5 text-center">
          <h1 className="text-2xl md:text-3xl">Notes and To-Do Sidepanel</h1>
          <p className="text-lg md:text-xl">
            Add your todos and take notes while visiting websites!
          </p>
        </div>
        <div className="flex-1 flex flex-col md:flex-row items-center justify-around w-full p-4 md:p-5 gap-4 md:gap-5">
          <Todos />
          <Notes />
        </div>
        <Footer />
      </div>
    </>
  );
}

export default App;
