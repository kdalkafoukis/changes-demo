import React from 'react'
import HTML from 'react-dom-factories'
import Header from 'components/header/header.js'
import Footer from 'components/footer/footer.js'
import Map from 'components/map/map.js'

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
            { data: 'topography/9022-SU1085-5c963',    title: 'Month 1' },
            { data: 'topography/10277-SU1085-5c963',   title: 'Month 2' },
            { data: 'topography/12290-SU1085-5c963',   title: 'Month 3' },
            { data: 'topography/14970-SU1085-5c963',   title: 'Month 4' },
            { data: 'topography/18275-SU1085-5c963',   title: 'Month 5' },
            { data: 'topography/20245-SU1085-5c963',   title: 'Month 6' },
            { data: 'topography/22094-SU1085-5c963',   title: 'Month 7' },
            { data: 'topography/24278-SU1085-5c963',   title: 'Month 8' },
            { data: 'topography/26934-SU1085-5c963',   title: 'Month 9' },
            { data: 'topography/29428-SU1085-5c963',   title: 'Month 10' },
            { data: 'topography/32828-SU1085-5c963',   title: 'Month 11' },
            { data: 'topography/35759-SU1085-5c963',   title: 'Month 12' },
            { data: 'topography/38700-SU1085-5c963',   title: 'Month 13' },
            { data: 'topography/40707-SU1085-5c963',   title: 'Month 14' },
            { data: 'topography/42758-SU1085-5c963',   title: 'Month 15' },
            { data: 'topography/45014-SU1085-5c963',   title: 'Month 16' },
            { data: 'topography/47332-SU1085-5c963',   title: 'Month 17' },
            { data: 'topography/49672-SU1085-5c963',   title: 'Month 18' },
            { data: 'topography/51973-SU1085-5c963',   title: 'Month 19' },
            { data: 'topography/54251-SU1085-5c963',   title: 'Month 20' },
            { data: 'topography/56724-SU1085-5c963',   title: 'Month 21' },
            { data: 'topography/58968-SU1085-5c963',   title: 'Month 22' },
            { data: 'topography/61530-SU1085-5c963',   title: 'Month 23' },
            { data: 'topography/63961-SU1085-5c963',   title: 'Month 24' },
            { data: 'topography/66380-SU1085-5c963',   title: 'Month 25' },
            { data: 'topography/68990-SU1085-5c963',   title: 'Month 26' },
            { data: 'topography/71559-SU1085-5c963',   title: 'Month 27' },
            { data: 'topography/73696-SU1085-5c963',   title: 'Month 28' },
            { data: 'topography/78419-SU1085-5c963',   title: 'Month 29' },
            { data: 'topography/81057-SU1085-5c963',   title: 'Month 30' },
            { data: 'topography/83216-SU1085-5c963',   title: 'Month 31' },
            { data: 'topography/86223-SU1085-5c963',   title: 'Month 32' },
            { data: 'topography/88533-SU1085-5c963',   title: 'Month 33' },
            { data: 'topography/90674-SU1085-5c963',   title: 'Month 34' },
            { data: 'topography/92000-SU1085-5c963',   title: 'Month 35' },
            { data: 'topography/93434-SU1085-5c963',   title: 'Month 36' },
            { data: 'topography/94431-SU1085-5c963',   title: 'Month 37' },
            { data: 'topography/95320-SU1085-5c963',   title: 'Month 38' },
            { data: 'topography/95704-SU1085-5c963',   title: 'Month 39' },
            { data: 'topography/95928-SU1085-5c963',   title: 'Month 40' },
            { data: 'topography/96154-SU1085-5c963',   title: 'Month 41' },
            { data: 'topography/1338957-SU1085-5c963', title: 'Month 42' },
            { data: 'topography/1357616-SU1085-5c963', title: 'Month 43' },
            { data: 'topography/1373155-SU1085-5c963', title: 'Month 44' },
            { data: 'topography/1389938-SU1085-5c963', title: 'Month 45' },
            { data: 'topography/1425147-SU1085-5c963', title: 'Month 46' },
            { data: 'topography/1441974-SU1085-5c963', title: 'Month 47' },
            { data: 'topography/1462490-SU1085-5c963', title: 'Month 48' },
            { data: 'topography/1485053-SU1085-5c963', title: 'Month 49' },
            { data: 'topography/1508581-SU1085-5c963', title: 'Month 50' },
            { data: 'topography/1548350-SU1085-5c963', title: 'Month 51' },
            { data: 'topography/1592959-SU1085-5c963', title: 'Month 52' }
        ]
        this.setState({ centre, zoom, topographyList })
        this.togglePlay()
    }

    togglePlay(state) {
        const playing = state !== undefined ? state : !this.state.playing
        this.setState({ playing })
    }

    setSelected(i) {
        this.setState({ topographySelected: i })
    }

    loop() {
        if (!this.state.playing) return
        const next = this.state.topographySelected < this.state.topographyList.length - 1 ? this.state.topographySelected + 1 : 0
        this.setState({ topographySelected: next })
        setTimeout(this.loop, 2 * 1000) // in milliseconds
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
                title: this.state.topographyList[this.state.topographySelected].title,
                total: this.state.topographyList.length
            })
        ])
    }

}
