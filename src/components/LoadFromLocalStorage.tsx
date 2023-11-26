import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { useLocalStorage } from "react-use";

type Props<T> = {
  decision: T;

  onLoaded: (decision: T) => void;
};

type SavedDecision<T> = {
  name: string;
  decision: T;
};

export default function LoadFromLocalStorage<T>({
  decision,
  onLoaded,
}: Props<T>) {
  const [value = [], setValue, remove] = useLocalStorage<SavedDecision<T>[]>(
    "options",
    []
  );

  const handleNewItemSave = () => {
    const saveName = prompt("Save as:");
    if (!saveName) return;

    // save the decision to local storage
    // add to the list of saved decisions

    const newDecision = {
      name: saveName,
      decision,
    };

    // overwrite the old value if same name
    const idx = value.findIndex((d) => d.name === saveName);

    if (idx > -1) {
      const newValue = [...value];
      newValue[idx] = newDecision;
      setValue(newValue);
      return;
    }

    setValue([...value, newDecision]);
  };

  const hasSaved = value.length > 0;

  return (
    <>
      <Button onClick={handleNewItemSave}>Save to local storage</Button>
      {hasSaved && (
        <>
          <Dropdown>
            <DropdownTrigger>
              <Button variant="bordered">Load saved item</Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              {value.map((d, idx) => (
                <DropdownItem
                  key={idx}
                  onClick={() => {
                    onLoaded(d.decision);
                  }}
                >
                  {d.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <Button onClick={() => remove()}>Clear local storage</Button>
        </>
      )}
    </>
  );
}
