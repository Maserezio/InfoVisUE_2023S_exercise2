let mapWidth = 800;
let mapHeight = 500;
let map = null;
let mapData = null;



function initMap(countryArray) {

    // loads the world map as topojson
    d3.json("../static/data/world-topo.json").then(function (countries) {

        // defines the map projection method and scales the map within the SVG
        let projection = d3.geoEqualEarth()
            .scale(180)
            .translate([mapWidth / 2, mapHeight / 2]);

        // generates the path coordinates from topojson
        let path = d3.geoPath()
            .projection(projection);

        // configures the SVG element
        let svg = d3.select("#svg_map")
            .attr("width", mapWidth)
            .attr("height", mapHeight);

        // map geometry
        mapData = topojson.feature(countries, countries.objects.countries).features;

        // generates and styles the SVG path
        map = svg.append("g")
            .selectAll('path')
            .data(mapData)
            .enter().append('path')
            .attr('d', path)
            .attr('stroke', 'black')
            .attr('stroke-width', 0.5)
            .attr('fill', 'red')
            .attr('fill', function(d) {
                // checks if the country is present in the input data
                let country = countryArray.find(c => c["Country Name"] === d.properties.admin);
                if (country) {
                    return 'gray';
                } else {
                    return 'white';
                }
            });
    });


}

