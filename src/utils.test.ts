import { countNeighbors, resetGrid, seedGrid, calculateNextGrid, numRows, numCols } from './utils';

describe('utils', () => {
  it('resetGrid', () => {
    const grid = resetGrid();
    expect(grid.length).toEqual(numCols);
    expect(grid[0].length).toEqual(numRows);
    expect(grid[0][0]).toEqual(0);
  });

  it('seedGrid', () => {
    const grid = seedGrid();
    expect(grid.length).toEqual(numCols);
    expect(grid[0].length).toEqual(numRows);
    expect(grid[0][0]).toBeLessThanOrEqual(1);
  });

  it('countNeighbors', () => {
    const grid = seedGrid();
    const count = countNeighbors(grid, 1, 1);
    expect(count).toBeLessThanOrEqual(8);
  });

  it('calculateNextGrid', () => {
    const testGrid = [
      [1, 1, 0, 0, 1],
      [0, 1, 0, 0, 0],
      [1, 0, 0, 1, 1],
      [0, 1, 0, 1, 1],
      [0, 0, 0, 0, 1]
    ];
    const result = calculateNextGrid(testGrid);

    expect(result[1][1]).toEqual(1);
    expect(result[3][1]).toEqual(0);
    expect(result[3][3]).toEqual(0);
    expect(result[1][3]).toEqual(1);
  });
});
