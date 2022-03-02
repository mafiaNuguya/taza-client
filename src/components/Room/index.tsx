import UserProfile from "../user/UserProfile";
import RoleTag from "./RoleTag";

const gameInfo = {
  numberOfPeople: 6,
  roles: {
    마피아: 2,
    경찰: 1,
    의사: 1,
    시민: 2,
  },
};
const participants = [
  "가위",
  "나비",
  "다람쥐",
  "라디오",
  "마분지",
  "바지",
  "사다리",
  "아이",
];

const Room: React.FC = () => {
  return (
    <div className="flex flex-row border-2 text-primary-gray border-primary-gray rounded-2xl mb-10 p-5 text-sm hover:opacity-70 cursor-pointer">
      <div className="flex flex-col flex-1 justify-between">
        <div className="text-2xl">방제목</div>
        <div className="w-full flex flex-row flex-wrap flex-1 p-1">
          {participants.map((user) => {
            return <UserProfile key={user} name={user} />;
          })}
        </div>
      </div>
      <div className="flex flex-col">
        <div className="border-b mb-5">{`시작인원 ${gameInfo.numberOfPeople}`}</div>
        {Object.entries(gameInfo.roles).map((role) => (
          <RoleTag key={role[0]} role={role} />
        ))}
      </div>
    </div>
  );
};

export default Room;
