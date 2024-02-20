'use client'
import { ScaleBand, ScaleLinear, axisBottom, axisLeft, scaleBand, scaleLinear, select } from "d3";
import { useEffect, useRef } from "react";
import monthData from '../../../month_ct.json';
import {Data, AxisBottomProps, AxisLeftProps, BarsProps, BarChartProps} from '../types'

const DATA: Data[] = [
    { label: "Apples", value: 100 },
    { label: "Bananas", value: 200 },
    { label: "Oranges", value: 50 },
    { label: "Kiwis", value: 150 }
];

var MONTH_DATA : Data[] = [];
for (var i in Object.keys(monthData)) {
    var key = Object.keys(monthData)[i];
    var data : Data = {
        label: key,
        value: Number(monthData[key])
    }
    MONTH_DATA.push(data);
}

/**
 * AxisBottom: Renders g element used to draw horizontal axis.
 * @param param0 
 * @returns 
 */
function AxisBottom({ scale, transform }: AxisBottomProps) {
    const ref = useRef<SVGGElement>(null);
  
    useEffect(() => {
      if (ref.current) {
        select(ref.current).call(axisBottom(scale));
      }
    }, [scale]);
  
    return <g ref={ref} transform={transform} style={{fontSize: "16px"}} />;
}

/**
 * AxisLeft: Renders g component to draw vertical axis
 * @param param0 
 * @returns 
 */
function AxisLeft({ scale }: AxisLeftProps) {
    const ref = useRef<SVGGElement>(null);
  
    useEffect(() => {
      if (ref.current) {
        select(ref.current).call(axisLeft(scale));
      }
    }, [scale]);
  
    return <g ref={ref} style={{fontSize:"16px"}} />;
}

function Bars({ data, height, scaleX, scaleY }: BarsProps) {
    return (
      <>
        {data.map(({ value, label }) => (
          <rect
            key={`bar-${label}`}
            x={scaleX(label)}
            y={scaleY(value)}
            width={scaleX.bandwidth()}
            height={height - scaleY(value)}
            fill="teal"
          />
        ))}
      </>
    );
  }
  
  
  
  
export default function MonthsChart() {
    const margin = { top: 10, right: 0, bottom: 30, left: 50 }; // how do we come up with these values?
    const width = 1000;
    const height = 400;

    // Define X axis
    const scaleX = scaleBand()
        .domain(MONTH_DATA.map(({ label }) => label))
        .range([0, width])
        .padding(0.25); // add padding between categories.

    // Define Y axis
    const scaleY = scaleLinear()
        .domain([0, Math.max(...MONTH_DATA.map(({ value }) => value))])
        .range([height, 0]);

    return (
        <svg
            width={width + margin.left + margin.right}
            height={height + margin.top + margin.bottom}>

                {/* Container for x-axis, y-axis, bars */}
                {/* Transform: Creates space to properly render elems */}
                <g transform={`translate(${margin.left}, ${margin.top})`}>
                    <AxisBottom scale={scaleX} transform={`translate(0, ${height})`} />
                    <AxisLeft scale={scaleY} />
                    <Bars data={MONTH_DATA} height={height} scaleX={scaleX} scaleY={scaleY} />
                </g>
        </svg>
    );
}