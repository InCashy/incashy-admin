"use client"

import React, { useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"
import mbxDirections from "@mapbox/mapbox-sdk/services/directions"

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

const Map = () => {
  const mapContainer = useRef(null)
  const map = useRef(null)

  const origin = [-122.43539772352648, 37.77440680146262]
  const destination = [-122.42409811526268, 37.76556957793795]

  useEffect(() => {
    if (map.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: origin,
      zoom: 14,
    })

    map.current.on("load", () => {
      const directionsClient = mbxDirections({ accessToken: mapboxgl.accessToken })

      directionsClient
        .getDirections({
          profile: "driving",
          waypoints: [
            { coordinates: origin },
            { coordinates: destination },
          ],
          geometries: "geojson",
        })
        .send()
        .then(response => {
          const route = response.body.routes[0].geometry
          const coordinates = route.coordinates

          const actualStart = mapboxgl.LngLat.convert(coordinates[0])
          const actualEnd = mapboxgl.LngLat.convert(coordinates[coordinates.length - 1])

          // Draw route
          map.current.addSource("route", {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: route,
            },
          })

          map.current.addLayer({
            id: "route",
            type: "line",
            source: "route",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#1db7dd",
              "line-width": 6,
            },
          })

          // Add marker using normalized precision
          new mapboxgl.Marker({ color: "#1E90FF", anchor: "bottom" })
            .setLngLat(actualStart)
            .setPopup(new mapboxgl.Popup().setText("Snapped Origin"))
            .addTo(map.current)

          new mapboxgl.Marker({ color: "#FF6347", anchor: "bottom" })
            .setLngLat(actualEnd)
            .setPopup(new mapboxgl.Popup().setText("Snapped Destination"))
            .addTo(map.current)

          console.log("actualStart", actualStart)
          console.log("routeCoords[0]", route.coordinates[0])
        })
        .catch(err => {
          console.error("Error fetching directions:", err)
        })
    })
  }, [])

  return <div ref={mapContainer} className="w-full h-screen" />
}

export default Map
