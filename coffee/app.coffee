class App

  LOCATION_URL = 'http://54.85.163.238'

  constructor: ->
    @map = null

  render: =>
    try Typekit.load()

    # Usecapture for touchstart event, as advised in
    # http://www.mobify.com/blog/beginners-guide-to-perceived-performance/
    document.addEventListener "touchstart", () ->
      null
    , true

    @setupMap()
    @loadMapLocation()

    $(window).on "resize", @onResize
    @onResize()

  renderMapMarker: (name) ->
    $(".venue-name").html name
    $(".created-at").html "Updated #{moment(res.createdAt * 1000).fromNow()}"

    $(".label-container").css marginLeft: (-$(".label-container").outerWidth()/2)+"px"
    $(".marker").show()
    $(".created-at").show()

  setupMap: =>
    @map = L.mapbox.map('map', 'fravic.j11ifpci', {
      attributionControl: false
      zoomControl: false
    })
    @map.dragging.disable()
    @map.touchZoom.disable()
    @map.doubleClickZoom.disable()
    @map.scrollWheelZoom.disable()

  loadMapLocation: =>
    $.getJSON LOCATION_URL, (res) =>
      if res.apiError
        console.log "API Error:", res.apiError
        return

      @map.setView([res.lat, res.lng], 13)
      @renderMapMarker(res.name)
    .error () ->
      console.log "Server Error: Could not load map location"

  onResize: =>

  isMobile: ->
    return (/Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i).test(
      navigator.userAgent || navigator.vendor || window.opera
    )

window.app = new App()
$ app.render
