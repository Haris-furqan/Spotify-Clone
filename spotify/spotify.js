let currentsong = null;
let index = 0;

async function getsongs() {
    

    const a = await fetch("http://127.0.0.1:3000/songs");
    const resp = await a.text();
    const div = document.createElement("div");
    div.innerHTML = resp;
    const as = div.getElementsByTagName("a");
    let songs = [];
    for(let i = 0;i<as.length;i++)
    {
        const element=as[i];
        if(element.href.endsWith(".mp3"))
        {
            songs.push(element.href);
        }
    }
 
    return songs;
}

function playsong(track)
{
   
    currentsong = new Audio(`/songs/${track}`);
    currentsong.play();
        currentsong.addEventListener("timeupdate",()=>{
        let percentage = (currentsong.currentTime/currentsong.duration)*100;
        document.querySelector(".circle").style.left = `${percentage}%`
    });
    
}

function stopsong()
{
    if(currentsong){
    currentsong.pause(); 
    }
}

async function main() 
{

    const songs = await getsongs();
    

    
    for (let index = 0; index < songs.length; index++) {
        let song = songs[index].split("songs/")[1];
        song = song.replaceAll("%20"," ");
        songs[index] = song 
    }

    let thissong = songs[0];
    currentsong = thissong;
    playsong(currentsong);
    stopsong();

    let songsURl = document.querySelector(".playables").getElementsByTagName("ul")[0];
    for (const element of songs) {
        const song = element
        
        songsURl.innerHTML+=`<li class="info flex">
                        <img src="music.svg" alt="music-note">
                        <div class="songnartist">
                        <div class="playsongname">${song}</div>
                        <div class="artistname">Unknown</div>
                        </div>
                        <img class="songplaybtn" src="rounded-play-button (1).svg" alt="play">


                    </li>`; 
    }

    Array.from(document.querySelector(".playables").getElementsByTagName("ul")[0].getElementsByTagName("li")).forEach(element => {

        const songname = element.querySelector(".playsongname").textContent;

        element.addEventListener("click",()=>{
            if(currentsong )
            {
                stopsong(currentsong);
            }
            currentsong = songname;
            playsong(songname);

            })
        });

        const play = document.querySelector(".play");
        play.addEventListener("click",()=>{
            
            if(currentsong.paused)
            {
                currentsong.play();
                play.innerHTML = "&#9654;";
            }
            else
            {
                currentsong.pause();
                play.innerHTML ="&#10073;&#10073;"
            }
            
        }); 
        
        const next = document.querySelector(".next")
        next.addEventListener("click",()=>
        {
            let songname = currentsong.src.split("songs/")[1];
            songname = songname.replaceAll("%20"," ");
            index = songs.indexOf(songname);
            stopsong();
            currentsong = songs[index+1];
            playsong(currentsong);
        });

        const prev = document.querySelector(".prev");
        prev.addEventListener("click",()=>
        {
            let songname = currentsong.src.split("songs/")[1];
            songname = songname.replaceAll("%20"," ");
            index = songs.indexOf(songname);
            stopsong();
            currentsong = songs[index-1];
            playsong(currentsong);
        });


        let seek  = document.querySelector(".seekbar");
        seek.addEventListener("click",(e)=>
            {
                let offsetx = e.offsetX;
                let width = e.target.getBoundingClientRect().width
               
                const perc = (offsetx/width);
                
                
                document.querySelector(".circle").style.left = `${perc*100}%`;
                currentsong.currentTime = perc*currentsong.duration;
            }
        )
}
main();
