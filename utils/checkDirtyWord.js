const listDirtyWords = [
  "clusterfuck",
  "fucking",
  "fuckin",
  "fuck",
  "sex",
  "shit",
  "shitty",
  "shitblimp",
  "doggy",
  "doggystyle",
  "hentai",
];

const checkDirtyWord = (messageText = " ") => {
  console.log("messageText--", messageText);
  for (const dirtyWord of listDirtyWords) {
    if (messageText.includes(dirtyWord)) return { inValid: true, dirtyWord };
  }
  return { inValid: false, dirtyWord: null };
};

export { checkDirtyWord };
