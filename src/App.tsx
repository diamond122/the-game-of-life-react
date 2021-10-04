import React, { useCallback, useRef, useState, useMemo, useEffect, FC } from 'react';
import produce from 'immer';

import { numCols, numRows, seedGrid, resetGrid, calculateNextGrid } from './utils';
import './styles.css';

const App: FC = () => {
  const [grid, setGrid] = useState<number[][]>(() => resetGrid());

  const [running, setRunning] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [speed, setSpeed] = useState(500);
  const [pattern, setPattern] = useState('square');

  const historyRef = useRef<number[][][]>([]);

  const runningRef = useRef(running);
  runningRef.current = running;

  const generationRef = useRef(generation);
  generationRef.current = generation;

  const speedRef = useRef(speed);
  speedRef.current = speed;

  const populationSize = useMemo(() => {
    return grid.reduce((size, row) => {
      row.forEach((cell) => {
        size += cell;
      });
      return size;
    }, 0);
  }, [grid]);

  const calculateNextGeneration = useCallback(() => {
    historyRef.current = [...historyRef.current, grid]

    setGrid((currentGrid) =>
      calculateNextGrid(currentGrid)
    );

    setGeneration(++generationRef.current);
  }, [grid]);

  useEffect(() => {
    let timer: any = null;
    if (running) {
      timer = setInterval(() => {
        calculateNextGeneration();
      }, speedRef.current);
    }

    return () => {
      if (timer)
        clearInterval(timer);
    };
  }, [calculateNextGeneration, running]);

  const calculatePrevGeneration = () => {
    if (historyRef.current.length > 0 ) {
      setGrid(historyRef.current[historyRef.current.length - 1]);
      historyRef.current.splice(historyRef.current.length - 1, 1);
      setGeneration(--generationRef.current);
    }
  };

  const toggleCellState = (rowIdx: number, colIdx: number) => {
    if (!running && generation === 0) {
      const newGrid = produce(grid, (gridCopy) => {
        gridCopy[rowIdx][colIdx] = grid[rowIdx][colIdx] ? 0 : 1;
      });
      setGrid(newGrid);
    }
  };

  const reset = () => {
    setGrid(() => resetGrid());
    setGeneration(0);
    setRunning(false);
    historyRef.current = [];
    runningRef.current = false;
  };

  const playSimulation = () => {
    setRunning(!running);
    runningRef.current = !running;
  };

  const randomInitialState = () => {
    setGrid(() => seedGrid());
  };

  const changeSpeed = (e: any) => {
    setSpeed(e.target.value);
    speedRef.current = e.target.value;
  };

  return (
    <div className="container">
      <h1>The Game of Life</h1>

      <div className="actions">
        <button onClick={playSimulation}>{!running ? 'Play' : 'Pause'}</button>
        <button onClick={() => {
          setGrid(resetGrid());
          setGeneration(0);
        }}>Clear</button>
        <button disabled={!generation} onClick={reset}>Reset</button>
        <button disabled={!!generation} onClick={randomInitialState}>Random</button>
        <button disabled={!historyRef.current.length} onClick={calculatePrevGeneration}>step backward</button>
        <button onClick={calculateNextGeneration}>step forward</button>
      </div>

      <div className="notifications">
        <p>Generation: {generation}</p>
        <p>Population: {populationSize}</p>
      </div>

      <div className="settings">
        <div className="setting-option">
          <span>Simulation speed:</span>
          <select value={speed} onChange={changeSpeed}>
            <option value={100}>100ms</option>
            <option value={200}>200ms</option>
            <option value={500}>500ms</option>
            <option value={1000}>1s</option>
            <option value={2000}>2s</option>
          </select>
        </div>

        <div className="setting-option">
          <span>Pattern:</span>
          <div className={`cell-wrapper ${pattern === 'square' ? 'active' : ''}`}>
            <div onClick={() => setPattern('square')} className="cell" style={{backgroundColor: '#003366'}}/>
          </div>
          <div className={`cell-wrapper ${pattern === 'spaceship' ? 'active' : ''}`}>
            <div onClick={() => setPattern('spaceship')} className="cell" style={{border: 0}}>🚀</div>
          </div>
        </div>
      </div>

      <div
        className="board"
        style={{
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
        }}
      >
        {grid.map((rows, rowIdx) =>
          rows.map((col, colIdx) => (
            <div
              className="cell"
              key={`${rowIdx}-${colIdx}`}
              onClick={() => toggleCellState(rowIdx, colIdx)}
              style={{
                backgroundColor: pattern === 'square' && grid[rowIdx][colIdx] ? '#003366' : '#eee',
              }}
            >
              {pattern === 'spaceship' &&
              <span>{!grid[rowIdx][colIdx] ? '🌌' : '🚀'}</span>
              }
            </div>
          )),
        )}
      </div>
    </div>
  );
};

export default App;
