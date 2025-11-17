"use client";

import React from "react";

export type TrainingLog = {
	_id: string;
	title: string;
	date: Date;
	hoursLogged: number;
	ownerName: string;
	animalName: string;
	breed: string;
	description: string;
};

interface Props {
	log: TrainingLog;
}

export default function TrainingLogCard({ log }: Props) {

    let dateObj = new Date(log.date);
	return (
		<div className="flex flex-row bg-white text-black p-4">
        <div className="bg-[#070A52D9] text-white w-20 p-4 text-center">
            <div className="text-2xl font-bold">{dateObj.getDate()}</div>
            <div className="text-sm">{dateObj.getMonth() + 1} - {dateObj.getFullYear()}</div>
        </div>
        <div className="ml-4">
            <div className="text-lg font-bold">{log.title}<span className="font-normal"> • {log.hoursLogged}</span></div>
            <div className="text-sm">{log.ownerName} - {log.breed} - {log.animalName}</div>
            <div className="text-sm mt-2">{log.description}</div>
        </div>
        <div className="w-12 h-12 bg-red-600 flex justify-center items-center text-white text-2xl cursor-pointer">
            ✏️
        </div>
        </div>
	);
}