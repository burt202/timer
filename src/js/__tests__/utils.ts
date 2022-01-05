import {expect} from "chai"
import * as moment from "moment"
import {Item} from "../main"
import {getProgress, processItems} from "../utils"

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

context("processItems", () => {
  context("example 1", () => {
    it("should correctly", () => {
      const items = [
        {
          name: "Carrots",
          stages: [
            {
              name: "Boil",
              duration: 20,
            },
          ],
        },
        {
          name: "Brocolli",
          stages: [
            {
              name: "Boil",
              duration: 5,
            },
          ],
        },
        {
          name: "Peas",
          stages: [
            {
              name: "Bring water to boil",
              duration: 10,
            },
            {
              name: "Boil",
              duration: 4,
            },
          ],
        },
        {
          name: "Pigs in blankets",
          stages: [
            {
              name: "Put in oven",
              duration: 30,
            },
          ],
        },
        {
          name: "Stuffing",
          stages: [
            {
              name: "Put in oven",
              duration: 30,
            },
          ],
        },
        {
          name: "Potatoes",
          stages: [
            {
              name: "Boil",
              duration: 15,
            },
            {
              name: "Roast",
              duration: 60,
            },
          ],
        },
        {
          name: "Plates",
          stages: [
            {
              name: "Put in oven",
              duration: 20,
            },
          ],
        },
        {
          name: "Yorkshires",
          stages: [
            {
              name: "Put in oven",
              duration: 5,
            },
          ],
        },
        {
          name: "Beef",
          stages: [
            {
              name: "Roast",
              duration: 43,
            },
            {
              name: "Rest",
              duration: 15,
            },
          ],
        },
      ] as Array<Item>

      const res = processItems(items)

      expect(res).to.eql({
        total: 75,
        items: [
          {minute: "0", group: [{name: "Potatoes", stage: "Boil", minute: 0}]},
          {
            minute: "15",
            group: [{name: "Potatoes", stage: "Roast", minute: 15}],
          },
          {minute: "17", group: [{name: "Beef", stage: "Roast", minute: 17}]},
          {
            minute: "45",
            group: [
              {name: "Pigs in blankets", stage: "Put in oven", minute: 45},
              {name: "Stuffing", stage: "Put in oven", minute: 45},
            ],
          },
          {
            minute: "55",
            group: [
              {name: "Carrots", stage: "Boil", minute: 55},
              {name: "Plates", stage: "Put in oven", minute: 55},
            ],
          },
          {minute: "60", group: [{name: "Beef", stage: "Rest", minute: 60}]},
          {
            minute: "61",
            group: [{name: "Peas", stage: "Bring water to boil", minute: 61}],
          },
          {
            minute: "70",
            group: [
              {name: "Brocolli", stage: "Boil", minute: 70},
              {name: "Yorkshires", stage: "Put in oven", minute: 70},
            ],
          },
          {minute: "71", group: [{name: "Peas", stage: "Boil", minute: 71}]},
        ],
      })
    })
  })

  context("example 2", () => {
    it("should correctly", () => {
      const items = [
        {
          name: "Carrots",
          stages: [
            {
              name: "Boil",
              duration: 20,
            },
          ],
        },
        {
          name: "Brocolli",
          stages: [
            {
              name: "Boil",
              duration: 5,
            },
          ],
        },
        {
          name: "Plates",
          stages: [
            {
              name: "Put in oven",
              duration: 20,
            },
          ],
        },
        {
          name: "Pork",
          stages: [
            {
              name: "Turn on grill",
              duration: 5,
            },
            {
              name: "grill",
              duration: 12,
            },
          ],
        },
        {
          name: "Kale",
          stages: [
            {
              name: "Boil water",
              duration: 10,
            },
            {
              name: "put in pan",
              duration: 3,
            },
          ],
        },
      ] as Array<Item>

      const res = processItems(items)

      expect(res).to.eql({
        total: 20,
        items: [
          {
            minute: "0",
            group: [
              {name: "Carrots", stage: "Boil", minute: 0},
              {name: "Plates", stage: "Put in oven", minute: 0},
            ],
          },
          {
            minute: "3",
            group: [{name: "Pork", stage: "Turn on grill", minute: 3}],
          },
          {
            minute: "7",
            group: [{name: "Kale", stage: "Boil water", minute: 7}],
          },
          {minute: "8", group: [{name: "Pork", stage: "grill", minute: 8}]},
          {
            minute: "15",
            group: [{name: "Brocolli", stage: "Boil", minute: 15}],
          },
          {
            minute: "17",
            group: [{name: "Kale", stage: "put in pan", minute: 17}],
          },
        ],
      })
    })
  })
})
