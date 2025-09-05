---
Pronounced:
  - Hal-vin-R
aliases:
  - Ruin Central
Type:
Population:
  - 30000
Tech:
  - Tech7
Theme:
Region:
Terrain:
  - Mountain
GovtType:
  - City_State
Defences:
Religions:
Imports:
Exports:
NoteI:
  - Location
tags:
  - Location
  - Place
  - Halvinar
map_height_y: 3452
map_width_x: 3386
scale_pixels: 268
scale_pixels_range: 139
mapCalc1: 0.5186567164179104
---
> [!info]- Overview
> **Pronounced:**  "`=this.Pronounced`"
> ![[halvinar.png|cover hm-sm]]
> ###### Info
>  |
> ---|---|
> **Alias** | `=this.alias` |
> **Type** | `=this.type` |
> **Population** | `=this.population` |
> **Theme** | `=this.theme` |
> **Region** | `=link(this.Region)` |
> **Terrain** | `=this.terrain` |
> ###### Politics
>  |
>  ---|---|
> **Ruler(s)** | TBD |
> **Leaders** | TBD |
> **Govt Type** | `=this.GovtType` |
> **Defenses** | `=this.defences` |
> **Religion(s)** | `=link(this.religions)` |
> ###### Commerce
>  |
>  ---|---|
> **Imports** | `=this.imports` |
> **Exports** | `=this.exports` |

> [!info]- Super Table
> [[Kendin/People/Organizations/Organizations|Add Organization]]
> [[Things|Add Point of Interest]]
> [[NPCs|Add NPC]]
>  
> ```dataviewjs
>  const createButton = (name) => {
>    const btn = dv.el('button', name);
>    btn.addEventListener('click', (event) => {
>        event.preventDefault();
>        removeTable();
>        renderTable(name);
>    });
>    return btn;
>};
>
>const th = dv.current();
>const buttons = ['Organizations', 'Points of Interest', 'NPCs'];
>
>const renderTable = (name) => { 
>    if(name == 'Organizations'){
>        const pages = dv.pages('"Kendin/People"') 
>            .where(page => page.NoteI == 'Organization')
>            .where(page => {
>                function checkLocation(value, index, array) {
>                    return value == th.file.name;
>                }
>                try {
>                    let location = page.Locations.find(checkLocation);
>                    if (typeof location == 'undefined') {
>                        return false;
>                    } else {
>                        return true;
>                    }
>                } catch(err) {
>                    // Handle error
>                }
>            });
>        dv.header(2, name);
>        dv.table(['Title', 'Type', 'Tags', 'Significance', 'Locations'], pages
>            .sort(pageP => pageP.tags, 'asce')
>            .map(pageP => {
>                return [
>                    pageP.file.link, 
>                    pageP.Type, 
>                    pageP.tags, 
>                    pageP.Significance, 
>                    pageP.Locations
>                ];
>            })
>        );
>    } else if(name == 'Points of Interest'){ 
>        const pages = dv.pages('"Kendin/Things"')
>            .where(page => page.NoteI == 'POI');
>        dv.header(2, name);
>        dv.table(['Title', 'Rating', 'Runtime', 'Seasons', 'Locations'], pages.map(pageP => {
>            return [
>                pageP.file.link, 
>                pageP.rating, 
>                pageP.runtime, 
>                pageP.seasons, 
>                pageP.Locations
>            ];
>        }));
>    } else if(name == 'NPCs'){
>        const pages = dv.pages('"Kendin/People"')
>            .where(page => page.NoteI == 'NPC')
>            .where(page => {
>                let location;
>                function checkLocation(value) {
>                    return value == th.file.name;
>                }
>                let checkLocationResult = false;
>                
>                let locationsArray = [];
>                if(typeof page.Locations !== 'undefined'){
>                    locationsArray = locationsArray.concat(page.Locations);
>                    location = locationsArray.find(checkLocation);
>                    
>                    if(location == th.file.name){
>                        checkLocationResult = true;
>                    } else {
>                        checkLocationResult = false;
>                    }
>                }
>                let stack = []; 
>                let count= 0; 
>                let stackA = [];
>                for (let org of page.Affiliations){ 
>                    stack.push("Kendin/People/Organizations/"+ org);
>                    try {
>                        locationsArray = locationsArray.concat((dv.page(stack[count]).Locations));
>                    } catch(err) {
>                        continue;
>                    }
>                    count++; 
>                }
>                location = locationsArray.find(checkLocation);
>                
>                
>             
>                return((location == th.file.name) || checkLocationResult);
>            });
>        dv.header(2, name);
>        dv.table(['Title', 'Ancestry', 'Aliases', 'Affiliations', 'Locations'], pages.map(pageP =>{ 
>            let stack = []; 
>            let count= 0; 
>            let stackA = [];
>            for (let org of pageP.Affiliations){ 
>                stack.push("Kendin/People/Organizations/"+ org);
>                try {
>                    stackA.push(dv.page(stack[count]).Locations);
>                } catch(err) {
>                    continue;
>                }
>                count++; 
>            }
>            if(pageP.Locations !== 'undefined' && stackA.length !== 0){
>                return [
>                    pageP.file.link, 
>                    pageP.Ancestry,
>                    pageP.Aliases,
>                    pageP.Affiliations,
>                    stackA.concat(pageP.Locations) 
>                ];
>            }
>            if(stackA.length !== 0 ){
>                return [
>                    pageP.file.link, 
>                    pageP.Ancestry,
>                    pageP.Aliases,
>                    pageP.Affiliations,
>                    stackA
>                ];
>            } else if(pageP.Locations !== 'undefined'){
>                return [
>                    pageP.file.link, 
>                    pageP.Ancestry,
>                    pageP.Aliases,
>                    pageP.Affiliations,
>                    pageP.Locations
>                ];
>            } else {
>                stackA.push('Unknown Location');
>                return [
>                    pageP.file.link, 
>                    pageP.Ancestry,
>                    pageP.Aliases,
>                    pageP.Affiliations,
>                    stackA
>                ];
>            }
>        }));
>    }
>};
>
>const removeTable = () => {
>    this.container.lastChild.remove();
>    this.container.lastChild.remove();
>};
>
>buttons.forEach(button => createButton(button));
>renderTable('Organizations');
> ``` 

# **`=this.file.name`**
> [!info|bg-c-purple]+ Map w/Overview
>
>## Map
>```leaflet
 id: Halvinar
 image: [[halvinar.png|Halvinar]]
 height: 850px
 width: 95%
 bounds: [[0,0], [3386, 3452]] 
 lat: 1726
 long: 1693
 maxZoom: 1
 minZoom: -1.5
 defaultZoom: -1
 unit: meters
 scale: 0.5186567164179104
>
>## Notable Locations
>
> ### Districts
>


## History
TBD

## DM Notes
### Plot Hooks


### Hidden Details


### General Notes





