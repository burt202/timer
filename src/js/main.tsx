import * as moment from "moment"
import * as React from "react"
import {useState} from "react"
import Items from "./items"
import Timer from "./timer"

export interface Stage {
  name: string
  duration: number
}

export interface Item {
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
  const [startTime, setStartTime] = useState<string | undefined>(undefined)

  return (
    <div style={{width: 1000, margin: "0 auto"}}>
      {startTime ? (
        <Timer items={items} startTime={startTime} />
      ) : (
        <Items
          items={items}
          onGoClick={() => setStartTime(moment().format())}
        />
      )}
    </div>
  )
}
