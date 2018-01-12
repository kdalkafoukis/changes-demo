import React from 'react'
import HTML from 'react-dom-factories'
import Header from '/components/header/header.js'
import Footer from '/components/footer/footer.js'
import Map from '/components/map/map.js'

export default class MainPage extends React.Component {

    constructor() {
        super()
        this.state = {
            centre: null,
            zoom: null,
            topographyList: null,
            topographySelected: 0,
            playing: false
        }
        this.setup = this.setup.bind(this)
        this.togglePlay = this.togglePlay.bind(this)
        this.setSelected = this.setSelected.bind(this)
        this.loop = this.loop.bind(this)
    }

    setup() {
        const centre = [-1.8231, 51.5989]
        const zoom = 14.44
        const topographyList = [
            'data/9022-SU1085-5c963',
            'data/10277-SU1085-5c963',
            'data/12290-SU1085-5c963',
            'data/14970-SU1085-5c963',
            'data/18275-SU1085-5c963',
            'data/20245-SU1085-5c963',
            'data/22094-SU1085-5c963',
            'data/26934-SU1085-5c963',
            'data/29428-SU1085-5c963',
            'data/32828-SU1085-5c963',
            'data/35759-SU1085-5c963',
            'data/38700-SU1085-5c963',
            'data/40707-SU1085-5c963',
            'data/42758-SU1085-5c963',
            'data/45014-SU1085-5c963',
            'data/47332-SU1085-5c963',
            'data/49672-SU1085-5c963',
            'data/51973-SU1085-5c963',
            'data/56724-SU1085-5c963',
            'data/58968-SU1085-5c963',
            'data/61530-SU1085-5c963',
            'data/63961-SU1085-5c963',
            'data/66380-SU1085-5c963',
            'data/68990-SU1085-5c963',
            'data/71559-SU1085-5c963',
            'data/73696-SU1085-5c963',
            'data/78419-SU1085-5c963',
            'data/81057-SU1085-5c963',
            'data/83216-SU1085-5c963',
            'data/86223-SU1085-5c963',
            'data/88533-SU1085-5c963',
            'data/90674-SU1085-5c963',
            'data/92000-SU1085-5c963',
            'data/93434-SU1085-5c963',
            'data/94431-SU1085-5c963',
            'data/95320-SU1085-5c963',
            'data/95704-SU1085-5c963',
            'data/95928-SU1085-5c963',
            'data/96154-SU1085-5c963',
            'data/1338957-SU1085-5c963',
            'data/1357616-SU1085-5c963',
            'data/1373155-SU1085-5c963',
            'data/1389938-SU1085-5c963',
            'data/1425147-SU1085-5c963',
            'data/1441974-SU1085-5c963',
            'data/1462490-SU1085-5c963',
            'data/1485053-SU1085-5c963',
            'data/1508581-SU1085-5c963',
            'data/1548350-SU1085-5c963',
            'data/1592959-SU1085-5c963'
        ]
        this.setState({ centre, zoom, topographyList })
    }

    togglePlay() {
        this.setState({ playing: !this.state.playing })
    }

    setSelected(i) {
        this.setState({ topographySelected: i })
    }

    loop() {
        if (!this.state.playing) return
        const next = this.state.topographySelected + 1 < this.state.topographyList.length ? this.state.topographySelected + 1 : 0
        this.setState({ topographySelected: next })
        setTimeout(this.loop, 4 * 1000) // in milliseconds
    }

    componentDidMount() {
        this.setup()
    }

    componentDidUpdate(_, prevState) {
        if (prevState.playing !== this.state.playing) this.loop()
    }

    render() {
        if (!this.state.topographyList) return HTML.div({ className: 'loading' })
        return HTML.div({ className: 'main-page' }, ...[
            React.createElement(Header),
            React.createElement(Map, {
                centre: this.state.centre,
                zoom: this.state.zoom,
                topographyList: this.state.topographyList,
                topographySelected: this.state.topographySelected
            }),
            React.createElement(Footer, {
                play: this.togglePlay,
                playing: this.state.playing,
                set: this.setSelected,
                value: this.state.topographySelected,
                total: this.state.topographyList.length
            })
        ])
    }

}
