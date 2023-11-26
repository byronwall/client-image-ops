import { RegularPolygon, Text } from "react-konva";
import Konva from "konva";
import { useCallback, useEffect, useRef } from "react";

import { type HexagonGame } from "./App";

type Props = {
  hexagon: HexagonGame["hexagons"][0];
  onHexClick: (number: number) => void;
  hexSize: number;
};

export function HexagonCell({ hexagon, onHexClick, hexSize }: Props) {
  const { col, row, value, index, state } = hexagon;

  const hexWidth = (Math.sqrt(3) / 2) * hexSize;

  const x_offset = row % 2 === 0 ? hexWidth * 2 : hexWidth;
  const x = col * hexWidth * 2 + x_offset;

  const y = row * (hexSize * 1.5) + hexSize;

  // a nice dark blue color
  const fill = "#00008b";

  const hexProps = {
    x: x,
    y: y,
    sides: 6,
    radius: hexSize,
    fill: state === "active" ? fill : state === "remove" ? "yellow" : "white",
    stroke: state === "active" ? "white" : "black",
    strokeWidth: 1,

    opacity: state === "new" ? 0 : 1,

    onClick: () => onHexClick(index),
    onTap: () => onHexClick(index),
  };

  const textProps = {
    x: hexProps.x,
    y: hexProps.y,
    text: String(value),
    fontSize: 36,
    fontFamily: "Arial",
    fill: state === "active" ? "white" : "black",
    width: hexSize,
    align: "center",
    verticalAlign: "middle",
    offsetX: hexWidth / 2,
    offsetY: hexWidth / 3,
    onClick: () => onHexClick(index),
    onTap: () => onHexClick(index),
  };

  const shapeRef = useRef<Konva.RegularPolygon>(null);

  const handleAnimation = useCallback(() => {
    if (!shapeRef.current) {
      return;
    }

    const targetOpacity = state === "remove" ? 0 : 1;

    const tween = new Konva.Tween({
      node: shapeRef.current, // Reference to the shape
      duration: 4,
      opacity: targetOpacity,
    });

    tween.play();
  }, [state]);

  useEffect(() => {
    if (state === "remove" || state === "new") {
      handleAnimation();
    }
  }, [handleAnimation, state]);

  return (
    <>
      <RegularPolygon {...hexProps} ref={shapeRef} />
      {state !== "remove" && <Text {...textProps} />}
    </>
  );
}
