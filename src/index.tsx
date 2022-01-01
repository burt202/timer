// eslint-disable-next-line
declare var VERSION: string

import * as React from "react"
import * as ReactDom from "react-dom"

import Main from "./main"

require("./style.css")

ReactDom.render(<Main />, document.body.querySelector("#container"))
