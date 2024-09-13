function populateOpponentDropdown(opponents) {
    const dropdown = document.getElementById('opponent-dropdown');
    dropdown.innerHTML = ''; // Clear existing options
    opponents.forEach(opponent => {
        const option = document.createElement('option');
        option.value = opponent; // Set the value
        option.textContent = opponent; // Set the displayed text
        dropdown.appendChild(option); // Append to the dropdown
    });
}

// Function to populate the date dropdown
function populateDateDropdown(dates) {
    const dropdown = document.getElementById('date-dropdown');
    dropdown.innerHTML = ''; // Clear existing options
    dates.forEach(date => {
        const option = document.createElement('option');
        option.value = date; // Set the value
        option.textContent = date; // Set the displayed text
        dropdown.appendChild(option); // Append to the dropdown
    });
}

// Fetch averages and populate the dropdowns on page load
fetch('/get_averages')
    .then(response => response.json())
    .then(data => {
        const opponents = data.opponents; // Get opponents from the response
        const dates = data.dates; // Get dates from the response

        populateOpponentDropdown(opponents); // Populate the opponent dropdown
        populateDateDropdown(dates); // Populate the date dropdown
        
        // Display averages
        document.getElementById('avg-points').innerText = data.average_points_per_possession.toFixed(2);
        document.getElementById('avg-paint-touches').innerText = data.average_paint_touches.toFixed(2);
        document.getElementById('avg-side-changes').innerText = data.average_side_changes.toFixed(2);
    })
    .catch(error => {
        console.error('Error fetching averages:', error);
    });

function filterByDate() {
    const selectedDate = document.getElementById('date-dropdown').value;

    // Fetch averages based on the selected date
    fetch(`/get_averages?date=${selectedDate}`)
        .then(response => response.json())
        .then(data => {
            // Update displayed averages
            document.getElementById('avg-points').innerText = data.average_points_per_possession.toFixed(2);
            document.getElementById('avg-paint-touches').innerText = data.average_paint_touches.toFixed(2);
            document.getElementById('avg-side-changes').innerText = data.average_side_changes.toFixed(2);
        })
        .catch(error => {
            console.error('Error fetching averages:', error);
        });


}


