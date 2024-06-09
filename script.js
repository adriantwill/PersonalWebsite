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

fetch(
  "https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/4/schedule?season=2024"
)
  .then((response) => console.log(response))
  .catch((error) => console.log(error));

customElements.define("nav-matchup", SpecialHeader);
