import { type HexagonGame, type HexagonData } from "~/components/App";

export function createHexagonGame(
  gridWidth: number,
  gridHeight: number
): HexagonGame {
  const hexagons: HexagonData[] = [];

  const targetSum = Math.floor(Math.random() * 20) + 1;

  for (let i = 0; i < gridWidth * gridHeight; i++) {
    const col = i % gridWidth;
    const row = Math.floor(i / gridWidth);

    hexagons.push({
      index: i,
      value: Math.floor(Math.random() * 10) + 1,
      row,
      col,
      state: "inactive",
    });
  }

  return {
    hexagons,
    gridWidth,
    gridHeight,
    targetSum,
  };
}
