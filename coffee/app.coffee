class App

  render: =>
    try Typekit.load()

    # Usecapture for touchstart event, as advised in
    # http://www.mobify.com/blog/beginners-guide-to-perceived-performance/
    document.addEventListener "touchstart", () ->
      null
    , true

    $(window).on "resize", @onResize
    @onResize()

  onResize: =>

  isMobile: ->
    return (/Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i).test(
      navigator.userAgent || navigator.vendor || window.opera
    )

window.App = App
