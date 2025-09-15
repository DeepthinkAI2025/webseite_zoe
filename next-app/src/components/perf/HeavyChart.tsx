"use client";
// Simuliert eine größere Client-Komponente (Lazy Loading Demo)
import { useEffect, useState } from 'react';

export default function HeavyChart(){
  const [data,setData] = useState<number[]>([]);
  useEffect(()=>{
    // Fake compute
    const arr = Array.from({length:5000}, (_,i)=> Math.sin(i/10) * Math.random());
    setData(arr.slice(0,50));
  },[]);
  return (
    <div className="rounded border p-4 bg-white/50 dark:bg-neutral-800/40 text-xs overflow-x-auto">
      <p className="font-medium mb-2">Lazy Chart (Demo)</p>
      <pre className="leading-tight whitespace-pre">{JSON.stringify(data,null,2)}</pre>
    </div>
  );
}
