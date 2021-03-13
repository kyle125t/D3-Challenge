// Setting chart parameters
var svgWidth = 960;
var svgHeight = 500;
var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

var chart = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

// Add in tooltip through a div in the body
d3.select(".chart").append("div").attr("class", "tooltip").style("opacity", 0);

// Call in CSV
d3.csv("data/data.csv", function(err, CSVdata) {
    // Remove errors
    if (err) throw err;
    // Parse data
    CSVdata.forEach(function(data) {
        data.income += data.income;
        data.obesity += data.obesity;
    });
    // Create scales
    var xLinearScale = d3.scaleLinear().range([0, width]);
    var yLinearScale = d3.scaleLinear().range([height, 0]);
    // Use scales in creation of axes
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    // Set blank variables
    var xMin;
    var xMax;
    var yMin;
    var yMax;
    // Define min/max for axes
    xMin = d3.min(CSVdata, function(data) {
        return +data.income * 0.95;
    });;
    xMax = d3.max(CSVdata, function(data) {
        return +data.income * 1.05;
    });;
    yMin = d3.min(CSVdata, function(data) {
        return +data.obesity * 0.95;
    });;
    yMax = d3.max(CSVdata, function(data) {
        return +data.obesity *1.05;
    });;
    // Set linear scales
    xLinearScale.domain([xMin, xMax]);
    yLinearScale.domain([yMin, yMax]);
    // Tooltip
    var toolTip = d3
    .tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(data) {
        var stateName = data.state;
        var income = +data.income;
        var obesity = +data.obesity;
        return (
            stateName + '<br> Income: ' + income + '% <br> Obesity: ' + obesity +'%'
        );
    });
});