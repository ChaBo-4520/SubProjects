"use strict";
var id_count = 1;
// 이벤트 추가
function Add_EventListeners() {
  input_text.addEventListener("keyup", enterkey);
  input_text.addEventListener("keyup", onFocus);
  const clear_complete = document.querySelector(".clear-completed");
  clear_complete.addEventListener("click", clearComplete);
  filters.addEventListener("click", selectOption);
  const toggle_complete = document.querySelector("#toggle-all");
  toggle_complete.addEventListener("click", toggleComplete);
}

// About Input
// =============================================
// complete가 하나라도 있으면 전부 completed표시 해제
// 아니면 전부 completed표시
function toggleComplete() {
  const items = document.querySelectorAll(".items input");
  for (let a = items.length - 1; a >= 0; a--) {
    if (completeCount == 0) items[a].checked = true;
    else items[a].checked = false;
  }
  countItems();
}
// text input이 포커스 됐을 때,
function onFocus() {
  if (input_text.value != "") {
    document.getElementById("clear-text").style.display = "block";
    const deleteBtn = document.querySelector("#clear-text");
    deleteBtn.addEventListener("click", deleteTextInput);
    return true;
  } else {
    document.getElementById("clear-text").style.display = "none";
    return false;
  }
}

// text input에서 enter를 눌렀을 때
function enterkey(event) {
  if (input_text.value == "") return;
  if (event.key == "Enter") {
    Add_item(input_text.value);
    deleteTextInput();
  }
}
// clear-text버튼을 눌렀을 때
function deleteTextInput() {
  input_text.value = "";
}
// todo-list에 아이템을 추가하는 함수
function Add_item(text) {
  // list에 추가할 li 생성 과정
  var temp = document.createElement("li");
  temp.setAttribute("class", "item");
  temp.setAttribute("id", `itemWrapper${id_count}`);
  temp.innerHTML = `
  <input type="checkbox" id="item${id_count}" />
  <label for="item${id_count}" class="toggle"></label>
  <span>${text}</span>
  <button class="delete"><i class="fas fa-times"></i></button>
  `;
  list.appendChild(temp);

  // li를 이용해 7번째 child인 버튼에 이벤트 추가
  document
    .querySelector(`#itemWrapper${id_count}`)
    .childNodes[7].addEventListener("click", DeleteItem);
  document
    .querySelector(`#itemWrapper${id_count} > #item${id_count}`)
    .addEventListener("click", clickCheckBox);
  id_count++;
}

// 체크박스를 클릭했을 때,
function clickCheckBox(event) {
  // 수정!!!! style을 바꾸는 기능 추가
  if (event.target.checked) {
  } else {
  }
  countItems();
}

// About List
// =============================================
// 목록에서 item을 지우는 함수
function DeleteItem(event) {
  list.removeChild(event.target.parentNode.parentNode);
}

// 리스트에 보여질 item을 결정하는 함수
function displayItems(option) {
  // 필터적용
  const checkbox = document.querySelectorAll(".items > .item > input");
  const li = document.querySelectorAll(".items > .item");
  let option_state;
  switch (option) {
    case "all":
      option_state = 0;
      break;
    case "active":
      option_state = 1;
      break;
    case "completed":
      option_state = 2;
      break;
  }

  for (let i = 0; i < checkbox.length; i++) {
    if (option_state == 0) {
      // All
      li[i].style.display = "flex";
    } else if (option_state == 1) {
      // Active
      if (!checkbox[i].checked) {
        li[i].style.display = "flex";
      } else li[i].style.display = "none";
    } else {
      if (checkbox[i].checked) {
        li[i].style.display = "flex";
      } else li[i].style.display = "none";
    }
  }
}
// About Footer
// =============================================

// 클리어된 todo를 지우는 함수
function clearComplete() {
  if (confirm("완료된 항목을 지우시겠습니까?")) {
    const items = document.querySelectorAll(".items input");
    for (let a = items.length - 1; a >= 0; a--) {
      if (items[a].checked == true) {
        list.removeChild(items[a].parentNode);
      }
    }
  }
}

// 옵션 선택시 하나의 옵션만 선택되도록 함
function selectOption(event) {
  const key = event.target.dataset.key;
  const option = event.target.dataset.value;
  if (key == null || option == null) return;
  // 수정!!!!!!! 추후에 querySelectorAll로 고칠것
  // 선택된 옵션외에는 selected-option 클래스 제거
  for (let i = 0; i < filters.childNodes.length; i++) {
    const child = filters.childNodes[i];
    if (child.dataset == null) continue;
    if (child.dataset.value == option) child.classList.add("selected-option");
    else child.classList.remove("selected-option");
  }

  displayItems(option);
}

// complete를 제외한 task카운팅
function countItems() {
  activeCount = 0;
  completeCount = 0;
  const checkbox = document.querySelectorAll(".items > .item > input");
  for (let i = 0; i < checkbox.length; i++) {
    if (checkbox[i].checked) completeCount++;
    else activeCount++;
  }
  const todoCount = document.querySelector(".todo-count");
  todoCount.removeChild(document.querySelector(".counting"));
  const temp = document.createElement("strong");
  temp.setAttribute("class", "counting");
  temp.innerHTML = `${activeCount}`;
  todoCount.prepend(temp);
}
// About Define
// =============================================
const input_text = document.querySelector(".new-todo");
const list = document.querySelector(".items");
const filters = document.querySelector(".filters");
Add_EventListeners();

// list 변화 감지
// 감지대상
const target = document.querySelector(".items");
let activeCount;
let completeCount;
// 감지시 동작
const observer = new MutationObserver((mutations) => {
  countItems();
});
// observer 옵션
const option = {
  childList: true,
};
// observer동작시작
observer.observe(target, option);
