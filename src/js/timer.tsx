import moment from "moment"
import * as R from "ramda"
import React, {useEffect, useState} from "react"

import Group from "./group"
import {Item} from "./main"
import {getPreviousExtends, getProgress, processItems} from "./utils"

interface Props {
  items: Array<Item>
  startTime: string
  onEditClick: () => void
  onResetTimerClick: () => void
}

export default function Timer(props: Props) {
  const result = processItems(props.startTime, props.items)

  const [currentTime, setCurrentTime] = useState(moment().format())
  const [groups, setGroups] = useState(
    result.groups.map((g) => {
      return {...g, extend: 0}
    }),
  )

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(moment().format()), 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    setGroups(
      result.groups.map((g) => {
        return {...g, extend: 0}
      }),
    )
  }, [props.startTime])

  const totalExtends = R.sum(R.pluck("extend", groups))
  const readyAt = moment(props.startTime).add(
    result.total + totalExtends,
    "minute",
  )

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
              marginRight: 32,
            }}
          >
            <a
              style={{
                cursor: "pointer",
                textDecoration: "underline",
                color: "#336699",
              }}
              onClick={props.onResetTimerClick}
            >
              Reset Timer
            </a>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 32,
            }}
          >
            <a
              style={{
                cursor: "pointer",
                textDecoration: "underline",
                color: "#336699",
              }}
              onClick={props.onEditClick}
            >
              Edit
            </a>
          </div>
          <div
            style={{
              background: "#336699",
              color: "white",
              display: "flex",
              flexDirection: "column",
              padding: 8,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <span>Ready at</span>
            <span style={{fontSize: 20}}>
              {readyAt.clone().format("HH:mm")}
            </span>
          </div>
        </div>
      </div>
      {groups.map((g, i) => {
        const previousExtends = getPreviousExtends(i, groups)

        const groupStartTime = moment(g.start)
          .add(previousExtends, "minutes")
          .format()

        const groupEndTime = groups[i + 1]
          ? moment(groups[i + 1].start)
              .add(previousExtends + g.extend, "minutes")
              .format()
          : readyAt.format()

        const progress = getProgress(groupStartTime, groupEndTime, currentTime)

        return (
          <Group
            key={i}
            start={groupStartTime}
            items={g.items}
            progress={progress}
            onExtend={() => {
              const updated = R.update(i, {...g, extend: g.extend + 1}, groups)
              setGroups(updated)
            }}
          />
        )
      })}
    </>
  )
}
