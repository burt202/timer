import * as moment from "moment"
import * as R from "ramda"
import {Item, Stage} from "./main"

function round(num: number, decimals: number) {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

export function getProgress(start: string, end: string, currentTime: string) {
  const lower = moment(start)
  const upper = moment(end)

  if (moment(currentTime).isAfter(upper)) {
    return 100
  }

  if (moment(currentTime).isBefore(lower)) {
    return 0
  }

  const max = upper.diff(lower, "seconds")
  const progress = moment(currentTime).diff(lower, "seconds")

  return round((progress / max) * 100, 2)
}

export function processItems(startTime: string, items: Array<Item>) {
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

        const start = moment(startTime)
          .add(total - duration, "minutes")
          .format()

        return {
          name: p.name,
          stage: s.name,
          start,
        }
      })
    }),
  )

  const grouped = R.toPairs(R.groupBy((a) => a.start, flattened)).map(
    ([start, group]) => {
      return {
        items: group.map((g) => {
          return R.pick(["name", "stage"], g)
        }),
        start,
      }
    },
  )

  return {total, groups: R.sortBy((g) => g.start, grouped)}
}

export function getPreviousExtends(
  index: number,
  groups: Array<{extend: number}>,
) {
  return R.sum(R.pluck("extend", groups.slice(0, index)))
}
