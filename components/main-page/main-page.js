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
            { data: 'data/9022-SU1085-5c963',    title: '1' },
            { data: 'data/10277-SU1085-5c963',   title: '2' },
            { data: 'data/12290-SU1085-5c963',   title: '3' },
            { data: 'data/14970-SU1085-5c963',   title: '4' },
            { data: 'data/18275-SU1085-5c963',   title: '5' },
            { data: 'data/20245-SU1085-5c963',   title: '6' },
            { data: 'data/22094-SU1085-5c963',   title: '7' },
            { data: 'data/26934-SU1085-5c963',   title: '8' },
            { data: 'data/29428-SU1085-5c963',   title: '9' },
            { data: 'data/32828-SU1085-5c963',   title: '10' },
            { data: 'data/35759-SU1085-5c963',   title: '11' },
            { data: 'data/38700-SU1085-5c963',   title: '12' },
            { data: 'data/40707-SU1085-5c963',   title: '13' },
            { data: 'data/42758-SU1085-5c963',   title: '14' },
            { data: 'data/45014-SU1085-5c963',   title: '15' },
            { data: 'data/47332-SU1085-5c963',   title: '16' },
            { data: 'data/49672-SU1085-5c963',   title: '17' },
            { data: 'data/51973-SU1085-5c963',   title: '18' },
            { data: 'data/56724-SU1085-5c963',   title: '19' },
            { data: 'data/58968-SU1085-5c963',   title: '20' },
            { data: 'data/61530-SU1085-5c963',   title: '21' },
            { data: 'data/63961-SU1085-5c963',   title: '22' },
            { data: 'data/66380-SU1085-5c963',   title: '23' },
            { data: 'data/68990-SU1085-5c963',   title: '24' },
            { data: 'data/71559-SU1085-5c963',   title: '25' },
            { data: 'data/73696-SU1085-5c963',   title: '26' },
            { data: 'data/78419-SU1085-5c963',   title: '27' },
            { data: 'data/81057-SU1085-5c963',   title: '28' },
            { data: 'data/83216-SU1085-5c963',   title: '29' },
            { data: 'data/86223-SU1085-5c963',   title: '30' },
            { data: 'data/88533-SU1085-5c963',   title: '31' },
            { data: 'data/90674-SU1085-5c963',   title: '32' },
            { data: 'data/92000-SU1085-5c963',   title: '33' },
            { data: 'data/93434-SU1085-5c963',   title: '34' },
            { data: 'data/94431-SU1085-5c963',   title: '35' },
            { data: 'data/95320-SU1085-5c963',   title: '36' },
            { data: 'data/95704-SU1085-5c963',   title: '37' },
            { data: 'data/95928-SU1085-5c963',   title: '38' },
            { data: 'data/96154-SU1085-5c963',   title: '39' },
            { data: 'data/1338957-SU1085-5c963', title: '40' },
            { data: 'data/1357616-SU1085-5c963', title: '41' },
            { data: 'data/1373155-SU1085-5c963', title: '42' },
            { data: 'data/1389938-SU1085-5c963', title: '43' },
            { data: 'data/1425147-SU1085-5c963', title: '44' },
            { data: 'data/1441974-SU1085-5c963', title: '45' },
            { data: 'data/1462490-SU1085-5c963', title: '46' },
            { data: 'data/1485053-SU1085-5c963', title: '47' },
            { data: 'data/1508581-SU1085-5c963', title: '48' },
            { data: 'data/1548350-SU1085-5c963', title: '49' },
            { data: 'data/1592959-SU1085-5c963', title: '50' }
        ]
        this.setState({ centre, zoom, topographyList })
        this.togglePlay()
    }

    togglePlay() {
        this.setState({ playing: !this.state.playing })
    }

    setSelected(i) {
        this.setState({ topographySelected: i })
    }

    loop() {
        if (!this.state.playing) return
        const next = this.state.topographySelected < this.state.topographyList.length - 1 ? this.state.topographySelected + 1 : 0
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
                title: this.state.topographyList[this.state.topographySelected].title,
                total: this.state.topographyList.length
            })
        ])
    }

}
