import * as moment from "moment"
import * as React from "react"
import {useEffect, useState} from "react"
import {Item} from "./main"
import Row from "./row"
import {getProgress, processItems} from "./utils"

interface Props {
  items: Array<Item>
  startTime: string
  onEditClick: () => void
}

export default function Timer(props: Props) {
  const [currentTime, setCurrentTime] = useState(moment())

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(moment()), 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  const {items, total} = processItems(props.items)
  const readyAt = moment(props.startTime).add(total, "minute")

  return (
    <>
      <div style={{display: "flex", justifyContent: "space-between"}}>
        <h1>Timer</h1>
        <div style={{display: "flex", marginTop: 8}}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 32,
            }}
          >
            <a
              style={{
                cursor: "pointer",
                textDecoration: "underline",
                color: "#336699",
              }}
              onClick={props.onEditClick}
            >
              Edit
            </a>
          </div>
          <div
            style={{
              background: "#336699",
              color: "white",
              display: "flex",
              flexDirection: "column",
              padding: 8,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <span>Ready at</span>
            <span style={{fontSize: 20}}>
              {readyAt.clone().format("HH:mm")}
            </span>
          </div>
        </div>
      </div>
      {items.map((g, i) => {
        const lower = moment(props.startTime).add(g.minute, "minute")
        const upper = items[i + 1]
          ? moment(props.startTime).add(items[i + 1].minute, "minute")
          : readyAt

        const progress = getProgress(lower, upper, currentTime)

        return (
          <Row
            key={i}
            start={lower.clone().format("HH:mm")}
            group={g.group}
            progress={progress}
          />
        )
      })}
    </>
  )
}
