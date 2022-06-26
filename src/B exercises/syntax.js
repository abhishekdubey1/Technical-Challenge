const list = [
  {
    name: "Abhishek",
    score: 99,
    school: "Public School",
  },
  {
    name: "Sam",
    score: 49,
    school: "Public School",
  },
  {
    name: "Raj",
    score: 41,
    school: "Public School",
  },
  {
    name: "Amit",
    score: 71,
    school: "Public School",
  },
  {
    name: "Ravi",
    score: 85,
    school: "English School",
  },
  {
    name: "Neha",
    score: 62,
    school: "English School",
  },
  {
    name: "Raveena",
    score: 76,
    school: "English School",
  },
  {
    name: "Pinky",
    score: 55,
    school: "English School",
  },
  {
    name: "Seema",
    score: 95,
    school: "English School",
  },
  {
    name: "Chinky",
    score: 95,
    school: "Public School",
  },
];

const findByName = (name) => list.find((el) => el.name === name);

const findByName1 = (name) => list.find((el) => el?.name === name);

const findByRange = (min_score, max_score) =>
  list.filter((el) => el?.score >= min_score && el?.score <= max_score);

const findDistinctValues = (key) => new Set(list.map((l) => (l ? l[key] : l)));

const sortListBySchoolAndName = (a, b) => {
  if (a === null || b === null) return 0;
  if (a.school > b.school) {
    return 1;
  } else if (a.school < b.school) {
    return -1;
  } else if (a.school === b.school) {
    return a.name > b.name ? 1 : a.name < b.name ? -1 : 0;
  }
};
