# D3-Challenge# 

![Newsroom](https://media.giphy.com/media/v2xIous7mnEYg/giphy.gif)

Information from the U.S. Census Bureau and the Behavioral Risk Factor Surveillance System is used to create an interactive D3 chart.

The data set : [https://factfinder.census.gov/faces/nav/jsf/pages/searchresults.xhtml](https://factfinder.census.gov/faces/nav/jsf/pages/searchresults.xhtml). The data set incldes data on rates of income, obesity, poverty, etc. by state. MOE stands for "margin of error."

A scatter plot is created between two of the data variables such as `Healthcare vs. Poverty` or `Smokers vs. Age`.

Each state is represented with circle elements. This graphic is coded in the `app.js`. 

* Note: The `python -m http.server` is used to run the visualization. This will host the page at `localhost:8000` in your web browser.

The scatter plot are given click events so that users can decide which data to display. The transitions are animated for the circles' locations as well as the range of your axes. 

Further, tooltips are added to the circles. 

