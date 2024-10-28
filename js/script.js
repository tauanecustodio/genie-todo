let idCounter = 0;

const $tasksList = $('#task-list');
const $progressBar = $('.progress-bar');
const $progressBarText = $('.progress-bar__percentage');
const $modalAddTask = $('.modal-add-task');
const $formAddTask = $('.form-add-task');
const $inputNewTask = $('.task-input');
const $messageErro = $('.message-erro');
const $openModalAddTask = $('.open-modal');
const $closeModalAddTask = $('.close-modal');

let tasks = [];

// ---------------functions---------------

function displayTasks() {
    $tasksList.html('');
    tasks.forEach((el) => {
        $tasksList.append(`<li class="task-list__item" id="${el.id}">
                        <div>
                            <button title="marcar ou desmarcar tarefa" class="task-list__item-check">
                                <i class="${el.check ? 'fa-regular fa-circle-check' : 'fa-regular fa-circle'}"></i>
                            </button>
                            <p class="${el.check ? 'line-through' : ''}">${el.title}</p>
                        </div>

                        <div>
                            <button class="task-list__delete-btn" title="Excluir tarefa"><i class="fa-solid fa-minus"></i></button>
                        </div>
                    </li>`);
    });

    updateProgressBar();
    saveTasksToLocalStorage();
}

function updateProgressBar() {
    let completedTasks = tasks.filter(el => el.check).length;
    const totalTasks = tasks.length;
    const totalProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const progressValue = isNaN(totalProgress) ? 0 : Math.round(totalProgress);

    $progressBar.css('width', `${progressValue}%`);
    $progressBarText.text(`${progressValue}%`);
}

function toggleModalAddTask() {
    $modalAddTask.slideToggle();
    $messageErro.text('');
}

function toggleTaskStatus(taskId, $button) {
    const task = tasks.find(el => el.id === taskId);
    if (task) {
        task.check = !task.check;
        updateProgressBar();

        const $icon = $button.find('i');
        const $taskText = $button.next('p');

        if (task.check) {
            $icon.removeClass('fa-circle').addClass('fa-circle-check');
            $taskText.addClass('line-through');
        } else {
            $icon.removeClass('fa-circle-check').addClass('fa-circle');
            $taskText.removeClass('line-through');
        }
    }
    saveTasksToLocalStorage();
}

function deleteTask(taskId) {
    tasks = tasks.filter(el => el.id !== taskId);

    displayTasks();
}

function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('idCounter', idCounter.toString());
}

// ---------------eventos----------------

$(document).ready(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }

    const storedIdCounter = localStorage.getItem('idCounter');
    if (storedIdCounter) {
        idCounter = parseInt(storedIdCounter, 10);
    }

    displayTasks();
    updateProgressBar();
});

$openModalAddTask.on('click', toggleModalAddTask);
$closeModalAddTask.on('click', toggleModalAddTask);

$formAddTask.on('submit', (e) => {
    e.preventDefault();

    const newTaskTitle = $inputNewTask.val();
    if (!newTaskTitle) {
        $messageErro.text('Por favor, insira um título para a tarefa.');
        return;
    } else if(tasks.some(task => task.title === newTaskTitle)) {
        $messageErro.text('Essa tarefa já foi adicionada.');
        return;
    }

    idCounter++;
    localStorage.setItem('idCounter', idCounter.toString());

    tasks.push({
        id: idCounter,
        title: newTaskTitle,
        check: false
    });

    $messageErro.text('');
    $inputNewTask.val('');
    displayTasks();
    toggleModalAddTask();
});

$tasksList.on('click', (event) => {
    const $buttonCheck = $(event.target).closest('.task-list__item-check');
    const $buttonDelete = $(event.target).closest('.task-list__delete-btn');
    
    if ($buttonCheck.length) {
        const taskId = parseInt($buttonCheck.closest('.task-list__item').attr('id'));
        toggleTaskStatus(taskId, $buttonCheck);
    } else if ($buttonDelete.length) {
        const taskId = parseInt($buttonDelete.closest('.task-list__item').attr('id'));
        deleteTask(taskId);
    }
});
