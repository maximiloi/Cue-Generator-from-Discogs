const API_URL = 'https://api.discogs.com/releases/';
const CUE_DICTIONARY = [
  'REM',
  'GENRE',
  'STYLES',
  'DATE',
  'DISCOGS_URL',
  'PERFORMER',
  'MP3',
  'TITLE',
  'FILE',
  'DISCNUMBER',
  'TRACK',
  'AUDIO',
  'INDEX 01',
];

const btnGenerator = document.querySelector('.btn-generator');
const btnDownload = document.querySelector('.btn-download');
const discogsId = document.querySelector('.discogs-id');
const fileName = document.querySelector('.file-name');
const numberDisc = document.querySelector('.number-disc');
const cueOut = document.querySelector('.cue-out');

let cueTracklist = '';
let timeTrack = new Date().setHours(0, 0, 0);
let trackNumber = 1;

function gettingId() {
  return discogsId.value.replace(/[^0-9]/g, '');
}

function getFileName() {
  return fileName.value;
}

function getNumberDisc() {
  return numberDisc.value;
}

function dataForArray(array) {
  return array.join(', ');
}

function getArtistToTrack(array) {
  if (array.length > 1) {
    return `${array[0].name} ${array[0].join} ${array[1].name}`;
  } else {
    return `${array[0].name}`;
  }
}

function getTrackNumber() {
  let number = '';
  if (trackNumber < 10) {
    number = `0${trackNumber}`;
  } else {
    number = `${trackNumber}`;
  }
  trackNumber++;
  return number;
}

function tracklist(array) {
  let resultArray = [];
  let timeArray = ['00:00:00'];
  let timeOut = 0;

  cueTracklist = '';

  array.forEach((item) => {
    if (item.position[0].includes(getNumberDisc())) {
      resultArray.push(item);
    }
  });

  resultArray.forEach((item) => {
    getArtistToTrack(item.artists);

    cueTracklist += `${CUE_DICTIONARY[10]} ${getTrackNumber()} ${
      CUE_DICTIONARY[11]
    }
    ${CUE_DICTIONARY[5]} "${getArtistToTrack(item.artists)}"
    ${CUE_DICTIONARY[7]} "${item.title}"
    ${CUE_DICTIONARY[12]} ${
      Math.floor(timeOut / 60) < 10
        ? '0' + Math.floor(timeOut / 60)
        : Math.floor(timeOut / 60)
    }:${String(timeOut % 60).padStart(2, '0')}:00
  `;

    timeArray.push('0' + item.duration + ':00');
    timeOut = timeArray.reduce((acc, el) => {
      const [min, sec] = el.split`:`;
      return acc + min * 60 + parseInt(sec);
    }, 0);
  });
  return cueTracklist;
}

async function getDiscogs() {
  const url = API_URL + gettingId();
  const res = await fetch(url);
  const data = await res.json();
  cueOut.innerHTML = '';
  return data;
}

async function generateCue() {
  let discogsData = await getDiscogs();

  cueOut.innerHTML = `${CUE_DICTIONARY[0]} "${discogsData.artists_sort} - ${
    discogsData.title
  }"
${CUE_DICTIONARY[0]} ${CUE_DICTIONARY[1]} "${dataForArray(discogsData.genres)}"
${CUE_DICTIONARY[0]} ${CUE_DICTIONARY[2]} "${dataForArray(discogsData.styles)}"
${CUE_DICTIONARY[0]} ${CUE_DICTIONARY[3]} "${discogsData.year}"
${CUE_DICTIONARY[0]} ${CUE_DICTIONARY[4]} "${discogsData.uri}"
${CUE_DICTIONARY[7]} "${discogsData.artists_sort} - ${discogsData.title}"
${CUE_DICTIONARY[0]} ${CUE_DICTIONARY[9]} "${getNumberDisc()}"
${CUE_DICTIONARY[8]} "${getFileName()}" ${CUE_DICTIONARY[6]}
  ${tracklist(discogsData.tracklist)}
  `;
  trackNumber = 1;
}

function downloadCue() {
  let text = cueOut.value;
  let blob = new Blob([text], { type: 'text/plain; charset=utf-8' });

  saveAs(blob, `${getFileName().substr(0, getFileName().length - 4)}.cue`);
}

btnGenerator.addEventListener('click', generateCue);
btnDownload.addEventListener('click', downloadCue);
