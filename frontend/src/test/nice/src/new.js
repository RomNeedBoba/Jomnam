// class
let classesUnique = [];

function openAddModalUnique() {
  document.getElementById("addModalUnique").style.display = "flex";
}

function openModifyModalUnique() {
  const modifyList = document.getElementById("modifyClassListUnique");
  modifyList.innerHTML = "";

  if (classesUnique.length === 0) {
    alert("No classes available to modify.");
    return;
  }

  classesUnique.forEach((classItem, index) => {
    const div = document.createElement("div");
    div.className = "modify-row-unique";
    div.innerHTML = `
      <input type="text" class="modify-input-unique" value="${classItem.name}" oninput="updateClassNameUnique(${index}, this.value)">
      <button class="modern-delete-unique" onclick="deleteClassUnique(${index})">Delete</button>
    `;
    modifyList.appendChild(div);
  });

  document.getElementById("modifyModalUnique").style.display = "flex";
}

function closeModalUnique(modalId) {
  document.getElementById(modalId).style.display = "none";
}

function addClassUnique() {
  const input = document.getElementById("newClassInputUnique");
  const className = input.value.trim();
  if (!className) return;

  classesUnique.push({ name: className, count: 0 });

  updateClassListUnique();
  input.value = "";
  closeModalUnique("addModalUnique");
}

function updateClassNameUnique(index, newName) {
  classesUnique[index].name = newName;
}

function deleteClassUnique(index) {
  classesUnique.splice(index, 1);
  updateClassListUnique();
  closeModalUnique("modifyModalUnique"); // Close modal after deletion
}

function saveChangesUnique() {
  updateClassListUnique();
  closeModalUnique("modifyModalUnique");
}

function updateClassListUnique() {
  const classList = document.getElementById("classListUnique");
  classList.innerHTML = "";

  classesUnique.forEach((classItem) => {
    const classElement = document.createElement("div");
    classElement.className = "class-item-unique";
    classElement.innerHTML = `
      <span class="class-name-unique">${classItem.name}</span>
      <span class="class-details-unique">${classItem.count || 0}</span>
    `;
    classList.appendChild(classElement);
  });
}


const images = document.querySelectorAll('.toolbar img');

images.forEach(image => {
    image.setAttribute('draggable', 'false');
    image.addEventListener('dragstart', (e) => {
        e.preventDefault(); // Prevent default drag behavior
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.icon-buttonnn');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
});


// change name
document.addEventListener("DOMContentLoaded", function () {
    const titleElement = document.getElementById("projectTitle");

    // Load saved title from local storage if it exists
    const savedTitle = localStorage.getItem("projectTitle");
    if (savedTitle) {
        titleElement.textContent = savedTitle;
    }

    // Make the title editable on click
    titleElement.addEventListener("click", function () {
        const newTitle = prompt("Enter new project title:", titleElement.textContent);
        if (newTitle !== null && newTitle.trim() !== "") {
            titleElement.textContent = newTitle;
            localStorage.setItem("projectTitle", newTitle); // Save title to local storage
        }
    });
});