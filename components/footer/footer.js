import React from 'react'
import HTML from 'react-dom-factories'
import Debounce from 'debounce'

export default class Footer extends React.Component {

    constructor() {
        super()
        this.set = Debounce(this.set, 100)
    }

    set(position) {
        const value = Math.floor((position / 1000) * (this.props.total - 1))
        this.props.set(value)
        this.props.play(false)
    }

    render() {
        const position = Math.floor((this.props.value / (this.props.total - 1)) * 1000)
        const icon = this.props.playing ? 'components/footer/button-pause.svg' : 'components/footer/button-play.svg'
        const play = event => {
            this.props.play()
        }
        const update = event => {
            event.persist()
            this.set(event.target.value)
        }
        return HTML.footer({}, ...[
            HTML.h2({}, this.props.title),
            HTML.div({}, ...[
                HTML.button({ className: 'play', onClick: play }, HTML.img({ src: icon })),
                HTML.input({ type: 'range', min: 0, max: 1000, value: position, onChange: update })
            ])
        ])
    }

}
