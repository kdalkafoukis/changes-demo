import React from 'react'
import HTML from 'react-dom-factories'

export default class Footer extends React.Component {

    constructor() {
        super()
        this.set = this.set.bind(this)
        this.receive = this.receive.bind(this)
        this.state = {
            value: 0
        }
    }

    set(value) {
        const selected = Math.round((value / 1000) * this.props.total)
        this.props.set(selected)
        this.receive(event.target.value)
    }

    receive(number) {
        const value = (number / this.props.total) * 1000
        this.setState({ value })
    }

    componentWillReceiveProps(nextProps) {
        this.receive(nextProps.value)
    }

    render() {
        const icon = this.props.playing ? '/components/footer/button-pause.svg' : '/components/footer/button-play.svg'
        return HTML.footer({}, ...[
            HTML.h2({}, 'September 2004'),
            HTML.div({}, ...[
                HTML.button({ className: 'play', onClick: this.props.play }, HTML.img({ src: icon })),
                HTML.input({ type: 'range', min: 0, max: 1000, value: this.state.value, onChange: event => this.set(event.target.value) })
            ])
        ])
    }

}