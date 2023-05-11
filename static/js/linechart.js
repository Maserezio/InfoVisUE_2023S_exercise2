export function initLineChart(data) {

// Set the dimensions and margins of the chart
    const margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

// Append the SVG element to the chart div
    const svg = d3.select("#svg_linechart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Set the ranges
    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

// Define the line
    const line = d3.line()
        .x(function (d) {
            return x(d.year);
        })
        .y(function (d) {
            return y(d["Access to electricity (% of population)"]);
        });

// Scale the range of the data
    x.domain(d3.extent(data, function (d) {
        return d.year;
    }));
    y.domain([0, d3.max(data, function (d) {
        return d["Access to electricity (% of population)"];
    })]);

// Add the line
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", line)
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("fill", "none");

// Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

// Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

// Add the chart title
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Access to electricity (% of population)");
}