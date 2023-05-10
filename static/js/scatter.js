function buildScatterplot(data) {
  // Set the dimensions and margins of the plot
  var margin = { top: 20, right: 20, bottom: 30, left: 40 },
      width = 600 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

  // Append the SVG object to the body of the page
  var svg = d3.select("#svg_plot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

  // Add X axis
  var x = d3.scaleLinear()
    .domain([d3.min(data, function(d) { return d.PC1; }) - 1, d3.max(data, function(d) { return d.PC1; }) + 1])
    .range([0, width]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([d3.min(data, function(d) { return d.PC2; }) - 1, d3.max(data, function(d) { return d.PC2; }) + 1])
    .range([height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Add dots
  svg.selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function(d) { return x(d.PC1); })
      .attr("cy", function(d) { return y(d.PC2); })
      .attr("r", 8)
      .style("fill", "blue")
      .on("mouseover", function(d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 15)
            .style("fill","red")
        svg.append("text")
          .attr("id", "tooltip")
          .attr("x", x(d.PC1) + 15)
          .attr("y", y(d.PC2))
          .text(d['Country Name'])
          .append("tspan")
            .attr("dx", 5)
            .attr("dy", -8)
            .text("id: " + d.id);
      })
      .on("mouseout", function(d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 8)
           .style("fill", "blue");
        d3.select("#tooltip").remove();
      });
}
