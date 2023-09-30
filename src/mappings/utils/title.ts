export const cleanTitle = (title: string): string =>
  transformSpecificVariations(
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

export const removeSpecialChars = (title: string): string =>
  title
    ?.replaceAll(/[^A-Za-z0-9!@#$%^&*()\-= ]/gim, " ")
    .replaceAll(/[^A-Za-z0-9\-= ]/gim, "")
    .replaceAll("  ", " ");

export const transformSpecificVariations = (title: string): string =>
  title?.replaceAll("yuu", "yu").replaceAll(" ou", " oh");

export const sanitizeTitle = (title: string): string => {
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
};
