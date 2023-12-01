export type DropData = {
  files: File[];
  text: string | null;
  url: string | null;
  customData: Record<string, string>;
};

export function createDefaultDropData(): DropData {
  return { files: [], text: null, url: null, customData: {} };
}

export type ProcImageData = {
  base64Data: string;
  dropData: DropData;
};
