// TO COMPLETE
import {groups, quantile, select, scaleSequential, interpolatePiGY} from "d3"
import {useRef, useEffect} from 'react'

function Year({years}){
    const ref = useRef<SVGGElement>(null);

    useEffect(() => {
      if (ref.current) {
        select(ref.current);
      }
    }, [years]);
}

export default function Calendar(){
    const width = 928; // width of chart
    const cellSize = 17; // height of one cell 
    const height = cellSize * 7; // height of a week (5 days + padding) 

    // Formatting functions for axes, tooltips
    const formatValue = d3.format("+2%");
    const formatClose = d3.format("$,.2f");
    const formatDate = d3.utcFormat("%x"); // %-m/%-d/%Y
    const formatDay = i => "SMTWTFS"[i]; // WOW this is a smart way to do it. i \in {0,...,6}
    const formatMonth = d3.utcFormat("%b"); // abbreviated month name

    // Helpers, compute day's position within a week
    const timeWeek = d3.utcMonday; // Monday-based weeks in UTC time (e.g., February 6, 2012 at 12:00 AM)... wait this fcn would've been so helpful for SRT
    const countDay = i => (i + 6) % 7;

    // Compute values to color the cells
    const data = [
       { date: new Date(2024, 1, 1), value: 10 },
       { date: new Date(2024, 1, 2), value: 20 },
    ]

    // Do some math, define color scale
    const max = quantile(data, 0.9975, d => Math.abs(d.value));
    const color = scaleSequential(interpolatePiGY).domain([-max, +max]);

    // Group data by year
    const years = groups(data, d => d.date.getUTCFullYear());
    
    // Draw white line to the left of each month
    function pathMonth(t){
	    const d = Math.max(0, Math.min(5, countDay(t.getUTCDay())));
	    const w = timeWeek.count(d3.utcYear(t), t);
             return `${d === 0 ? `M${w * cellSize},0`
        	: d === 5 ? `M${(w + 1) * cellSize},0`
	        : `M${(w + 1) * cellSize},0V${d * cellSize}H${w * cellSize}`}V${5 * cellSize}`;
    }

    return (
	    <svg width={width} height={height * years.length} 
	            viewBox={`[0, 0, ${width}, ${height * years.length}`} 
		    style={{"maxWidth": "100%", "height": "auto", "font": "10px sans-serif"}}>
            </svg>
    )

}
