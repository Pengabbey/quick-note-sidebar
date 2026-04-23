console.log("content.js 已注入");
let sidebar = null;

// 接收消息
chrome.runtime.onMessage.addListener((msg) => {
  console.log("收到消息", msg);
  if (msg.action === "toggle") {
    toggleSidebar();
  }
});

// 核心逻辑
function toggleSidebar() {
   console.log("toggle 被调用");

  let sidebar = document.getElementById("note-sidebar");

  if (!sidebar) {
    console.log("创建 sidebar");
    createSidebar();
  } else {
    console.log("切换 sidebar");
  }

  if (sidebar.style.right === "0px") {
    sidebar.style.right = "-320px";
  } else {
    sidebar.style.right = "0px";
    document.getElementById("note-input").focus();
  }
}

// 创建UI
function createSidebar() {
  sidebar = document.createElement("div");
  sidebar.id = "note-sidebar";

  sidebar.style.position = "fixed";
  sidebar.style.top = "0";
  sidebar.style.right = "-320px";
  sidebar.style.width = "320px";
  sidebar.style.height = "100%";
  sidebar.style.background = "#fff";
  sidebar.style.borderLeft = "1px solid #ddd";
  sidebar.style.zIndex = "999999";
  sidebar.style.padding = "12px";
  sidebar.style.transition = "right 0.25s ease";

  sidebar.innerHTML = `
    <div style="font-weight:bold;margin-bottom:8px;">Note</div>
    <textarea id="note-input" style="width:100%;height:80%;border:none;outline:none;"></textarea>
  `;

  document.body.appendChild(sidebar);

  initNote();

  // 打开动画
  requestAnimationFrame(() => {
    sidebar.style.right = "0px";
    document.getElementById("note-input").focus();
  });
}

// 数据逻辑
function initNote() {
  const textarea = document.getElementById("note-input");
  const url = location.origin + location.pathname;

  chrome.storage.local.get(["notes"], (res) => {
    const note = res.notes?.[url];
    if (note) textarea.value = note.content;
  });

  let timer = null;

  textarea.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      saveNote(url, textarea.value);
    }, 500);
  });

  window.addEventListener("beforeunload", () => {
    saveNote(url, textarea.value);
  });
}

function saveNote(url, content) {
  chrome.storage.local.get(["notes"], (res) => {
    const notes = res.notes || {};
    notes[url] = { content, time: Date.now() };
    chrome.storage.local.set({ notes });
  });
}