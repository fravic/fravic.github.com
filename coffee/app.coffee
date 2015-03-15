class App

  LOCATION_URL = 'http://fravic-com.herokuapp.com/'

  PROD_ROOT_DOMAIN = 'fravic.com'
  DEV_MIXPANEL_TOKEN = '3e0e6b7523b1b89c23e3f916353b4e29'
  PROD_MIXPANEL_TOKEN = '7625405302264f41acc4ae05b9861ff7'

  MAPBOX_MAP_ID = 'fravic.lff5k96b'

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

    @initAnalytics()
    mixpanel.track "index:view"

  initAnalytics: ->
    hostname = new URL(window.location).hostname
    hostname = hostname.slice("www.".length) if hostname.indexOf("www.") == 0
    mixpanel.init if hostname == PROD_ROOT_DOMAIN then PROD_MIXPANEL_TOKEN else DEV_MIXPANEL_TOKEN

  renderMapMarker: (name, createdAt) ->
    $(".venue-name").html name
    $(".created-at").html "Updated #{moment(createdAt * 1000).fromNow()}"

    $(".marker").show()
    $(".created-at").show()
    @repositionLabelContainer()

  repositionLabelContainer: ->
    $(".label-container").css marginLeft: (-$(".label-container").outerWidth()/2)+"px"

  setupMap: =>
    @map = L.mapbox.map('map', MAPBOX_MAP_ID, {
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

      @map.setView([res.lat, res.lng], 12)
      @renderMapMarker(res.name, res.createdAt)
    .error () ->
      console.log "Server Error: Could not load map location"

  onResize: =>
    @repositionLabelContainer()

  isMobile: ->
    return (/Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i).test(
      navigator.userAgent || navigator.vendor || window.opera
    )

window.app = new App()
$ app.render
