import * as R from "ramda"
import * as React from "react"
import {Item} from "./main"

interface Props {
  items: Array<Item>
  onItemsChange: (changed: Array<Item>) => void
  onGoClick: () => void
}

export default function Items(props: Props) {
  const updateItem = (index: number, item: Item) => {
    const updated = R.update(index, item, props.items)
    props.onItemsChange(updated)
  }

  return (
    <>
      <div style={{display: "flex", justifyContent: "space-between"}}>
        <h1>Timer</h1>
      </div>
      {props.items.map((item, i) => {
        return (
          <div key={i} style={{marginBottom: 24}}>
            <div style={{display: "flex", alignItems: "center"}}>
              <input
                placeholder="Item name"
                value={item.name}
                style={{
                  padding: 8,
                  width: "100%",
                  marginRight: 8,
                  background: "#eee",
                  border: "1px solid",
                }}
                onChange={(e) => {
                  updateItem(i, {...item, name: e.target.value})
                }}
              />
              <img
                src="delete.svg"
                style={{height: 24, cursor: "pointer"}}
                onClick={() => {
                  const updated = R.remove(i, 1, props.items)
                  props.onItemsChange(updated)
                }}
              />
            </div>
            {item.stages.map((s, j) => {
              return (
                <div key={`${i}${j}`} style={{paddingLeft: 16, marginTop: 8}}>
                  <input
                    placeholder="Stage name"
                    value={s.name}
                    style={{
                      width: 200,
                      border: 0,
                      borderBottom: "1px solid",
                      marginRight: 8,
                    }}
                    onChange={(e) => {
                      const stages = R.update(
                        j,
                        {...s, name: e.target.value},
                        item.stages,
                      )

                      updateItem(i, {...item, stages})
                    }}
                  />
                  <input
                    placeholder="Stage duration"
                    type="number"
                    value={s.duration}
                    style={{width: 50}}
                    onChange={(e) => {
                      const stages = R.update(
                        j,
                        {...s, duration: parseInt(e.target.value, 10)},
                        item.stages,
                      )

                      updateItem(i, {...item, stages})
                    }}
                  />{" "}
                  mins
                </div>
              )
            })}
          </div>
        )
      })}
      <div style={{marginTop: 32}}>
        <button
          style={{
            background: "#336699",
            color: "#fff",
            padding: "8px 16px",
            border: 0,
            cursor: "pointer",
          }}
          onClick={props.onGoClick}
        >
          Go
        </button>
      </div>
    </>
  )
}
