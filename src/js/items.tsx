import * as React from "react"
import {Item} from "./main"

interface Props {
  items: Array<Item>
  onGoClick: () => void
}

export default function Items(props: Props) {
  return (
    <>
      <div style={{display: "flex", justifyContent: "space-between"}}>
        <h1>Timer</h1>
      </div>
      <h3 style={{textDecoration: "underline", marginTop: 0}}>Items</h3>
      {props.items.map((item, i) => {
        return (
          <div key={i} style={{marginBottom: 8}}>
            <h4 style={{margin: 0}}>{item.name}</h4>
            {item.stages.map((s, j) => {
              return (
                <p key={`${i}${j}`} style={{paddingLeft: 16, margin: 0}}>
                  - {s.name} ({s.duration} mins)
                </p>
              )
            })}
          </div>
        )
      })}
      <div style={{marginTop: 32}}>
        <button onClick={props.onGoClick}>Go</button>
      </div>
    </>
  )
}
