import type { Component } from 'solid-js';
import { Show } from 'solid-js';
import generalData from './res/general.json';
import dateTimeData from './res/date-time.json';
import film1Data from './res/film1.json';
import film2Data from './res/film2.json';

const sameFilm = JSON.stringify(film1Data) === JSON.stringify(film2Data);

const App: Component = () => {
  return (
    <>
      <div class="invite container">
        <h4 class="it">{generalData.title1}</h4>
        <h1>{generalData.title2}</h1>
        <h3 class="it">{generalData.title3}</h3>
        <hr />
        <h2>{dateTimeData.date}</h2>
        <h2>{generalData.address}</h2>
        <hr />
        <h3 class="it bold">{dateTimeData.time1} </h3>
        <h4 class="it">{generalData.food}</h4>
        <h3 class="it bold">{dateTimeData.time2}</h3>
        <h4 class="it">{generalData.film}</h4>
        <hr />
        <p class="it bold">{generalData.rsvp}</p>
        <hr />
        <h1>{generalData.featuredFilms}</h1>
        <h4> {generalData.adults}</h4>
        <h1>{film1Data.title}</h1>
        <p>{film1Data.desc}</p>
        <img class="poster" src={film1Data.filename} alt={film1Data.title} />

        <Show when={!sameFilm}>
          <hr />
          <h4> {generalData.kids}</h4>
          <h1>{film2Data.title}</h1>
          <p>{film2Data.desc}</p>
          <img class="poster" src={film2Data.filename} alt={film2Data.title} />
        </Show>

        <hr />
        <p class="bold">{generalData.closing}</p>
        <hr />
        <p class="credits">
          Built with{' '}
          <a href="https://github.com/smycynek/invite-maker">
            https://github.com/smycynek/invite-maker
          </a>
        </p>
      </div>
    </>
  );
};

export default App;
