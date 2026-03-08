"use client";

interface CardProps {
  title: string;
  value: number | string;
}

const Card = ({ title, value }: CardProps) => (
  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm w-full">
    <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
    <p className="mt-1 text-2xl font-bold text-slate-800">{value}</p>
  </div>
);

export default Card;
