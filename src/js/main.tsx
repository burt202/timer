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

const defaultItems = [
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

function validateItems(items: Array<Item>) {
  return items.filter((item) => {
    const hasEmptyStageNames = item.stages.some((stage) => {
      return stage.name.length === 0
    })

    return item.name.length === 0 || hasEmptyStageNames
  })
}

export default function Main() {
  const [startTime, setStartTime] = useState<string | undefined>(undefined)
  const [items, setItems] = useState(defaultItems)
  const [error, setError] = useState<string | undefined>(undefined)

  return (
    <div className="main">
      {startTime ? (
        <Timer
          items={items}
          startTime={startTime}
          onBackClick={() => {
            setStartTime(undefined)
          }}
        />
      ) : (
        <Items
          items={items}
          onItemsChange={(changed: Array<Item>) => {
            setItems(changed)
          }}
          onGoClick={() => {
            const errors = validateItems(items)

            if (errors.length > 0) {
              setError("No item or stage names can be empty")
              return
            }

            setStartTime(moment().format())
            window.scrollTo(0, 0)
          }}
          error={error}
        />
      )}
    </div>
  )
}
