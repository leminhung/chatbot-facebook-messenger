const listDirtyWords = ["địt", "đéo", "đụ", "fuck", "cút", "lồn", "cặc"];

const checkDirtyWord = (messageText) => {
  for (const dirtyWord of listDirtyWords) {
    if (messageText.includes(dirtyWord)) return { inValid: true, dirtyWord };
  }
  return { inValid: false, dirtyWord: null };
};

export { checkDirtyWord };
