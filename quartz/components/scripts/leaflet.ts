import { QuartzTransformerPlugin } from "../types"

interface LeafletMap {
  lat: number
  lng: number
  zoom: number
  markers?: Array<{
    lat: number
    lng: number
    title?: string
  }>
}

export const LeafletTransformer: QuartzTransformerPlugin = {
  name: "LeafletTransformer",
  transform: (content) => {
    // Match Obsidian leaflet syntax: ```leaflet\nid: map1\nlat: 41.4\nlng: 2.2\nzoom: 10\n```
    const regex = /```leaflet\n([\s\S]*?)```/g
    return content.replace(regex, (match, mapConfig) => {
      try {
        // Parse map configuration
        const config: LeafletMap = mapConfig.split('\n').reduce((acc: any, line: string) => {
          const [key, value] = line.split(':').map(s => s.trim())
          if (key === 'markers') {
            acc.markers = JSON.parse(value)
          } else if (['lat', 'lng', 'zoom'].includes(key)) {
            acc[key] = parseFloat(value)
          }
          return acc
        }, {})

        // Generate unique map ID
        const mapId = `map-${Math.random().toString(36).substr(2, 9)}`

        // Create map container and script
        return `
          <div id="${mapId}" style="height: 400px; width: 100%; border-radius: 4px;"></div>
          <script>
            window.addEventListener('load', function() {
              const map = L.map('${mapId}').setView([${config.lat}, ${config.lng}], ${config.zoom});
              L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
              }).addTo(map);
              ${config.markers?.map(marker => `
                L.marker([${marker.lat}, ${marker.lng}])
                  .bindPopup('${marker.title || ''}')
                  .addTo(map);
              `).join('\n') || ''}
            });
          </script>
        `
      } catch (e) {
        console.error('Error parsing leaflet map config:', e)
        return match
      }
    })
  }
}