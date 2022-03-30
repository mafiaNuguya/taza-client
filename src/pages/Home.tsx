import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { inputOptions } from '../libs/utils';
import useUser from '../libs/hooks/useUser';
import useMutation from '../libs/hooks/useMutation';
import cookieClient from '../libs/cookie';

import Input from '../components/Input';
import SubmitButton from '../components/buttons/Submit';
import Logo from '../components/Logo';

interface FormType {
  name: string;
}

interface MutationResult {
  ok: boolean;
  token?: string;
}

const Home: React.FC = () => {
  const [user, { mutate }] = useUser();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormType>();
  const [enter, { loading, data }] = useMutation<MutationResult>(
    `${process.env.REACT_APP_API_URL}/enter`
  );

  const inputOnValid = (data: FormType) => {
    if (loading) return;
    enter(data);
  };

  useEffect(() => {
    if (data && !data.ok) {
      setError('name', {
        message: '중복되는 이름 입니다. 다른 이름을 선택해 주세요',
      });
      return;
    }

    if (data && data.ok) {
      cookieClient.set(process.env.REACT_APP_TOKEN_NAME, data.token, {
        path: '/',
      });
      mutate();
      return;
    }
  }, [data, setError, mutate]);

  useEffect(() => {
    if (user) navigate('/waiting', { replace: true });
  }, [user]);

  return (
    <div className="flex flex-col justify-center items-center w-full h-full max-w-lg mx-auto space-y-8">
      <div className="flex flex-col items-center space-y-3">
        <Logo />
        <div className="text-white font-serif text-lg">마피아누구야</div>
      </div>
      <form
        onSubmit={handleSubmit(inputOnValid)}
        className="flex flex-col items-center w-2/3 space-y-5"
      >
        <Input
          register={register('name', inputOptions)}
          error={errors.name?.message}
          type={'text'}
          placeholder="닉네임을 입력하세요"
          autoComplete="off"
        />
        <SubmitButton
          className="w-28 h-10"
          text="입장하기"
          loading={loading}
          disabled={errors.name || loading ? true : false}
        />
      </form>
    </div>
  );
};

export default Home;
