let inactivityTimer;
let isSleeping = false;

function safeSendMessage(message, callback) {
  try {
    chrome.runtime.sendMessage(message, callback);
  } catch (e) {
    console.warn("Extension context invalidated", e)
  }
}


function startInactivityTimer() {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    setAvatarState("sleeping")
    isSleeping = true;
  }, 30000);
}

const container = document.createElement("div");
document.body.appendChild(container);
const shadow = container.attachShadow({ mode: "open" });
container.style.cssText = `
position: fixed;
bottom: 20px;
right: 20px;
z-index: 9999;
`;

const style = document.createElement("style");
const avatar = document.createElement("img");
avatar.className = "avatar";

shadow.appendChild(style);
shadow.appendChild(avatar);

function applyStyle(color) {
  style.textContent = `
    .avatar {
        width: 120px;
        height: auto;
    }
    `;
}

function setAvatarState(state) {
  const imageMap = {
    focused: "focus.png",
    bored: "bored.png",
        idle: "idle.png",
        sleeping: "sleep.png"
    };
    avatar.src = chrome.runtime.getURL(`assets/${imageMap[state] || "idle.png"}`);
}

document.addEventListener("mousemove", () => {
  if (isSleeping) {
    safeSendMessage({ type: "getState" }, (response) => {
      if (response) setAvatarState(response.state);
    });
    isSleeping = false;
  }
  startInactivityTimer();
});

document.addEventListener("keydown", () => {
  if (isSleeping) {
    safeSendMessage({ type: "getState" }, (response) => {
      if (response) setAvatarState(response.state);
    });
    isSleeping = false;
  }
  startInactivityTimer();
});


chrome.runtime.onMessage.addListener((message) => {
  startInactivityTimer();

  if (message.state === "focused") {
    setAvatarState("focused")
  } else if (message.state === "bored") {
    setAvatarState("bored")
  } else {
    setAvatarState("idle")
  }
});

setAvatarState("idle")
applyStyle();

