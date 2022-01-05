import * as moment from "moment"
import {Moment} from "moment"
import * as R from "ramda"
import {Item, Stage} from "./main"

function round(num: number, decimals: number) {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

export function getProgress(lower: Moment, upper: Moment, currentTime: Moment) {
  if (moment(currentTime).isAfter(upper)) {
    return 100
  }

  if (moment(currentTime).isBefore(lower)) {
    return 0
  }

  const max = upper.diff(lower, "seconds")
  const progress = currentTime.diff(lower, "seconds")

  return round((progress / max) * 100, 2)
}

export function processItems(items: Array<Item>) {
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

  return {total, items: R.sortBy((g) => parseInt(g.minute, 10), grouped)}
}
