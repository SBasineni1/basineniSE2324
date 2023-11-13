/*
    Demonstrate how to create a line chart
*/

async function getData() {
    const response = await fetch("/basineniSE2324/data/avg_output_Igra.csv");
    const data = await response.text(); // CSV is in text format

    const xYears = []; // x-axis labels = years values
    const yLI = []; // y-axis global temp values
    const ySI = []; // y-axis NH temp values
    const yKI = []; // y-axis SH temp values

    // split("\n") will separate table into an array of indiv. rows
    // slice(start, end) - return a new array starting at index start up to but not including index end
    const table = data.split("\n").slice(1);

    table.forEach(row => {
        const columns = row.split(","); // split each row on the commas (give series of values from that row)

        const year = columns[0]; // assign that year value to the var
        xYears.push(year); // push the year values to year array
        const liftedIndex = parseFloat(columns[1]);
        yLI.push(liftedIndex); 
        const showalterIndex = parseFloat(columns[2]);
        ySI.push(showalterIndex);
        const kIndex = parseFloat(columns[3]);
        yKI.push(kIndex);

    });

    return { xYears, yLI, ySI, yKI};
}


async function createChart(){
    const data = await getData() // Create chart will wait until getData() is finished
    const ctx = document.getElementById("myChart")
    const degSys = String.fromCharCode(176)

    const myChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: data.xYears,
            datasets: [
                {
                    label: `Lifted Index Temperature in ${degSys}C`,
                    data: data.yLI,
                    fill: false,
                    backgroundColor: "rgba(255, 99, 132, 0.2)",
                    borderColor: "rgba(255, 99, 132, 0.5)",
                    borderWidth: 1,
                },
                {
                    label: `Showalter Index Temperature in ${degSys}C`,
                    data: data.ySI,
                    fill: false,
                    backgroundColor: "rgba(0, 102, 255, 0.2)",
                    borderColor: "rgba(0, 102, 255, 0.5)",
                    borderWidth: 1,
                },
                {
                    label: `K Index Temperature in ${degSys}C`,
                    data: data.yKI,
                    fill: false,
                    backgroundColor: "rgba(0, 153, 51, 0.2)",
                    borderColor: "rgba(0, 153, 51, 0.5)",
                    borderWidth: 1,
                }
            ]
        },
        options: {
            responsive: true, // resize based on screen size
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Year", // x-axis title
                        font: {
                            size: 20,
                        },
                    },
                    ticks: {
                        callback: function(val, index){
                            // labeling of tick marks can be controlled by code
                            return index % 5 === 0 ? this.getLabelForValue(val) : ""
                        },
                        font: {
                            size: 16
                        }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: ` Temperature (${degSys}C)`, // x-axis title
                        font: {
                            size: 20,
                        },
                    },
                    ticks: {
                        maxTicksLimit: data.yLI.length/2,
                        font: {
                            size: 12
                        }
                    }
                }
            },
            plugins: { // Display options
                title: {
                    display: true,
                    text: `Yearly Averages of the Lifted Index (LI), Showalter Index (SI), K Index (KI) in ${degSys}C `,
                    font: {
                        size: 24
                    },
                    padding: {
                        top: 30,
                        bottom: 30,
                    }
                },
                legend: {
                    align: "start",
                    position: "bottom",
                }
            }
        },
    })
}
createChart()