import moment from "moment"
import React, {useEffect, useRef} from "react"

import {useAlarm} from "./useAlarm"

interface Props {
  start: string
  items: Array<{name: string; stage: string}>
  progress: number
  onExtend: () => void
}

export default function Group(props: Props) {
  const previousProgress = usePrevious(props.progress)
  const alarm = useAlarm()

  useEffect(() => {
    if (previousProgress && previousProgress < 100 && props.progress >= 100) {
      alarm()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.progress])

  const isInProgress = props.progress > 0 && props.progress < 100

  return (
    <div
      style={{
        background: `linear-gradient(to right, #559E55 ${props.progress}%, #ccc 0)`,
        marginTop: 8,
        padding: 8,
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div style={{display: "flex"}}>
        <div style={{marginRight: 16, display: "flex", alignItems: "center"}}>
          <h1 style={{margin: 0}}>{moment(props.start).format("HH:mm")}</h1>
        </div>
        <div>
          {props.items.map((item, i) => {
            return (
              <p key={i}>
                {item.name} - {item.stage}
              </p>
            )
          })}
        </div>
      </div>
      {isInProgress && (
        <div style={{display: "flex", alignItems: "center"}}>
          <a
            style={{
              cursor: "pointer",
              textDecoration: "underline",
              color: "#336699",
            }}
            onClick={props.onExtend}
          >
            Extend
          </a>
        </div>
      )}
    </div>
  )
}

function usePrevious<T>(value: T) {
  const ref = useRef<T>()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}
