import { ResponsiveLine } from '@nivo/line'
import { LegendAnchor } from '@nivo/legends'
import style from './LineChart.module.scss'

export interface Point {
  x: string
  y: number
}
export interface Searies {
  id: string
  color: string
  data: Point[]
}
export function LineChart({
  data,
  anchor,
  minY,
  stacked,
}: {
  data: Searies[]
  anchor?: LegendAnchor
  minY?: number
  stacked?: boolean
}) {
  return (
    <ResponsiveLine
      colors={(d) => d.color}
      data={data}
      margin={{ top: 50, right: 10, bottom: 50, left: 60 }}
      xScale={{
        type: 'time',
        format: '%d/%m/%Y',
        useUTC: false,
        precision: 'day',
      }}
      xFormat="time:%d/%m/%Y"
      yScale={{
        type: 'linear',
        min: minY ?? 'auto',
        max: 'auto',
        stacked,
      }}
      yFormat={(value) => `${value.toLocaleString('he')}`}
      axisBottom={null}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legendOffset: -40,
        legendPosition: 'middle',
      }}
      enablePoints={false}
      enableSlices="y"
      sliceTooltip={({ slice }) => {
        return (
          <div
            className={style.tooltip}
            style={{
              color: slice.points[0].serieColor,
            }}
          >
            {slice.points[0].data.xFormatted}

            <div key={slice.points[0].id}>
              <strong>{slice.points[0].data.yFormatted}</strong>
            </div>
          </div>
        )
      }}
      pointSize={10}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
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
