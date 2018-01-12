import React from 'react'
import ReactDOM from 'react-dom'
import MainPage from '/components/main-page/main-page.js'

const main = document.querySelector('main')
const page = React.createElement(MainPage)
main.classList.remove('loading')
ReactDOM.render(page, main)
