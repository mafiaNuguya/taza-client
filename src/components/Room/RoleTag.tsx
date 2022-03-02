interface RoleTagProps {
  role: [string, number];
}

const RoleTag: React.FC<RoleTagProps> = ({ role }) => {
  return (
    <div className="flex flex-row items-center">
      <div className="rounded-full w-1 h-1 bg-white mr-2" />
      {`${role[0]} ${role[1]}`}
    </div>
  );
};
export default RoleTag;
