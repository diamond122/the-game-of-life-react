import produce from "immer";

export const numRows = 50;
export const numCols = 50;

const operations = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

export const resetGrid: () => number[][] = () =>
  Array.from({ length: numRows }).map(() =>
    Array.from({ length: numCols }).fill(0),
  ) as number[][];

export const seedGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => (Math.random() > 0.7 ? 1 : 0)));
  }
  return rows;
};

export const countNeighbors = (grid: number[][], x: number, y: number) => {
  return operations.reduce((acc, [i, j]) => {
    const row = (x + i + grid[0].length) % grid[0].length;
    const col = (y + j + grid.length) % grid.length;
    acc += grid[row][col];
    return acc;
  }, 0);
};

export const calculateNextGrid = (grid: number[][]) => {
  return produce(grid, (gridCopy) => {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[0].length; j++) {
        const count = countNeighbors(grid, i, j);
        if (grid[i][j] === 1 && (count < 2 || count > 3))
          gridCopy[i][j] = 0;
        if (!grid[i][j] && count === 3) gridCopy[i][j] = 1;
      }
    }
  });
}
