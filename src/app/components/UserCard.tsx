import React from "react"
import { useRouter } from "next/navigation";

export type User = {
    _id: string;
    userName: string;
    email: string;
    accountType: string;
};

interface Props {
    user: User;
}

export default function UserCard({ user }: Props) {
    const router = useRouter();
    const userInitial = user.userName?.charAt(0).toUpperCase() || '?';
    const acctType = user.accountType === 'admin' ? 'Admin' : 'User';

    const handleClick = () => {
        router.push(`/dashboard/animals/edit?id=${user._id}`);
    };
    
    return (
    <div className="flex items-center bg-white shadow-md rounded-xl p-4 gap-4 mb-2">
      {/* Initials circle */}
      <div className="flex items-center justify-center w-12 h-12 bg-red-500 text-white font-bold rounded-full text-lg">
        {userInitial}
      </div>

      {/* User info */}
      <div className="flex flex-col">
        <span className="font-bold text-gray-800">{user.userName}</span>
        <span className="text-gray-500 text-sm">{acctType}</span>
      </div>
    </div>
  );
}