import { ResponsiveLine } from '@nivo/line'
import type { SliceTooltipProps, Serie } from '@nivo/line'
import type { CartesianMarkerProps } from '@nivo/core'
import { LegendAnchor } from '@nivo/legends'
import { Chip, TableTooltip } from '@nivo/tooltip'
import { useTheme } from '@nivo/core'
import TextNumber from 'components/textNumber'
import { useTheme as useCustomTheme } from '../../hooks/useTheme'

export interface Point {
  x: string
  y: number
}
export function LineChart({
  data,
  anchor,
  // minY,
  stacked,
  markers,
}: {
  data: Serie[]
  anchor?: LegendAnchor
  minY?: number
  stacked?: boolean
  markers?: CartesianMarkerProps[]
}) {
  const { theme } = useCustomTheme()

  return (
    <ResponsiveLine
      markers={markers}
      theme={theme}
      defs={[{ id: 'fill-color', color: 'inherit' }]}
      enableArea
      fill={[{ match: '*', id: 'fill-color' }]}
      colors={(d) => d.color}
      data={data}
      margin={{ top: 20, right: 10, bottom: 30, left: 50 }}
      xScale={{
        type: 'time',
        format: '%d/%m/%Y',
        useUTC: false,
        precision: 'day',
      }}
      xFormat="time:%d/%m/%Y"
      yScale={{
        type: 'linear',
        // min: minY ?? 'auto',
        min: 0,
        max: 'auto',
        stacked,
      }}
      yFormat={(value) => `${value.toLocaleString('he')}`}
      axisBottom={{
        format: '%d/%m/%y',
        // legendPosition: "middle",
        // legendOffset: 40,
        // tickSize: 20,
        legendPosition: 'start',
        ticksPosition: 'after',
        // tickValues: 'every 2 month',
        tickValues: 4,
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
        legendOffset: -40,
        legendPosition: 'middle',
      }}
      enablePoints={false}
      enableSlices="y"
      sliceTooltip={({ slice }) => {
        return <Tooltip slice={slice} />
      }}
      pointSize={10}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
          // data: data.map(({ id, color }) => ({
          //   id,
          //   label: id,
          //   color,
          // })),
          anchor: anchor ?? 'top-left',
          direction: 'column',
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: 'left-to-right',
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: 'circle',
          symbolBorderColor: 'rgba(0, 0, 0, .5)',
          effects: [
            {
              on: 'hover',
              style: {
                itemBackground: 'rgba(0, 0, 0, .03)',
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  )
}

function Tooltip({ slice }: Pick<SliceTooltipProps, 'slice'>) {
  const theme = useTheme()

  return (
    <TableTooltip
      rows={slice.points.map((point) => [
        <Chip key="chip" color={point.serieColor} style={theme.tooltip.chip} />,
        <div key={point.data.xFormatted}>
          <div>{point.data.xFormatted}</div>
          <TextNumber value={point.data.yFormatted} suffix=" ₪" />
        </div>,
      ])}
    />
  )
}
