import React from 'react'
import HTML from 'react-dom-factories'

export default class Header extends React.Component {
    render() {
        return HTML.header({}, ...[
            HTML.img({ src: '/components/header/logo.svg' }),
            HTML.h1({}, 'Changes demo')
        ])
    }

}
