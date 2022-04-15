const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "PLAYER_STORAGE_KEY";

const player = $(".player__container");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const progress = $("#progress");
const playButton = $(".btn-toggle-play");
const nextButton = $(".btn-next");
const prevButton = $(".btn-prev");
const randomButton = $(".btn-random");
const repeatButton = $(".btn-repeat");

const playlist = $(".playlist");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
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
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
            <div class="song" data-index="${index}">
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

    playlist.innerHTML = htmls.join("");
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
    // CD rotating
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iterations: Infinity,
    });
    cdThumbAnimate.pause();
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
      cdThumbAnimate.play();
    };
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };
    // Progress bar
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };
    // Seeking song
    progress.onchange = function (e) {
      const seekTime = (e.target.value / 100) * audio.duration;
      audio.currentTime = seekTime;
    };
    // Next song
    nextButton.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.scrollToActiveSong();
    };
    // Prev song
    prevButton.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.crollToActiveSong();
    };
    // Random song
    randomButton.onclick = function () {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      randomButton.classList.toggle("btn-active", _this.isRandom);
    };
    // Song ending
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextButton.click();
      }
    };
    // Song repeating
    repeatButton.onclick = function (e) {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      repeatButton.classList.toggle("btn-active", _this.isRepeat);
    };
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");
      const optionNode = e.target.closest(".option");
      if (songNode || optionNode) {
        if (songNode) {
          _this.currentIndex = songNode.dataset.index;
          _this.loadCurrentSong();
          audio.play();
        }
        if (optionNode) {
        }
      }
    };
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 300);
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`;
    audio.src = this.currentSong.path;
    const querySong = $$(".song");
    for (let i = 0; i < querySong.length; i++) {
      if (i == this.currentIndex) {
        querySong[i].classList.add("active");
      } else {
        querySong[i].classList.remove("active");
      }
    }
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  randomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  start: function () {
    // Assign config to current
    this.loadConfig();
    this.defineProperties();
    this.handleEvents();
    this.render();
    this.loadCurrentSong();
    randomButton.classList.toggle("btn-active", this.isRandom);
    repeatButton.classList.toggle("btn-active", this.isRepeat);
  },
};
app.start();
