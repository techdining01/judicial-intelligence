"use client";

interface CardProps {
  title: string;
  value: number | string;
}

const Card = ({ title, value }: CardProps) => (
  <div className="p-4 bg-white shadow rounded-md w-full sm:w-1/3">
    <h3 className="text-gray-500 text-sm">{title}</h3>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

export default Card;
