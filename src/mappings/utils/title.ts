export function cleanTitle(title: string) {
  return transformSpecificVariations(
    removeSpecialChars(
      title
        ?.replaceAll(/[^A-Za-z0-9!@#$%^&*() ]/gim, " ")
        .replaceAll(/(th|rd|nd|st) (Season|season)/gim, "")
        .replaceAll(/\([^\(]*\)$/gim, "")
        .replaceAll("season", "")
        .replaceAll("  ", " ")
        .replaceAll('"', "")
        .trimEnd()
    )
  );
}

export function removeSpecialChars(title: string) {
  return title
    ?.replaceAll(/[^A-Za-z0-9!@#$%^&*()\-= ]/gim, " ")
    .replaceAll(/[^A-Za-z0-9\-= ]/gim, "")
    .replaceAll("  ", " ");
}

export function transformSpecificVariations(title: string) {
  return title?.replaceAll("yuu", "yu").replaceAll(" ou", " oh");
}

export function sanitizeTitle(title: string): string {
  let resTitle = title.replace(
    / *(\(dub\)|\(sub\)|\(uncensored\)|\(uncut\)|\(subbed\)|\(dubbed\))/i,
    ""
  );
  resTitle = resTitle.replace(/ *\([^)]+audio\)/i, "");
  resTitle = resTitle.replace(/ BD( |$)/i, "");
  resTitle = resTitle.replace(/\(TV\)/g, "");
  resTitle = resTitle.trim();
  resTitle = resTitle.substring(0, 99); // truncate
  return resTitle;
}

export function stringSearch(string: string, pattern: string): number {
  let count = 0;
  string = string.toLowerCase();
  pattern = pattern.toLowerCase();
  string = string.replace(/[^a-zA-Z0-9 -]/g, "");
  pattern = pattern.replace(/[^a-zA-Z0-9 -]/g, "");

  for (let i = 0; i < string.length; i++) {
    for (let j = 0; j < pattern.length; j++) {
      if (pattern[j] !== string[i + j]) break;
      if (j === pattern.length - 1) count++;
    }
  }
  return count;
}
