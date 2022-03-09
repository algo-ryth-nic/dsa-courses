let sessionData = getSessionData();
console.log(sessionData);
const container = document.querySelector(".container");

window.addEventListener("beforeunload", () => {
  window.localStorage.setItem("progress", JSON.stringify(sessionData));
});

const insertData = async () => {
  const data = await fetch("./data.json")
    .then((r) => r.json())
    .then((data) => data)
    .catch((err) => console.log(err));

  const sections = Object.keys(data);

  sections.forEach((s) => {
    const div = document.createElement("div");
    div.classList.add("section-container");
    div.id = s;
    const h3 = document.createElement("h3");
    h3.innerHTML = s;
    container.appendChild(document.createElement("hr"));
    container.appendChild(h3);
    container.appendChild(div);
    getData(data[s], s);
  });

  if (sessionData) {
    console.log("restoring");
    restoreSession();
  }

  updateProgess();
};

const getData = (list, name) => {
  list.forEach((ob) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.style.width = "18rem";
    div.innerHTML = `<div class="card-body">
          <h5 class="card-title"><a href=${ob["link"]} >${ob["question"]}</a></h5>
          <p class="card-text">${ob["question"]}</p>
          <div class="card-button">
            <button type="button" class="status-btn btn-success" id="completed"><i class="material-icons">task_alt</i></button>
            <button type="button" class="status-btn btn-danger"><i class="material-icons">do_disturb</i></button>
          </div>
        </div>`;
    document.getElementById(name).appendChild(div);
  });
};
insertData();

document.querySelector(".container").addEventListener("click", (e) => {
  if (e.target.nodeName == "BUTTON") {
    const key = e.target.closest(".card-body").firstElementChild.textContent;
    const status = e.target.closest(".card");
    if (e.target.id == "completed") {
      toggle(status, [0, 255, 0], 0.15, { [key]: true });
    } else {
      toggle(status, [255, 0, 0], 0.15, { [key]: false });
    }
  }
  updateProgess();
});

function toggle(element, colors, alpha, obj) {
  const rgba_col = `rgb(${colors[0]}, ${colors[1]}, ${colors[2]})`;
  const key = Object.keys(obj).pop();
  if (element.style.borderColor === rgba_col) {
    element.style.borderColor = "rgba(0,0,0,.125)";
    element.style.backgroundColor = "";
    delete sessionData[key];
  } else {
    element.style.borderColor = rgba_col;
    element.style.backgroundColor = `rgba(${colors[0]}, ${colors[1]}, ${colors[2]}, ${alpha})`;
    sessionData[key] = obj[key];
  }
}

function getSessionData() {
  if (window.localStorage.length !== 0) {
    console.log("found");
    return JSON.parse(window.localStorage.getItem("progress"));
  }
  return new Object();
}

function restoreSession() {
  if (sessionData !== null) {
    const sections = Object.keys(sessionData);
    sections.forEach((s) => {
      const card = Array.from(document.querySelectorAll(".card-title")).find((title) => title.textContent === s);
      if (sessionData[s] === true) {
        toggle(card.closest(".card"), [0, 255, 0], 0.15, { [s]: true });
      } else if (sessionData[s] === false) {
        toggle(card.closest(".card"), [255, 0, 0], 0.15, { [s]: false });
      }
    });
  }
}

function updateProgess() {
  const progress = Object.keys(sessionData).length;
  const progressBar = document.querySelector("#progress");
  // progressBar.style.width = `${progress}%`;
  progressBar.innerHTML = `${progress}/450`;
}
