
let taskList;
let btnAdd = document.getElementById("btn-add");
let inputNewTask = document.getElementById("desc-task");
let filters = document.querySelectorAll("#filters span");
let btnClearAll = document.getElementById("btn-clear-all");
let btnCancel = document.getElementById("btn-cancel")

let taskArray = [];

let filterMode = "all";

let editedId;//O sırada güncellenecek task'in id'si
let isEditMode = false;
let isEditing = false;
btnAdd.addEventListener("click", addNewTask);
btnClearAll.addEventListener("click", function () {
  taskArray = [];
  saveLocalStorage();
  displayTasks();
})

for (const span of filters) {
  span.addEventListener("click", function () {
    document.querySelector("span.active").classList.remove("active");
    span.classList.add("active");
    filterMode = span.id;
    displayTasks();
  });
}

function getTasks() {
  if (localStorage.getItem("taskList") != null) {
    taskArray = JSON.parse(localStorage.getItem("taskList"));
  }
  let taskListContainer = document.getElementById("task-list-container");
  let div = `
            <div class="card mt-3">
                <ul id="task-list" class="list-group">

                    
                
                </ul>
            </div>
        `;
  taskListContainer.insertAdjacentHTML("beforeend", div);


}

function displayTasks() {

  if (taskArray.length >= 1) {
    taskList = document.getElementById("task-list");
    // taskList.innerHTML = "";
    for (const task of taskArray) {
      let isCompleted = task.status == "completed" ? true : false;
      if (filterMode == task.status || filterMode == "all") {
        let li = `
            <li class="list-group-item task d-flex justify-content-between align-items-center ${isCompleted ? 'bg-warning' : ''}">
                <div class="form-check">
                    <input onclick="updateStatus(this)" class="form-check-input" type="checkbox" id="${task.id}" ${isCompleted ? "checked" : ""}>
                    <label class="form-check-label ${isCompleted ? 'completed' : ''}" for="${task.id}">${task.description} ${task.id}</label>
                </div>
                <div class="dropdown">
                    <button class="btn btn-secondary dropdown-toggle" type="button"
                        data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fa-solid fa-ellipsis"></i>
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#" onclick="removeTask(${task.id})">Sil</a></li>
                        <li><a class="dropdown-item" href="#" onclick="editTask(${task.id},'${task.description}')">Düzenle</a></li>
                    </ul>
                </div>
            </li>
        `;
        taskList.insertAdjacentHTML("beforeend", li)
      }
    }
  } else {
    let alert = `
            <div id="alert-message" class="alert alert-warning mt-2">
                 Herhangi bir görev kaydı bulunamamıştır.
            </div>
        `;
    let taskListContainer = document.getElementById("task-list-container");
    taskListContainer.insertAdjacentHTML("beforeend", alert);
    taskList = document.getElementById("task-list");
    taskList ? taskList.innerHTML = "" : taskList;
  }
}

function addNewTask(e) {
  e.preventDefault();
  if (!isEditMode) {
    //Yeni kayıt
    let alertMessage = document.getElementById("alert-message");
    if (alertMessage) {
      alertMessage.remove();
    }

    if (isFull(inputNewTask.value)) {
      let newId = taskArray.length == 0 ? 1 : taskArray[taskArray.length - 1].id + 1;
      taskArray.push({ id: newId, description: inputNewTask.value, status: "pending" });
    } else {
      alert("Lütfen görev açıklamasını boş bırakmayınız!");
    }
  } else {
    //Güncelleme
    for (const task of taskArray) {
      if (task.id == editedId) {
        task.description = inputNewTask.value;
        isEditMode = false;
        editedId = null;
        btnAdd.innerText = "Ekle";
        btnAdd.classList.remove("bg-warning");
        //Diğer görevler tekrar görünür hale getirilecek
        let containerTaskList = document.getElementById("task-list").parentElement;
        containerTaskList.classList.remove("hide");
        toggleCancelBtn(false);
      }
    }
  }
  saveLocalStorage();
  displayTasks();
  inputNewTask.value = "";
  inputNewTask.focus();

}

function editTask(id, description) {
  editedId = id;
  isEditMode = true;
  inputNewTask.value = description;
  inputNewTask.focus();
  btnAdd.innerText = "Güncelle";
  btnAdd.classList.add("bg-warning");
  isEditing = true;
  toggleCancelBtn(true);//vazgeç butonunu göster 
  //Buraya görevleri gizleyecek bir kod yazacağız.
  let containerTaskList = document.getElementById("task-list").parentElement;
  containerTaskList.classList.add("hide");
}
function saveLocalStorage() {
  // JSON: JavaScript Object Notation
  localStorage.setItem("taskList", JSON.stringify(taskArray));
}
function removeTask(id) {
  let deletedIndex;
  for (let i = 0; i < taskArray.length; i++) {
    if (taskArray[i].id == id) {
      deletedIndex = i;
    }
  }
  let answer = confirm("\"" + taskArray[deletedIndex].description + "\"" + " görevini silmek istediğinizden emin misiniz?")
  if (answer) {
    taskArray.splice(deletedIndex, 1);
    saveLocalStorage();
    displayTasks();
  }
}

function isFull(value) {
  if (value.trim() == "") {
    return false;
  }
  return true;
}



//VAZGEÇ BUTONU 
function toggleCancelBtn(show) {
  const btnCancel = document.getElementById("btn-cancel");
  if (show) {
    btnCancel.style.display = "inline-block";
  } else {
    btnCancel.style.display = "none";
  }
}
//VAZGEÇ butonuna tıklandğında düzenleme işlemi iptal edilecek
btnCancel.addEventListener("click", function () {
  isEditMode = false;
  editedId = null;
  btnAdd.innerText = "Ekle";
  btnAdd.classList.remove("bg-warning");
  isEditing = false; // Düzenleme işlemi iptal edildi
  toggleCancelBtn(false); // Vazgeç butonunu gizle
  //Diğer görevler tekrar görünür hale getirilecek
  let containerTaskList = document.getElementById("task-list").parentElement;
  containerTaskList.classList.remove("hide");
});


function updateStatus(element) {
  // console.log(element.getAttribute("id"));
  // console.log(element.id);
  let updatedIndex;
  for (let i = 0; i < taskArray.length; i++) {
    if (taskArray[i].id == element.getAttribute("id")) {
      updatedIndex = i;
    }
  }

  if (element.checked) {
    element.nextElementSibling.classList.add("completed");
    element.parentElement.parentElement.classList.add("bg-warning");
    taskArray[updatedIndex].status = "completed";
  } else {
    element.nextElementSibling.classList.remove("completed");
    element.parentElement.parentElement.classList.remove("bg-warning");
    taskArray[updatedIndex].status = "pending";
  }
  if (filterMode != "all") {
    element.parentElement.parentElement.remove();
  }
  saveLocalStorage();
}

getTasks();
displayTasks();