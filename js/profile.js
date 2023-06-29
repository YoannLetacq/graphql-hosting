// js/profile.js

import { getUserData } from './api.js';

export async function displayUserData() {
    // Retrieve the stored JWT from localStorage
    const token = sessionStorage.getItem('jwt');

    try {
        const userData = await getUserData(token);

        // Assume that userData has fields 'username' and 'xp'
        console.log(userData);
        const username = userData.data.user[0].login;
        const firstname = userData.data.user[0].firstName;
        const lastname =  userData.data.user[0].lastName;
        const auditRatio = userData.data.user[0].auditRatio;
        const xps = userData.data.xp_total.aggregate.sum.amount;
        const progresses = userData.data.user[0].progresses;
        console.log(progresses);

        // Find the elements in the DOM
        const usernameElement = document.getElementById('profile-username');
        const lastnameElement = document.getElementById('profile-lastname');
        const firstnameElement = document.getElementById('profile-firstname')
        const xpElement = document.getElementById('profile-xp');
        const ratio = document.getElementById('profile-auditRatio');
        const main_profile = document.getElementById('user-main-title');


        // Update their text content
        usernameElement.textContent = username;
        xpElement.textContent = xps;
        lastnameElement.textContent = lastname;
        firstnameElement.textContent = firstname;
        ratio.textContent = auditRatio;
        main_profile.textContent += username + ' you will find here all your stats!';


        // ?  create a map for attempt per exercise GOLANG
        let go_attempt_per_exercise = new Map();
                progresses.forEach(progress => {
                    if (progress.path.includes("piscine-go")) {
                        let name = progress.object.name;
    
                        if (!go_attempt_per_exercise.has(name)) {
                            go_attempt_per_exercise.set(name, 1);
                        } else {
                            let count = go_attempt_per_exercise.get(name);
                            go_attempt_per_exercise.set(name, count + 1);
                        }
                    }
                });
                console.log(go_attempt_per_exercise);


        // * create a map for attempt per exercise JAVASCRIPT
        let js_attempt_per_exercise = new Map();
        progresses.forEach(progress => {
            if (progress.path.includes("piscine-js")) {
                let name = progress.object.name;

                if (!js_attempt_per_exercise.has(name)) {
                    js_attempt_per_exercise.set(name, 1);
                } else {
                    let count = js_attempt_per_exercise.get(name);
                    js_attempt_per_exercise.set(name, count + 1);
                }
            }
        });
        console.log(js_attempt_per_exercise);
        

        // ! creeate a map for attempt per exercise RUST
        let rust_attempt_per_exercise = new Map();
        progresses.forEach(progress => {
            if (progress.path.includes("piscine-rust")) {
                let name = progress.object.name;

                if (!rust_attempt_per_exercise.has(name)) {
                    rust_attempt_per_exercise.set(name, 1);
                } else {
                    let count = rust_attempt_per_exercise.get(name);
                    rust_attempt_per_exercise.set(name, count + 1);
                }
            }
        });
        console.log(rust_attempt_per_exercise);


        

        // # graph attempt per formation checkpoint

        let cursus_attempt_per_exercise = new Map();
        progresses.forEach(progress => {
            if (progress.path.includes("checkpoint")) {
                let name = progress.object.name;

                if (!cursus_attempt_per_exercise.has(name)) {
                    cursus_attempt_per_exercise.set(name, 1);
                } else {
                    let count = cursus_attempt_per_exercise.get(name);
                    cursus_attempt_per_exercise.set(name, count + 1);
                }
            }
        });
        console.log(cursus_attempt_per_exercise);


        // _ graph for the attempt per exercise
    
 // Constants for our bar chart
const barHeight = 30;
const barSpacing = 5;
const maxBarWidth = 400;  // maximum width of the bar

// Function to create a bar
function createBar(x, y, width, height, fill) {
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", width);
    rect.setAttribute("height", height);
    rect.setAttribute("fill", fill);
    return rect;
}

// Function to create text
function createText(x, y, textContent) {
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", x);
    text.setAttribute("y", y);
    text.textContent = textContent;
    return text;
}

// Function to generate the chart
function generateChart(attempts_per_exercise) {
    // Clear existing chart
    const chartDiv = document.getElementById("chart");
    while (chartDiv.firstChild) {
        chartDiv.removeChild(chartDiv.firstChild);
    }

    // Calculate the SVG size
    const svgWidth = maxBarWidth;
    const svgHeight = (barHeight + barSpacing) * attempts_per_exercise.size;

    // Create SVG element
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("height", svgHeight);
    svg.style.width = "100%";
    chartDiv.appendChild(svg);  

    // Create bars for the bar chart
    let index = 0;
    const maxAttempts = Math.max(...Array.from(attempts_per_exercise.values()));  // maximum number of attempts

    for (let [exercise, attempts] of attempts_per_exercise.entries()) {
        const barWidth = (attempts / maxAttempts) * maxBarWidth;  // scale the bar width according to maxBarWidth
        const bar = createBar(0, index * (barHeight + barSpacing), barWidth, barHeight, "#ADD8E6");
        svg.appendChild(bar);

        // Add exercise name
        const text = createText(barWidth + 10, index * (barHeight + barSpacing) + barHeight / 2, exercise);
        svg.appendChild(text);

        // Add number of attempts inside the bar
        const attemptsText = createText(5, index * (barHeight + barSpacing) + barHeight / 2, attempts.toString());
        attemptsText.setAttribute("fill", "black");
        svg.appendChild(attemptsText);

        index++;
    }
}

// Attach event listeners to radio buttons
document.getElementById("radioGo").addEventListener("change", function() {
    generateChart(go_attempt_per_exercise);
});

document.getElementById("radioJs").addEventListener("change", function() {
    generateChart(js_attempt_per_exercise);
});

document.getElementById("radioRust").addEventListener("change", function() {
    generateChart(rust_attempt_per_exercise);
});

document.getElementById("radioCheckpoint").addEventListener("change", function() {
    generateChart(cursus_attempt_per_exercise);
});

        
// # PASS FAIL RATIO calculation
        let fails = 0;
        let pass = 0;

        progresses.forEach(progress => {
            if (progress.grade == 0) {
                fails += 1;
            } else if (progress.grade == 1){
                pass += 1;
            }
        });
        console.log(pass, fails);
// _ path fails ratio graph

// Create SVG element
let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
svg.setAttribute('width', 500);
svg.setAttribute('height', 500);

// Append SVG to your div
document.getElementById('Piechart').appendChild(svg);

// Create a group (g) element to hold the pie chart and center it within the SVG
let g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
g.setAttribute('transform', 'translate(250, 250)');
svg.appendChild(g);

// Calculate total and ratios
let total = pass + fails;
let passRatio = pass / total;
let failRatio = fails / total;

// Calculate the path descriptions for the arcs
let passArc = describeArc(0, 0, 200, 0, passRatio * 360);
let failArc = describeArc(0, 0, 200, passRatio * 360, 360);

// Create pass arc
let passPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
passPath.setAttribute('d', passArc);
passPath.setAttribute('fill', 'green');
g.appendChild(passPath);

// Create fail arc
let failPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
failPath.setAttribute('d', failArc);
failPath.setAttribute('fill', 'red');
g.appendChild(failPath);

// Create pass text
let passText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
passText.setAttribute('x', 0);
passText.setAttribute('y', -220);
passText.textContent = `Pass: ${pass}`;
passText.setAttribute('font-size', '20px');
passText.setAttribute('text-anchor', 'middle');
g.appendChild(passText);

// Create fail text
let failText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
failText.setAttribute('x', 0);
failText.setAttribute('y', 240);
failText.textContent = `Fails: ${fails}`;
failText.setAttribute('font-size', '20px');
failText.setAttribute('text-anchor', 'middle');
g.appendChild(failText);

// Function to describe an SVG arc
function describeArc(x, y, radius, startAngle, endAngle) {
    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);

    var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    var d = [
        "M", start.x, start.y, 
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");

    return d;
}

// Function to convert polar coordinates to Cartesian
function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}




        


    } catch (error) {
        // Handle the error however you see fit
        console.log('Failed to fetch user data:', error);
    }
}





