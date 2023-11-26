import { Stage, Layer } from "react-konva";
import { useWindowSize } from "react-use";

import { type HexagonGame } from "./App";
import { HexagonCell } from "./HexagonCell";

type Props = {
  hexagonGame: HexagonGame;
  onHexClick: (index: number) => void;
};

const HexGrid = ({ hexagonGame, onHexClick }: Props) => {
  const { hexagons } = hexagonGame;

  // get full screen width
  const { width, height } = useWindowSize();

  // get full screen height

  return (
    <Stage width={width} height={height}>
      <Layer>
        {hexagons.map((hexagon) => (
          <HexagonCell
            key={hexagon.index}
            hexagon={hexagon}
            hexSize={50}
            onHexClick={onHexClick}
          />
        ))}
      </Layer>
    </Stage>
  );
};

export default HexGrid;
