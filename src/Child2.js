import React, { Component } from "react"; // Importing React and Component from the React library
import * as d3 from "d3"; // Importing the entire D3 library and assigning it to the variable d3

class Child2 extends Component { // Defining a React component called Child1, extending Component
    constructor(props) { // Constructor method to initialize the component's state
        super(props); // Calling the constructor of the parent class (Component)
        this.state = {
            selectedCategory: "A"
        }; // Initializing the component's state
    }

    componentDidMount() { // Lifecycle method called after the component is mounted
        // Setting the initial state of x_scale to 10
        this.setState({ x_scale: 10 });
    }

    componentDidUpdate() {
    var unfilteredData = this.props.data2;
    const selectedCategory = this.state.selectedCategory;
    const data = unfilteredData.filter(item => item.category === selectedCategory);

    // Setting up margins and dimensions for the visualization
    var margin = { top: 10, right: 10, bottom: 30, left: 20 },
        w = 500 - margin.left - margin.right,
        h = 300 - margin.top - margin.bottom;
    var container = d3
        .select(".child2_svg") // Selecting an SVG element with class "child1_svg"
        .attr("width", w + margin.left + margin.right) // Setting the width attribute of the SVG element
        .attr("height", h + margin.top + margin.bottom) // Setting the height attribute of the SVG element
        .select(".g_2") // Selecting an existing or creating a new <g> element with class "g_1" within the SVG
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Creating x-scale based on the total_bill data
    const x_scale = d3.scaleLinear().domain([0, 20]).range([margin.left, w]); 

    container.selectAll(".x_axis_g").data([0]).join('g').attr("class", 'x_axis_g')
        .attr("transform", `translate(0, ${h})`).call(d3.axisBottom(x_scale));

    var y_data = unfilteredData.map(item => item.y); 
    const y_scale = d3.scaleLinear().domain([0, 20]).range([h, 0]); 

    // Appending y-axis to the container
    container.selectAll(".y_axis_g").data([0]).join('g').attr("class", 'x_axis_g')
        .attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(y_scale));

    // Append y-axis label
    container.append("text")
        .attr("class", "y-axis-label")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -h / 2)
        .attr("y", -margin.left) 
        .text("Y Axis Label");

    // Append x-axis label
    container.append("text")
        .attr("class", "x-axis-label")
        .attr("text-anchor", "middle")
        .attr("x", w / 2)
        .attr("y", h + margin.top + 20) 
        .text("X Axis Label");

    var tooltip = d3.select("body")
        .selectAll(".tooltip_div")
        .data([0])  // binds a single element to the tooltip
        .join("div")  // joins the data to a div element
        .attr("class", "tooltip_div")  // adds a CSS class for styling
        .style("position", "absolute")  // uses absolute positioning
        .style("visibility", "hidden")  // starts as hidden

    // Binding data to circles and appending them to the SVG
    container.selectAll("circle") // Selects all existing circle elements (if any) within the container
        .data(data) // Binds the data array to the selection of circles.  Each element in the data array corresponds to one circle.
        .join("circle") // This joins the data to the selection of circles, creating new circle elements for any data points that don't have corresponding circles. It also selects any existing circles that match the data points.
        .attr("cx", function (d) {
            return x_scale(d.x); // Sets the x-coordinate of the circle using the x_scale
        })
        .attr("cy", function (d) {
            return y_scale(d.y); // Sets the y-coordinate of the circle using the y_scale
        })
        .attr("r", 3) // Sets the radius of the circles to 3 pixels
        .style("fill", "#69b3a2") // Sets the fill color of the circles to "#69b3a2"

        .on("mouseover", function (event, d) {
            tooltip.html(`X is: ${d.x}<br>Y: ${d.y}`)
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px")
            tooltip.style("visibility", "visible");
        })
        .on("mouseout", function (d) {
            tooltip.style("visibility", "hidden");
        });
}


    render() { // Render method to render the component's UI
        return (
            <div>
                <select id="selectButton" onChange={(event) => this.setState({ selectedCategory: event.target.value })}>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                </select><br></br>
                <svg className="child2_svg"> {/* SVG container */}
                    <g className="g_2"></g> {/* Empty group element */}
                </svg>
            </div>
        );
    }
}

export default Child2; // Exporting the Child1 component as the default export
