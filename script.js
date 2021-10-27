const API_URL = 'https://api.discogs.com/releases/';
const CUE_DICTIONARY = ['REM', 'GENRE', 'STYLES', 'DATE', 'DISCOGS_URL', 'PERFORMER', 'WAVE', 'TITLE', 'FILE', 'DISCNUMBER', 'TRACK', 'AUDIO', 'INDEX'];

const btnGenerator = document.querySelector('.btn-generator');
const discogsId = document.querySelector('.discogs-id');
const fileName = document.querySelector('.file-name');
const numberDisc = document.querySelector('.number-disc');
const cueOut = document.querySelector('.cue-out');

let cueTracklist = '';
let timeTrack = new Date().setHours(0, 0, 0);

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

function tracklist(array) {
  let resultArray = [];
  array.forEach(item => {
    if (item.position[0].includes(getNumberDisc())) {
      resultArray.push(item);
    }
  });

  resultArray.forEach(item => {
    getArtistToTrack(item.artists);
    `${item.title}`;
    `${item.position}`;
    `${item.position.substr(item.position.length - 2)}`;
    `${item.duration}`;
    console.log('item.duration: ', item.duration);

    cueTracklist += `${CUE_DICTIONARY[10]} ${item.position.substr(item.position.length - 2)} ${CUE_DICTIONARY[11]}
    ${CUE_DICTIONARY[7]} "${item.title}"
    ${CUE_DICTIONARY[5]} "${getArtistToTrack(item.artists)}"
    ${CUE_DICTIONARY[12]} ${item.position.substr(item.position.length - 2)} ${timeTrack}
  `;
    // new Date(Date.parse(item.duration));
    console.log('new Date(Date.parse(item.duration)): ', new Date(Date.parse(item.duration)));
    // timeTrack = ;
  });
  return cueTracklist;
}

async function getDiscogs() {
  const url = API_URL + gettingId();
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

async function generateCue() {
  let discogsData = await getDiscogs();

  cueOut.innerHTML =
    `${CUE_DICTIONARY[0]} ${discogsData.artists_sort} - ${discogsData.title}
${CUE_DICTIONARY[0]} ${CUE_DICTIONARY[1]} ${dataForArray(discogsData.genres)}
${CUE_DICTIONARY[0]} ${CUE_DICTIONARY[2]} ${dataForArray(discogsData.styles)}
${CUE_DICTIONARY[0]} ${CUE_DICTIONARY[3]} ${discogsData.year}
${CUE_DICTIONARY[0]} ${CUE_DICTIONARY[4]} ${discogsData.uri}
${CUE_DICTIONARY[7]} ${discogsData.artists_sort} - ${discogsData.title}
${CUE_DICTIONARY[0]} ${CUE_DICTIONARY[9]} ${getNumberDisc()}
${CUE_DICTIONARY[8]} ${getFileName()} ${CUE_DICTIONARY[6]}
  ${tracklist(discogsData.tracklist)}
  `;
}

btnGenerator.addEventListener('click', generateCue);