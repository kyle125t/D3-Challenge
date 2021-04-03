// Canvas attributes
var margin = 20;
var width = parseInt(d3.select("#scatter").style("width"));
var height = width - width / 3.9;
var labelArea = 110;
var paddingBottom = 40;
var paddingLeft = 40;

// Create svg canvas
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "chart");

// Create function for the radius of circle to improve visibility across apps
var circleRadius;
function crGet() {
  if (width <= 530) {
    circleRadius = 5;
  }
  else {
    circleRadius = 10;
  }
}
crGet();

// Setting x-axis 
svg.append("g").attr("class", "xText");
var xText = d3.select(".xText")

function xTextRefresh() {
  xText.attr(
    "transform",
    "translate(" +
      ((width - labelArea) / 2 + labelArea) +
      ", " +
      (height - margin - paddingBottom) +
      ")"
  );
}
xTextRefresh();

// Setting y-axis
svg.append("g").attr("class", "yText");
var yText = d3.select(".yText");

var leftX = margin + paddingLeft;
var leftY = (height + labelArea) / 2 - labelArea;

function yTextRefresh() {
  yText.attr(
    "transform",
    "translate(" + leftX + ", " + leftY + ")rotate(-90)"
  );
}
yTextRefresh();

// X-axis label appended to xText
xText
  .append("text")
  .attr("y", 26)
  .attr("data-name", "income")
  .attr("data-axis", "x")
  .attr("class", "aText active x")
  .text("Household Income (Median, in $USD)");

// y-axis label appended to yText
yText
  .append("text")
  .attr("y", -26)
  .attr("data-name", "obesity")
  .attr("data-axis", "y")
  .attr("class", "aText active y")
  .text("Obese (%)");

// Read in data CSV
d3.csv("assets/data/data.csv").then(function(data) {
  visualize(data);
});

// Define what will be shown through visualize function
function visualize(dData) {
  // Define what data is on each axis
  var axisX = "income";
  var axisY = "obesity";

  // 
  var toolTip = d3
    .tip()
    .attr("class", "d3-tip")
    .offset([40, -60])
    .html(function(d) {
      var xX;
      var stateName = "<div>" + d.state + "</div>";
      var yY = "<div>" + axisY + ": " + d[axisY] + "%</div>";
      var xX = "<div>" + axisX + ": " + "$" + d[axisX] + "</div>";
      return stateName + xX + yY;
    });
  svg.call(toolTip);
  
  // Assign empty min/max values
  var xMin;
  var xMax;
  var yMin;
  var yMax;

  // Create functions to set values for min/max based off data
  function xMinMax() {
    xMin = d3.min(dData, function(d) {
      return + d.income * 0.9;
    });
    xMax = d3.max(dData, function(d) {
      return + d.income * 1.1
    })
  };
  function yMinMax() {
    yMin = d3.min(dData, function(d) {
      return + d.obesity * 0.9;
    });
    yMax = d3.max(dData, function(d) {
      return + d.obesity * 1.1
    })
  };
  xMinMax();
  yMinMax();

  // Create scales
  var xScale = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([margin + labelArea, width - margin]);
  var yScale = d3
    .scaleLinear()
    .domain([yMin, yMax])
    .range([height - margin - labelArea, margin]);
  
  // Add scales to axes and append axes as groups to svg
  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);

  svg
    .append("g")
    .call(xAxis)
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + (height - margin - labelArea) + ")");
  svg
    .append("g")
    .call(yAxis)
    .attr("class", "yAxis")
    .attr("transform", "translate(" + (margin + labelArea) + ", 0)");

  var dataCircles = svg.selectAll("g dataCircles").data(dData).enter();

  // Adding circles to graph, along with their labels
  dataCircles
    .append("circle")
    .attr("cx", function(d) {
      return xScale(d[axisX]);
    })
    .attr("cy", function(d) {
      return yScale(d[axisY]);
    })
    .attr("r", circleRadius)
    .attr("class", function(d) {
      return "stateCircle " + d.abbr;
    })
    .on("mouseover", function(d) {
      toolTip.show(d, this);
      d3.select(this).style("stroke", "#ffffff");
    })
    .on("mouseout", function(d) {
      toolTip.hide(d);
      d3.select(this).style("stroke", "#ffffff");
    });

  dataCircles
    .append("text")
    .text(function(d) {
      return d.abbr;
    })
    .attr("dx", function(d) {
      return xScale(d[axisX]);
    })
    .attr("dy", function(d) {
      return yScale(d[axisY]) + circleRadius / 2.5;
    })
    .attr("font-size", circleRadius)
    .attr("class", "stateText")
    .on("mouseover", function(d) {
      toolTip.show(d);
      d3.select("." + d.abbr).style("stroke", "#ffffff");
    })
    .on("mouseout", function(d) {
      toolTip.hide(d);
      d3.select("." + d.abbr).style("stroke", "#ffffff");
    });
}


// Original portion of my code, for reference to my line of thinking

// var svgWidth = 960;
// var svgHeight = 500;
// var margin = {
//   top: 20,
//   right: 40,
//   bottom: 20,
//   left: 40
// };
// var width = svgWidth - margin.left - margin.right;
// var height = svgHeight - margin.top - margin.bottom;
// var chart = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

// // Add in tooltip through a div in the body
// d3.select(".chart").append("div").attr("class", "tooltip").style("opacity", 0);

// // Call in CSV
// d3.csv(".data/data.csv", function(err, CSVdata) {
//     // Remove errors
//     if (err) throw err;
//     // Parse data
//     CSVdata.forEach(function(data) {
//         data.income += data.income;
//         data.obesity += data.obesity;
//     });
//     // Create scales
//     var xLinearScale = d3.scaleLinear().range([0, width]);
//     var yLinearScale = d3.scaleLinear().range([height, 0]);
//     // Use scales in creation of axes
//     var bottomAxis = d3.axisBottom(xLinearScale);
//     var leftAxis = d3.axisLeft(yLinearScale);
//     // Set blank variables
//     var xMin;
//     var xMax;
//     var yMin;
//     var yMax;
//     // Define min/max for axes
//     xMin = d3.min(CSVdata, function(data) {
//         return +data.income * 0.95;
//     });;
//     xMax = d3.max(CSVdata, function(data) {
//         return +data.income * 1.05;
//     });;
//     yMin = d3.min(CSVdata, function(data) {
//         return +data.obesity * 0.95;
//     });;
//     yMax = d3.max(CSVdata, function(data) {
//         return +data.obesity *1.05;
//     });;
//     // Set linear scales
//     xLinearScale.domain([xMin, xMax]);
//     yLinearScale.domain([yMin, yMax]);
//     // Create tooltip variable
//     var toolTip = d3
//     .tip()
//     .attr("class", "tooltip")
//     .offset([80, -60])
//     .html(function(data) {
//         var stateName = data.state;
//         var income = +data.income;
//         var obesity = +data.obesity;
//         return (stateName + "<br> Income: " + income + "% <br> Obesity: " + obesity + "%");
//     });
//     // Append axes
//     chart.append("g")
//       .attr("transform", `translate(0, ${height})`)
//       .call(bottomAxis);
//     chart.append("g")
//       .call(leftAxis);
//     // Create circles
//     var circlesGroup = chart.selectAll("circle")
//       .data(CSVdata)
//       .enter()
//       .append("circle")
//       .attr("cx", d => xLinearScale(data.income + 0.5))
//       .attr("cy", d => yLinearScale(data.obesity + 0.5))
//       .attr("r", "12")
//       .attr("fill", "blue")
//       .attr("opacity", 0.5)
//       .on("mouseout", function(data, index) {
//         toolTip.hide(data);
//       });
//     chart.call(toolTip);
//     // click
//     circlesGroup.on("click", function(data) {
//       toolTip.show(data);
//     })
//       // Mouseout event
//       .on("mouseout", function(data, index) {
//         toolTip.hide(data);
//       });
    
// });