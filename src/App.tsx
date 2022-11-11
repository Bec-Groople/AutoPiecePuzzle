import React, { useEffect, useState } from 'react';
import './App.css';
import CalendarComponent from './components/calendar/index.tsx';
import CoverComponent from './components/cover/index.tsx';
import { BoardShape, getShapeMasks, PieceItemLayout, solve } from './puzzleUtil.ts';

function App() {


  const [month, setMonth] = useState(new Date().getMonth());
  const [day, setDay] = useState(new Date().getDate());
  const [solutions, setSolutions] = useState<PieceItemLayout[][]>([]);//指定日期上所有可能的拼法
  const [itemMasks, setItemMasks] = useState<any>([]);//每一片拼图的拼法集合
  const [solutionIndex, setSolutionIndex] = useState(0);//解法索引


  useEffect(() => {
    const itemMasks = getShapeMasks();
    setItemMasks(itemMasks);
    updateSolutions(month, day, itemMasks);
  }, []);




  const handleChange = ({ month, day }: { month: number, day: number }) => {
    setDay(day);
    setMonth(month);
    updateSolutions(month, day, itemMasks);
  };

  function updateSolutions(month: number, day: number, itemMasks: any[]) {
    const board = BoardShape.map(row => row.split(''));
    board[Math.floor(month / 6)][month % 6] = 'x'
    board[Math.floor((day - 1) / 7) + 2][(day - 1) % 7] = 'x';
    const solutions = solve(board, itemMasks);
    setSolutions(solutions);
  }

  return (
    <div className="App">
       
      {/*<TypeSwitch value={type} onChange={this.handleTypeChange} />*/}
      <div className="Container">
        <CalendarComponent month={month} day={day} onChange={handleChange} />
        {solutions[solutionIndex] && <CoverComponent solution={solutions[solutionIndex]} itemMasks={itemMasks} />}
      </div>
     
      {solutions.length > 0
        ? (
          <div className="Solutions">
            {solutions?.map((solution, i) => (
              <div
                className={`SolutionItem ${i === solutionIndex ? 'selected' : ''}`}
                key={i}
                onClick={() => {
                  setSolutionIndex(i);
                  window.scrollTo({ top: 0 })
                }}
              >
                {`解法${i + 1}`}
              </div>
            ))}
          </div>
        )
        : (
          <div>无解？？？！！</div>
        )}
    </div>
  );
}

export default App;
