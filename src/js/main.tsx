import moment from "moment"
import React, {useEffect, useState} from "react"
import * as uuid from "uuid"

import Items from "./items"
import Timer from "./timer"

export interface Stage {
  id: string
  name: string
  duration: number
}

export interface Item {
  id: string
  name: string
  stages: Array<Stage>
}

const defaultItems = [
  {
    id: uuid.v4(),
    name: "Carrots",
    stages: [{id: uuid.v4(), name: "Boil", duration: 20}],
  },
  {
    id: uuid.v4(),
    name: "Brocolli",
    stages: [{id: uuid.v4(), name: "Boil", duration: 5}],
  },
  {
    id: uuid.v4(),
    name: "Peas",
    stages: [
      {id: uuid.v4(), name: "Bring water to boil", duration: 10},
      {id: uuid.v4(), name: "Boil", duration: 4},
    ],
  },
  {
    id: uuid.v4(),
    name: "Pigs in blankets",
    stages: [{id: uuid.v4(), name: "Put in oven", duration: 30}],
  },
  {
    id: uuid.v4(),
    name: "Stuffing",
    stages: [{id: uuid.v4(), name: "Put in oven", duration: 30}],
  },
  {
    id: uuid.v4(),
    name: "Potatoes",
    stages: [
      {id: uuid.v4(), name: "Boil", duration: 15},
      {id: uuid.v4(), name: "Roast", duration: 60},
    ],
  },
  {
    id: uuid.v4(),
    name: "Plates",
    stages: [{id: uuid.v4(), name: "Put in oven", duration: 20}],
  },
  {
    id: uuid.v4(),
    name: "Yorkshires",
    stages: [{id: uuid.v4(), name: "Put in oven", duration: 5}],
  },
  {
    id: uuid.v4(),
    name: "Beef",
    stages: [
      {id: uuid.v4(), name: "Roast", duration: 43},
      {id: uuid.v4(), name: "Rest", duration: 15},
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
  const [page, setPage] = useState("items")
  const [mode, setMode] = useState("add")
  const [items, setItems] = useState(defaultItems)
  const [error, setError] = useState<string | undefined>(undefined)

  useEffect(() => {
    const onBeforeUnload = (ev: Event) => {
      if (page === "timer") {
        ev.preventDefault()
        return true
      }
    }

    window.addEventListener("beforeunload", onBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload)
    }
  }, [page])

  return (
    <div className="main">
      {page === "timer" && startTime ? (
        <Timer
          items={items}
          startTime={startTime}
          onEditClick={() => {
            setPage("items")
            setMode("edit")
          }}
          onResetTimerClick={() => {
            if (confirm("Are you sure?")) {
              setStartTime(moment().format())
            }
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

            setPage("timer")

            if (mode === "add") {
              setStartTime(moment().format())
            }

            window.scrollTo(0, 0)
          }}
          error={error}
        />
      )}
    </div>
  )
}
