let taskList = document.getElementById("task-list");
let btnAdd = document.getElementById("btn-add");
let inputNewTask = document.getElementById("desc-task"); /* input nesnesini aldım */

let editedId;//O sırada güncellenecek task'in id'si
let isEditMode = false;

/* virgülden sonra fonksiyon yazabiliriz veya  */
/* callback kullanımını araştır (addNewTask) */
btnAdd.addEventListener("click", addNewTask); /* CLİCK OLAYINI DİNLİYOR TIKLANINCA FONKSİYONU ÇALIŞTIRIYOR */

let taskArray = [
  { id: 1, description: "Netflix'i iptal et" },
  { id: 2, description: "Pilav yapmayı unutma" },
  { id: 3, description: "Su iç" },
  { id: 4, description: "Çöpelri at" },
  { id: 5, description: "Fenerin maçını izle" },
];

function displayTask() {
  taskList.innerHTML = "";
  for (const task of taskArray) {
    let li = `
        <li class="list-group-item task d-flex justify-content-between align-items-center">
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="${task.id}">
                <label class="form-check-label" for="${task.id}">${task.description} ${task.id}</label>
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
    taskList.insertAdjacentHTML("beforeend", li);
  }
}


function addNewTask(e) {
  e.preventDefault();
  if (!isEditMode) {

    //YENİ KAYIT
    if (isFull(inputNewTask.value)) {
      let newId = taskArray[taskArray.length - 1].id + 1;
      /* arraya ekliyoruz */
      taskArray.push({ id: newId, description: inputNewTask.value });
    } else {
      alert("lütfen görev açıklamasını boş bırakmayınız")
    }
  } else {
    //GÜNCELLEME
    for (const task of taskArray) {
      if (task.id == editedId) {
        task.description = inputNewTask.value;
        isEditMode = false;
        editedId = null;
        btnAdd.innerText = "Ekle";
        btnAdd.classList.remove("bg-warning")
      }
    }
  }
  displayTask();
  inputNewTask.value = ""; /* input boş olsun */
  inputNewTask.focus(); /* imleç bu kısımda olsun */

}


function isFull(value) {
  if (value.trim() == "") {
    return false;
  }
  return true;
}
/* Turnery ---> const isFull = (value) => (value.trim() === "") ? false : true;
 */

function removeTask(id) {
  /* önce gönderilen id^nin dizide yerini bulmalıyız */
  let deletedIndex;
  for (let i = 0; i < taskArray.length; i++) {
    if (taskArray[i].id == id) {
      deletedIndex = i;
    }
  }
  let answer = confirm("\"" + taskArray[deletedIndex].description + "\"" + " görevini silmek istediğinizden emin misiniz?")
  if (answer) {
    taskArray.splice(deletedIndex, 1);
    displayTask();
  }
  // console.log("silinecek görev : ", taskArray[deletedIndex]);
}
function editTask(id, description) {
  editedId=id;
  isEditMode=true;
  inputNewTask.value=description;
  inputNewTask.focus();
  btnAdd.innerText="Güncelle"
  btnAdd.classList.add("bg-warning")
}
displayTasks();