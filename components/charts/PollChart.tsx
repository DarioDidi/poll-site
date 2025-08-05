import { Poll } from "@/lib/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';



interface PollChartProps {
  poll: Poll
}

const PollChart: React.FC<PollChartProps> = ({ poll }) => {
  const chartData = poll.options.map(option => ({
    name: option.text,
    votes: option.votes,
    percentage: option.percentage
  }));

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={70}
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip
            formatter={(value, name) => {
              if (name === 'percentage') {
                return [`${value}%`, 'Percentage'];
              }
              return [value, 'Votes'];
            }}
            labelFormatter={(label) => `Option: ${label}`}
          />
          <Legend />
          <Bar
            dataKey="votes"
            name="Votes"
            fill="#8884d8"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="percentage"
            name="Percentage"
            fill="#82ca9d"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}


export default PollChart;
