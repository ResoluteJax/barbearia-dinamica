// frontend/src/App.jsx
import React from 'react';
import Scheduler from './components/Scheduler/Scheduler';
import './App.scss'; // Vamos criar este arquivo para estilos globais

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Barbearia Dinâmica</h1>
      </header>
      <main>
        <Scheduler />
      </main>
    </div>
  );
}

export default App;