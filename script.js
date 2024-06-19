class SpecialHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <header class="container">
        <h1>Matchup Insights</h1>
        <img src="Image/whistle.png" class="logo" />
        <nav>
        <ul class="test">
          <li><a href="index.html">Home</a></li>
          <li><a href="contact.html">About Me</a></li>
        </ul>
      </nav>
    </header>
        `;
  }
}

customElements.define("nav-matchup", SpecialHeader);

async function fetchData(api) {
  try {
    const response = await fetch(api);
    if (!response.ok) {
      throw new Error("Could not fetch resource");
    }
    const data = await response.json();
    let games = data.events;
    if (api == "response.json" || "week1.json") {
      games = data.events;
    }
    createMatchup(games);
  } catch (error) {
    console.error(error);
  }
}

function createMatchup(games) {
  const elements = ["home", "away"];
  const gamesList = document.getElementById("games-list");
  gamesList.innerHTML = "";
  for (let i = 0; i < games.length; i++) {
    const divGroup = document.createElement("div");
    divGroup.id = "matchup";
    const buttonGroup = document.createElement("div");
    buttonGroup.className = "button-group";
    let container = document.getElementById(
      games[i].status.type.detail.slice(0, 3).toLowerCase()
    );
    if (container == null) {
      mainTitle = document.createElement("h2");
      mainTitle.innerText = dateConverter(games[i].date);
      gamesList.appendChild(mainTitle);
      container = document.createElement("div");
      container.className = "weekday";
      container.id = games[i].status.type.detail.slice(0, 3).toLowerCase();
      gamesList.appendChild(container);
    }
    const title = document.createElement("h3");
    title.id = "game-title";
    title.innerText = games[i].status.type.detail.slice(-11);
    for (let j = 0; j < 2; j++) {
      const button = document.createElement("button");
      button.className = elements[j];
      button.id = games[i].competitions[0].competitors[j].team.shortDisplayName;
      const logo = document.createElement("img");
      logo.id = "logo";
      const name = document.createElement("span");
      name.className = "name";
      name.innerText =
        games[i].competitions[0].competitors[j].team.shortDisplayName;
      button.appendChild(name);
      button.appendChild(logo);

      logo.setAttribute(
        "src",
        `https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/${games[i].competitions[0].competitors[j].team.abbreviation}.png`
      );
      button.addEventListener("click", function () {
        if (button.style.backgroundColor == "") {
          button.style.backgroundColor = `${teamColors[button.textContent][0]}`;
          button.style.color = teamColors[button.textContent][1];
          const other = document.getElementById(
            games[i].competitions[0].competitors[1 - j].team.shortDisplayName
          );
          other.style.backgroundColor = "";
          other.style.color = "black";
        } else {
          button.style.backgroundColor = "";
          button.style.color = "black";
        }
      });
      buttonGroup.prepend(button);
    }
    divGroup.appendChild(buttonGroup);
    divGroup.prepend(title);
    container.appendChild(divGroup);
    if (container.querySelectorAll(".button-group").length >= 3) {
      container.style.gridTemplateColumns = "repeat(3, 1fr)";
    } else {
      container.style.gridTemplateColumns = `repeat(${
        container.querySelectorAll(".button-group").length
      }, 1fr)`;
    }
  }
}

function createSelect() {
  const select = document.getElementById("week-select");
  for (let i = 1; i <= 17; i++) {
    const option = document.createElement("option");
    option.innerText = `Week ${i}`;
    option.onclick = `fetchData('https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?limit=1000&dates=2024&seasontype=2&week=${i}')`;
    select.appendChild(option);
  }
}

window.onload = fetchData("week1.json");
window.onload = createSelect();

function dateConverter(dateString) {
  const date = new Date(dateString);
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
  const month = date.toLocaleDateString("en-US", { month: "long" });
  const day = date.toLocaleDateString("en-US", { day: "numeric" });
  return `${weekday}, ${month} ${day}`;
}

const teamColors = {
  Cardinals: ["#97233F", "#000000"],
  Falcons: ["#A71930", "#000000", "#A5ACAF"],
  Ravens: ["#241773", "#9E7C0C", "#000000"],
  Bills: ["#00338D", "#C60C30"],
  Panthers: ["#0085CA", "#101820", "#A5ACAF", "#BFC0BF"],
  Bears: ["#0B162A", "#C83803", "#DD4814", "#FFFFFF"],
  Bengals: ["#FB4F14", "#000000", "#FFFFFF"],
  Browns: ["#311D00", "#FF3C00", "#FFFFFF"],
  Cowboys: ["#041E42", "#869397", "#FFFFFF"],
  Broncos: ["#FB4F14", "#002244", "#FFFFFF"],
  Lions: ["#0076B6", "#B0B7BC", "#FFFFFF"],
  Packers: ["#203731", "#FFB81C"],
  Texans: ["#03202F", "#A71930", "#FFFFFF"],
  Colts: ["#002C5F", "#A5ACAF", "#FFFFFF"],
  Jaguars: ["#006778", "#D7A22A", "#D7A22A", "#9F792C"],
  Chiefs: ["#E31837", "#FFB81C"],
  Raiders: ["#000000", "#A5ACAF", "#FFFFFF"],
  Chargers: ["#0072CE", "#FFB81C", "#002244", "#FFFFFF"],
  Rams: ["#003594", "#ffa300", "#B3995D"],
  Dolphins: ["#008E97", "#F58220", "#FFFFFF", "#005778"],
  Vikings: ["#4F2683", "#FFC62F", "#FFFFFF"],
  Patriots: ["#002244", "#C60C30", "#B0B7BC", "#FFFFFF"],
  Saints: ["#D3BC8D", "#101820"],
  Giants: ["#0B2265", "#a71930", "#a5acaf"],
  Jets: ["#203731", "#FFFFFF"],
  Eagles: ["#004C54", "#A5ACAF", "#FFFFFF"],
  Steelers: ["#FFB81C", "#101820"],
  "49ers": ["#AA0000", "#B3995D", "#FFFFFF"],
  Seahawks: ["#002244", "#69BE28", "#A5ACAF", "#FFFFFF"],
  Buccaneers: ["#D50A0A", "#34302B", "#FF7900", "#FFFFFF"],
  Titans: ["#0C2340", "#4B92DB", "#FFFFFF"],
  Commanders: ["#773141", "#FFB612"],
};
