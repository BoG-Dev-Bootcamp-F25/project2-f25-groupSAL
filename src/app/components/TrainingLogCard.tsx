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
  const dateObj = new Date(log.date);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString("en-US", { month: "short" });
  const year = dateObj.getFullYear();
  const hoursText = `${log.hoursLogged} ${
    log.hoursLogged === 1 ? "hour" : "hours"
  }`;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-md overflow-hidden flex items-stretch">

        {/* date */}
        <div className="bg-indigo-800 text-white text-center py-4 px-6 rounded-l-2xl flex flex-col justify-center">
          <div className="text-5xl font-bold leading-none">{day}</div>
          <div className="text-lg mt-2">{month} - {year}</div>
        </div>

        {/* content */}
        <div className="py-4 px-6 flex-grow">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold text-gray-800">{log.title}</h2>
            <span className="text-gray-500">•</span>
            <span className="text-sm text-gray-500">{hoursText}</span>
          </div>

          <div className="text-gray-500 mt-1">
            {log.ownerName} - {log.breed} - {log.animalName}
          </div>

          <div className="text-gray-700 mt-2">{log.description}</div>
        </div>

        {/* edit */}
        <div className="flex items-center justify-center pr-6">
            <img
              src="/images/trainingLogCardEditButton.png"
              alt="Edit Button"
              className="w-12 h-12"
            />
        </div>

      </div>
    </div>
  );
}