// eslint-disable-next-line
declare var VERSION: string

import * as React from "react"
import {createRoot} from "react-dom/client"

import Main from "./js/main"

import "./style.css"

const container = document.body.querySelector("#container") as Element
const root = createRoot(container)

root.render(<Main />)
