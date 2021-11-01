import ColorHash from "color-hash";

const sanitizeWhitespaces = (str = ""): string => {
  const doubleWhitespaces = "  ";
  const singleWhitespace = " ";

  let resultString = str;

  while (resultString.includes(doubleWhitespaces)) {
    resultString = resultString.replaceAll(doubleWhitespaces, singleWhitespace);
  }

  return resultString;
};

export const stringAvatar = (
  name = ""
): { sx: { bgcolor: string }; children: string } => {
  const colorHash = new ColorHash();

  // prettier-ignore
  const [
    [firstNameFirstLetter = ""] = "",
    [lastNameFirstLetter = ""] = ""
  ] = sanitizeWhitespaces(name).split(" ");

  return {
    sx: {
      bgcolor: colorHash.hex(name),
    },
    children: `${firstNameFirstLetter.toUpperCase()}${lastNameFirstLetter.toUpperCase()}`,
  };
};
