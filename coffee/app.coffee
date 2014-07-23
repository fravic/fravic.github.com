class App

  render: =>
    try Typekit.load()

    # Usecapture for touchstart event, as advised in
    # http://www.mobify.com/blog/beginners-guide-to-perceived-performance/
    document.addEventListener "touchstart", () ->
      null
    , true

    @setupMap()

    $(window).on "resize", @onResize
    @onResize()

  setupMap: =>
    map = L.mapbox.map('map', 'fravic.j11ifpci', {
      attributionControl: false
      zoomControl: false
    })
    map.dragging.disable()
    map.touchZoom.disable()
    map.doubleClickZoom.disable()
    map.scrollWheelZoom.disable()

  onResize: =>

  isMobile: ->
    return (/Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i).test(
      navigator.userAgent || navigator.vendor || window.opera
    )

window.app = new App()
$ app.render
