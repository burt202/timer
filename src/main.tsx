import * as moment from "moment"
import * as R from "ramda"
import * as React from "react"
import {useState} from "react"

interface Stage {
  name: string
  duration: number
}

interface Item {
  name: string
  stages: Array<Stage>
}

const items = [
  {name: "Carrots", stages: [{name: "Boil", duration: 20}]},
  {name: "Brocolli", stages: [{name: "Boil", duration: 5}]},
  {
    name: "Peas",
    stages: [
      {name: "Bring water to boil", duration: 10},
      {name: "Boil", duration: 4},
    ],
  },
  {name: "Pigs in blankets", stages: [{name: "Put in oven", duration: 30}]},
  {name: "Stuffing", stages: [{name: "Put in oven", duration: 30}]},
  {
    name: "Potatoes",
    stages: [
      {name: "Boil", duration: 15},
      {name: "Roast", duration: 60},
    ],
  },
  {name: "Plates", stages: [{name: "Put in oven", duration: 20}]},
  {name: "Yorkshires", stages: [{name: "Put in oven", duration: 5}]},
  {
    name: "Beef",
    stages: [
      {name: "Roast", duration: 43},
      {name: "Rest", duration: 15},
    ],
  },
] as Array<Item>

export default function Main() {
  const [stage, setStage] = useState(0)

  const withTotal = R.pipe(
    R.map((i: Item) => {
      const total = R.pipe(
        R.map((s: Stage) => s.duration),
        R.sum,
      )(i.stages)
      return {...i, total}
    }),
  )(items)

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
    <div style={{width: 1000, margin: "0 auto"}}>
      <div style={{display: "flex", justifyContent: "space-between"}}>
        <h1>Timer</h1>
        {stage === 1 && (
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
        )}
      </div>
      {stage === 0 && (
        <>
          <h3 style={{textDecoration: "underline", marginTop: 0}}>Items</h3>
          {items.map((item, i) => {
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
            <button onClick={() => setStage(1)}>Go</button>
          </div>
        </>
      )}
      {stage === 1 &&
        R.sortBy(R.prop("minute"), grouped).map((g, i) => {
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
    </div>
  )
}
