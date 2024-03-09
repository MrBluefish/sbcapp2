document.addEventListener('DOMContentLoaded', function () {
    const muscleGroupInput = document.getElementById('muscleGroupInput');
    const muscleGroupText = document.getElementById('muscleGroupText');
    const form = document.getElementById('workoutForm');

    // Add one exercise input group when the DOM content is loaded
    addExerciseInput();

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        submitWorkout();
    });

    muscleGroupInput.addEventListener('input', function () {
        muscleGroupText.textContent = this.value;
    });

    document.getElementById('addExerciseBtn').addEventListener('click', addExerciseInput);
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

    // When 'Add Sets' is clicked, it will generate the inputs for sets
    exerciseDiv.querySelector('.addSetsBtn').addEventListener('click', function () {
        generateSetInputs(exerciseDiv);
    });
}

function generateSetInputs(exerciseDiv) {
    const numSets = parseInt(exerciseDiv.querySelector('.numSets').value, 10);
    const setsContainer = exerciseDiv.querySelector('.setsContainer');
    setsContainer.innerHTML = '';

    for (let i = 1; i <= numSets; i++) {
        const setDiv = document.createElement('div');
        setDiv.className = 'set';
        setDiv.innerHTML = `
            <label>Set ${i} Weight:</label>
            <input type="number" class="setWeight" placeholder="Weight in lbs">
            <label>Set ${i} Reps:</label>
            <input type="number" class="setReps" placeholder="Reps">
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
                reps: setDiv.querySelector('.setReps').value
            });
        });
        exercises.push({ name, sets });
    });
    return exercises;
}

async function submitWorkout() {
    const muscleGroup = document.getElementById('muscleGroupInput').value;
    const exercises = collectExercisesData();

    try {
        const response = await fetch('/workout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ muscleGroup, exercises }),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const responseData = await response.json();
        showConfirmationPopup('Workout Submitted Successfully!');
    } catch (error) {
        console.error('Error:', error);
        showConfirmationPopup('Failed to submit workout.');
    }
}

function showConfirmationPopup(message) {
    const popup = document.getElementById('confirmationPopup');
    const messageElement = document.getElementById('popupMessage');
    const closeButton = document.getElementById('closePopup');

    messageElement.textContent = message;
    popup.style.display = 'flex';

    closeButton.addEventListener('click', function () {
        popup.style.display = 'none';
    });
}
