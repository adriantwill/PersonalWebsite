class SpecialHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <header class="container">
      <nav>
        <h1>Matchup Insights</h1>
        <img src="Image/whistle.png" class="logo" />
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
    const container = document.querySelector(".bracket");
    const positions = ["left", "right"];
    let games;
    if (api == "response.json" || "week1.json") {
      games = data.events;
    }
    for (let i = 0; i < games.length; i++) {
      const divGroup = document.createElement("div");
      divGroup.id = "matchup";
      const homeButton = document.createElement("button");
      homeButton.id = "home";
      const awayButton = document.createElement("button");
      awayButton.id = "away";
      const elements = [homeButton, awayButton];
      for (let j = 0; j < elements.length; j++) {
        elements[j].innerText =
          games[i].competitions[0].competitors[j].team.shortDisplayName;
        elements[j].style.backgroundImage = `linear-gradient(to ${
          positions[j]
        }, ${
          teamColors[
            games[i].competitions[0].competitors[j].team.displayName
          ][0]
        } 50%, white 50%)`;
        elements[j].addEventListener("mouseenter", function () {
          elements[j].style.color =
            teamColors[
              games[i].competitions[0].competitors[j].team.displayName
            ][1];
        });
        elements[j].addEventListener("mouseleave", function () {
          elements[j].style.color = "black";
        });
      }
      divGroup.appendChild(awayButton);
      divGroup.appendChild(homeButton);
      container.appendChild(divGroup);
    }
  } catch (error) {
    console.error(error);
  }
}

const teamColors = {
  "Arizona Cardinals": ["#97233F", "#000000"],
  "Atlanta Falcons": ["#A71930", "#000000", "#A5ACAF"],
  "Baltimore Ravens": ["#241773", "#000000", "#9E7C0C"],
  "Buffalo Bills": ["#00338D", "#C60C30"],
  "Carolina Panthers": ["#0085CA", "#101820", "#A5ACAF", "#BFC0BF"],
  "Chicago Bears": ["#0B162A", "#C83803", "#DD4814", "#FFFFFF"],
  "Cincinnati Bengals": ["#FB4F14", "#000000", "#FFFFFF"],
  "Cleveland Browns": ["#311D00", "#FF3C00", "#FFFFFF"],
  "Dallas Cowboys": ["#041E42", "#869397", "#FFFFFF"],
  "Denver Broncos": ["#FB4F14", "#002244", "#FFFFFF"],
  "Detroit Lions": ["#0076B6", "#B0B7BC", "#FFFFFF"],
  "Green Bay Packers": ["#203731", "#FFB81C"],
  "Houston Texans": ["#03202F", "#A71930", "#FFFFFF"],
  "Indianapolis Colts": ["#002C5F", "#A5ACAF", "#FFFFFF"],
  "Jacksonville Jaguars": ["#101820", "#006778", "#D7A22A", "#9F792C"],
  "Kansas City Chiefs": ["#E31837", "#FFB81C"],
  "Las Vegas Raiders": ["#000000", "#A5ACAF", "#FFFFFF"],
  "Los Angeles Chargers": ["#0072CE", "#FFB81C", "#002244", "#FFFFFF"],
  "Los Angeles Rams": ["#002244", "#FFFFFF", "#B3995D"],
  "Miami Dolphins": ["#008E97", "#F58220", "#FFFFFF", "#005778"],
  "Minnesota Vikings": ["#4F2683", "#FFC62F", "#FFFFFF"],
  "New England Patriots": ["#002244", "#C60C30", "#B0B7BC", "#FFFFFF"],
  "New Orleans Saints": ["#D3BC8D", "#101820"],
  "New York Giants": ["#0B2265", "#a71930", "#a5acaf"],
  "New York Jets": ["#203731", "#FFFFFF"],
  "Philadelphia Eagles": ["#004C54", "#A5ACAF", "#FFFFFF"],
  "Pittsburgh Steelers": ["#FFB81C", "#101820"],
  "San Francisco 49ers": ["#AA0000", "#B3995D", "#FFFFFF"],
  "Seattle Seahawks": ["#002244", "#69BE28", "#A5ACAF", "#FFFFFF"],
  "Tampa Bay Buccaneers": ["#D50A0A", "#34302B", "#FF7900", "#FFFFFF"],
  "Tennessee Titans": ["#0C2340", "#4B92DB", "#FFFFFF"],
  "Washington Commanders": ["#773141", "#FFB612"],
};

function getTeamColor(team) {
  return teamColors[team] || "#000000";
}
