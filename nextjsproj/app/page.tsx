'use client'

import Image from "next/image";
import BarChart from "./components/BarChart";
import monthData from '../../month_ct.json';
import { Data } from "./types";

export default function Home() {

  
  var MONTH_DATA : Data[] = [];
  for (var i in Object.keys(monthData)) {
      var key = Object.keys(monthData)[i];
      var data : Data = {
          label: key,
          value: Number(monthData[key])
      }
      MONTH_DATA.push(data);
  }

   return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

      <BarChart data={MONTH_DATA} title="Number of Videos Watched per Month" xlabel="Months" ylabel="Video Count" />
      

    </main>
  );
}
