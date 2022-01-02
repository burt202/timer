import * as moment from "moment"
import * as R from "ramda"
import * as React from "react"
import {useEffect, useState} from "react"
import {Item, Stage} from "./main"
import Row from "./row"

interface Props {
  items: Array<Item>
}

function round(num: number, decimals: number) {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

function getProgress(start: number, end: number, currentTime: number) {
  if (currentTime > end) {
    return 100
  }

  if (currentTime < start) {
    return 0
  }

  const upper = end - start
  const progress = currentTime - start

  return round((progress / upper) * 100, 2)
}

export default function Timer(props: Props) {
  const [currentTime, setCurrentTime] = useState(moment().format("HHmmss"))

  useEffect(() => {
    const interval = setInterval(
      () => setCurrentTime(moment().format("HHmmss")),
      1000,
    )
    return () => {
      clearInterval(interval)
    }
  }, [])

  const withTotal = R.pipe(
    R.map((i: Item) => {
      const total = R.pipe(
        R.map((s: Stage) => s.duration),
        R.sum,
      )(i.stages)
      return {...i, total}
    }),
  )(props.items)

  const total = Math.max.apply(null, R.pluck("total", withTotal))

  const flattened = R.flatten(
    withTotal.map((p) => {
      return p.stages.map((s, i) => {
        const duration = R.sum(
          R.pluck("duration")(R.takeLast(p.stages.length - i, p.stages)),
        )

        return {
          name: p.name,
          stage: s.name,
          minute: total - duration,
        }
      })
    }),
  )

  const grouped = R.toPairs(
    R.groupBy((a) => a.minute.toString(), flattened),
  ).map(([minute, group]) => {
    return {minute, group}
  })

  const readyAt = moment().add(total, "minute").format("HH:mm")

  const sorted = R.sortBy(R.prop("minute"), grouped)

  return (
    <>
      <div style={{display: "flex", justifyContent: "space-between"}}>
        <h1>Timer</h1>
        <div
          style={{
            background: "#336699",
            marginTop: 8,
            color: "white",
            display: "flex",
            flexDirection: "column",
            padding: 8,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span>Ready at</span>
          <span style={{fontSize: 20}}>{readyAt}</span>
        </div>
      </div>
      {sorted.map((g, i) => {
        const minute = moment().add(g.minute, "minute").format("HH:mm")
        const start = moment(minute, "HH:mm").format("HHmmss")
        const nextMinute = sorted[i + 1]
          ? moment()
              .add(sorted[i + 1].minute, "minute")
              .format("HH:mm")
          : readyAt
        const end = moment(nextMinute, "HH:mm")
          .subtract(1, "second")
          .format("HHmmss")

        const progress = getProgress(
          parseInt(start, 10),
          parseInt(end, 10),
          parseInt(currentTime, 10),
        )

        return (
          <Row key={i} minute={minute} group={g.group} progress={progress} />
        )
      })}
    </>
  )
}
