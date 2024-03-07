document.addEventListener('DOMContentLoaded', function () {
    const muscleGroupInput = document.getElementById('muscleGroupInput');
    const muscleGroupText = document.getElementById('muscleGroupText');
    const form = document.getElementById('workoutForm');

    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent the form from submitting to the server

        // Display the input value
        muscleGroupText.textContent = muscleGroupInput.value;

        // Clear the input field after displaying the text
        muscleGroupInput.value = '';

        // Additional form submission logic here (e.g., AJAX request to the server)
    });

    // You might still want to keep the real-time update as the user types
    muscleGroupInput.addEventListener('input', function() {
        muscleGroupText.textContent = this.value;
    });
});



// Placeholder function for adding new exercise inputs dynamically
function addExerciseInput() {
    const form = document.getElementById('workoutForm');
    const exerciseInputGroup = document.createElement('div');
    exerciseInputGroup.innerHTML = `
        <div class="input-group exercise">
            <label>Exercise Name:</label>
            <input type="text" name="exerciseName">
            <label>Sets:</label>
            <input type="number" name="sets" min="1">
            <label>Reps:</label>
            <input type="number" name="reps" min="1">
            <label>Weight:</label>
            <input type="number" name="weight">
        </div>
    `;
    form.insertBefore(exerciseInputGroup, form.lastElementChild); // Insert before the submit button
}

// Implementing collectExercisesData to collect data from all exercise inputs
function collectExercisesData() {
    const exerciseInputs = document.querySelectorAll('.exercise');
    const exercises = Array.from(exerciseInputs).map(exerciseInput => {
        return {
            name: exerciseInput.querySelector('[name="exerciseName"]').value,
            sets: exerciseInput.querySelector('[name="sets"]').value,
            reps: exerciseInput.querySelector('[name="reps"]').value,
            weight: exerciseInput.querySelector('[name="weight"]').value,
        };
    });
    return exercises;
}


async function submitWorkout(workoutData) {
    try {
        const response = await fetch('/workout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(workoutData),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const responseData = await response.json();
        showConfirmationPopup(responseData); // Implement this function based on your preferences
    } catch (error) {
        console.error('Error:', error);
    }
}

let exerciseLog = []; // Assuming you want to keep track of exercises before submitting

// Directly add event listener for the 'Add Exercise' button
document.getElementById('addExerciseBtn').addEventListener('click', addExerciseInput);

// Add event listener for form submission
const form = document.getElementById('workoutForm');
form.addEventListener('submit', function (e) {
    e.preventDefault();
    const muscleGroup = document.getElementById('muscleGroupInput').value;
    submitWorkout({ muscleGroup, exercises: exerciseLog });
});

function addExerciseInput() {
    const exercisesContainer = document.getElementById('exercisesContainer');
    const exerciseDiv = document.createElement('div');
    exerciseDiv.className = 'exercise';
    exerciseDiv.innerHTML = `
        <label>Exercise Name:</label>
        <input type="text" class="exerciseName">
        <label>Number of Sets:</label>
        <input type="number" class="numSets" min="1" placeholder="Enter number of sets">
        <button type="button" class="addSetsBtn">Add Sets</button>
        <div class="setsContainer"></div>
    `;
    exercisesContainer.appendChild(exerciseDiv);

    exerciseDiv.querySelector('.addSetsBtn').addEventListener('click', function() {
        generateSetInputs(exerciseDiv);
    });
}

function generateSetInputs(exerciseDiv) {
    const numSets = parseInt(exerciseDiv.querySelector('.numSets').value, 10);
    const setsContainer = exerciseDiv.querySelector('.setsContainer');
    setsContainer.innerHTML = ''; // Clear existing inputs if any

    for (let i = 1; i <= numSets; i++) {
        const setDiv = document.createElement('div');
        setDiv.className = 'set';
        setDiv.innerHTML = `
            <label>Set ${i} Weight:</label>
            <input type="number" class="setWeight" placeholder="Weight">
            <label>Set ${i} Reps:</label>
            <input type="number" class="setReps" placeholder="Reps">
            <label>Notes:</label>
            <input type="text" class="setNotes" placeholder="Notes">
        `;
        setsContainer.appendChild(setDiv);
    }
}


function collectExercisesData() {
    const exercises = [];
    document.querySelectorAll('.exercise').forEach(exerciseDiv => {
        const name = exerciseDiv.querySelector('.exerciseName').value;
        const sets = [];
        exerciseDiv.querySelectorAll('.set').forEach(setDiv => {
            sets.push({
                weight: setDiv.querySelector('.setWeight').value,
                reps: setDiv.querySelector('.setReps').value,
                notes: setDiv.querySelector('.setNotes').value, // Collecting notes
            });
        });
        exercises.push({ name, sets });
    });
    return exercises;
}

async function submitWorkout(workoutData) {
    workoutData.exercises = collectExercisesData(); // Update the workout data with collected exercises
    // Rest of the submitWorkout function...
}
function showConfirmationPopup(message) {
    const popup = document.getElementById('confirmationPopup');
    const messageElement = document.getElementById('popupMessage');
    const closeButton = document.getElementById('closePopup');

    messageElement.textContent = message;
    popup.style.display = 'flex';

    closeButton.addEventListener('click', function() {
        popup.style.display = 'none';
    });
}
