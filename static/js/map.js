let mapWidth = 800;
let mapHeight = 500;
let map = null;
let mapData = null;

function initMap(countryArray) {
    d3.json("../static/data/world-topo.json").then(function (countries) {
        let projection = d3.geoEqualEarth()
            .scale(180)
            .translate([mapWidth / 2, mapHeight / 2]);

        let path = d3.geoPath()
            .projection(projection);

        let svg = d3.select("#svg_map")
            .attr("width", mapWidth)
            .attr("height", mapHeight);

        mapData = topojson.feature(countries, countries.objects.countries).features;

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
                const data = countryArray.filter(item => item['Country Code'] === this.getAttribute("code") && item['year'] === 2020);

                const p = d3.select("#info")
                    .selectAll("span")
                    .data(data);

                p.enter()
                    .append("span")
                    .merge(p)
                    .html(function (d) {
                        const entries = Object.entries(d);
                        const firstElement = entries[0];
                        const lastTen = entries.slice(-10);
                        const result = [firstElement, ...lastTen];
                        return result.map(([key, value]) => `${key}: ${value}<br>`).join("");
                    });
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
                d3.select("#info").selectAll("span").remove()
            });

        svg.selectAll('path').on('click', function (d) {
            d3.select(this);
            let selectedOption = d3.select('select[id="indicator_dropdown"] option:checked').node().value;
            const countryCode = this.getAttribute('code');

            const filteredArray = countryArray.filter(item => item['Country Code'] === countryCode)
                .map(item => ({
                    'Country Name': item['Country Name'],
                    'Country Code': item['Country Code'],
                    'year': item['year'],
                    [selectedOption]: item[selectedOption]
                }));

            if (filteredArray.length !== 0) {
                if (!d3.select("#svg_linechart svg g").empty()) {
                    updateLineChart(filteredArray, selectedOption, this.getAttribute('name'));
                } else {
                    initLineChart(filteredArray, selectedOption, this.getAttribute('name'));
                }
            }
        });
    });
}