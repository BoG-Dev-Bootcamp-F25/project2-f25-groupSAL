import React from "react"
import { useRouter } from "next/navigation";

export type Animal = {
    _id: string;
    name: string;
    breed: string;
    owner: {
      userName: string;
      _id: string;
    };
    hoursTrained: number;
    profilePicture: string;
};

interface Props {
    animal: Animal;
    clickable?: boolean;
}

export default function AnimalCard({ animal, clickable = true}: Props) {
    const router = useRouter();
    const hoursText = `${animal.hoursTrained} ${
        animal.hoursTrained === 1 ? "hour" : "hours"
    }`;
    
    // Get first letter of owner's name for avatar
    const ownerInitial = animal.owner?.userName?.charAt(0).toUpperCase() || '?';
    const ownerName = animal.owner?.userName || 'Unknown';
    
    const handleClick = () => {
        if (clickable) {
            router.push(`/dashboard/animals/edit?id=${animal._id}`);
        }
    };
    
    return (
        <div 
            onClick={clickable ? handleClick : undefined}
            className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200 w-80 flex-shrink-0"
        >
            <div className="w-full h-64 bg-gray-100 overflow-hidden">
                {animal.profilePicture ? (
                    <img
                        src={animal.profilePicture}
                        alt={animal.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-500 text-6xl">🐾</span>
                    </div>
                )}
            </div>
    
            <div className="px-4 py-4 bg-white h-24 flex items-center">
                <div className="flex items-center gap-3 w-full">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-lg">{ownerInitial}</span>
                    </div>
                    
                    <div className="flex-grow min-w-0">
                        <h2 className="text-xl font-bold text-black truncate">
                            {animal.name} - {animal.breed}
                        </h2>
                        <p className="text-sm text-black mt-1">
                            {ownerName} • Trained: {hoursText}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}