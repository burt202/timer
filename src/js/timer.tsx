import * as moment from "moment"
import * as React from "react"
import {useEffect, useState} from "react"
import {Item} from "./main"
import Row from "./row"
import {getProgress, processItems} from "./utils"

interface Props {
  items: Array<Item>
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

  const {items, total} = processItems(props.items)
  const readyAt = moment().add(total, "minute").format("HH:mm")

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
      {items.map((g, i) => {
        const minute = moment().add(g.minute, "minute").format("HH:mm")
        const start = moment(minute, "HH:mm").format("HHmmss")
        const nextMinute = items[i + 1]
          ? moment()
              .add(items[i + 1].minute, "minute")
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
