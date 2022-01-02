import * as moment from "moment"
import * as R from "ramda"
import * as React from "react"
import {Item, Stage} from "./main"

interface Props {
  items: Array<Item>
}

export default function Timer(props: Props) {
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
      {R.sortBy(R.prop("minute"), grouped).map((g, i) => {
        return (
          <div
            key={i}
            style={{
              background: "#ccc",
              marginTop: 8,
              padding: 8,
              display: "flex",
            }}
          >
            <div
              style={{marginRight: 16, display: "flex", alignItems: "center"}}
            >
              <h1 style={{margin: 0}}>
                {moment().add(g.minute, "minute").format("HH:mm")}
              </h1>
            </div>
            <div>
              {g.group.map((group, j) => {
                return (
                  <p key={`${i}${j}`}>
                    {group.name} - {group.stage}
                  </p>
                )
              })}
            </div>
          </div>
        )
      })}
    </>
  )
}
