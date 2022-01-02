import * as React from "react"

interface Props {
  minute: string
  group: Array<{name: string; stage: string}>
  progress: number
}

export default function Row(props: Props) {
  console.log("progress", props.progress)

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
        <h1 style={{margin: 0}}>{props.minute}</h1>
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
