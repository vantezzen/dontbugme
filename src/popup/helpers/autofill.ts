import { sendMessageToCurrentTab } from "./browser"

export const autofillData = (user : string, password : string) => {
  sendMessageToCurrentTab({
    command: "autofill",
    user,
    password
  });
}