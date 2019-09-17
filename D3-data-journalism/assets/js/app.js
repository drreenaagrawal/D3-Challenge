var svgWidth = 860;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 30,
  bottom: 80,
  left: 110
};

  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

  // Create an SVG wrapper, append an SVG group that will hold our chart,
  // and shift the latter by left and top margins.
  var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  // Append an SVG group
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Initial Params
  var chosenXAxis = "poverty";
  var chosenYAxis = "healthcare";

    // function used for updating x-scale var upon click on axis label
    function xScale(healthData, chosenXAxis) {
      var xLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.8,
          d3.max(healthData, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);
  
      return xLinearScale;
    }
  
    // function used for updating y-scale var upon click on axis label
    function yScale(healthData, chosenYAxis) {
      var yLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d[chosenYAxis]) * 0.8, 
        d3.max(healthData, d => d[chosenYAxis]) * 1.2])
        .range([height, 0]);
  
      return yLinearScale;
    }
  // function used for updating xAxis var upon click on axis label
    function renderAxes(newXScale, xAxis) {
      var bottomAxis = d3.axisBottom(newXScale);
  
      xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
  
      return xAxis;
    }
  
    // function used for updating yAxis var upon click on axis label
    function renderYAxes(newYScale, yAxis) {
      var leftAxis = d3.axisLeft(newYScale);
  
      yAxis.transition()
        .duration(1000)
        .call(leftAxis);
  
      return yAxis;
    }

    function renderCircles(circlesGroup, newXScale, chosenXAxis) {

      circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]));
  
      return circlesGroup;
    }
  
    function renderYCircles(circlesGroup, newYScale, chosenYAxis) {
  
      circlesGroup.transition()
        .duration(1000)
        .attr("cy", d => newYScale(d[chosenYAxis]));
  
      return circlesGroup;
    }
   // function used for updating texts group with a transition to
  // new circles 
    function renderTexts(textsGroup, newXScale, chosenXAxis) {

      textsGroup.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]));
  
      return textsGroup;
    }
  
    function renderYTexts(textsGroup, newYScale, chosenYAxis) {
  
      textsGroup.transition()
        .duration(1000)
        .attr("y", d => newYScale(d[chosenYAxis]));
  
      return textsGroup;
    }
 
  // Retrieve data from the CSV file and execute everything below
  d3.csv("../assets/data/data.csv").then(function(healthData) {

    // parse data
    healthData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.age = +data.age;
      data.income = +data.income;
      data.healthcare = +data.healthcare;
      data.obesity = +data.obesity;
      data.smokes = +data.smokes;
    });


    // xLinearScale function 
    var xLinearScale = xScale(healthData, chosenXAxis);
    
    // yLinearScale function 
    var yLinearScale = yScale(healthData, chosenYAxis);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);


    // append x axis
    var xAxis = chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    // append y axis
    var yAxis = chartGroup.append("g")
      .call(leftAxis);

      var tip = d3.tip()
      .style("background", "steelblue")
      .style("color", "white")
      .offset([80, -60])
      .attr("class", "d3-tip")
      .html(function(d) {
        return (`${d.state}<br>${chosenXAxis}: ${d[chosenXAxis]}<br>${chosenYAxis}: ${d[chosenYAxis]}%`)
        ;
      });
  

  
    // append initial circles
    var circlesGroup = chartGroup.append("g")
      .selectAll("circle")
      .data(healthData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("r", 12)
      .attr("fill", "lightblue")
      .attr("opacity", ".8")
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

      circlesGroup.call(tip);

      // append text labels
    var textsGroup = chartGroup.append("g")
      .selectAll("text")
      .data(healthData)
      .enter()
      .append("text")
      .classed("text-group", true)
      .text(d => d.abbr)
      .attr("x", d => xLinearScale(d[chosenXAxis]))
      .attr("y", d => yLinearScale(d[chosenYAxis]))
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "central")
      .attr("font_family", "sans-serif")  // Font type
      .attr("font-size", "11px")  // Font size
      .attr("fill", "white")   // Font color
      .style("font-weight", "bold");


    // Create group for  3 x-axis labels
    var labelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty") // value to grab for event listener
      .classed("active", true)
      .text("In Poverty (%)");

    var ageLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "age") // value to grab for event listener
      .classed("inactive", true)
      .text("Age (Median)");

    var incomeLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 60)
      .attr("value", "income") // value to grab for event listener
      .classed("inactive", true)
      .text("Household Income (Median) in USD");
    
    // Create group for  3 y-axis labels
    var ylabelsGroup = chartGroup.append("g")
      .attr("transform", "rotate(-90)");

    var healthcareLabel = ylabelsGroup.append("text")
      .attr("y", 0 - 50)
      .attr("x", 0 - (height / 2))
      .attr("value", "healthcare")
      .classed("active", true)
      .text("Lacks Healthcare (%)");

    var obesityLabel = ylabelsGroup.append("text")
      .attr("y", 0 - 70)
      .attr("x", 0 - (height / 2))
      .attr("value", "obesity")
      .classed("inactive", true)
      .text("Obese (%)");

    var smokesLabel = ylabelsGroup.append("text")
      .attr("y", 0 - 90)
      .attr("x", 0 - (height / 2))
      .attr("value", "smokes")
      .classed("inactive", true)
      .text("Smokes (%)");


    // x axis labels event listener
    labelsGroup.selectAll("text")
      .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {

          // replaces chosenXaxis with value
          chosenXAxis = value;

          // updates x scale for new data
          xLinearScale = xScale(healthData, chosenXAxis);

          // updates x axis with transition
          xAxis = renderAxes(xLinearScale, xAxis);

          // updates circles with new x values
          circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
   
          // update texts with new x values
          textsGroup = renderTexts(textsGroup, xLinearScale, chosenXAxis);

          // changes classes to change bold text
          if (chosenXAxis === "age") {
            ageLabel
              .classed("active", true)
              .classed("inactive", false);
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenXAxis === "poverty") {
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            povertyLabel
              .classed("active", true)
              .classed("inactive", false);
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenXAxis === "income") {
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            incomeLabel
              .classed("active", true)
              .classed("inactive", false);
          }
        }
      });

    // y axis labels event listener
    ylabelsGroup.selectAll("text")
      .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenYAxis) {

          // replaces chosenXaxis with value
          chosenYAxis = value;

          // updates x scale for new data
          yLinearScale = yScale(healthData, chosenYAxis);

          // updates x axis with transition
          yAxis = renderYAxes(yLinearScale, yAxis);

          // updates circles with new y values
          circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);
 
          // update texts with new y values
          textsGroup = renderYTexts(textsGroup, yLinearScale, chosenYAxis);

          // changes classes to change bold text
          if (chosenYAxis === "healthcare") {
            healthcareLabel
              .classed("active", true)
              .classed("inactive", false);
            obesityLabel
              .classed("active", false)
              .classed("inactive", true);
            smokesLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenYAxis === "obesity") {
            healthcareLabel
              .classed("active", false)
              .classed("inactive", true);
            obesityLabel
              .classed("active", true)
              .classed("inactive", false);
            smokesLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenYAxis === "smokes") {
            healthcareLabel
              .classed("active", false)
              .classed("inactive", true);
            obesityLabel
              .classed("active", false)
              .classed("inactive", true);
            smokesLabel
              .classed("active", true)
              .classed("inactive", false);
          }
        }
      });
  });




  


