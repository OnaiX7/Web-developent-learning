const addBtn = document.querySelector("#addBtn");
addBtn.addEventListener("click", async(e) => {
    e.preventDefault();
    const data = {
        title: document.getElementById('title').value,
        priority: document.getElementById('priority').value,
        description: document.getElementById('description').value
    };
    console.log(data);
    const success = await addData(data);
    console.log(success);
    if (success.status === 'success') {
        document.querySelector("#addForm").reset();
        displayData();
    }

})

const form = document.querySelector("#addForm");
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
        title: document.getElementById('title').value,
        priority: document.getElementById('priority').value,
        description: document.getElementById('description').value
    };
    const success = await addData(data);
    console.log(success);
    if (success.status === 'success') {
        form.reset();
        displayData();
    }
});

async function addData(task) {
    const response = await fetch("api/add.php",
        {method: "POST",
            body: JSON.stringify(task),
            headers: {"Content-Type": "application/json"}
        });
    return await response.json();
}
async function getData() {
    const response = await fetch("api/read.php");
    return await response.json();
}

async function displayData() {
    const tasks = await getData();
    console.log(tasks);
    const tbody = document.querySelector("#taskTable tbody");
    tbody.innerHTML = "";
    if(!Array.isArray(tasks)) return;

    tasks.forEach(task => {
        let row = document.createElement("tr");
        row.innerHTML = `<td>${task.id}</td>
                        <td class="${task.status === 'completed' ? 'status-completed' : ''}"
                        >${task.title}</td>
                        <td class="priority-${task.priority}"
                        >${task.priority}</td>
                        <td>${task.status}</td>  
                        <td><button class="edit-btn">Bearbeiten</button>
                            <button class="delete-btn">Löschen</button></td>`;
        tbody.appendChild(row);
    });

    document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", () => openEditModal(btn.dataset.id));
    });
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", () => deleteTask(btn.dataset.id));
    });
}
async function deleteTask(id) {
    if (!confirm("Aufgabe wirklich löschen?")) return;

    const response = await fetch("api/delete.php", {
        method: "POST",
        body: JSON.stringify({ id: id }),
        headers: { "Content-Type": "application/json" }
    });
    const result = await response.json();
    if (result.status === 'success') {
        displayData();
    }
}

const modal = document.getElementById("editModal");
const closeBtn = document.querySelector(".close");

async function openEditModal(id) {
    const response = await fetch("api/edit.php?id=" + id);
    const task = await response.json();

    document.getElementById("editId").value = task.id;
    document.getElementById("editTitle").value = task.title;
    document.getElementById("editPriority").value = task.priority;
    document.getElementById("editDescription").value = task.description || "";
    document.getElementById("editStatus").value = task.status;

    modal.style.display = "block";
}

closeBtn.addEventListener("click", () => modal.style.display = "none");
window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
});

document.getElementById("editForm").addEventListener("submit",
    async (e) => {
    e.preventDefault();
    const data = {
        id: document.getElementById("editId").value,
        title: document.getElementById("editTitle").value,
        priority: document.getElementById("editPriority").value,
        description: document.getElementById("editDescription").value,
        status: document.getElementById("editStatus").value
    };

    const response = await fetch("api/update.php", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
    });
    const result = await response.json();
    if (result.status === 'success') {
        modal.style.display = "none";
        displayData();
    }
});

displayData();