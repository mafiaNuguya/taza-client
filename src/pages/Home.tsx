import { useState } from "react";
import { RegisterOptions, useForm } from "react-hook-form";

import Input from "../components/Input";
import SubmitButton from "../components/buttons/Submit";
import Logo from "../components/Logo";

interface FormType {
  name: string;
}

const Home: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormType>();
  const [submitLoading, setSubmitLoading] = useState(false);

  const inputOptions: RegisterOptions = {
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

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto space-y-8">
      <div className="flex flex-col items-center space-y-3">
        <Logo />
        <div className="text-white font-serif text-lg">마피아누구야</div>
      </div>
      <form
        onSubmit={handleSubmit(() => {})}
        className="flex flex-col items-center w-2/3 space-y-5"
      >
        <Input
          register={register("name", inputOptions)}
          error={errors.name?.message}
          type={"text"}
          placeholder="닉네임을 입력하세요"
          autoComplete="off"
        />
        <SubmitButton
          className="w-28 h-10"
          text="입장하기"
          loading={submitLoading}
          disabled={errors.name || submitLoading ? true : false}
        />
      </form>
    </div>
  );
};

export default Home;
