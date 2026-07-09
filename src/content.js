function applyStyle(color) {
  style.textContent = `
    .avatar {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background-color: ${color}
    }
    `;
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

chrome.runtime.onMessage.addListener((message) => {
  if (message.state === "focused") {
    applyStyle('green')
  } else if (message.state === "bored") {
    applyStyle('red')
  } else {
    applyStyle('yellow')
  }
});

const avatar = document.createElement("div");
avatar.className = "avatar";
applyStyle('yellow')
shadow.appendChild(avatar);
shadow.appendChild(style);
