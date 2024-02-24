'use client'

import Image from "next/image";
import BarChart from "./components/BarChart";
import monthData from '../../month_ct.json';
import dayData from '../../day_ct.json';
import monthYearData from '../../month_year_ct.json';
import { Data } from "./types";
import {useState, useRef} from 'react';
import Conditional from "./components/Conditional";
import Calendar from "./components/Calendar";

export default function Home() {

  // load month data from month_ct.json: for month vs vid count 
  var MONTH_DATA : Data[] = [];
  for (var i in Object.keys(monthData)) { var key = Object.keys(monthData)[i]; var data : Data = { label: key, value: Number(monthData[key])
      }
      MONTH_DATA.push(data);
  }
  
  // load week data from day_ct: for day of week vs vid count
  var DAY_DATA: Data[] = [];
  for (var i in Object.keys(dayData)) {
      var key = Object.keys(dayData)[i];
      var data : Data = {
          label: key,
          value: Number(dayData[key])
      }
      DAY_DATA.push(data);
  }

   var MONTH_YEAR_DATA : Data[] = [];
   for (var i in Object.keys(monthYearData)){
	   var key = Object.keys(monthYearData)[i];
	   var data : Data = {
		   label: key,
		   value: Number(monthYearData[key])
	   }
	   MONTH_YEAR_DATA.push(data);
   }
   MONTH_YEAR_DATA = MONTH_YEAR_DATA.slice(0, 12); 

     const calendarData = [
	    { date: new Date(2024, 1, 1), value: 10 },
	    { date: new Date(2024, 1, 2), value: 20 },
     ];

   enum Graph {
	   MONTH_VS_COUNT = 1,
	   DAY_VS_COUNT = 2,
	   CHRON_COUNT = 3,
   }

   const dropdownMenuRef = useRef();
   const toggleArrowRef = useRef();
   const [graph, setGraph] = useState(Graph.MONTH_VS_COUNT); 
   const [year, getYear] = useState(); // note, only valid if graph selected is YEAR_VS_CT

   function toggleDropdown(){
	    if (dropdownMenuRef){
		if (dropdownMenuRef.current.className == "dropdown show"){
			dropdownMenuRef.current.className = "dropdown";
		}
		else {
			dropdownMenuRef.current.className = "dropdown show";
		}
	    }

	    if (toggleArrowRef){
		    if (toggleArrowRef.current.className != "bx bx-chevron-down arrow"){
			    toggleArrowRef.current.className = "bx bx-chevron-down arrow";
		    }
		    else {
			    toggleArrowRef.current.className = "bx bx-chevron-down"
		    }
	    }
   }

   return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24"> 
    <div style={{"position": "absolute", "left": "300px", "top": "50px"}}>
	    <button class="btn" id="btn" onClick={() => toggleDropdown()}>
	    	Select Graph
    		 <i class="bx bx-chevron-down" id="arrow" ref={toggleArrowRef}></i>
	    </button>

    <div class="dropdown" id="dropdown" ref={dropdownMenuRef}>
	    <p onClick={()=> setGraph(Graph.MONTH_VS_COUNT)}>Month vs Video Count</p>
	    <p onClick={() => setGraph(Graph.DAY_VS_COUNT)}>Day of Week vs Video Count</p>
	    <p onClick={() => setGraph(Graph.CHRON_COUNT)}>Chronological Video Count (per month/year)</p>
    </div>

      <Conditional showWhen={graph == Graph.MONTH_VS_COUNT}>	    
	      <BarChart  data={MONTH_DATA} title="Number of Videos Watched per Month" xlabel="Months" ylabel="Video Count" />
      </Conditional>

      <Conditional showWhen={graph == Graph.DAY_VS_COUNT}>
	      <BarChart  data={DAY_DATA} title="Number of Videos Watched per Day of Week" xlabel="Day of Week" ylabel="Video Count" /> 
      </Conditional>

      <Conditional showWhen={graph == Graph.CHRON_COUNT}>
	      <BarChart  data={MONTH_YEAR_DATA} title="Number of Videos Watched per Month/Year" xlabel="Month/Year" ylabel="Video Count" /> 
      </Conditional>
    </div>

    </main>
  ) 
}
