import { QuartzTransformerPlugin } from "../types"
import { visit } from "unist-util-visit"

export const LeafletTransformer: QuartzTransformerPlugin = () => {
  return {
    name: "LeafletTransformer",
    htmlPlugins() {
      return [
        () => {
          return (tree) => {
            visit(tree, "element", (node) => {
              if (
                node.tagName === "pre" &&
                node.children?.[0]?.tagName === "code" &&
                node.children[0].properties?.className?.includes("language-leaflet")
              ) {
                const rawCode = node.children[0].children
                  .map((c: any) => c.value)
                  .join("")

                const cfg = parseLeafletBlock(rawCode)

                const divId = `map-${cfg.id || Math.random().toString(36).slice(2, 9)}`

                node.tagName = "div"
                node.properties = { className: ["leaflet-map"] }
                node.children = [
                  {
                    type: "element",
                    tagName: "div",
                    properties: {
                      id: divId,
                      style: `height:${cfg.height || "600px"}; width:${cfg.width || "100%"};`,
                    },
                    children: [],
                  },
                  {
                    type: "element",
                    tagName: "script",
                    properties: {},
                    children: [
                      {
                        type: "text",
                        value: generateLeafletScript(cfg, divId),
                      },
                    ],
                  },
                ]
              }
            })
          }
        },
      ]
    },
  }
}

function parseLeafletBlock(code: string) {
  const cfg: Record<string, any> = {}
  code.split("\n").forEach((line) => {
    const [key, ...rest] = line.split(":")
    if (!key) return
    const cleanKey = key.trim()
    const value = rest.join(":").trim()
    if (!value) return

    switch (cleanKey) {
      case "bounds":
        // Example: [[0,0], [3386, 3452]]
        cfg.bounds = JSON.parse(
          value.replace(/(\d+)\s*,\s*(\d+)/g, "[$1,$2]")
        )
        break
      case "lat":
      case "long":
      case "maxZoom":
      case "minZoom":
      case "defaultZoom":
      case "scale":
        cfg[cleanKey] = parseFloat(value)
        break
      case "height":
      case "width":
      case "id":
      case "unit":
        cfg[cleanKey] = value
        break
      case "image":
        // e.g. [[attainments/halvinar.png|Halvinar]]
        cfg.image = value.replace(/[\[\]]/g, "").split("|")[0]
        break
    }
  })
  return cfg
}

function generateLeafletScript(cfg: any, divId: string): string {
  const bounds = cfg.bounds || [[0, 0], [1000, 1000]]
  return `
    const map = L.map('${divId}', {
      crs: L.CRS.Simple,
      minZoom: ${cfg.minZoom ?? -2},
      maxZoom: ${cfg.maxZoom ?? 2},
      zoom: ${cfg.defaultZoom ?? 0}
    })

    const image = '${cfg.image}'
    const bounds = ${JSON.stringify(bounds)}

    L.imageOverlay(image, bounds).addTo(map)
    map.fitBounds(bounds)

    ${cfg.lat && cfg.long ? `map.setView([${cfg.lat}, ${cfg.long}], ${cfg.defaultZoom ?? 0});` : ""}
  `
}
