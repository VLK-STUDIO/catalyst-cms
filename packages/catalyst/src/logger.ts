import { yellow, bold } from "colorette";

export const logWarning = (message: string) => {
  console.log(yellow(`${bold("Catalyst - ")} ${message}`));
};
