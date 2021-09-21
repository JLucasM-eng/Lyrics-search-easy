
const form = document.querySelector('#form')
const searchInput = document.querySelector('#search')
const songsContainer = document.querySelector('#songs-container')
const prevAndNextContainer = document.querySelector('#prev-and-next-container')
const apiUrl = 'https://api.lyrics.ovh'
const textReturnSongs = document.querySelector('#return-songs')

const getMoreSongs = async url =>{
    const response = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
    const data = await response.json()
    isertSongsIntoPage(data)
}


const isertSongsIntoPage = infoSongs => {
    songsContainer.innerHTML = infoSongs.data.map((song)=>{
        return `<li class="song">
                    <span class="song-artist"><strong>${song.artist.name}</strong> - ${song.title}</span>
                    <button class="btn" data-artist="${song.artist.name}" data-song-title="${song.title}">Ver letra</button>
                </li>`
    }).join(' ')

    if(infoSongs.next || infoSongs.prev){
        prevAndNextContainer.innerHTML = `
        ${infoSongs.next ? `<button class="btn" onClick="getMoreSongs('${infoSongs.next}')">Próximas</button>`:''}
        ${infoSongs.prev ? `<button class="btn" onClick="getMoreSongs('${infoSongs.prev}')">Anteriores</button>`:''}
        `
        return
    }
    prevAndNextContainer.innerHTML=''

}

const fetchSongs =  async term =>{
    
   const response = await fetch(`${apiUrl}/suggest/${term}`)
    const data = await response.json()
    isertSongsIntoPage(data)
    textReturnSongs.innerHTML =''
}



form.addEventListener('submit',(event)=>{
    event.preventDefault()

    const searchTerm = searchInput.value.trim()
   if(!searchTerm){
       songsContainer.innerHTML = `<li class="warning-message">Por favor, digite um texto válido</li>`
       return;
   }
   fetchSongs(searchTerm)
}) 

const fetchLyrics = async( artist, songTitle)=>{
    const response = await fetch(`${apiUrl}/v1/${artist}/${songTitle}`)
    const data = await response.json()
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g,'<br>')

    songsContainer.innerHTML = `
    <li class="lyrics-container">
        <h2>
            <strong>${songTitle}</strong> - ${artist}
        </h2>
        <p class="lyrics">${lyrics}</p>
    </li>`

    textReturnSongs.innerHTML = `<span onClick="fetchSongs('${artist}')">Músicas de ${artist}</span> > ${songTitle}`
}

songsContainer.addEventListener('click',event=>{
    const clickedElement = event.target
    if(clickedElement.tagName==='BUTTON'){
        const artist = clickedElement.getAttribute('data-artist')
        const songTitle = clickedElement.getAttribute('data-song-title')
        prevAndNextContainer.innerHTML = ''
        fetchLyrics(artist,songTitle)
    }
    
})