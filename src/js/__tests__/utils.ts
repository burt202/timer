import {expect} from "chai"
import {Item} from "../main"
import {getProgress, processItems} from "../utils"

context("getProgress", () => {
  context("when current time is greater than end", () => {
    it("should return 100", () => {
      const start = "2022-01-02T12:15"
      const end = "2022-01-02T12:25"
      const currentTime = "2022-01-02T12:30"

      const res = getProgress(start, end, currentTime)

      expect(res).to.eql(100)
    })
  })

  context("when current time is less than start", () => {
    it("should return 0", () => {
      const start = "2022-01-02T12:15"
      const end = "2022-01-02T12:25"
      const currentTime = "2022-01-02T12:10"

      const res = getProgress(start, end, currentTime)

      expect(res).to.eql(0)
    })
  })

  context("when current time is less than start", () => {
    it("should return 0", () => {
      const start = "2022-01-02T12:15"
      const end = "2022-01-02T12:25"
      const currentTime = "2022-01-02T12:16"

      const res = getProgress(start, end, currentTime)

      expect(res).to.eql(10)
    })
  })
})

context("processItems", () => {
  context("example 1", () => {
    it("should correctly process items", () => {
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

      const res = processItems("2022-01-02T12:15", items)

      expect(res).to.eql({
        total: 75,
        groups: [
          {
            start: "2022-01-02T12:15:00+00:00",
            items: [{name: "Potatoes", stage: "Boil"}],
          },
          {
            start: "2022-01-02T12:30:00+00:00",
            items: [{name: "Potatoes", stage: "Roast"}],
          },
          {
            start: "2022-01-02T12:32:00+00:00",
            items: [{name: "Beef", stage: "Roast"}],
          },
          {
            start: "2022-01-02T13:00:00+00:00",
            items: [
              {name: "Pigs in blankets", stage: "Put in oven"},
              {name: "Stuffing", stage: "Put in oven"},
            ],
          },
          {
            start: "2022-01-02T13:10:00+00:00",
            items: [
              {name: "Carrots", stage: "Boil"},
              {name: "Plates", stage: "Put in oven"},
            ],
          },
          {
            start: "2022-01-02T13:15:00+00:00",
            items: [{name: "Beef", stage: "Rest"}],
          },
          {
            start: "2022-01-02T13:16:00+00:00",
            items: [{name: "Peas", stage: "Bring water to boil"}],
          },
          {
            start: "2022-01-02T13:25:00+00:00",
            items: [
              {name: "Brocolli", stage: "Boil"},
              {name: "Yorkshires", stage: "Put in oven"},
            ],
          },
          {
            start: "2022-01-02T13:26:00+00:00",
            items: [{name: "Peas", stage: "Boil"}],
          },
        ],
      })
    })
  })

  context("example 2", () => {
    it("should correctly process items", () => {
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

      const res = processItems("2022-01-02T12:15", items)

      expect(res).to.eql({
        total: 20,
        groups: [
          {
            start: "2022-01-02T12:15:00+00:00",
            items: [
              {name: "Carrots", stage: "Boil"},
              {name: "Plates", stage: "Put in oven"},
            ],
          },
          {
            start: "2022-01-02T12:18:00+00:00",
            items: [{name: "Pork", stage: "Turn on grill"}],
          },
          {
            start: "2022-01-02T12:22:00+00:00",
            items: [{name: "Kale", stage: "Boil water"}],
          },
          {
            start: "2022-01-02T12:23:00+00:00",
            items: [{name: "Pork", stage: "grill"}],
          },
          {
            start: "2022-01-02T12:30:00+00:00",
            items: [{name: "Brocolli", stage: "Boil"}],
          },
          {
            start: "2022-01-02T12:32:00+00:00",
            items: [{name: "Kale", stage: "put in pan"}],
          },
        ],
      })
    })
  })
})
