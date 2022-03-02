interface UserProfileProps {
  name: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ name }) => {
  return (
    <div
      className={`flex justify-center items-center w-10 h-10 rounded-full bg-white text-gray-800 m-2 text-sm p-1`}
    >
      {name.slice(0, 2)}
    </div>
  );
};

export default UserProfile;
