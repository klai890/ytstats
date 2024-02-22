'use client'
import { ScaleBand, ScaleLinear, axisBottom, axisLeft, scaleBand, scaleLinear, select } from "d3";
import { useEffect, useRef } from "react";
import {Data, AxisBottomProps, AxisLeftProps, BarsProps, BarChartProps} from '../types'

const DATA: Data[] = [
    { label: "Apples", value: 100 },
    { label: "Bananas", value: 200 },
    { label: "Oranges", value: 50 },
    { label: "Kiwis", value: 150 }
];

/**
 * AxisBottom: Renders g element used to draw horizontal axis.
 * @param param0 
 * @returns 
 */
function AxisBottom({ scale, transform }: AxisBottomProps) {
    const ref = useRef<SVGGElement>(null);
  
    // Set ref to SVG element
    useEffect(() => {
      if (ref.current) {
        select(ref.current).call(axisBottom(scale).tickPadding(5));
      }
    }, [scale]);
  
    return <g ref={ref} transform={transform} style={{fontSize: "12px"}} />;
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
  
    return <g ref={ref} style={{fontSize:"12px"}} />;
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
            fill="steelblue"
          />
        ))}
      </>
    );
  }
  
  
  
  
export default function BarChart({data, title, xlabel, ylabel} : BarChartProps) {
    const margin = { top: 30, right: 0, bottom: 60, left: 80 }; // how do we come up with these values?
    const width = 800;
    const height = 500;

    // Define X axis
    const scaleX = scaleBand()
        .domain(data.map(({ label }) => label))
        .range([0, width])
        .padding(0.15); // add padding between categories.

    // Define Y axis
    const scaleY = scaleLinear()
        .domain([0, Math.max(...data.map(({ value }) => value))])
        .range([height, 0]);

    
    function sortData(){
      data.sort(function(a,b) { return +a.value - +b.value })
    }

    return (
      <>
        <svg
            width={width + margin.left + margin.right}
            height={height + margin.top + margin.bottom}
            >

                {/* Container for x-axis, y-axis, bars */}
                {/* Transform: Creates space to properly render elems */}
                <g transform={`translate(${margin.left}, ${margin.top})`}>
                    <AxisBottom scale={scaleX} transform={`translate(0, ${height})`} />
                    <text textAnchor="middle" x={width/2} y={height + margin.top + 20} fontSize="16px">{xlabel}</text>
                    <AxisLeft scale={scaleY} />
                    <text textAnchor="middle" x={-height/2 + margin.top} y={-margin.left * (2/3)} fontSize="16px" transform={"rotate(-90)"}>{ylabel}</text>
                    <Bars data={data} height={height} scaleX={scaleX} scaleY={scaleY} />
                    <text textAnchor="middle" x={width/2} y={-10} fontSize="18px" textDecoration="underline">{title}</text>
                </g>
        </svg>
      </>
    );
}