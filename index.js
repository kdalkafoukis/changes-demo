function setup() {
    const centre = [-1.8231, 51.5989]
    const terrain = 'data/su18nw.bil'
    const topographies = [
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
    load(centre, topographies)
}

function load(centre, topographies) {
    render(centre)
        .then(display => {
            topographies.map(display.add)
            rotate(display, topographies, 2)
        })
        .catch(console.error)
}

function render(centre) {
    const sources = {
        'terrain': {
            type: 'raster-dem',
            tiles: ['https://api.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.pngraw']
        }
    }
    const layers = [
        {
            id: 'background',
            type: 'background',
            paint: {
                'background-color': '#444'
            }
        },
        {
            id: 'hillshading',
            type: 'hillshade',
            source: 'terrain'
        }
    ]
    const renderer = new mapboxgl.Map({
        style: { version: 8, sources, layers },
        container: document.querySelector('main'),
        center: centre,
        zoom: 14.44,
        minZoom: 12,
        maxZoom: 16
    })
    document.querySelector('.mapboxgl-missing-css').remove() // hack
    const add = topography => {
        renderer.addSource(topography, {
            type: 'vector',
            tiles: [window.location.href + topography + '/{z}/{x}/{y}.pbf']
        })
        style(topography).forEach(layer => {
            renderer.addLayer(layer)
            renderer.setLayoutProperty(layer.id, 'visibility', 'none')
            renderer.moveLayer('hillshading')
        })
    }
    const show = topography => {
        const current = style(topography).map(layer => layer.id)
        const previous = Object.keys(renderer.style._layers).filter(layer => {
            return !current.concat(['background', 'hillshading']).includes(layer)
        })
        current.forEach(id => {
            renderer.setLayoutProperty(id, 'visibility', 'visible')
        })
        setTimeout(() => { // add a short delay to ensure new topography is loaded first
            previous.forEach(id => {
                renderer.setLayoutProperty(id, 'visibility', 'none')
            })
        }, 1000)
    }
    return new Promise((resolve, reject) => {
        renderer.on('load', () => resolve({ add, show }))
        renderer.on('error', reject)
    })
}

function style(topography) {
    return [
        {
            'id': topography + '-fields',
            'type': 'fill',
            'source': topography,
            'source-layer': topography,
            'filter': [
                'in',
                'descriptivegroup1',
                'General Surface',
                'Landform',
                'Roadside'
            ],
            'paint': {
                'fill-color': '#c7fda0',
                'fill-outline-color': '#87b36a'
            }
        },
        {
            'id': topography + '-urban',
            'type': 'fill',
            'source': topography,
            'source-layer': topography,
            'filter': [
                '==',
                'descriptivegroup1',
                'Unclassified'
            ],
            'paint': {
                'fill-color': '#cbcc99',
                'fill-outline-color': '#7a9068'
            }
        },
        {
            'id': topography + '-semiurban',
            'type': 'fill',
            'source': topography,
            'source-layer': topography,
            'filter': [
                'all',
                [
                    '==',
                    'descriptivegroup1',
                    'General Surface'
                ],
                [
                    '==',
                    'make',
                    'Multiple'
                ]
            ],
            'paint': {
                'fill-color': '#fffeca',
                'fill-outline-color': '#9a9f77'
            }
        },
        {
            'id': topography + '-rural',
            'type': 'fill',
            'source': topography,
            'source-layer': topography,
            'filter': [
                '==',
                'descriptivegroup1',
                'Natural Environment'
            ],
            'paint': {
                'fill-color': '#c9fbca',
                'fill-outline-color': '#95bd85'
            }
        },
        {
            'id': topography + '-buildings',
            'type': 'fill',
            'source': topography,
            'source-layer': topography,
            'filter': [
                'in',
                'descriptivegroup1',
                'Building',
                'Glasshouse'
            ],
            'paint': {
                'fill-color': '#fecb9a',
                'fill-outline-color': '#dd8667'
            }
        },
        {
            'id': topography + '-structure',
            'type': 'fill',
            'source': topography,
            'source-layer': topography,
            'filter': [
                '==',
                'descriptivegroup1',
                'Structure'
            ],
            'paint': {
                'fill-color': '#d99669',
                'fill-outline-color': '#6b6844'
            }
        },
        {
            'id': topography + '-water',
            'type': 'fill',
            'source': topography,
            'source-layer': topography,
            'filter': [
                '==',
                'descriptivegroup1',
                'Inland Water'
            ],
            'paint': {
                'fill-color': '#d5fffa',
                'fill-outline-color': '#86d2d0'
            }
        },
        {
            'id': topography + '-road',
            'type': 'fill',
            'source': topography,
            'source-layer': topography,
            'filter': [
                'in',
                'descriptivegroup1',
                'Road Or Track',
                'Path'
            ],
            'paint': {
                'fill-color': '#cccccc',
                'fill-outline-color': '#8c8c82'
            }
        },
        {
            'id': topography + '-rail',
            'type': 'fill',
            'source': topography,
            'source-layer': topography,
            'filter': [
                '==',
                'descriptivegroup1',
                'Rail'
            ],
            'paint': {
                'fill-color': '#787878',
                'fill-outline-color': '#222222'
            }
        },
        {
            'id': topography + '-3d-buildings',
            'type': 'fill-extrusion',
            'source': topography,
            'source-layer': topography,
            'filter': [
                'has',
                'abshmax'
            ],
            'paint': {
                'fill-extrusion-color': '#fecb9a',
                'fill-extrusion-height': [
                    '-',
                    ['get', 'abshmax'],
                    ['get', 'abshmin']
                ],
                'fill-extrusion-opacity': 0.8
            }
        }
    ]
}

function rotate(display, topographies, time, number) {
    const i = number || 0
    display.show(topographies[i])
    const next = i + 1 < topographies.length ? i + 1 : 0
    setTimeout(() => rotate(display, topographies, time, next), time * 1000)
}

setup()
