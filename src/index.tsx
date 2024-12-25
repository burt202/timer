import "./style.css"

import React from "react"
import {createRoot} from "react-dom/client"

import Main from "./js/main"

const container = document.body.querySelector("#container") as Element
const root = createRoot(container)

root.render(<Main />)
