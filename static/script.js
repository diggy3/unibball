function addPlayer(event) {
    const playerName = event.target.innerHTML;
    const activePlayersDiv = document.getElementById("active-players");
    

    if (!activePlayersDiv.innerHTML.includes(playerName)) {
        activePlayersDiv.innerHTML += `<div class="player-tile" onclick="removePlayer(this)">${playerName}</div>`;
    }
}

function removePlayer(tile) {
    // Remove the player tile from the active lineup
    tile.classList.add('active'); // Turn the tile red
    setTimeout(() => {
        tile.remove(); // Remove the tile after a short delay
    }, 200); // Adjust delay if needed for visual effect
}

// Change Sides Counter
let changeSidesCount = 0;

function incrementChangeSides() {
    changeSidesCount++;
    const button = document.querySelector('#change-sides');
    button.innerText = changeSidesCount; // Update button text to reflect the new count
}


// Paint Touches Counter
let paintTouchesCount = 0;

function incrementPaintTouches() {
    paintTouchesCount++;
    const button = document.querySelector('#paint-touches');
    button.innerText = paintTouchesCount; // Update button text to reflect the new count
}




// Statistics counters
let statsCounters = {
    '2pm': 0,
    '2pa': 0,
    '3pm': 0,
    '3pa': 0,
    'fta': 0,
    'ftm': 0,
    'offFoul': 0,
    'defFoul': 0,
    'turnover': 0,
    'offReb': 0
};

// Function to increment the specific stat counter
function incrementStat(stat) {
    if (statsCounters.hasOwnProperty(stat)) {
        statsCounters[stat]++;
        // Update the button text to reflect the new count
        const button = document.querySelector(`button[onclick="incrementStat('${stat}')"]`);
        button.innerText = statsCounters[stat];

        // Additional logic for automatic increments
        if (stat === '2pm') {
            statsCounters['2pa']++;
            document.querySelector(`button[onclick="incrementStat('2pa')"]`).innerText = statsCounters['2pa'];
        } else if (stat === '3pm') {
            statsCounters['3pa']++;
            document.querySelector(`button[onclick="incrementStat('3pa')"]`).innerText = statsCounters['3pa'];
        } else if (stat === 'ftm') {
            statsCounters['fta']++;
            document.querySelector(`button[onclick="incrementStat('fta')"]`).innerText = statsCounters['fta'];
        }
    }
}

// Possession counter
let possessionCount = 1;

// Function to handle the Next Possession button click
function nextPossession() {
    const activePlayersDiv = document.getElementById("active-players");
    const activePlayers = [...activePlayersDiv.getElementsByClassName("player-tile")].map(tile => tile.innerText);

    // Gather data to write to CSV
    const opponent = localStorage.getItem('opponent');
    const date = localStorage.getItem('date');
    const location = localStorage.getItem('location');
    
    const dataToWrite = {
        opponent: opponent,
        date: date,
        location: location,
        possessionNumber: possessionCount,
        changeSidesCount: changeSidesCount,
        paintTouchesCount: paintTouchesCount,
        stats: statsCounters,
        activePlayers: activePlayers
    };

    // Writing data to CSV using Flask
    fetch('/write_to_csv', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToWrite)
    }).then(response => {
        if (response.ok) {
            // Reset counters after successful write
            changeSidesCount = 0;
            paintTouchesCount = 0;
            statsCounters = {
                '2pm': 0,
                '2pa': 0,
                '3pm': 0,
                '3pa': 0,
                'fta': 0,
                'ftm': 0,
                'offFoul': 0,
                'defFoul': 0,
                'turnover': 0,
                'offReb': 0
            };

            // Update button texts to show reset values
            document.querySelector('#change-sides').innerText = changeSidesCount; // Reset Change Sides button
            document.querySelector('#paint-touches').innerText = paintTouchesCount; // Reset Paint Touches button
            
            // Reset statistics buttons
            for (const stat in statsCounters) {
                const button = document.querySelector(`button[onclick="incrementStat('${stat}')"]`);
                button.innerText = statsCounters[stat]; // Reset statistics buttons
            }

            // Increment possession number
            possessionCount++;
            document.getElementById('possession-number').innerText = possessionCount; // Update possession number display
        } else {
            console.error('Error writing to CSV');
        }
    }).catch(error => {
        console.error('Error:', error);
    });
}



// Function to handle the Finish Game button click
function finishGame() {
    const activePlayersDiv = document.getElementById("active-players");
    const activePlayers = [...activePlayersDiv.getElementsByClassName("player-tile")].map(tile => tile.innerText);
    
    // Gather data to write to CSV
    const opponent = localStorage.getItem('opponent');
    const date = localStorage.getItem('date');
    const location = localStorage.getItem('location');
    
    const dataToWrite = {
        opponent: opponent,
        date: date,
        location: location,
        possessionNumber: possessionCount,
        changeSidesCount: changeSidesCount,
        paintTouchesCount: paintTouchesCount,
        stats: { ...statsCounters },
        activePlayers: activePlayers,
        final: true, // Indicate this is the final game data
    };


    // Writing final data to CSV using Flask
    fetch('/write_to_csv', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToWrite)
    }).then(response => {
        if (response.ok) {
            // Reset all counters
            changeSidesCount = 0;
            paintTouchesCount = 0;
            statsCounters = {
                '2pm': 0,
                '2pa': 0,
                '3pm': 0,
                '3pa': 0,
                'fta': 0,
                'ftm': 0,
                'offFoul': 0,
                'defFoul': 0,
                'turnover': 0,
                'offReb': 0
            };

            // Update button texts to show reset values
            document.querySelector('#change-sides').innerText = changeSidesCount; // Reset Change Sides button
            document.querySelector('#paint-touches').innerText = paintTouchesCount; // Reset Paint Touches button
            
            // Reset statistics buttons
            for (const stat in statsCounters) {
                const button = document.querySelector(`button[onclick="incrementStat('${stat}')"]`);
                button.innerText = statsCounters[stat]; // Reset statistics buttons
            }

            // Redirect to home page
            window.location.href = '/'; // Redirect to the homepage after finishing the game
        } else {
            console.error('Error writing final game data to CSV');
        }
    }).catch(error => {
        console.error('Error:', error);
    });
}

// Points total
let pointsTotal = 0;

// Function to increment the specific stat counter
function incrementStat(stat) {
    if (statsCounters.hasOwnProperty(stat)) {
        statsCounters[stat]++;
        // Update the button text to reflect the new count
        const button = document.querySelector(`button[onclick="incrementStat('${stat}')"]`);
        button.innerText = statsCounters[stat];

        // Logic for automatic increments and points calculation
        if (stat === '2pm') {
            pointsTotal += 2; // Add 2 points for 2PM
            statsCounters['2pa']++;
            document.querySelector(`button[onclick="incrementStat('2pa')"]`).innerText = statsCounters['2pa']; // Automatically increment 2PA
        } else if (stat === '3pm') {
            pointsTotal += 3; // Add 3 points for 3PM
            statsCounters['3pa']++;
            document.querySelector(`button[onclick="incrementStat('3pa')"]`).innerText = statsCounters['3pa']; // Automatically increment 3PA
        } else if (stat === 'ftm') {
            pointsTotal += 1; // Add 1 point for FTM
            statsCounters['fta']++;
            document.querySelector(`button[onclick="incrementStat('fta')"]`).innerText = statsCounters['fta']; // Automatically increment FTA
        }

        // Update points total display
        document.getElementById('points-total').innerText = pointsTotal; // Update points display
    }
}

// Function to handle the Next Possession button click
function nextPossession() {
    const activePlayersDiv = document.getElementById("active-players");
    const activePlayers = [...activePlayersDiv.getElementsByClassName("player-tile")].map(tile => tile.innerText);
    
    // Gather data to write to CSV
    const opponent = localStorage.getItem('opponent');
    const date = localStorage.getItem('date');
    const location = localStorage.getItem('location');
    
    const dataToWrite = {
        opponent: opponent,
        date: date,
        location: location,
        possessionNumber: possessionCount,
        changeSidesCount: changeSidesCount,
        paintTouchesCount: paintTouchesCount,
        stats: statsCounters,
        activePlayers: activePlayers,
        pointsTotal: pointsTotal // Include points total to write to CSV
    };

    // Writing data to CSV using Flask
    fetch('/write_to_csv', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToWrite)
    }).then(response => {
        if (response.ok) {
            // Reset counters and points after successful write
            changeSidesCount = 0;
            paintTouchesCount = 0;
            pointsTotal = 0; // Reset points total
            statsCounters = {
                '2pm': 0,
                '2pa': 0,
                '3pm': 0,
                '3pa': 0,
                'fta': 0,
                'ftm': 0,
                'offFoul': 0,
                'defFoul': 0,
                'turnover': 0,
                'offReb': 0
            };

            // Update button texts to show reset values
            document.querySelector('#change-sides').innerText = changeSidesCount; // Reset Change Sides button
            document.querySelector('#paint-touches').innerText = paintTouchesCount; // Reset Paint Touches button
            
            // Reset statistics buttons
            for (const stat in statsCounters) {
                const button = document.querySelector(`button[onclick="incrementStat('${stat}')"]`);
                button.innerText = statsCounters[stat]; // Reset statistics buttons
            }

            // Increment possession number
            possessionCount++;
            document.getElementById('possession-number').innerText = possessionCount; // Update possession number display
            document.getElementById('points-total').innerText = pointsTotal; // Update points display to 0
        } else {
            console.error('Error writing to CSV');
        }
    }).catch(error => {
        console.error('Error:', error);
    });
}

// Function to handle the Finish Game button click
function finishGame() {
    const activePlayersDiv = document.getElementById("active-players");
    const activePlayers = [...activePlayersDiv.getElementsByClassName("player-tile")].map(tile => tile.innerText);
    
    // Gather data to write to CSV
    const opponent = localStorage.getItem('opponent');
    const date = localStorage.getItem('date');
    const location = localStorage.getItem('location');
    
    const dataToWrite = {
        opponent: opponent,
        date: date,
        location: location,
        possessionNumber: possessionCount,
        changeSidesCount: changeSidesCount,
        paintTouchesCount: paintTouchesCount,
        stats: { ...statsCounters },
        activePlayers: activePlayers,
        pointsTotal: pointsTotal, // Include points total to write to CSV
        final: true, // Indicate this is the final game data
    };

    // Writing final data to CSV using Flask
    fetch('/write_to_csv', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToWrite)
    }).then(response => {
        if (response.ok) {
            // Reset all counters and points
            changeSidesCount = 0;
            paintTouchesCount = 0;
            pointsTotal = 0; // Reset points total
            statsCounters = {
                '2pm': 0,
                '2pa': 0,
                '3pm': 0,
                '3pa': 0,
                'fta': 0,
                'ftm': 0,
                'offFoul': 0,
                'defFoul': 0,
                'turnover': 0,
                'turnover': 0,
                'offReb': 0
            };

            // Update button texts to show reset values
            document.querySelector('#change-sides').innerText = changeSidesCount; // Reset Change Sides button
            document.querySelector('#paint-touches').innerText = paintTouchesCount; // Reset Paint Touches button
            
            // Reset statistics buttons
            for (const stat in statsCounters) {
                const button = document.querySelector(`button[onclick="incrementStat('${stat}')"]`);
                button.innerText = statsCounters[stat]; // Reset statistics buttons
            }

            // Redirect to home page
            window.location.href = '/'; // Redirect to the homepage after finishing the game
        } else {
            console.error('Error writing final game data to CSV');
        }      
    document.addEventListener('keydown', function(event) {
        console.log('Key pressed:', event.key); // Debugging log
        switch (event.key) {
            case '1':
                alert('Free Throw Made triggered'); // Test function
                // incrementStat('ftm'); // Uncomment when confirmed working
                break;
            case 'Enter':
                alert('Next Possession triggered'); // Test function
                // nextPossession(); // Uncomment when confirmed working
                break;
            // Add other cases as needed
            default:
                break;
        }
    });
        


    }).catch(error => {
        console.error('Error:', error);
    });
}

//Logic for using keys to increment stats
document.addEventListener('keydown', function(event) {
    if (event.code === 'Enter') { // Check if the Enter key is pressed
        nextPossession(); // Call the function to go to the next possession
    }else if (event.code ==='KeyS'){
        incrementChangeSides();
    }else if (event.code ==='KeyP'){
        incrementPaintTouches();
    }else if (event.code ==='Digit1'){
        incrementStat('ftm');
    }else if (event.code ==='Digit2'){
        incrementStat('2pm');
    }else if (event.code ==='Digit3'){
        incrementStat('3pm');
    }else if (event.code ==='KeyQ'){
        incrementStat('fta');
    }else if (event.code ==='KeyW'){
        incrementStat('2pa');
    }else if (event.code ==='KeyE'){
        incrementStat('3pa');
    }else if (event.code ==='KeyO'){
        incrementStat('offFoul');
    }else if (event.code ==='KeyD'){
        incrementStat('defFoul');
    }else if (event.code ==='KeyT'){
        incrementStat('turnover');
    }else if (event.code ==='KeyR'){
        incrementStat('offReb');
    }
});


