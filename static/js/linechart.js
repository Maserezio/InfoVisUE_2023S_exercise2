function initLineChart(data, yAxisProperty, countryName) {
    const margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 900 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#svg_linechart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    const line = d3.line()
        .x(function (d) {
            return x(d.year);
        })
        .y(function (d) {
            return y(d[yAxisProperty]);
        });

    x.domain(d3.extent(data, function (d) {
        return d.year;
    }));
    y.domain([0, d3.max(data, function (d) {
        return d[yAxisProperty];
    })]);

    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", line)
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("fill", "none");

    svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("id", "y-axis")
        .call(d3.axisLeft(y));

    svg.append("text")
        .attr("id", "chart-title")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text(yAxisProperty + ' in ' + countryName + ' from 1960 to 2020');
}
function updateLineChart(data, yAxisProperty, countryName) {
    const margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 900 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#svg_linechart").select("svg");

    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    const line = d3.line()
        .x(function (d) {
            return x(d.year)
        })
        .y(function (d) {
            return y(d[yAxisProperty])
        });

    x.domain(d3.extent(data, function (d) {
        return d.year;
    }));
    y.domain([0, d3.max(data, function (d) {
        return d[yAxisProperty];
    })]);

    svg.select("#x-axis")
        .transition()
        .duration(1000)
        .call(d3.axisBottom(x));

    svg.select("#y-axis")
        .transition()
        .duration(1000)
        .call(d3.axisLeft(y));

    svg.select("#chart-title")
        .text(yAxisProperty + ' in ' + countryName + ' from 1960 to 2020');

    svg.select(".line")
        .datum(data)
        .transition()
        .duration(500)
        .attr("d", line)
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("fill", "none");
}