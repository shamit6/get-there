import { ResponsiveBar } from '@nivo/bar'
import { useTheme } from '@nivo/core'
import { useTheme as useCustomTheme } from '../../hooks/useTheme'
import type { AxisTickProps } from '@nivo/axes'

export function BarChart({
  data,
  indexBy,
  keys,
}: {
  data: any
  indexBy: string
  keys: string[]
}) {
  const { theme } = useCustomTheme()

  return (
    <ResponsiveBar
      theme={theme}
      data={data}
      keys={keys}
      indexBy={indexBy}
      // margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      margin={{ top: 20, right: 130, bottom: 30, left: 50 }}
      padding={0.3}
      valueScale={{ type: 'linear' }}
      valueFormat={(value) => `${value.toLocaleString('he')}`}
      indexScale={{ type: 'band', round: true }}
      colors={{ scheme: 'nivo' }}
      defs={[
        {
          id: 'dots',
          type: 'patternDots',
          background: 'inherit',
          color: '#38bcb2',
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: 'lines',
          type: 'patternLines',
          background: 'inherit',
          color: '#eed312',
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      fill={[
        {
          match: {
            id: 'fries',
          },
          id: 'dots',
        },
        {
          match: {
            id: 'sandwich',
          },
          id: 'lines',
        },
      ]}
      borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        renderTick: ErningSpendingTick,
      }}
      axisLeft={{
        format: (value) =>
          Intl.NumberFormat('en-US', {
            maximumFractionDigits: 1,
            notation: 'compact',
            compactDisplay: 'short',
          }).format(value),
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: '',
        legendPosition: 'middle',
        legendOffset: -40,
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
      legends={[
        {
          dataFrom: 'keys',
          anchor: 'bottom-right',
          direction: 'column',
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: 'left-to-right',
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: 'hover',
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  )
}

function ErningSpendingTick(tick: AxisTickProps<string>) {
  const theme = useTheme()

  return (
    <g transform={`translate(${tick.x},${tick.y + 10})`}>
      {tick.value.split(' ').map((word, index) => (
        <text
          key={word}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            ...theme.axis.ticks.text,
            transform: `translateY(${index * 12}px)`,
            fontSize: 10,
          }}
        >
          {word}
        </text>
      ))}
    </g>
  )
}
