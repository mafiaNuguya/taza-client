import { roleNames } from '../CreateGame/RoleCounter';

interface RoleTagProps {
  name: Role;
  count: number;
}

const RoleTag: React.FC<RoleTagProps> = ({ name, count }) => {
  return (
    <div className="flex flex-row items-center">
      <div className="rounded-full w-1 h-1 bg-white mr-2" />
      {`${roleNames[name]} ${count}`}
    </div>
  );
};
export default RoleTag;
