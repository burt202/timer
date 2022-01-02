import {expect} from "chai"
import * as moment from "moment"
import {getProgress} from "../utils"

context("getProgress", () => {
  context("when current time is greater than end", () => {
    it("should return 100", () => {
      const lower = moment("2022-01-02T12:15")
      const upper = moment("2022-01-02T12:25")
      const currentTime = moment("2022-01-02T12:30")

      const res = getProgress(lower, upper, currentTime)

      expect(res).to.eql(100)
    })
  })

  context("when current time is less than start", () => {
    it("should return 0", () => {
      const lower = moment("2022-01-02T12:15")
      const upper = moment("2022-01-02T12:25")
      const currentTime = moment("2022-01-02T12:10")

      const res = getProgress(lower, upper, currentTime)

      expect(res).to.eql(0)
    })
  })

  context("when current time is less than start", () => {
    it("should return 0", () => {
      const lower = moment("2022-01-02T12:15")
      const upper = moment("2022-01-02T12:25")
      const currentTime = moment("2022-01-02T12:16")

      const res = getProgress(lower, upper, currentTime)

      expect(res).to.eql(10)
    })
  })
})
