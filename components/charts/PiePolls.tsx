'use client';

import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import type { LegendProps, TooltipProps, LegendPayload } from 'recharts';
import { Poll, PollOption } from '@/lib/types';


const generateConsistentColor = (text: string): string => {
  // Simple but effective hash for short strings
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Use golden ratio conjugate for hue distribution
  const goldenRatio = 0.618033988749895;
  const hue = (hash * goldenRatio) % 1;

  // Fixed saturation and lightness for good contrast
  const saturation = 0.7 + (hash % 0.3); // 70-100%
  const lightness = 0.5 + (hash % 0.2);  // 50-70%

  // Convert to HSL string
  return `hsl(${Math.round(hue * 360)}, ${Math.round(saturation * 100)}%, ${Math.round(lightness * 100)}%)`;
};

interface CustomLegendProps extends LegendProps {
  payload?: readonly LegendPayload[];
}

const renderCustomizedLegend = (props: CustomLegendProps) => {
  const { payload } = props;

  if (!payload) return null;

  // Filter out the "Votes" entry and get actual option data
  const optionPayload = payload.filter(item =>
    item.type !== 'line' && item.value !== 'Votes'
  );

  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {optionPayload.map((entry, index) => (
        <div key={`legend-${index}`} className="flex items-center">
          <div
            className="w-4 h-4 mr-2"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

// Properly typed tooltip props
interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: {
    payload: PollOption & { color: string; percentage: number };
  }[];
  label?: string;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;
  return (
    <div className="bg-gray-600 text-white p-4 border border-gray-200 rounded shadow-lg">
      <p className="font-semibold">{data.text}</p>
      <p>Votes: {data.votes}</p>
      <p>Percentage: {data.percentage}%</p>
    </div>
  );
};

const PollChart = ({ poll }: { poll: Poll }) => {
  const [chartType, setChartType] = useState<'bar' | 'pie'>('pie');

  const dataWithColors = useMemo(() => (
    poll.options.map(option => ({
      ...option,
      color: generateConsistentColor(option.text),
      name: option.text
    }))
  ), [poll.options]);
  console.log("data with colors:", dataWithColors);

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="chartType"
            checked={chartType === 'bar'}
            onChange={() => setChartType('bar')}
            className="text-indigo-600 focus:ring-indigo-500"
          />
          Bar Chart
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="chartType"
            checked={chartType === 'pie'}
            onChange={() => setChartType('pie')}
            className="text-indigo-600 focus:ring-indigo-500"
          />
          Pie Chart
        </label>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart
              data={dataWithColors}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="text"
                angle={-45}
                textAnchor="end"
                height={70}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                content={(props) =>
                  renderCustomizedLegend({
                    ...props, height: Number(props.height), width: Number(props.width)
                  })
                }
                wrapperStyle={{ paddingTop: '10px' }}
              />
              <Bar dataKey="votes" name="Votes">
                {dataWithColors.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    name={entry.text}
                  />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={dataWithColors}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="percentage"
                nameKey="text"
                label={({ name, percent }) => percent ? `${name}: ${(percent * 100).toFixed(0)}%` : `${name}`}
              >
                {dataWithColors.map((entry, index) => (
                  <Cell
                    key={`pie-cell-${index}`}
                    fill={entry.color}
                    name={entry.text}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                content={(props) =>
                  renderCustomizedLegend({
                    ...props, height: Number(props.height), width: Number(props.width)
                  })
                }
                wrapperStyle={{ paddingTop: '20px' }}
              />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PollChart;
