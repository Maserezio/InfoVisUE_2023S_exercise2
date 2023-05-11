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
            .attr('name', d => d.properties.admin)
            .attr('code', d => d.properties.id)
            .attr('fill', function (d) {
                // checks if the country is present in the input data
                let country = countryArray.find(c => c["Country Code"] === d.properties.id);
                if (country) {
                    return 'gray';
                } else {
                    return 'white';
                }
            });

        // add hover event listener to highlight corresponding country on the map
        svg.selectAll('path')
            .on('mouseover', function (d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('fill', 'red');
                let countryCode = this.getAttribute("code");
                d3.selectAll('circle')
                    .filter(function () {
                        return d3.select(this).attr('code') === countryCode;
                    })
                    .transition()
                    .duration(200)
                    .attr('r', 15)
                    .style('fill', 'red');
                d3.select("#country")
                    .text(this.getAttribute("name"))
            })
            .on('mouseout', function (d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('fill', function (d) {
                        let country = countryArray.find(c => c["Country Code"] === d.properties.id);
                        if (country) {
                            return 'gray';
                        } else {
                            return 'white';
                        }
                    });
                let countryCode = this.getAttribute("code");
                d3.selectAll('circle')
                    .filter(function () {
                        return d3.select(this).attr('code') === countryCode;
                    })
                    .transition()
                    .duration(200)
                    .attr('r', 8)
                    .style('fill', 'blue');
                d3.select("#country")
                    .text("Country Name")
            });

        // svg.selectAll('path').on('click', function (d) {
        //     d3.select(this);
        //     let selectedOption = d3.select('select[id="indicator_dropdown"] option:checked').node().value;
        //     const countryName = this.getAttribute('code');
        //
        //     const filteredArray = countryArray.filter(item => item['Country Code'] === countryName)
        //         .map(item => ({
        //             'Country Name': item['Country Name'],
        //             'Country Code': item['Country Code'],
        //             'year': item['year'],
        //             [selectedOption]: item[selectedOption]
        //         }));
        //
        //     if (filteredArray.length !== 0) {
        //         initLineChart(filteredArray);
        //     }
        //
        // });

    });
}


