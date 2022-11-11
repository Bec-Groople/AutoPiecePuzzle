import { uniqBy } from "lodash";

/**每一块拼图的拼法 */
export interface PieceItemLayout {
  pieceIndex: number; //拼图索引
  shapeIndex: number; //拼图的形状索引
}
export const ROWS = 7;
export const COLS = 7;

// 拼图面板形状
export const BoardShape = [
  "......x",
  "......x",
  ".......",
  ".......",
  ".......",
  ".......",
  "...xxxx",
];

// 每一块的拼图形状
export const PieceShapes = [
  ["x...", "xxxx"],
  ["x..", "xxx", "..x"],
  ["..xx", "xxx."],
  ["xxxx", "..x."],
  [".xx", "xxx"],
  ["xxx", "x.x"],
  ["xxx", "xxx"],
  ["x..", "x..", "xxx"],
];

export function getShapeMasks() {
  return PieceShapes.map((item) => {
    const ret = [item];
    // rotate
    for (let i = 1; i < 4; ++i) {
      ret.push(rotate(ret[i - 1]));
    }
    for (let i = 4; i < 8; ++i) {
      ret.push(flip(ret[i - 4]));
    }
    return uniqBy(ret, (x) => x.join("\n"));
  });
}
/**
 * 旋转
 * @param item
 * @returns
 */
export function rotate(item: string[]) {
  const n = item.length;
  const m = item[0].length;
  const ret: any[] = [];
  for (let i = 0; i < m; ++i) {
    ret.push([]);
    for (let j = 0; j < n; ++j) {
      ret[i].push(item[j][m - i - 1]);
    }
  }
  return ret.map((v) => v.join(""));
}

/**
 * 翻转
 * @param item
 * @returns
 */
export function flip(item: string[]) {
  const n = item.length;
  const m = item[0].length;
  const ret: any[] = [];
  for (let i = 0; i < m; ++i) {
    ret.push([]);
    for (let j = 0; j < n; ++j) {
      ret[i].push(item[j][i]);
    }
  }
  return ret.map((v) => v.join(""));
}

/**
 * 根据日期找到拼法
 * @param board
 * @returns
 */
export function solve(board: string[][], itemMasks: any[]) {
  const ret: PieceItemLayout[][] = [];
  const solution: (PieceItemLayout | null)[] = PieceShapes.map(() => null);

  const firstXCols = itemMasks?.map((masks) =>
    masks.map((mask) => mask[0].indexOf("x"))
  );

  let count = 0;
  const canPlace = (index: number, i: number, j: number) => {
    const row = Math.floor(index / COLS);
    const col = index % COLS;
    const mask = itemMasks[i][j];
    const n = mask.length;
    const m = mask[0].length;
    const firstXCol = firstXCols[i][j];
    if (row + n > ROWS) {
      return false;
    }
    if (col - firstXCol < 0 || col + m - firstXCol > COLS) {
      return false;
    }
    for (let r = 0; r < n; ++r) {
      for (let c = 0; c < m; ++c) {
        if (mask[r][c] === "x" && board[row + r][col + c - firstXCol] === "x") {
          return false;
        }
      }
    }
    return true;
  };

  const place = (index: number, i: number, j: number) => {
    const row = Math.floor(index / COLS);
    const col = index % COLS;
    const mask = itemMasks[i][j];
    const n = mask.length;
    const m = mask[0].length;
    const firstXCol = firstXCols[i][j];
    for (let r = 0; r < n; ++r) {
      for (let c = 0; c < m; ++c) {
        if (mask[r][c] === "x") {
          board[row + r][col + c - firstXCol] = "x";
        }
      }
    }
  };

  const unPlace = (index: number, i: number, j: number) => {
    const row = Math.floor(index / COLS);
    const col = index % COLS;
    const mask = itemMasks[i][j];
    const n = mask.length;
    const m = mask[0].length;
    const firstXCol = firstXCols[i][j];
    for (let r = 0; r < n; ++r) {
      for (let c = 0; c < m; ++c) {
        if (mask[r][c] === "x") {
          board[row + r][col + c - firstXCol] = ".";
        }
      }
    }
  };

  const dfs: any = (index: number) => {
    count += 1;
    const row = Math.floor(index / COLS);
    const col = index % COLS;

    //所有的格子上都不为空，循环结束
    if (row >= ROWS) {
      ret.push(solution.map((s) => s!));
      return true;
    }
    //如果格子不是空的，继续下一个格子
    if (board[row][col] === "x") {
      return dfs(index + 1);
    }
    //格子是空的，查找合适的拼图放上面
    for (let i = 0; i < PieceShapes.length; ++i) {
      if (!solution[i]) {
        //找到没有放过的
        for (let j = 0; j < itemMasks[i].length; ++j) {
          if (canPlace(index, i, j)) {
            place(index, i, j);
            solution[i] = { pieceIndex: index, shapeIndex: j };
            dfs(index + 1);
            solution[i] = null;
            unPlace(index, i, j);
          }
        }
      }
    }
    return false;
  };

  dfs(0);
  console.log(`搜索次数: ${count}`);
  return ret;
}
