class SpecialHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <header class="container">
        <h1>Adrian Will</h1>
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

class SpecialTable extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <h2></h2>
         <table class="content-table">
          <thead>
            <tr>
              <th>Team</th>
              <th>Win</th>
              <th>Loss</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
        `;
  }
}

customElements.define("nav-matchup", SpecialHeader);
customElements.define("table-matchup", SpecialTable);

async function fetchData(api) {
  try {
    const response = await fetch(api);
    if (!response.ok) {
      throw new Error("Could not fetch resource");
    }
    const data = await response.json();
    createMatchup(data);
  } catch (error) {
    console.error(error);
  }
}

async function fetchTeams(api) {
  try {
    const response = await fetch(api);
    if (!response.ok) {
      throw new Error("Could not fetch resource");
    }
    const data = await response.json();
    const games = data.sports[0].leagues[0].teams;
    return games;
  } catch (error) {
    console.error(error);
  }
} //combine api's

function createMatchup(games) {
  const elements = ["home", "away"];
  const gamesList = document.getElementById("games-list");
  gamesList.innerHTML = "";
  const singleTitle = document.getElementById("single-title");
  singleTitle.innerText = games.events.length === 17 ? games.team.displayName : `Week ${games.week.number}`;
  games = games.events;
  for (let i = 0; i < games.length; i++) {
    const divGroup = document.createElement("div");
    const buttonGroup = document.createElement("div");
    buttonGroup.className = "button-group";
    const title = document.createElement("h3");
    title.className = "game-title";
    mainTitle = document.createElement("h2");
    if (games.length === 17) {
      mainTitle.innerText = games[i].week.text;
      divGroup.appendChild(mainTitle);
      title.innerText = games[i].competitions[0].status.type.detail;
      gamesList.appendChild(divGroup);
      gamesList.style.gridTemplateColumns = "repeat(auto-fit, minmax(480px, 1fr))";
      gamesList.style.display = "grid";
    } else {
      let container = document.getElementById(games[i].status.type.detail.slice(0, 3).toLowerCase());
      if (container === null) {
        mainTitle.innerText = games[i].status.type.detail.split(" ").slice(0, 3).join(" ");
        gamesList.appendChild(mainTitle);
        container = document.createElement("div");
        container.className = "weekday";
        container.id = games[i].status.type.detail.slice(0, 3).toLowerCase();
        gamesList.appendChild(container);
      }
      container.appendChild(divGroup);
      title.innerText = games[i].status.type.detail.slice(-11);
      gamesList.style.display = "";
      container.style.gridTemplateColumns = "repeat(auto-fit, minmax(480px, 1fr))";
    }
    for (let j = 0; j < 2; j++) {
      const button = document.createElement("button");
      button.className = elements[j];
      const logo = document.createElement("img");
      logo.className = "logo";
      const name = document.createElement("span");
      name.className = "name";
      name.innerText = games[i].competitions[0].competitors[j].team.shortDisplayName;
      button.appendChild(name);
      button.appendChild(logo);
      logo.setAttribute(
        "src",
        `https://a.espncdn.com/i/teamlogos/nfl/500/${games[i].competitions[0].competitors[j].team.abbreviation}.png`
      );
      button.addEventListener("click", function () {
        let buttons = buttonGroup.querySelectorAll("button");
        if (button.style.backgroundColor === "") {
          button.style.backgroundColor = `${teamColors[button.textContent][0]}`;
          button.style.color = teamColors[button.textContent][1];
          for (let k = 0; k < 2; k++) {
            teamRecords[games[i].competitions[0].competitors[Math.abs(k - j)].team.shortDisplayName][k]++;
          }
          if (buttons[j].style.backgroundColor !== "") {
            for (let k = 0; k < 2; k++) {
              teamRecords[games[i].competitions[0].competitors[Math.abs(1 - k - j)].team.shortDisplayName][k]--;
            }
          }
          buttons[j].style.backgroundColor = "";
          buttons[j].style.color = "black";
        } else {
          button.style.backgroundColor = "";
          button.style.color = "black";
          for (let k = 0; k < 2; k++) {
            teamRecords[games[i].competitions[0].competitors[Math.abs(k - j)].team.shortDisplayName][k]--;
          }
        }
        for (let k = 0; k < 2; k++) {
          win = document.getElementById(
            `${games[i].competitions[0].competitors[Math.abs(k - j)].team.shortDisplayName}-${k}`
          );
          loss = document.getElementById(
            `${games[i].competitions[0].competitors[Math.abs(k - j)].team.shortDisplayName}-${Math.abs(1 - k)}`
          );
          win.innerText = teamRecords[games[i].competitions[0].competitors[Math.abs(k - j)].team.shortDisplayName][k];
          loss.innerText =
            teamRecords[games[i].competitions[0].competitors[Math.abs(k - j)].team.shortDisplayName][Math.abs(1 - k)];
        }
        sorter();
      });
      buttonGroup.prepend(button);
    }
    divGroup.appendChild(title);
    divGroup.appendChild(buttonGroup);
  }
}

//create default elements here and create long term elements

async function createSelect() {
  let div = document.getElementById("team-table");
  let tables = div.querySelectorAll("tbody");
  tables[0].id = "nfc-tbody";
  tables[1].id = "afc-tbody";
  let h2s = div.querySelectorAll("h2");
  h2s[0].innerText = "NFC Rankings";
  h2s[1].innerText = "AFC Rankings";
  const week = document.getElementById("week-select");
  for (let i = 1; i <= 18; i++) {
    const option = document.createElement("option");
    option.innerText = `Week ${i}`;
    option.setAttribute(
      "onclick",
      `fetchData('https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?limit=1000&dates=2024&seasontype=2&week=${i}')`
    );
    week.appendChild(option);
  }
  const team = document.getElementById("team-select"); //add team based on team.json and id for calling api
  teamList = await fetchTeams("teams.json");
  for (let i = 0; i < 32; i++) {
    const option = document.createElement("option");
    option.innerText = teamList[i].team.shortDisplayName;
    option.setAttribute(
      "onclick",
      `fetchData('https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${teamList[i].team.id}/schedule?season=2024')`
    );
    team.appendChild(option);
    const tableRow = document.createElement("tr");
    const tableDetailName = document.createElement("td");
    const tableDetailWins = document.createElement("td");
    const tableDetailLosses = document.createElement("td");
    const spanElement = document.createElement("span");
    const imgElement = document.createElement("img");
    spanElement.textContent = teamList[i].team.shortDisplayName;
    imgElement.setAttribute("src", `https://a.espncdn.com/i/teamlogos/nfl/500/${teamList[i].team.abbreviation}.png`);
    imgElement.className = "logo";
    tableDetailName.appendChild(spanElement);
    tableDetailName.appendChild(imgElement);
    tableDetailWins.innerText = teamRecords[teamList[i].team.shortDisplayName][0];
    tableDetailWins.id = `${teamList[i].team.shortDisplayName}-0`;
    tableDetailLosses.innerText = teamRecords[teamList[i].team.shortDisplayName][1];
    tableDetailLosses.id = `${teamList[i].team.shortDisplayName}-1`;
    tableRow.appendChild(tableDetailName);
    tableRow.appendChild(tableDetailWins);
    tableRow.appendChild(tableDetailLosses);
    if (teamList[i].team.conference == "afc") {
      const tbody = document.getElementById("afc-tbody");
      tbody.appendChild(tableRow);
    } else {
      const tbody = document.getElementById("nfc-tbody");
      tbody.appendChild(tableRow);
    }
  }
}

function resetRecords() {
  //reset button to add
  for (let team in teamRecords) {
    teamRecords[team] = [0, 0];
  }
}

function sorter() {
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.querySelectorAll("table");
  for (let j = 0; j < 2; j++) {
    switching = true;
    while (switching) {
      switching = false;
      rows = table[j].rows;
      for (i = 1; i < rows.length - 1; i++) {
        shouldSwitch = false;
        x = rows[i].getElementsByTagName("TD")[0];
        y = rows[i + 1].getElementsByTagName("TD")[0];
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
    switching = true;
    while (switching) {
      switching = false;
      rows = table[j].rows;
      for (i = 1; i < rows.length - 1; i++) {
        shouldSwitch = false;
        v = rows[i].getElementsByTagName("TD")[2];
        w = rows[i + 1].getElementsByTagName("TD")[2];
        x = rows[i].getElementsByTagName("TD")[1];
        y = rows[i + 1].getElementsByTagName("TD")[1];
        firstPercent =
          parseFloat(x.innerHTML.toLowerCase()) /
          (parseFloat(x.innerHTML.toLowerCase()) + parseFloat(v.innerHTML.toLowerCase()));
        secondPercent =
          parseFloat(y.innerHTML.toLowerCase()) /
          (parseFloat(y.innerHTML.toLowerCase()) + parseFloat(w.innerHTML.toLowerCase()));
        if (!isFinite(firstPercent)) {
          firstPercent = 0;
        }
        if (!isFinite(secondPercent)) {
          secondPercent = 0;
        }
        if (firstPercent < secondPercent) {
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
    switching = true;
    while (switching) {
      switching = false;
      rows = table[j].rows;
      for (i = 1; i < rows.length - 1; i++) {
        shouldSwitch = false;
        x = rows[i].getElementsByTagName("TD")[2];
        y = rows[i + 1].getElementsByTagName("TD")[2];
        v = rows[i].getElementsByTagName("TD")[1];
        w = rows[i + 1].getElementsByTagName("TD")[1];
        if (
          x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase() &&
          w.innerHTML.toLowerCase() == 0 &&
          v.innerHTML.toLowerCase() == 0
        ) {
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
  }
}

window.onload = fetchData("week1.json");
window.onload = createSelect();

let teamRecords = {
  Cardinals: [0, 0],
  Falcons: [0, 0],
  Ravens: [0, 0],
  Bills: [0, 0],
  Panthers: [0, 0],
  Bears: [0, 0],
  Bengals: [0, 0],
  Browns: [0, 0],
  Cowboys: [0, 0],
  Broncos: [0, 0],
  Lions: [0, 0],
  Packers: [0, 0],
  Texans: [0, 0],
  Colts: [0, 0],
  Jaguars: [0, 0],
  Chiefs: [0, 0],
  Raiders: [0, 0],
  Chargers: [0, 0],
  Rams: [0, 0],
  Dolphins: [0, 0],
  Vikings: [0, 0],
  Patriots: [0, 0],
  Saints: [0, 0],
  Giants: [0, 0],
  Jets: [0, 0],
  Eagles: [0, 0],
  Steelers: [0, 0],
  "49ers": [0, 0],
  Seahawks: [0, 0],
  Buccaneers: [0, 0],
  Titans: [0, 0],
  Commanders: [0, 0],
};

const teamColors = {
  Cardinals: ["#97233F", "#000000"],
  Falcons: ["#A71930", "#000000"],
  Ravens: ["#241773", "#9E7C0C"],
  Bills: ["#00338D", "#C60C30"],
  Panthers: ["#0085CA", "#101820"],
  Bears: ["#0B162A", "#C83803"],
  Bengals: ["#FB4F14", "#000000"],
  Browns: ["#311D00", "#FF3C00"],
  Cowboys: ["#041E42", "#869397"],
  Broncos: ["#FB4F14", "#002244"],
  Lions: ["#0076B6", "#B0B7BC"],
  Packers: ["#203731", "#FFB81C"],
  Texans: ["#03202F", "#A71930"],
  Colts: ["#002C5F", "#A5ACAF"],
  Jaguars: ["#006778", "#D7A22A"],
  Chiefs: ["#E31837", "#FFB81C"],
  Raiders: ["#000000", "#A5ACAF"],
  Chargers: ["#0072CE", "#FFB81C"],
  Rams: ["#003594", "#ffa300"],
  Dolphins: ["#008E97", "#F58220"],
  Vikings: ["#4F2683", "#FFC62F"],
  Patriots: ["#002244", "#C60C30"],
  Saints: ["#D3BC8D", "#101820"],
  Giants: ["#0B2265", "#a71930"],
  Jets: ["#203731", "#FFFFFF"],
  Eagles: ["#004C54", "#A5ACAF"],
  Steelers: ["#FFB81C", "#101820"],
  "49ers": ["#AA0000", "#B3995D"],
  Seahawks: ["#002244", "#69BE28"],
  Buccaneers: ["#D50A0A", "#34302B"],
  Titans: ["#0C2340", "#4B92DB"],
  Commanders: ["#773141", "#FFB612"],
};
