function initScatterplot(data) {
    const margin = {top: 20, right: 20, bottom: 30, left: 40};
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Append the SVG object to the body of the page
    const svg = d3.select("#svg_plot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Add X axis
    const x = d3.scaleLinear()
        .domain([d3.min(data, d => d.PC1) - 1, d3.max(data, d => d.PC1) + 1])
        .range([0, width]);
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([d3.min(data, d => d.PC2) - 1, d3.max(data, d => d.PC2) + 1])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add dots
    svg.selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.PC1))
        .attr("cy", d => y(d.PC2))
        .attr("name", d => d["Country Name"])
        .attr("code", d => d["Country Code"])
        .attr("r", 8)
        .style("fill", "blue")
        .on("mouseover", function () {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("r", 15)
                .style("fill", "red");

            let countryCode = this.getAttribute("code");
            d3.selectAll('path')
                .filter(function () {
                    return d3.select(this).attr('code') === countryCode;
                })
                .transition()
                .duration(200)
                .attr('fill', 'red');

            d3.select("#country")
                .text(this.getAttribute("name"))
        })
        .on("mouseout", function () {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("r", 8)
                .style("fill", "blue");


            let countryCode = this.getAttribute("code");
            d3.selectAll('path')
                .filter(function () {
                    return d3.select(this).attr('code') === countryCode;
                })
                .transition()
                .duration(200)
                .attr('fill', 'gray');

            d3.select("#country")
                .text("Country Name")
        });
}
