import * as R from "ramda"
import * as React from "react"
import {Item} from "./main"

interface Props {
  items: Array<Item>
  onItemsChange: (changed: Array<Item>) => void
  onGoClick: () => void
  error?: string
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
        <div style={{display: "flex", marginTop: 8}}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <a
              style={{
                cursor: "pointer",
                textDecoration: "underline",
                color: "#336699",
              }}
              onClick={() => {
                const cleared = [{name: "", stages: [{name: "", duration: 1}]}]
                props.onItemsChange(cleared)
              }}
            >
              Clear All
            </a>
          </div>
        </div>
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
            <div style={{paddingLeft: 16}}>
              {item.stages.map((s, j) => {
                return (
                  <div key={`${i}${j}`} style={{marginTop: 8}}>
                    <input
                      placeholder="Stage name"
                      value={s.name}
                      style={{
                        width: 150,
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
                      type="number"
                      value={s.duration}
                      style={{width: 50}}
                      onChange={(e) => {
                        const duration =
                          e.target.value.length === 0
                            ? 1
                            : parseInt(e.target.value, 10)

                        const stages = R.update(
                          j,
                          {...s, duration: duration < 1 ? 1 : duration},
                          item.stages,
                        )

                        updateItem(i, {...item, stages})
                      }}
                    />{" "}
                    mins
                    {j > 0 && (
                      <a
                        style={{
                          marginLeft: 24,
                          cursor: "pointer",
                          textDecoration: "underline",
                          color: "#336699",
                        }}
                        onClick={() => {
                          const stages = R.remove(j, 1, item.stages)
                          updateItem(i, {...item, stages})
                        }}
                      >
                        Remove
                      </a>
                    )}
                  </div>
                )
              })}
              <a
                style={{
                  marginTop: 8,
                  display: "inline-block",
                  cursor: "pointer",
                  textDecoration: "underline",
                  color: "#336699",
                }}
                onClick={() => {
                  const stages = [...item.stages, {name: "", duration: 1}]
                  updateItem(i, {...item, stages})
                }}
              >
                Add
              </a>
            </div>
          </div>
        )
      })}
      <div style={{display: "flex", justifyContent: "flex-end"}}>
        <button
          style={{
            background: "#ccc",
            padding: "8px 16px",
            border: 0,
            cursor: "pointer",
          }}
          onClick={() => {
            const updated = [
              ...props.items,
              {name: "", stages: [{name: "", duration: 1}]},
            ]
            props.onItemsChange(updated)
          }}
        >
          Add Item
        </button>
      </div>
      <div style={{marginTop: 16}}>
        {props.error && <p style={{color: "red"}}>{props.error}</p>}
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
