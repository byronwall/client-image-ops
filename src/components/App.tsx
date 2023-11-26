import { useState } from "react";
import { produce } from "immer";
import { Button } from "@nextui-org/react";

import { createHexagonGame } from "~/game/createHexagonGame";

import HexGrid from "./HexGrid";

export type HexagonData = {
  index: number;
  row: number;
  col: number;
  value: number;
  state: "active" | "inactive" | "new" | "remove";
};

export type HexagonGame = {
  hexagons: HexagonData[];

  gridWidth: number;
  gridHeight: number;

  targetSum: number;
};

const App = () => {
  // random number up to 20

  const [hexagonGame, setHexagonGame] = useState<HexagonGame>(
    createHexagonGame(20, 20)
  );

  const handleHexClick = (index: number) => {
    const newGame = produce(hexagonGame, (draft) => {
      // remove hexagons that are in the remove state
      for (let i = draft.hexagons.length - 1; i >= 0; i--) {
        if (draft.hexagons[i].state === "remove") {
          draft.hexagons.splice(i, 1);
        }
      }

      // force new state to be inactive
      draft.hexagons.forEach((hexagon) => {
        if (hexagon.state === "new") {
          hexagon.state = "inactive";
        }
      });

      const clickedHex = draft.hexagons.find(
        (hexagon) => hexagon.index === index
      );

      if (!clickedHex) {
        return;
      }

      if (clickedHex.state === "active") {
        clickedHex.state = "inactive";
      } else {
        clickedHex.state = "active";
      }

      const newSum = draft.hexagons.reduce((acc, hexagon) => {
        if (hexagon.state === "active") {
          return acc + hexagon.value;
        }
        return acc;
      }, 0);

      if (newSum == targetSum) {
        // assign new random number to all active hexagons
        // make all hexagons in active state inactive

        draft.hexagons.forEach((hexagon) => {
          if (hexagon.state === "active") {
            hexagon.state = "remove";

            // add a new one at the same spot

            const newHex: HexagonData = {
              index: hexagon.index,
              row: hexagon.row,
              col: hexagon.col,
              value: Math.floor(Math.random() * 20) + 1,
              state: "new",
            };

            draft.hexagons.push(newHex);

            hexagon.index = -hexagon.index;
          }
        });

        draft.targetSum = Math.floor(Math.random() * 20) + 1;
      }
    });

    setHexagonGame(newGame);
  };

  const activeHexagons = hexagonGame.hexagons.filter(
    (hexagon) => hexagon.state === "active"
  );

  const total = activeHexagons.reduce((acc, hexagon) => {
    return acc + hexagon.value;
  }, 0);

  const targetSum = hexagonGame.targetSum;

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-4">
        <h2>Target: {targetSum}</h2>
        <h2>
          Equation: {activeHexagons.map((hexagon) => hexagon.value).join(" + ")}{" "}
          = {total}
        </h2>
      </div>
      <Button
        onClick={() => {
          setHexagonGame(createHexagonGame(20, 20));
        }}
      >
        reset
      </Button>

      <HexGrid hexagonGame={hexagonGame} onHexClick={handleHexClick} />
    </div>
  );
};

export default App;
