import { useRef, useState } from "react";

export function NumericInputWithBlur(props: {
  value: number;
  onChange: (value: number) => void;
}) {
  const [stringValue, setStringValue] = useState(String(props.value));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStringValue(e.target.value);
  };

  const changeWrapper = () => {
    const possibleNumber = Number(stringValue);

    if (isNaN(possibleNumber)) {
      // don't change the value
      return;
    }

    props.onChange(possibleNumber);
  };

  const handleBlur = () => {
    changeWrapper();
  };

  // also trigger the change when the user presses enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      changeWrapper();
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);

  // focus on click
  const handleClick = () => {
    inputRef.current?.focus();
  };

  return (
    <input
      ref={inputRef}
      type="number"
      value={stringValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className="w-full h-full min-h-[32px] border border-gray-300 rounded-md px-2 text-right text-sm"
      onClick={handleClick}
    />
  );
}
