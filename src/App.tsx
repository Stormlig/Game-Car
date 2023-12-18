import Scene from "./components/BackgroundAnimation/Scene";

export default function App() {
  return (
    <div>
      <Scene />

      <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center pointer-events-none">
        <h1>Olá Sou</h1>
        <p>Herrison Souza</p>
      </div>
    </div>
  );
}
