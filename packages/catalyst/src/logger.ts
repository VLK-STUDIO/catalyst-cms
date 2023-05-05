import { yellow, bold, blue, red } from "colorette";

const PREFIX = bold("⚙︎ Catalyst:");

export const logWarning = (message: string) => {
  logGeneric(yellow, message);
};

export const logInfo = (message: string) => {
  logGeneric(blue, message);
};

export const logError = (message: string) => {
  logGeneric(red, message);
};

const logGeneric = (
  color: (text: string | number) => string,
  message: string
) => {
  console.log(color(`${PREFIX} ${message}`));
};
