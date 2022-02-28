import type { RegisterOptions } from "react-hook-form";

export function cls(...classNames: string[]) {
  return classNames.join(" ");
}

export const inputOptions: RegisterOptions = {
  required: {
    value: true,
    message: "필수 입력 값입니다.",
  },
  maxLength: {
    value: 8,
    message: "이름은 8글자 이하",
  },
  pattern: {
    value: /^[a-zA-Zㄱ-힣0-9]*$/,
    message: "특수문자는 사용할 수 없습니다.",
  },
};
