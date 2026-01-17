class GymApp {
    constructor() {
        this.state = {
            currentView: 'categories',
            selectedCategory: null,
            selectedExercise: null,
            streak: 0,
            logs: [],
            customExercises: {}
        };

        // DOM Elements
        this.mainContent = document.getElementById('main-content');
        this.navButtons = document.querySelectorAll('.nav-btn');
        this.streakDisplay = document.getElementById('streak-count');

        // Data (Hardcoded for now)
        this.bodyParts = [
            { id: 'chest', name: 'Chest', icon: 'fa-child-reaching', color: 'from-blue-500 to-cyan-500' },
            { id: 'back', name: 'Back', icon: 'fa-child', color: 'from-emerald-500 to-green-500' },
            { id: 'legs', name: 'Legs', icon: 'fa-person-running', color: 'from-orange-500 to-red-500' },
            { id: 'arms', name: 'Arms', icon: 'fa-hand-fist', color: 'from-purple-500 to-pink-500' },
            { id: 'shoulders', name: 'Shoulders', icon: 'fa-user', color: 'from-yellow-500 to-amber-500' }
        ];

        this.exercises = {
            chest: ['Bench Press', 'Incline Dumbbell Press', 'Push-ups', 'Cable Flys'],
            back: ['Pull-ups', 'Lat Pulldowns', 'Bent Over Rows', 'Deadlift'],
            legs: ['Squats', 'Leg Press', 'Lunges', 'Calf Raises'],
            arms: ['Bicep Curls', 'Tricep Dips', 'Hammer Curls', 'Skullcrushers'],
            shoulders: ['Overhead Press', 'Lateral Raises', 'Front Raises', 'Face Pulls']
        };

        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.render();
    }

    loadData() {
        const savedData = localStorage.getItem('gymPulseData');
        if (savedData) {
            const parsed = JSON.parse(savedData);
            this.state.streak = parsed.streak || 0;
            this.state.logs = parsed.logs || [];
            this.state.customExercises = parsed.customExercises || {};
            this.updateStreakDisplay();
        }
    }

    saveData() {
        localStorage.setItem('gymPulseData', JSON.stringify({
            streak: this.state.streak,
            logs: this.state.logs,
            customExercises: this.state.customExercises
        }));
    }

    updateStreakDisplay() {
        this.streakDisplay.textContent = this.state.streak;
    }

    setupEventListeners() {
        // Navigation
        this.navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = btn.dataset.view;
                this.switchView(view);

                // Update active state
                this.navButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    switchView(viewName) {
        this.state.currentView = viewName;
        this.render();
    }

    render() {
        this.mainContent.innerHTML = '';

        switch (this.state.currentView) {
            case 'categories':
                this.renderCategories();
                break;
            case 'exercises':
                this.renderExercises();
                break;
            case 'log':
                this.renderLogScreen();
                break;
            case 'history':
                this.renderHistory();
                break;
            case 'profile':
                this.renderProfile();
                break;
            default:
                this.renderCategories();
        }
    }

    renderCategories() {
        const grid = document.createElement('div');
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = '1fr 1fr';
        grid.style.gap = '1rem';

        this.bodyParts.forEach(part => {
            const card = document.createElement('div');
            card.className = 'card category-card';
            // Mock gradient usage in style attribute for now, typically handled via classes
            card.innerHTML = `
                <div style="font-size: 2rem; margin-bottom: 0.5rem; color: var(--primary);">
                    <i class="fa-solid ${part.icon}"></i>
                </div>
                <h3>${part.name}</h3>
            `;
            card.style.cursor = 'pointer';
            card.style.display = 'flex';
            card.style.flexDirection = 'column';
            card.style.alignItems = 'center';
            card.style.textAlign = 'center';

            card.addEventListener('click', () => {
                this.state.selectedCategory = part.id;
                this.state.currentView = 'exercises';
                this.render();
            });

            grid.appendChild(card);
        });

        this.mainContent.appendChild(grid);
    }

    // Placeholder render methods
    renderExercises() {
        const container = document.createElement('div');

        // Back button
        const backBtn = document.createElement('button');
        backBtn.innerHTML = '<i class="fa-solid fa-arrow-left"></i> Back to Categories';
        backBtn.className = 'btn-text';
        backBtn.style.color = 'var(--text-muted)';
        backBtn.style.background = 'none';
        backBtn.style.border = 'none';
        backBtn.style.fontSize = '1rem';
        backBtn.style.marginBottom = '1rem';
        backBtn.style.cursor = 'pointer';
        backBtn.onclick = () => {
            this.state.currentView = 'categories';
            this.render();
        };

        const title = document.createElement('h2');
        title.textContent = this.bodyParts.find(p => p.id === this.state.selectedCategory)?.name || 'Exercises';
        title.style.marginBottom = '1rem';

        container.appendChild(backBtn);
        container.appendChild(title);

        const basicList = this.exercises[this.state.selectedCategory] || [];
        const customList = this.state.customExercises[this.state.selectedCategory] || []; // Load custom
        const fullList = [...basicList, ...customList];

        // Add Exercise Button
        const addBtn = document.createElement('button');
        addBtn.className = 'btn-secondary';
        addBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add New Exercise';
        addBtn.style.cssText = `
            background: rgba(139, 92, 246, 0.1); 
            color: var(--primary); 
            border: 1px solid var(--primary); 
            padding: 0.8rem; 
            width: 100%; 
            border-radius: var(--radius);
            margin-bottom: 1rem;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s;
        `;
        addBtn.onmouseover = () => addBtn.style.background = 'rgba(139, 92, 246, 0.2)';
        addBtn.onmouseout = () => addBtn.style.background = 'rgba(139, 92, 246, 0.1)';
        addBtn.onclick = () => this.addCustomExercise();
        container.appendChild(addBtn);

        fullList.forEach(ex => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <h3>${ex}</h3>
                    <i class="fa-solid fa-chevron-right" style="color:var(--text-muted)"></i>
                </div>
            `;
            card.style.cursor = 'pointer';
            card.onclick = () => {
                this.state.selectedExercise = ex;
                this.state.currentView = 'log';
                this.render();
            };
            container.appendChild(card);
        });

        this.mainContent.appendChild(container);
    }

    addCustomExercise() {
        const name = prompt("Enter the name of the new exercise:");
        if (name && name.trim() !== "") {
            const category = this.state.selectedCategory;
            if (!this.state.customExercises[category]) {
                this.state.customExercises[category] = [];
            }
            this.state.customExercises[category].push(name.trim());
            this.saveData();
            this.render(); // Refresh list to show new exercise
        }
    }

    renderLogScreen() {
        const container = document.createElement('div');
        container.className = 'log-container';

        // Back Button
        const backBtn = document.createElement('button');
        backBtn.innerHTML = '<i class="fa-solid fa-arrow-left"></i> Back to Exercises';
        backBtn.className = 'btn-text';
        backBtn.style.color = 'var(--text-muted)';
        backBtn.style.background = 'none';
        backBtn.style.border = 'none';
        backBtn.style.fontSize = '1rem';
        backBtn.style.marginBottom = '1rem';
        backBtn.style.cursor = 'pointer';
        backBtn.onclick = () => {
            this.state.currentView = 'exercises';
            this.render();
        };

        const title = document.createElement('h2');
        title.textContent = this.state.selectedExercise;
        title.style.marginBottom = '1.5rem';

        // Sets Container
        const setsWrapper = document.createElement('div');
        setsWrapper.id = 'sets-wrapper';

        // Initial Set
        this.addSetInput(setsWrapper, 1);

        // Add Set Button
        const addSetBtn = document.createElement('button');
        addSetBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Set';
        addSetBtn.className = 'btn-secondary'; // Need to define this style or use inline
        addSetBtn.style.cssText = `
            background: rgba(255,255,255,0.1); 
            color: var(--primary); 
            border: 1px dashed var(--primary); 
            padding: 0.8rem; 
            width: 100%; 
            border-radius: var(--radius);
            margin-bottom: 1.5rem;
            cursor: pointer;
        `;
        addSetBtn.onclick = () => {
            const currentSets = setsWrapper.children.length;
            this.addSetInput(setsWrapper, currentSets + 1);
        };

        // Save Button
        const saveBtn = document.createElement('button');
        saveBtn.className = 'btn-primary';
        saveBtn.innerHTML = 'Complete Workout';
        saveBtn.onclick = () => this.handleSaveWorkout();

        container.appendChild(backBtn);
        container.appendChild(title);
        container.appendChild(setsWrapper);
        container.appendChild(addSetBtn);
        container.appendChild(saveBtn);

        this.mainContent.appendChild(container);
    }

    addSetInput(wrapper, setNum) {
        const setRow = document.createElement('div');
        setRow.className = 'card';
        setRow.style.display = 'flex';
        setRow.style.gap = '1rem';
        setRow.style.alignItems = 'center';
        setRow.style.padding = '0.8rem';

        setRow.innerHTML = `
            <span style="font-weight:bold; color:var(--text-muted); width: 20px;">#${setNum}</span>
            <div style="flex:1;">
                <label style="font-size:0.8rem; color:var(--text-muted); display:block; margin-bottom:0.3rem;">Reps</label>
                <input type="number" class="rep-input" placeholder="0" min="1" max="99" style="
                    width: 100%; 
                    background: var(--bg-dark); 
                    border: 1px solid var(--glass-border); 
                    color: white; 
                    padding: 0.5rem; 
                    border-radius: 8px;
                    text-align: center;
                    font-size: 1.1rem;
                ">
            </div>
            <div style="flex:1;">
                <label style="font-size:0.8rem; color:var(--text-muted); display:block; margin-bottom:0.3rem;">Lbs</label>
                <input type="number" class="weight-input" placeholder="0" style="
                    width: 100%; 
                    background: var(--bg-dark); 
                    border: 1px solid var(--glass-border); 
                    color: white; 
                    padding: 0.5rem; 
                    border-radius: 8px;
                    text-align: center;
                    font-size: 1.1rem;
                ">
            </div>
        `;

        // Validation Listener
        const repInput = setRow.querySelector('.rep-input');
        repInput.addEventListener('input', (e) => {
            if (e.target.value.length > 2) e.target.value = e.target.value.slice(0, 2);
            if (parseInt(e.target.value) > 99) e.target.value = 99;
        });

        wrapper.appendChild(setRow);
    }

    handleSaveWorkout() {
        const setRows = document.querySelectorAll('#sets-wrapper .card');
        const workoutSets = [];
        let isValid = true;

        setRows.forEach(row => {
            const reps = row.querySelector('.rep-input').value;
            const weight = row.querySelector('.weight-input').value;

            if (!reps) isValid = false;

            workoutSets.push({
                reps: parseInt(reps),
                weight: parseInt(weight) || 0
            });
        });

        if (!isValid) {
            alert('Please enter reps for all sets.');
            return;
        }

        // Logic to update Streak
        // Use local date to ensure late night workouts count for the correct local day
        const getLocalDate = () => {
            const now = new Date();
            const offset = now.getTimezoneOffset();
            const local = new Date(now.getTime() - (offset * 60 * 1000));
            return local.toISOString().split('T')[0];
        };

        const today = getLocalDate();
        const lastLog = this.state.logs[0]?.date;

        if (lastLog !== today) {
            if (lastLog) {
                // Calculate difference in days
                const oneDay = 24 * 60 * 60 * 1000;
                const lastDate = new Date(lastLog);
                const currentDate = new Date(today);

                // Reset hours to 0 for accurate day diff
                lastDate.setHours(0, 0, 0, 0);
                currentDate.setHours(0, 0, 0, 0);

                const diffDays = Math.round(Math.abs((currentDate - lastDate) / oneDay));

                if (diffDays === 1) {
                    this.state.streak++;
                } else if (diffDays > 1) {
                    this.state.streak = 1; // Streak broken
                }
            } else {
                this.state.streak = 1; // First set ever
            }
        }

        // Save Log
        const newLog = {
            date: today,
            timestamp: new Date().toISOString(),
            exerciseId: this.state.selectedExercise,
            sets: workoutSets
        };

        this.state.logs.unshift(newLog); // Add to beginning
        this.saveData();
        this.updateStreakDisplay();

        // Show Success & Redirect
        alert('Workout Saved! Streak: ' + this.state.streak);
        this.state.currentView = 'categories';
        this.render();
    }

    renderHistory() {
        this.mainContent.innerHTML = '<h2 style="margin-bottom:1rem;">History</h2>';

        if (this.state.logs.length === 0) {
            this.mainContent.innerHTML += '<p style="color:var(--text-muted); text-align:center; margin-top:2rem;">No workouts logged yet. Go lift!</p>';
            return;
        }

        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '1rem';

        this.state.logs.forEach(log => {
            const card = document.createElement('div');
            card.className = 'card';
            card.style.padding = '1rem';

            const date = new Date(log.timestamp).toLocaleDateString(undefined, {
                weekday: 'short', month: 'short', day: 'numeric'
            });

            let setsHtml = '';
            log.sets.forEach((set, idx) => {
                setsHtml += `<span style="display:inline-block; background:rgba(255,255,255,0.05); padding:2px 6px; border-radius:4px; font-size:0.8rem; margin-right:4px; margin-bottom:4px;">${set.reps}x${set.weight}lb</span>`;
            });

            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
                    <h3 style="font-size:1.1rem; color:var(--primary);">${log.exerciseId}</h3>
                    <span style="font-size:0.8rem; color:var(--text-muted);">${date}</span>
                </div>
                <div>${setsHtml}</div>
            `;
            container.appendChild(card);
        });

        this.mainContent.appendChild(container);
    }

    renderProfile() {
        this.mainContent.innerHTML = '<h2>Profile</h2><p>User stats and settings.</p>';
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    window.app = new GymApp();
});
