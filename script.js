const fahreja = {
  game: [
    {
      question: "What planet is known as the 'Red Planet'?",
      choiceArray: ["Earth", "Mars", "Jupiter", "Saturn"],
      correctAnswer: "Mars"
    },
    {
      question: "What is the name of Indonesia's capital city?",
      choiceArray: ["Jakarta", "Surabaya", "bandung", "Bali"],
      correctAnswer: "Jakarta"
    },
    {
      question: "Who was Indonesia's first president?",
      choiceArray: ["Jokowi Dodo", "Megawati", "Mohammad Hatta", "Soekarno"],
      correctAnswer: "Soekarno"
    },
    {
      question: "Who invented the light bulb?",
      choiceArray: ["Thomas Alva Edison", "Nikola Tesla", "Albert Einstein", "Galileo Galilei"],
      correctAnswer: "Thomas Alva Edison"
    },
    {
      question: "Who is the person referred to as the father of algebra?",
      choiceArray: ["Nikola Tesla", "Tony Gunawan", "Al-Khwarizmi", "Mark Zuckerberg"],
      correctAnswer: "Al-Khwarizmi"
    }
  ],
  time: {
    currentSecond: 0,
    totalSecond: 30
  },
  startGame: false,
  endGame: false,
  repeatGame: false,
  score: 0,
  currentQuestionIndex: 0,
  count: 0,
  lastNavbarOption: "",
  typeIt: new TypeIt("#textType", {
    speed: 10,
  })
}

function sleep(miliSecond) {
  return new Promise((resolve) => setTimeout(resolve, miliSecond));
}

function countDurationQuest(value) {
  const time = {
    percentage: (fahreja.time.currentSecond / fahreja.time.totalSecond) * 100,
    hours: Math.trunc(value / 3600),
    minutes: Math.trunc((value / 60) % 60),
    seconds: Math.trunc(value % 60)
  }

  time.hours = time.hours < 10 ? "0" + time.hours : time.hours;
  time.minutes = time.minutes < 10 ? "0" + time.minutes : time.minutes;
  time.seconds = time.seconds < 10 ? "0" + time.seconds : time.seconds;

  return {
    percentage: time.percentage,
    hours: time.hours,
    minutes: time.minutes,
    seconds: time.seconds
  }
}

function countdown(callback) {
  fahreja.count = 0;
  const intervalCoundown = setInterval(() => {
    fahreja.count++;
    fahreja.time.currentSecond = fahreja.time.totalSecond - fahreja.count;

    callback({
      percentage: countDurationQuest(fahreja.time.currentSecond).percentage,
      current: fahreja.time.currentSecond,
      hour: countDurationQuest(fahreja.time.currentSecond).hours,
      minute: countDurationQuest(fahreja.time.currentSecond).minutes,
      second: countDurationQuest(fahreja.time.currentSecond).seconds
    });
  }, 1000);

  return intervalCoundown;
}

async function startGame() {
  const start = {
    count: 0,
    containerMenu: document.querySelector(".container-menu"),
    containerQuestion: document.querySelector(".container-question"),
    blackScreen: document.querySelector(".black-screen"),
    progressBar: document.querySelector(".progress-bar"),
    remainingTime: document.querySelector(".remaining-time"),
    information: document.querySelector(".information")
  }

  start.information.classList.remove("hidden");
  start.information.classList.add("flex");
  start.containerMenu.classList.add("animation-hidden-menu");
  start.blackScreen.setAttribute("data", "start-game")
  start.blackScreen.classList.add("fixed", "animation-fadding-black-screen-in");
  start.blackScreen.classList.remove("hidden");

  sleep(900).then(() => {
    start.containerMenu.classList.add("hidden");
    start.containerMenu.classList.remove("flex", "animation-hidden-menu");
    start.containerQuestion.classList.remove("hidden");
    start.containerQuestion.classList.add(
      "display-question",
      "animation-display-question",
    );

    sleep(1100).then(() => {
      start.containerQuestion.classList.remove("animation-display-question");
    });

    const intervalCountdown = countdown((value) => {
      const { percentage, current, hour, minute, second } = value;
      fahreja.time.currentSecond = current;

      if (fahreja.endGame === true) {
        clearInterval(intervalCountdown);
        fahreja.time.currentSecond = 0;
        fahreja.score = 0;
        fahreja.currentQuestionIndex = 0;
        fahreja.startGame = false;
        fahreja.endGame = false;
        fahreja.repeatGame = false;
      } else {
        displayQuestion(fahreja.time.currentSecond, intervalCountdown);
      }

      start.remainingTime.innerHTML = `${hour}:${minute}:${second}`;
      start.progressBar.style.width = `${percentage}%`;

      if (percentage >= 60) {
        start.progressBar.style.backgroundColor = "lightgreen";
      } else if (percentage >= 30) {
        start.progressBar.style.backgroundColor = "yellow";
      } else {
        start.progressBar.style.backgroundColor = "red";
      }

      if (fahreja.time.currentSecond <= 0) {
        clearInterval(intervalCountdown);
      }
    })
  });
}

function optionsGame() {
  const optionsGame = {
    containerOptions: document.querySelector(".container-options"),
    blackScreen: document.querySelector(".black-screen")
  }

  optionsGame.blackScreen.setAttribute("data", "options");
  optionsGame.blackScreen.classList.add("fixed", "animation-fadding-black-screen-in");
  optionsGame.blackScreen.classList.remove("hidden");
  sleep(450).then(() => {
    optionsGame.containerOptions.classList.add("flex", "animation-about-move-in");
    optionsGame.containerOptions.classList.remove("hidden");
  })
}

document.querySelectorAll(".menu-options > nav > ul > li").forEach(value => {
  value.addEventListener("click", () => {
    if (value.getAttribute("id") !== fahreja.lastNavbarOption) {
      document.querySelectorAll(".menu-options > nav > ul").forEach(navOptionOut => {
        if (navOptionOut.querySelector(".active-option")) {

          if (window.innerWidth >= 640) {
            navOptionOut.querySelector(".active-option > div").setAttribute("class", "active move-indicator-nav-out");
          } else {
            navOptionOut.querySelector(".active-option > div").setAttribute("class", "active move-indicator-nav-out-mobile");
          }
        }
      })

      sleep(190).then(() => {
        document.querySelectorAll(".menu-options > nav > ul > li").forEach(cleanActive => {
          cleanActive.removeAttribute("class");
          cleanActive.querySelector("div").removeAttribute("class");
        })

        document.querySelectorAll(".menu-options > .content-options").forEach(contentOptions => {
          document.querySelectorAll(".menu-options > .content-options > div").forEach(hiddenContent => {
            hiddenContent.classList.add("hidden");
          })

          if (contentOptions.querySelector(`[data-id="${value.getAttribute("id")}"]`) !== null) {
            contentOptions.querySelector(`[data-id="${value.getAttribute("id")}"]`).classList.remove("hidden");
          }
        })

        value.setAttribute("class", "active-option");
        if (window.innerWidth >= 640) {
          value.querySelector("div").setAttribute("class", "active move-indicator-nav-in");
        } else {
          value.querySelector("div").setAttribute("class", "active move-indicator-nav-in-mobile");
        }

        sleep(190).then(() => {
          if (window.innerWidth >= 640) {
            value.querySelector("div").classList.remove("move-indicator-nav-in");
          } else {
            value.querySelector("div").classList.remove("move-indicator-nav-in-mobile");
          }
        })
      })
    }
    fahreja.lastNavbarOption = value.getAttribute("id");
  })
})

function optionsAudio() {
  const optionAudio = {
    audio: document.getElementById("audio"),
    buttonPlay: document.querySelector(".button-play-option"),
    triangle: document.querySelector(".button-play-option > .triangle"),
    pause: document.querySelector(".button-play-option > .pause")
  }

  optionAudio.audio.addEventListener("ended", () => {
    optionAudio.buttonPlay.setAttribute("data-play", "false");
    optionAudio.triangle.classList.remove("hidden");
    optionAudio.pause.classList.add("hidden");
    optionAudio.pause.classList.remove("flex");
  })
}

optionsAudio();

function mathOptionRange(range, number) {
  const mathVolume = {
    volume: range
  };

  return (parseInt(number) - mathVolume.volume.min) / (mathVolume.volume.max - mathVolume.volume.min) * 100;
}

function checkValueStorageRange(storage, valueDefault) {
  return localStorage.getItem(storage) === null ? valueDefault : parseInt(localStorage.getItem(storage))
}

function controlOptionRange(range, storage, valueDefault) {
  const controlOptions = {
    range: range,
    valueRange: 0,
    checkValue: 0,
  }
  controlOptions.range.addEventListener("input", () => {
    localStorage.setItem(storage, controlOptions.range.value);
    controlOptions.valueRange = mathOptionRange(controlOptions.range, controlOptions.range.value);
    controlOptions.range.style.background = `linear-gradient( to right, #00FFD1 0%, #00FFD1 ${controlOptions.valueRange}%, #403F66 ${controlOptions.valueRange}%, #403F66 100%)`;
  })

  controlOptions.checkValue = checkValueStorageRange(storage, valueDefault);

  controlOptions.range.style.background = `linear-gradient(to right, #00FFD1 0%, #00FFD1 ${mathOptionRange(controlOptions.range, controlOptions.checkValue)}%, #403F66 ${mathOptionRange(controlOptions.range, controlOptions.checkValue)}%, #403F66 100%)`;
}

function controlOptionVolume() {
  const volume = {
    audio: document.getElementById("audio"),
    rangeOption: document.getElementById("range-option"),
    checkValueStorage: checkValueStorageRange("optionsVolume", 100)
  }

  controlOptionRange(volume.rangeOption, "optionsVolume", 100);
  volume.rangeOption.value = volume.checkValueStorage;

  volume.rangeOption.addEventListener("input", () => {
    volume.audio.volume = volume.rangeOption.value * (1 / 100);
  });

  volume.audio.volume = localStorage.getItem("optionsVolume") === null ? 1 : localStorage.getItem("optionsVolume") * (1 / 100)
}

controlOptionVolume();

function controlOptionQuest() {
  const quest = {
    countTotalDuration: 0,
    rangeQuest: document.getElementById("range-duration-quest"),
    checkValueStorage: checkValueStorageRange("optionsQuest", fahreja.time.totalSecond),
    totalDurationQuest: document.querySelector(".total-duration-quest > a")
  }

  controlOptionRange(quest.rangeQuest, "optionsQuest", fahreja.time.totalSecond);
  quest.rangeQuest.value = quest.checkValueStorage;

  quest.rangeQuest.addEventListener("input", () => {
    const time = {
      hours: countDurationQuest(quest.rangeQuest.value).hours,
      minutes: countDurationQuest(quest.rangeQuest.value).minutes,
      seconds: countDurationQuest(quest.rangeQuest.value).seconds
    }

    quest.totalDurationQuest.innerHTML = `${time.hours}:${time.minutes}:${time.seconds}`;

    localStorage.setItem("totalDurationQuest", `${time.hours}:${time.minutes}:${time.seconds}`);
    localStorage.setItem("optionsQuest", quest.rangeQuest.value);
    fahreja.time.totalSecond = quest.rangeQuest.value;
  })

  if (localStorage.getItem("optionsQuest") === null) {
    quest.countTotalDuration =
      countDurationQuest(fahreja.time.totalSecond).hours + ":" +
      countDurationQuest(fahreja.time.totalSecond).minutes + ":" +
      countDurationQuest(fahreja.time.totalSecond).seconds;

    fahreja.time.totalSecond = fahreja.time.totalSecond;
  } else {
    quest.countTotalDuration = localStorage.getItem("optionsQuest");
    fahreja.time.totalSecond = localStorage.getItem("optionsQuest");
  }

  quest.totalDurationQuest.innerHTML = localStorage.getItem("totalDurationQuest") === null ? quest.countTotalDuration : localStorage.getItem("totalDurationQuest");
}

controlOptionQuest();

function runningRepeatAudio() {
  const running = {
    audio: document.getElementById("audio"),
    repeatPlay: document.querySelector(".button-repeat"),
    checkRepeatPlay: localStorage.audioRepeatPlay === undefined ? false : (localStorage.audioRepeatPlay === "true" ? true : false)
  }

  running.repeatPlay.checked = running.checkRepeatPlay;
  running.audio.loop = running.checkRepeatPlay;
}

runningRepeatAudio();

function audioRepeat() {
  const audioRepeat = {
    audio: document.getElementById("audio"),
    auto: document.querySelector(".button-repeat")
  }

  localStorage.audioRepeatPlay = audioRepeat.auto.checked;
  audioRepeat.audio.loop = audioRepeat.auto.checked;
}

function buttonPlayAudio() {
  const playAudio = {
    audio: document.getElementById("audio"),
    buttonPlay: document.querySelector(".button-play-option"),
    triangle: document.querySelector(".button-play-option > .triangle"),
    pause: document.querySelector(".button-play-option > .pause")
  }

  if (playAudio.buttonPlay.getAttribute("data-play") !== "true") {
    playAudio.buttonPlay.setAttribute("data-play", "true");
    playAudio.triangle.classList.add("hidden");
    playAudio.pause.classList.remove("hidden");
    playAudio.pause.classList.add("flex");
    playAudio.audio.play();

  } else {
    playAudio.buttonPlay.setAttribute("data-play", "false");
    playAudio.triangle.classList.remove("hidden");
    playAudio.pause.classList.add("hidden");
    playAudio.pause.classList.remove("flex");
    playAudio.audio.pause();
  }

}

function aboutGame() {
  const aboutGame = {
    containerAbout: document.querySelector(".container-about"),
    blackScreen: document.querySelector(".black-screen")
  }

  aboutGame.blackScreen.setAttribute("data", "about");
  aboutGame.blackScreen.classList.add("fixed", "animation-fadding-black-screen-in");
  aboutGame.blackScreen.classList.remove("hidden");
  sleep(450).then(() => {
    aboutGame.containerAbout.classList.add("flex", "animation-about-move-in");
    aboutGame.containerAbout.classList.remove("hidden");

    fahreja.typeIt
      .type(
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse volutpat vestibulum eros vitae malesuada. Pellentesque dui enim, suscipit non fermentum et, sodales a dui. Integer ultrices blandit lectus ac finibus. Curabitur vitae posuere ex. Phasellus mollis mattis ultricies. Suspendisse egestas dignissim tortor dignissim mattis. Sed a tempor leo. Cras gravida iaculis felis luctus ultricies. Suspendisse quis euismod urna. Quisque ornare finibus tellus eu convallis. Aenean sed pellentesque purus. Donec congue tortor rutrum, aliquet tellus aliquet, facilisis lectus. Maecenas scelerisque a nunc vel egestas. Morbi at arcu eros. Cras sit amet nisl mi.",
      )
      .go();
  });
}

function closeBlackScreen(containerAbout, blackScreen) {
  containerAbout.classList.add("animation-about-move-out");
  containerAbout.classList.remove("animation-about-move-in");
  sleep(390).then(() => {
    containerAbout.classList.remove("flex", "animation-about-move-out");
    containerAbout.classList.add("hidden");
    blackScreen.classList.remove("animation-fadding-black-screen-in");
    blackScreen.classList.add("animation-fadding-black-screen-out");
    sleep(390).then(() => {
      blackScreen.classList.remove(
        "fixed",
        "animation-fadding-black-screen-out",
      );
      blackScreen.classList.add("hidden");
    });
  });
}

function closeBlackScreenBack(container) {
  const screenBack = {
    blackScreen: document.querySelector(".black-screen")
  }

  container.forEach(value => {
    if (value.querySelector(".hidden") !== undefined) {
      document.querySelector(".back-about").addEventListener("click", () => {
        closeBlackScreen(value, screenBack.blackScreen);
      });

      document.querySelector(".back").addEventListener("click", () => {
        closeBlackScreen(value, screenBack.blackScreen);
      });
    }
  })
}

closeBlackScreenBack([
  document.querySelector(".container-options"),
  document.querySelector(".container-about")
]);

function closeScreen() {
  const closeScreen = {
    about: document.querySelector(".container-about"),
    options: document.querySelector(".container-options"),
    blackScreen: document.querySelector(".black-screen")
  }

  if (closeScreen.blackScreen.getAttribute("data") === "about") {
    closeBlackScreen(closeScreen.about, closeScreen.blackScreen);
  } else if (closeScreen.blackScreen.getAttribute("data") === "options") {
    closeBlackScreen(closeScreen.options, closeScreen.blackScreen);
  }
}

function checkAnswer(button) {
  if (button.value === fahreja.game[fahreja.currentQuestionIndex].correctAnswer) {
    fahreja.score += 1;
  }
  fahreja.currentQuestionIndex++;
  displayQuestion();
}

function displayQuestion(timers, intervalCountdown) {
  const question = {
    timers: timers !== undefined ? timers : fahreja.time.totalSecond,
    containerQuestion: document.querySelector(".question"),
    question: document.getElementById("question"),
    numberQuestion: document.querySelector(".number-question > p"),
    result: document.getElementById("result"),
    resultParagraph: document.createElement("p"),
    containerEndGame: document.querySelector(".container-end-game"),
    createEndGame: document.createElement("div"),
    repeatGame: document.createElement("button"),
    exitGame: document.createElement("button"),
    iconRepeatGame: document.createElement("i"),
    iconExitGame: document.createElement("i"),
    choice: document.getElementById("choices"),
    score: Math.trunc((100 / fahreja.game.length) * fahreja.score),
    star: document.createElement("div"),
    containerStar: document.querySelector(".container-star"),
    information: document.querySelector(".information")
  }

  if (fahreja.endGame === true) {
    clearInterval(intervalCountdown);
  }

  if (fahreja.currentQuestionIndex < fahreja.game.length && question.timers > 0) {
    question.numberQuestion.innerHTML =
      "No. " + (fahreja.currentQuestionIndex + 1);
    question.question.innerHTML =
      fahreja.game[fahreja.currentQuestionIndex].question;

    for (let i = 0; i < 4; i++) {
      const btn = document.getElementById("choice" + (i + 1));
      if (btn) {
        btn.innerHTML = fahreja.game[fahreja.currentQuestionIndex].choiceArray[i];
        btn.value = fahreja.game[fahreja.currentQuestionIndex].choiceArray[i];
      } else {
        console.warn(`Element #choice${i + 1} not found.`);
      }

    }
  } else {
    clearInterval(intervalCountdown);
    fahreja.endGame = true;
    question.result.innerHTML = "Score: ";
    question.resultParagraph.innerHTML = question.score;
    question.question.innerHTML = "Congrats!";
    question.question.classList.add("congrats");
    question.choice.innerHTML = "";

    question.result.appendChild(question.resultParagraph);
    question.containerQuestion.appendChild(question.star);
    question.information.classList.remove("flex");
    question.information.classList.add("hidden");
    question.star.classList.add("container-star");
    question.containerQuestion.appendChild(question.createEndGame);

    scoreGame(question.star, question.score, question.resultParagraph, question.containerStar);

    buttonEndGame(question.createEndGame, question.repeatGame, question.exitGame, question.iconRepeatGame, question.iconExitGame, question.containerEndGame);
  }
}

function buttonEndGame(container, repeat, exit, iconRepeat, iconExit, containerButton) {
  if (containerButton === null) {
    setAttributeGame({
      class: "container-end-game"
    }, container);

    container.appendChild(repeat);
    container.appendChild(exit);
    repeat.appendChild(iconRepeat);
    exit.appendChild(iconExit);
    repeat.insertAdjacentText("beforeend", " REPEAT");
    exit.insertAdjacentText("beforeend", " EXIT");

    setAttributeGame({
      class: "fa-solid fa-rotate-right"
    }, iconRepeat);

    setAttributeGame({
      class: "fa-solid fa-arrow-right-from-bracket"
    }, iconExit);

    setAttributeGame({
      class: "repeat-game",
      onclick: "repeatGame()"
    }, repeat);

    setAttributeGame({
      class: "exit-game",
      onclick: "exitGame()"
    }, exit);
  }
}

function scoreGame(star, score, color, checkStar) {
  checkStar = checkStar === null;
  if (score >= 70) {
    color.style.color = "lightgreen";
    checkStar ? ratingStar(star, 3) : "";
  } else if (score >= 40) {
    color.style.color = "yellow";
    checkStar ? ratingStar(star, 2) : "";
  } else {
    color.style.color = "red";
    checkStar ? ratingStar(star, 1) : "";
  }
}

function repeatGame() {
  fahreja.time.currentSecond = 0;
  fahreja.score = 0;
  fahreja.currentQuestionIndex = 0;
  fahreja.startGame = true;
  fahreja.repeatGame = true;

  const repeatGame = {
    repeat: document.querySelector(".container-question"),
    choices: document.getElementById("choices"),
    containerQuestion: document.querySelector(".question"),
    createQuestion: document.createElement("h2"),
    numberQuestion: document.querySelector(".number-question > p"),
    result: document.getElementById("result"),
    information: document.querySelector(".information"),
    remainingTime: document.querySelector(".remaining-time"),
    progressBar: document.querySelector(".progress-bar"),
  }

  repeatGame.repeat.classList.add("animation-about-move-out");
  repeatGame.repeat.classList.remove("animation-about-move-in");

  sleep(390).then(() => {
    repeatGame.repeat.classList.remove("flex", "animation-about-move-out", "display-question");
    repeatGame.repeat.classList.add("hidden");
    sleep(390).then(() => {
      repeatGame.repeat.classList.remove("hidden");
      repeatGame.repeat.classList.add("animation-display-question", "display-question");
      repeatGame.information.classList.remove("hidden");
      repeatGame.information.classList.add("flex");

      repeatGame.containerQuestion.innerHTML = "";
      repeatGame.result.innerHTML = "";
      repeatGame.choices.innerHTML = ""; // Bersihkan pilihan
      repeatGame.containerQuestion.innerHTML = ""; // Bersihkan pertanyaan

      repeatGame.containerQuestion.appendChild(repeatGame.createQuestion);
      setAttributeGame({
        id: "question"
      }, repeatGame.createQuestion);

      repeatGame.createQuestion.innerHTML = fahreja.game[fahreja.currentQuestionIndex].question;

      for (let i = 0; i < 4; i++) {
        const btn = document.getElementById("choice" + (i + 1));
        const createChoice = document.createElement("button");

        if (repeatGame.choices.querySelector("#choice4") === null) {
          repeatGame.choices.appendChild(createChoice);
          setAttributeGame({
            id: `choice${i + 1}`,
            onclick: "checkAnswer(this)",
            value: fahreja.game[fahreja.currentQuestionIndex].choiceArray[i]
          }, createChoice);
          createChoice.innerHTML = fahreja.game[fahreja.currentQuestionIndex].choiceArray[i];
          repeatGame.numberQuestion.innerHTML = "No. " + (fahreja.currentQuestionIndex + 1);
        } else {
          btn.innerHTML = fahreja.game[fahreja.currentQuestionIndex].choiceArray[i];
          btn.value = fahreja.game[fahreja.currentQuestionIndex].choiceArray[i];
        }
      }

      const intervalCoundown = countdown((value) => {
        const { percentage, current, hour, minute, second } = value;
        fahreja.time.currentSecond = current;
        repeatGame.remainingTime.innerHTML = `${hour}:${minute}:${second}`;
        repeatGame.progressBar.style.width = `${percentage}%`;

        if (fahreja.currentQuestionIndex < fahreja.game.length && fahreja.time.currentSecond > 0) {
          displayQuestion(fahreja.time.currentSecond)

          if (percentage >= 60) {
            repeatGame.progressBar.style.backgroundColor = "lightgreen";
          } else if (percentage >= 30) {
            repeatGame.progressBar.style.backgroundColor = "yellow";
          } else {
            repeatGame.progressBar.style.backgroundColor = "red";
          }

          if (fahreja.time.currentSecond <= 0) {
            fahreja.repeatGame = false;
            clearInterval(intervalCoundown);
          }
        } else {
          fahreja.repeatGame = false;
          displayQuestion(fahreja.time.currentSecond);
          clearInterval(intervalCoundown);
        }
      })

      sleep(1100).then(() => {
        repeatGame.repeat.classList.remove("animation-display-question");
      })
    })
  })
}

function exitGame() {
  fahreja.endGame = false;
  fahreja.currentQuestionIndex = 0;
  fahreja.score = 0;

  const exitGame = {
    exit: document.querySelector(".container-question"),
    blackScreen: document.querySelector(".black-screen"),
    containerMenu: document.querySelector(".container-menu"),
    buttonChoice: document.querySelector("#choices > button"),
    choices: document.getElementById("choices"),
    containerQuestion: document.querySelector(".question"),
    createQuestion: document.createElement("h2"),
    numberQuestion: document.querySelector(".number-question > p"),
    result: document.getElementById("result"),
  }

  exitGame.exit.classList.add("animation-about-move-out");
  exitGame.exit.classList.remove("animation-about-move-in");
  sleep(390).then(() => {
    exitGame.exit.classList.remove("flex", "animation-about-move-out", "display-question");
    exitGame.exit.classList.add("hidden");
    exitGame.blackScreen.classList.remove("animation-fadding-black-screen-in");
    exitGame.blackScreen.classList.add("animation-fadding-black-screen-out");
    sleep(390).then(() => {
      exitGame.blackScreen.classList.remove(
        "fixed",
        "animation-fadding-black-screen-out",
      );
      exitGame.containerMenu.classList.remove("hidden");
      exitGame.containerMenu.classList.add("flex");
      exitGame.blackScreen.classList.add("hidden");
      exitGame.containerMenu.classList.add("animation-display-question");
      sleep(1100).then(() => {
        exitGame.containerMenu.classList.remove("animation-display-question", "hidden");

        exitGame.containerQuestion.innerHTML = "";
        exitGame.result.innerHTML = "";

        exitGame.containerQuestion.appendChild(exitGame.createQuestion);
        setAttributeGame({
          id: "question"
        }, exitGame.createQuestion);

        exitGame.createQuestion.innerHTML = fahreja.game[fahreja.currentQuestionIndex].question;

        for (let i = 0; i < 4; i++) {
          const btn = document.getElementById("choice" + (i + 1));
          const createChoice = document.createElement("button");

          if (exitGame.buttonChoice === null) {
            exitGame.choices.appendChild(createChoice);
            setAttributeGame({
              id: `choice${i + 1}`,
              onclick: "checkAnswer(this)",
              value: fahreja.game[fahreja.currentQuestionIndex].choiceArray[i]
            }, createChoice);
            createChoice.innerHTML = fahreja.game[fahreja.currentQuestionIndex].choiceArray[i];
            exitGame.numberQuestion.innerHTML = "No. " + (fahreja.currentQuestionIndex + 1);
          } else {
            btn.innerHTML = fahreja.game[fahreja.currentQuestionIndex].choiceArray[i];
            btn.value = fahreja.game[fahreja.currentQuestionIndex].choiceArray[i];
          }
        }
      })
    });
  });
}

function setAttributeGame(attribute, element) {
  Object.entries(attribute).forEach(([key, value]) => {
    element.setAttribute(key, value);
  })
}

function ratingStar(star, total) {
  const attribute = {
    class: "fa-solid fa-star",
    style: "color: yellow"
  };

  for (let i = 1; i <= 3; i++) {
    const childStar = document.createElement("i");
    Object.entries(attribute).forEach(([key, value]) => {
      star.appendChild(childStar);
      childStar.setAttribute(key, value);

      if (i <= total) {
        star.appendChild(childStar);
        childStar.setAttribute(key, value);
      } else {
        star.appendChild(childStar);
        childStar.setAttribute("class", "fa-solid fa-star");
        childStar.setAttribute("style", "color: silver");
      }
    })
  }

}

function openingWeather() {
  const weather = {
    cloud: document.querySelector(".container-weather"),
  }
  sleep(1150).then(() => {
    weather.cloud.classList.remove("hidden");
    weather.cloud.classList.add("fadding-weather");
    sleep(490).then(() => {
      weather.cloud.classList.remove("fadding-weather");
    })
  })
}

function openingAnimationMenu() {
  const menu = {
    start: document.querySelector(".start"),
    options: document.querySelector(".options"),
    about: document.querySelector(".about")
  }
  sleep(500).then(() => {

    menu.about.classList.remove("hidden");
    menu.about.classList.add("opening-about");
    sleep(190).then(() => {
      menu.about.classList.remove("opening-about");

      menu.options.classList.remove("hidden");
      menu.options.classList.add("opening-options");
      sleep(190).then(() => {
        menu.options.classList.remove("opening-options");

        menu.start.classList.remove("hidden");
        menu.start.classList.add("opening-start");
        sleep(190).then(() => {
          menu.start.classList.remove("opening-start");
        })
      })
    })
  })
}

function openingAnimationMount() {
  const mount = {
    small: document.querySelector(".mount-small"),
    medium: document.querySelector(".mount-medium")
  }

  mount.small.classList.remove("hidden");
  mount.small.classList.add("opening-mount-small");

  sleep(260).then(() => {
    mount.small.classList.remove("opening-mount-small");
    mount.small.classList.add("running-mount-small");

    mount.medium.classList.remove("hidden");
    mount.medium.classList.add("opening-mount-medium");
    sleep(260).then(() => {
      mount.medium.classList.remove("opening-mount-medium");
      mount.medium.classList.add("running-mount-medium");
    })
  })
}

function loadAsset() {
  const asset = {
    component: document.querySelectorAll(".component"),
    totalComponent: document.querySelectorAll(".component").length,
    audio: document.getElementById("audio"),
    trackAudio: document.getElementById("trackAudio"),
    loaded: 0
  }

  asset.component.forEach((loadComponent, index) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', loadComponent.getAttribute("data-load"));
    xhr.responseType = "blob";

    xhr.onload = () => {
      if (xhr.status === 200) {
        const url = URL.createObjectURL(xhr.response);
        const url2 = loadComponent.getAttribute("data-load");

        if (loadComponent.alt !== undefined) {
          loadComponent.src = url
        } else if (loadComponent.id === "audio") {
          loadComponent.src = url
        } else {
          updateImageCss(loadComponent, url2);
        }

        loadComponent.removeAttribute("data-load");
        asset.loaded++;
        updateLoading(asset.loaded, asset.totalComponent)
      }
    }

    xhr.onerror = () => {
      console.error(`Failed to load image ${index + 1}: ${loadComponent}`);
    };

    xhr.send();
  })
}

loadAsset()

function updateLoading(loaded, total) {
  const update = {
    percentage: (loaded / total) * 100,
    barLoading: document.querySelector(".loading > .bar"),
    textPercentage: document.querySelector(".loading > .bar > a")
  }

  update.textPercentage.innerHTML = `${Math.round(update.percentage)}%`
  update.barLoading.style.width = `${Math.round(update.percentage)}%`;

  if (loaded === total) {
    completedLoading()
  }
}

function updateImageCss(component, url) {
  component.style.background = `url("${url}")`;
}

function completedLoading() {
  const complete = {
    loadingScreen: document.querySelector(".loading-screen"),
    containerLoading: document.querySelector(".container-loading")
  }

  complete.containerLoading.remove();
  complete.loadingScreen.classList.add("close-loading-screen");
  sleep(390).then(() => {
    complete.loadingScreen.remove();
    openingAnimationMenu();
    openingAnimationMount();
    openingWeather();
    displayQuestion();
  })


}


