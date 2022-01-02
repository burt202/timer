import * as React from "react"
import {useEffect, useRef} from "react"

interface Props {
  start: string
  group: Array<{name: string; stage: string}>
  progress: number
}

export default function Row(props: Props) {
  const previousProgress = usePrevious(props.progress)

  useEffect(() => {
    if (previousProgress && previousProgress < 100 && props.progress >= 100) {
      console.log("complete")
    }
  }, [props.progress])

  return (
    <div
      style={{
        background: `linear-gradient(to right, #559E55 ${props.progress}%, #ccc 0)`,
        marginTop: 8,
        padding: 8,
        display: "flex",
      }}
    >
      <div style={{marginRight: 16, display: "flex", alignItems: "center"}}>
        <h1 style={{margin: 0}}>{props.start}</h1>
      </div>
      <div>
        {props.group.map((group, i) => {
          return (
            <p key={i}>
              {group.name} - {group.stage}
            </p>
          )
        })}
      </div>
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
