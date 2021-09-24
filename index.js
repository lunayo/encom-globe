var Detector = {
  /**
   * @author arscan
   * @author alteredq / http://alteredqualia.com/
   * @author mr.doob / http://mrdoob.com/
   */
  canvas: !!window.CanvasRenderingContext2D,
  webgl: (function () {
    try {
      var canvas = document.createElement('canvas')
      return (
        !!window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      )
    } catch (e) {
      return false
    }
  })(),
  workers: !!window.Worker,
  fileapi: window.File && window.FileReader && window.FileList && window.Blob,

  getWebGLErrorMessage: function () {
    var element = document.createElement('div')
    element.id = 'webgl-error-message'
    element.style.fontSize = '13px'
    element.style.textAlign = 'center'
    element.style.color = '#fff'
    element.style.padding = '1.5em'
    element.style.width = '400px'
    element.style.margin = '5em auto 0'

    if (!this.webgl) {
      element.innerHTML = window.WebGLRenderingContext
        ? [
            'Your graphics card does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation">WebGL</a>.<br />',
            'Find out how to get it <a href="http://get.webgl.org/">here</a>.<br />',
            'Check out the repo on <a href="http://github.com/arscan/encom-globe">Github</a> to see what this looks like.',
          ].join('\n')
        : [
            'Your browser does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation">WebGL</a>.<br/>',
            'Find out how to get it <a href="http://get.webgl.org/">here</a>.<br />',
            'Check out the repo on <a href="http://github.com/arscan/encom-globe">Github</a> to see what this looks like.',
          ].join('\n')
    }

    return element
  },

  addGetWebGLMessage: function (parameters) {
    var parent, id, element

    parameters = parameters || {}

    parent = parameters.parent !== undefined ? parameters.parent : document.body
    id = parameters.id !== undefined ? parameters.id : 'oldie'

    element = Detector.getWebGLErrorMessage()
    element.id = id

    if (!this.webgl) {
      parent.appendChild(element)
    }
  },
}

///////////////////////////////////////////////

var globe
var globeCount = 0

function createGlobe() {
  var newData = []
  globeCount++
  // $('#globe canvas').remove()
  // if($("#globe-dd:checked").length){
  newData = data.slice()
  // }

  globe = new ENCOM.Globe(window.innerWidth, window.innerHeight, {
    font: 'Inconsolata',
    data: newData, // copy the data array
    tiles: grid.tiles,
    // baseColor: $('#globe-color').val(),
    // markerColor: $('#marker-color').val(),
    // pinColor: $('#pin-color').val(),
    // satelliteColor: $('#satellite-color').val(),
    // scale: parseFloat($('#globe-scale').val()),
    // dayLength: 1000 * parseFloat($('#globe-spr').val()),
    // introLinesDuration: parseFloat($('#globe-id').val()),
    // maxPins: parseFloat($('#globe-mp').val()),
    // maxMarkers: parseFloat($('#globe-mm').val()),
    // viewAngle: parseFloat($('#globe-va').val()),
  })

  element('#globe').appendChild(globe.domElement)
  globe.init(start)
}

function element(selector) {
  const elements = document.querySelectorAll(selector)
  if (elements.length === 0) throw new Error(`No elements found for selector '${selector}'`)

  if (elements.length > 1)
    throw new Error(
      `Expected exactly 1 element to match selector '${selector}', but found ${elements.length}`
    )

  return elements[0]
}

function onWindowResize() {
  globe.camera.aspect = window.innerWidth / window.innerHeight
  globe.camera.updateProjectionMatrix()
  globe.renderer.setSize(window.innerWidth, window.innerHeight)
}

function roundNumber(num) {
  return Math.round(num * 100) / 100
}

function projectionToLatLng(width, height, x, y) {
  return {
    lat: 90 - 180 * (y / height),
    lon: 360 * (x / width) - 180,
  }
}

function animate() {
  if (globe) {
    globe.tick()
  }

  lastTickTime = Date.now()

  requestAnimationFrame(animate)
}

function start() {
  if (globeCount === 1) {
    // only do this for the first globe that's created. very messy
    animate()

    /* add pins at random locations */
    setInterval(function () {
      // if (!globe || !$('#globe-dd:checked').length) {
      //   return
      // }

      var lat = Math.random() * 180 - 90,
        lon = Math.random() * 360 - 180,
        name = '' // 'Test ' + Math.floor(Math.random() * 100)

      globe.addPin(lat, lon, name)
    }, 5000)
  }
}

function main() {
  var open = false

  if (!Detector.webgl) {
    Detector.addGetWebGLMessage({
      parent: document.getElementById('container'),
    })
    return
  }

  window.addEventListener('resize', onWindowResize, false)

  WebFontConfig = {
    google: {
      families: ['Inconsolata'],
    },
    active: function () {
      /* don't start the globe until the font has been loaded */
      createGlobe()
    },
  }

  /* Webgl stuff */

  /* web font stuff*/
  var wf = document.createElement('script')
  wf.src =
    ('https:' == document.location.protocol ? 'https' : 'http') +
    '://ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js'
  wf.type = 'text/javascript'
  wf.async = 'true'
  var s = document.getElementsByTagName('script')[0]
  s.parentNode.insertBefore(wf, s)
}

main()
