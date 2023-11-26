type Decision = {
  choices: Choice[];
  criteria: Criteria[];
};

type Criteria = {
  desc: string;
  weight: number;
};

type Choice = {
  desc: string;
  ranks: number[];
};
