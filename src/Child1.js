import React, { Component } from "react"; // Importing React and Component from the React library
import * as d3 from "d3"; // Importing the entire D3 library and assigning it to the variable d3

class Child1 extends Component { // Defining a React component called Child1, extending Component
    constructor(props) { // Constructor method to initialize the component's state
        super(props); // Calling the constructor of the parent class (Component)
        this.state = {}; // Initializing the component's state
    }

    componentDidMount() { // Lifecycle method called after the component is mounted
        // Setting the initial state of x_scale to 10
        this.setState({ x_scale: 10 });
    }

    componentDidUpdate() { // Lifecycle method called after the component updates


        // Setting up margins and dimensions for the visualization
        var margin = { top: 10, right: 10, bottom: 30, left: 20 },
            w = 500 - margin.left - margin.right,
            h = 300 - margin.top - margin.bottom;

        var data = this.props.data1; // Retrieve data from props
        var temp_data = d3.flatRollup( // This is a D3 method used to create a rollup operation for a dataset, similar to d3.rollup. The difference is that flatRollup creates a flat array of results instead of nesting them.
            data,
            (d) => d.length,
            /* (line above) This is a callback function that specifies how to aggregate the data. In this case, it calculates the length 
            of each group of data points. It's assuming that data is an array of objects, and it's grouping the data by the day property of each object. */

            (d) => d.category
            /* This is a callback function that specifies the key to group the data by. It extracts the day property from each object in the dataset*/
        );

        console.log(temp_data)

        var container = d3
            .select(".child1_svg") // Select the SVG container
            .attr("width", w + margin.left + margin.right) // Set the width attribute of the SVG element
            .attr("height", h + margin.top + margin.bottom) // Set the height attribute of the SVG element
            .select(".g_1") // Select an existing or create a new <g> element with class "g_2" within the SVG
            .attr("transform", `translate(${margin.left}, ${margin.top})`); // Apply a translation transform to the <g> element

        // X axis
        var x_data = temp_data.map((item) => item[0]); // Extract x-axis data, iterates over each element in temp_data and extracts the first element (index 0) from each sub-array. This typically represents the category or label for each bar on the x-axis.
        var x_scale = d3
            .scaleBand() // Create a band scale for the x-axis
            .domain(x_data) // Set the domain of the x-scale
            .range([margin.left, w]) // Set the range of the x-scale
            .padding(0.2); // Set padding between bars

        container
            .selectAll(".x_axis_g") // Select all existing elements with class "x_axis_g"
            .data([0]) // Bind the data, binds data array[0]
            .join("g") // Join the data to the selection
            .attr("class", "x_axis_g") // Set the class attribute of the <g> element
            .attr("transform", `translate(0, ${h})`) // Apply a translation transform to the <g> element
            .call(d3.axisBottom(x_scale)); // Call the x-axis generator

        // Add Y axis
        var y_data = temp_data.map((item) => item[1]); // Extract y-axis data
        var y_scale = d3
            .scaleLinear() // Create a linear scale for the y-axis
            .domain([0, d3.max(y_data)]) // Set the domain of the y-scale
            .range([h, 0]); // Set the range of the y-scale

        // container
        //     .selectAll(".y_axis_g") // Select all existing elements with class "y_axis_g"
        //     .data([0]) // Bind the data
        //     .join("g") // Join the data to the selection
        //     .attr("class", "y_axis_g") // Set the class attribute of the <g> element
        //     .attr("transform", `translate(${margin.left},0)`) // Apply a translation transform to the <g> element
        //     .call(d3.axisLeft(y_scale)); // Call the y-axis generator

        container
            .selectAll("rect") // Select all existing <rect> elements
            .data(temp_data) // Bind the data
            .enter() // Enter selection for new data
            .append("rect") // Append a <rect> element for each data point
            .attr("x", function (d) {
                return x_scale(d[0]); // Set the x-coordinate of the rectangle
            })
            .attr("y", function (d) {
                return y_scale(d[1]); // Set the y-coordinate of the rectangle
            })
            .attr("width", x_scale.bandwidth()) // Set the width of the rectangle
            .attr("height", function (d) {
                return h - y_scale(d[1]); // Set the height of the rectangle
            })
            .attr("fill", "#69b3a2"); // Set the fill color of the rectangle

        const svg = d3.select("#demo2")
            .attr("width", w + margin.left + margin.right) 
            .attr("height", h + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
            container.selectAll(".bar-label")
            .data(temp_data)
            .enter()
            .append("text")
            .attr("class", "bar-label")
            .attr("x", function(d) { return x_scale(d[0]) + x_scale.bandwidth() / 2; }) 
            .attr("y", function(d) { return y_scale(d[1])+50; }) 
            .attr("text-anchor", "middle")
            .text(function(d) { return d[1]; }) 
            .attr("fill", "black"); 
    }

    render() { // Render method to render the component's UI
        return (
            <svg className="child1_svg"> {/* SVG container */}
                <g className="g_1"></g> {/* Empty group element */}
            </svg>
        );
    }
}

export default Child1; // Exporting the Child1 component as the default export
