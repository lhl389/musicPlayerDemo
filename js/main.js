const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const player = $(".player__container");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const progress = $("#progress");
const playButton = $(".btn-toggle-play");

const playlist = $(".playlist").innerHTML;

const app = {
  currentIndex: 0,
  isPlaying: false,
  songs: [
    {
      name: "Bang Bang Bang",
      singer: "BIGBANG",
      path: "./music/BangBangBang-BIGBANG.mp3",
      img: "./img/bangbangbang-bigbang.jpeg",
    },
    {
      name: "Blue",
      singer: "BIGBANG",
      path: "./music/Blue-BIGBANG.mp3",
      img: "./img/blue-bigbang.jpg",
    },
    {
      name: "Bullshit",
      singer: "G-DRAGON",
      path: "./music/Bullshit-GDRAGON.mp3",
      img: "./img/bullshit-gdragon.jpg",
    },
    {
      name: "Crayon",
      singer: "G-DRAGON",
      path: "./music/Crayon-GDRAGON.mp3",
      img: "./img/Crayon-GDRAGON.jpg",
    },
    {
      name: "Crooked",
      singer: "G-DRAGON",
      path: "./music/Crooked-GDRAGON.mp3",
      img: "./img/Crooked-GDRAGON.jpg",
    },
    {
      name: "Eyes, Nose, Lips",
      singer: "TAEYANG",
      path: "./music/EyesNoseLips-TAEYANG.mp3",
      img: "./img/EyesNoseLips-TAEYANG.jpg",
    },
    {
      name: "Fxxk It",
      singer: "BIGBANG",
      path: "./music/FxxkIt-BIGBANG.mp3",
      img: "./img/FxxkIt-BIGBANG.jpg",
    },
    {
      name: "Good Boy",
      singer: "GD X TAEYANG",
      path: "./music/GoodBoy-GDXTAEYANG.mp3",
      img: "./img/GoodBoy-GDXTAEYANG.jpg",
    },
    {
      name: "If you",
      singer: "BIGBANG",
      path: "./music/IfYou-BIGBANG.mp3",
      img: "./img/IfYou-BIGBANG.jpg",
    },
  ],
  render: function () {
    const htmls = this.songs.map((song) => {
      return `
            <div class="song">
                <div
                  class="thumb"
                  style="background-image: url('${song.img}')"
                ></div>
                <div class="body">
                  <div class="title">${song.name}</div>
                  <div class="author">${song.singer}</div>
                </div>
                <div class="option">
                  <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `;
    });
    $(".playlist").innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;
    // CD Interface
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newWidth = cdWidth - scrollTop;
      cd.style.width = newWidth > 0 ? newWidth + "px" : 0;
      cd.style.opacity = newWidth / cdWidth;
    };
    // Play button onclick
    playButton.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };
    audio.onplay = function () {
        _this.isPlaying = true;
        player.classList.add("playing");
    }
    audio.onpause = function () {
        _this.isPlaying = false;
        player.classList.remove("playing");
    }
    audio.ontimeupdate = function () {
        if(audio.duration){
            const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
            progress.value = progressPercent;
        }
    }
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`;
    audio.src = this.currentSong.path;
  },
  start: function () {
    // Define Object Properties
    this.defineProperties();
    this.handleEvents();
    this.loadCurrentSong();
    this.render();
  },
};
app.start();
