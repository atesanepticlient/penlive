// import { createCard } from "./createCard.js";

// /**
//  * Card Memory Game by Francisco Pereira (Gammafp)
//  * -----------------------------------------------
//  *
//  * Test your memory skills in this classic game of matching pairs.
//  * Flip over cards to reveal pictures, and try to remember where each image is located.
//  * Match all the pairs to win!
//  *
//  * Music credits:
//  * "Fat Caps" by Audionautix is licensed under the Creative Commons Attribution 4.0 license. https://creativecommons.org/licenses/by/4.0/
//  * Artist http://audionautix.com/
//  */
// export class Play extends Phaser.Scene
// {
//     // All cards names
//     cardNames = ["card-0", "card-1", "card-2", "card-3", "card-4", "card-5"];
//     // Cards Game Objects
//     cards = [];

//     // History of card opened
//     cardOpened = undefined;

//     // Can play the game
//     canMove = false;

//     // Game variables
//     lives = 0;

//     // Grid configuration
//     gridConfiguration = {
//         x: 113,
//         y: 102,
//         paddingX: 10,
//         paddingY: 10
//     }

//     constructor ()
//     {
//         super({
//             key: 'Play'
//         });
//     }

//     init ()
//     {
//         // Fadein camera
//         this.cameras.main.fadeIn(500);
//         this.lives = 10;
//         this.volumeButton();
//     }

//     create ()
//     {
//         // Background image
//         this.add.image(this.gridConfiguration.x - 63, this.gridConfiguration.y - 77, "background").setOrigin(0);

//         const titleText = this.add.text(this.sys.game.scale.width / 2, this.sys.game.scale.height / 2,
//             "Memory Card Game\nClick to Play",
//             { align: "center", strokeThickness: 4, fontSize: 40, fontStyle: "bold", color: "#8c7ae6" }
//         )
//             .setOrigin(.5)
//             .setDepth(3)
//             .setInteractive();
//         // title tween like retro arcade
//         this.add.tween({
//             targets: titleText,
//             duration: 800,
//             ease: (value) => (value > .8),
//             alpha: 0,
//             repeat: -1,
//             yoyo: true,
//         });

//         // Text Events
//         titleText.on(Phaser.Input.Events.POINTER_OVER, () => {
//             titleText.setColor("#9c88ff");
//             this.input.setDefaultCursor("pointer");
//         });
//         titleText.on(Phaser.Input.Events.POINTER_OUT, () => {
//             titleText.setColor("#8c7ae6");
//             this.input.setDefaultCursor("default");
//         });
//         titleText.on(Phaser.Input.Events.POINTER_DOWN, () => {
//             this.sound.play("whoosh", { volume: 1.3 });
//             this.add.tween({
//                 targets: titleText,
//                 ease: Phaser.Math.Easing.Bounce.InOut,
//                 y: -1000,
//                 onComplete: () => {
//                     if (!this.sound.get("theme-song")) {
//                         this.sound.play("theme-song", { loop: true, volume: .5 });
//                     }
//                     this.startGame();
//                 }
//             })
//         });
//     }

//     restartGame ()
//     {
//         this.cardOpened = undefined;
//         this.cameras.main.fadeOut(200 * this.cards.length);
//         this.cards.reverse().map((card, index) => {
//             this.add.tween({
//                 targets: card.gameObject,
//                 duration: 500,
//                 y: 1000,
//                 delay: index * 100,
//                 onComplete: () => {
//                     card.gameObject.destroy();
//                 }
//             })
//         });

//         this.time.addEvent({
//             delay: 200 * this.cards.length,
//             callback: () => {
//                 this.cards = [];
//                 this.canMove = false;
//                 this.scene.restart();
//                 this.sound.play("card-slide", { volume: 1.2 });
//             }
//         })
//     }

//     createGridCards ()
//     {
//         // Phaser random array position
//         const gridCardNames = Phaser.Utils.Array.Shuffle([...this.cardNames, ...this.cardNames]);

//         return gridCardNames.map((name, index) => {
//             const newCard = createCard({
//                 scene: this,
//                 x: this.gridConfiguration.x + (98 + this.gridConfiguration.paddingX) * (index % 4),
//                 y: -1000,
//                 frontTexture: name,
//                 cardName: name
//             });
//             this.add.tween({
//                 targets: newCard.gameObject,
//                 duration: 800,
//                 delay: index * 100,
//                 onStart: () => this.sound.play("card-slide", { volume: 1.2 }),
//                 y: this.gridConfiguration.y + (128 + this.gridConfiguration.paddingY) * Math.floor(index / 4)
//             })
//             return newCard;
//         });
//     }

//     createHearts ()
//     {
//         return Array.from(new Array(this.lives)).map((el, index) => {
//             const heart = this.add.image(this.sys.game.scale.width + 1000, 20, "heart")
//                 .setScale(2)

//             this.add.tween({
//                 targets: heart,
//                 ease: Phaser.Math.Easing.Expo.InOut,
//                 duration: 1000,
//                 delay: 1000 + index * 200,
//                 x: 140 + 30 * index // marginLeft + spaceBetween * index
//             });
//             return heart;
//         });
//     }

//     volumeButton ()
//     {
//         const volumeIcon = this.add.image(25, 25, "volume-icon").setName("volume-icon");
//         volumeIcon.setInteractive();

//         // Mouse enter
//         volumeIcon.on(Phaser.Input.Events.POINTER_OVER, () => {
//             this.input.setDefaultCursor("pointer");
//         });
//         // Mouse leave
//         volumeIcon.on(Phaser.Input.Events.POINTER_OUT, () => {
//             console.log("Mouse leave");
//             this.input.setDefaultCursor("default");
//         });

//         volumeIcon.on(Phaser.Input.Events.POINTER_DOWN, () => {
//             if (this.sound.volume === 0) {
//                 this.sound.setVolume(1);
//                 volumeIcon.setTexture("volume-icon");
//                 volumeIcon.setAlpha(1);
//             } else {
//                 this.sound.setVolume(0);
//                 volumeIcon.setTexture("volume-icon_off");
//                 volumeIcon.setAlpha(.5)
//             }
//         });
//     }

//     startGame ()
//     {

//         // WinnerText and GameOverText
//         const winnerText = this.add.text(this.sys.game.scale.width / 2, -1000, "YOU WIN",
//             { align: "center", strokeThickness: 4, fontSize: 40, fontStyle: "bold", color: "#8c7ae6" }
//         ).setOrigin(.5)
//             .setDepth(3)
//             .setInteractive();

//         const gameOverText = this.add.text(this.sys.game.scale.width / 2, -1000,
//             "GAME OVER\nClick to restart",
//             { align: "center", strokeThickness: 4, fontSize: 40, fontStyle: "bold", color: "#ff0000" }
//         )
//             .setName("gameOverText")
//             .setDepth(3)
//             .setOrigin(.5)
//             .setInteractive();

//         // Start lifes images
//         const hearts = this.createHearts();

//         // Create a grid of cards
//         this.cards = this.createGridCards();

//         // Start canMove
//         this.time.addEvent({
//             delay: 200 * this.cards.length,
//             callback: () => {
//                 this.canMove = true;
//             }
//         });

//         // Game Logic
//         this.input.on(Phaser.Input.Events.POINTER_MOVE, (pointer) => {
//             if (this.canMove) {
//                 const card = this.cards.find(card => card.gameObject.hasFaceAt(pointer.x, pointer.y));
//                 if (card) {
//                     this.input.setDefaultCursor("pointer");
//                 } else {
//                     if(go[0]) {
//                         if(go[0].name !== "volume-icon") {
//                             this.input.setDefaultCursor("pointer");
//                         }
//                     } else {
//                         this.input.setDefaultCursor("default");
//                     }
//                 }
//             }
//         });
//         this.input.on(Phaser.Input.Events.POINTER_DOWN, (pointer) => {
//             if (this.canMove && this.cards.length) {
//                 const card = this.cards.find(card => card.gameObject.hasFaceAt(pointer.x, pointer.y));

//                 if (card) {
//                     this.canMove = false;

//                     // Detect if there is a card opened
//                     if (this.cardOpened !== undefined) {
//                         // If the card is the same that the opened not do anything
//                         if (this.cardOpened.gameObject.x === card.gameObject.x && this.cardOpened.gameObject.y === card.gameObject.y) {
//                             this.canMove = true;
//                             return false;
//                         }

//                         card.flip(() => {
//                             if (this.cardOpened.cardName === card.cardName) {
//                                 // ------- Match -------
//                                 this.sound.play("card-match");
//                                 // Destroy card selected and card opened from history
//                                 this.cardOpened.destroy();
//                                 card.destroy();

//                                 // remove card destroyed from array
//                                 this.cards = this.cards.filter(cardLocal => cardLocal.cardName !== card.cardName);
//                                 // reset history card opened
//                                 this.cardOpened = undefined;
//                                 this.canMove = true;

//                             } else {
//                                 // ------- No match -------
//                                 this.sound.play("card-mismatch");
//                                 this.cameras.main.shake(600, 0.01);
//                                 // remove life and heart
//                                 const lastHeart = hearts[hearts.length - 1];
//                                 this.add.tween({
//                                     targets: lastHeart,
//                                     ease: Phaser.Math.Easing.Expo.InOut,
//                                     duration: 1000,
//                                     y: - 1000,
//                                     onComplete: () => {
//                                         lastHeart.destroy();
//                                         hearts.pop();
//                                     }
//                                 });
//                                 this.lives -= 1;
//                                 // Flip last card selected and flip the card opened from history and reset history
//                                 card.flip();
//                                 this.cardOpened.flip(() => {
//                                     this.cardOpened = undefined;
//                                     this.canMove = true;

//                                 });
//                             }

//                             // Check if the game is over
//                             if (this.lives === 0) {
//                                 // Show Game Over text
//                                 this.sound.play("whoosh", { volume: 1.3 });
//                                 this.add.tween({
//                                     targets: gameOverText,
//                                     ease: Phaser.Math.Easing.Bounce.Out,
//                                     y: this.sys.game.scale.height / 2,
//                                 });

//                                 this.canMove = false;
//                             }

//                             // Check if the game is won
//                             if (this.cards.length === 0) {
//                                 this.sound.play("whoosh", { volume: 1.3 });
//                                 this.sound.play("victory");

//                                 this.add.tween({
//                                     targets: winnerText,
//                                     ease: Phaser.Math.Easing.Bounce.Out,
//                                     y: this.sys.game.scale.height / 2,
//                                 });
//                                 this.canMove = false;
//                             }
//                         });

//                     } else if (this.cardOpened === undefined && this.lives > 0 && this.cards.length > 0) {
//                         // If there is not a card opened save the card selected
//                         card.flip(() => {
//                             this.canMove = true;
//                         });
//                         this.cardOpened = card;
//                     }
//                 }
//             }

//         });

//         // Text events
//         winnerText.on(Phaser.Input.Events.POINTER_OVER, () => {
//             winnerText.setColor("#FF7F50");
//             this.input.setDefaultCursor("pointer");
//         });
//         winnerText.on(Phaser.Input.Events.POINTER_OUT, () => {
//             winnerText.setColor("#8c7ae6");
//             this.input.setDefaultCursor("default");
//         });
//         winnerText.on(Phaser.Input.Events.POINTER_DOWN, () => {
//             this.sound.play("whoosh", { volume: 1.3 });
//             this.add.tween({
//                 targets: winnerText,
//                 ease: Phaser.Math.Easing.Bounce.InOut,
//                 y: -1000,
//                 onComplete: () => {
//                     this.restartGame();
//                 }
//             })
//         });

//         gameOverText.on(Phaser.Input.Events.POINTER_OVER, () => {
//             gameOverText.setColor("#FF7F50");
//             this.input.setDefaultCursor("pointer");
//         });

//         gameOverText.on(Phaser.Input.Events.POINTER_OUT, () => {
//             gameOverText.setColor("#8c7ae6");
//             this.input.setDefaultCursor("default");
//         });

//         gameOverText.on(Phaser.Input.Events.POINTER_DOWN, () => {
//             this.add.tween({
//                 targets: gameOverText,
//                 ease: Phaser.Math.Easing.Bounce.InOut,
//                 y: -1000,
//                 onComplete: () => {
//                     this.restartGame();
//                 }
//             })
//         });
//     }

// }

// /**
//  * Create a card game object
//  */
// export const createCard = ({
//     scene,
//     x,
//     y,
//     frontTexture,
//     cardName
// }) => {

//     let isFlipping = false;
//     const rotation = { y: 0 };

//     const backTexture = "card-back";

//     const card = scene.add.plane(x, y, backTexture)
//         .setName(cardName)
//         .setInteractive();

//     // start with the card face down
//     card.modelRotationY = 180;

//     const flipCard = (callbackComplete) => {
//         if (isFlipping) {
//             return;
//         }
//         scene.add.tween({
//             targets: [rotation],
//             y: (rotation.y === 180) ? 0 : 180,
//             ease: Phaser.Math.Easing.Expo.Out,
//             duration: 500,
//             onStart: () => {
//                 isFlipping = true;
//                 scene.sound.play("card-flip");
//                 scene.tweens.chain({
//                     targets: card,
//                     ease: Phaser.Math.Easing.Expo.InOut,
//                     tweens: [
//                         {
//                             duration: 200,
//                             scale: 1.1,
//                         },
//                         {
//                             duration: 300,
//                             scale: 1
//                         },
//                     ]
//                 })
//             },
//             onUpdate: () => {
//                 // card.modelRotation.y = Phaser.Math.DegToRad(180) + Phaser.Math.DegToRad(rotation.y);
//                 card.rotateY = 180 + rotation.y;
//                 const cardRotation = Math.floor(card.rotateY) % 360;
//                 if ((cardRotation >= 0 && cardRotation <= 90) || (cardRotation >= 270 && cardRotation <= 359)) {
//                     card.setTexture(frontTexture);
//                 }
//                 else {
//                     card.setTexture(backTexture);
//                 }
//             },
//             onComplete: () => {
//                 isFlipping = false;
//                 if (callbackComplete) {
//                     callbackComplete();
//                 }
//             }
//         });
//     }

//     const destroy = () => {
//         scene.add.tween({
//             targets: [card],
//             y: card.y - 1000,
//             easing: Phaser.Math.Easing.Elastic.In,
//             duration: 500,
//             onComplete: () => {
//                 card.destroy();
//             }
//         })
//     }

//     return {
//         gameObject: card,
//         flip: flipCard,
//         destroy,
//         cardName
//     }
// }

// export class Preloader extends Phaser.Scene
// {
//     constructor()
//     {
//         super({
//             key: 'Preloader'
//         });
//     }

//     preload ()
//     {
//         this.load.setBaseURL('https://cdn.phaserfiles.com/v385');
//         this.load.setPath("assets/games/card-memory-game/");

//         this.load.image("volume-icon", "ui/volume-icon.png");
//         this.load.image("volume-icon_off", "ui/volume-icon_off.png");

//         this.load.audio("theme-song", "audio/fat-caps-audionatix.mp3");
//         this.load.audio("whoosh", "audio/whoosh.mp3");
//         this.load.audio("card-flip", "audio/card-flip.mp3");
//         this.load.audio("card-match", "audio/card-match.mp3");
//         this.load.audio("card-mismatch", "audio/card-mismatch.mp3");
//         this.load.audio("card-slide", "audio/card-slide.mp3");
//         this.load.audio("victory", "audio/victory.mp3");
//         this.load.image("background");
//         this.load.image("card-back", "cards/card-back.png");
//         this.load.image("card-0", "cards/card-0.png");
//         this.load.image("card-1", "cards/card-1.png");
//         this.load.image("card-2", "cards/card-2.png");
//         this.load.image("card-3", "cards/card-3.png");
//         this.load.image("card-4", "cards/card-4.png");
//         this.load.image("card-5", "cards/card-5.png");

//         this.load.image("heart", "ui/heart.png");

//     }

//     create ()
//     {
//         this.scene.start("Play");
//     }
// }

// import { Preloader } from './Preloader.js';
// import { Play } from './Play.js';

// const config = {
//     title: 'Card Memory Game',
//     type: Phaser.AUTO,
//     backgroundColor: "#192a56",
//     width: 549,
//     height: 480,
//     parent: "phaser-example",
//     render: {
//         pixelArt: true,
//     },
//     scene: [
//         Preloader,
//         Play
//     ]
// };

// new Phaser.Game(config);

// const openGame = () => {
//   const gpID = 1020;
//   const gameID = 1;
//   let reqdata = {
//     Username: "2415340975",
//     Portfolio: "SeamlessGame",
//     IsWapSports: false,
//     CompanyKey: "F4D8A3106EA44C5D969D0AAE0B472762",
//     ServerId: "mbuzz881234",
//   };

//   let options = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "application/json",
//     },
//     body: JSON.stringify(reqdata),
//   };
//   fetch(
//     "https://ex-api-demo-yy.568win.com/web-root/restricted/player/login.aspx",
//     options
//   )
//     .then((response) => response.json())
//     .then(async (data) => {
//       console.log({ data });
//       // Handle the response data here
//       if (data?.error?.msg !== "No Error") {
//         console.log("Error : ", data.error.msg);
//         return;
//       }

//       let url = `https:${data.url}&gpid=${gpID}&gameid=${gameID}&device=d`;
//       console.log(url);
//     });
// };

// import axios from "axios";
// import FormData from "form-data";

// const username = "BOGBDT_GS";
// const apiUrl = "https://liveapi.fpay.support/merchant/";
// const api_key = "QdCYKJHdtXqqb2qdjfYc";
// const getCurrency = async () => {
//   const form = new FormData();
//   form.append("username", username);

//   axios
//     .post(apiUrl + "currency", form, {
//       headers: {
//         ...form.getHeaders(),
//       },
//       timeout: 400000, // 400 seconds (same as PHP timeout)
//     })
//     .then((response) => {
//       console.log(response.data);
//     })
//     .catch((error) => {
//       console.error("Error:", error.message);
//     });
// };

// const createAuth = async () => {
//   const form = new FormData();
//   form.append("username", username);
//   form.append("api_key", api_key);

//   const response = await axios.post(apiUrl + "auth", form, {
//     headers: {
//       ...form.getHeaders(),
//     },
//     timeout: 400000, // 400 seconds = same as PHP timeout
//   });
//   return response.data;
// };

// const getBankList = async () => {
//   const currency = "BDT";

//   // Prepare multipart form data
//   const form = new FormData();
//   form.append("username", username);
//   form.append("currency", currency);

//   axios
//     .post(`https://liveapi.fpay.support/wallet/withdraw_bank_list`, form, {
//       headers: {
//         ...form.getHeaders(),
//       },
//       timeout: 400000, // 400 seconds = same as PHP timeout
//     })
//     .then((response) => {
//       console.log("✅ Response:");
//       console.log(response.data);
//     })
//     .catch((error) => {
//       console.error("❌ Error:", error.message);
//     });
// };
// const withdraw = async () => {
//   const { auth, order_id } = await createAuth();
//   const amount =500; // Price amount
//   const currency = "BDT"; // Currency code
//   const orderid = order_id; // Merchant withdraw order ID
//   const bank_id = "800"; // Get from withdraw bank list API
//   const holder_name = "John Doe"; // Receiver holder name
//   const account_no = "01735156550"; // Receiver Bank Account no

//   // Prepare form data (multipart/form-data)
//   const form = new FormData();
//   form.append("auth", auth);
//   form.append("amount", amount);
//   form.append("currency", currency);
//   form.append("orderid", orderid);
//   form.append("bank_id", bank_id);
//   form.append("holder_name", holder_name);
//   form.append("account_no", account_no);

//   axios
//     .post(apiUrl + "withdraw_orders", form, {
//       headers: {
//         ...form.getHeaders(),
//       },
//       timeout: 400000, // 400 seconds
//     })
//     .then((response) => {
//       console.log("✅ Response:");
//       console.log(response.data);
//     })
//     .catch((error) => {
//       console.error("❌ Error:", error.message);
//     });
// };

// const deposit = async () => {
//   const { auth, order_id } = await createAuth();
//   // Merchant and transaction details
//   const username = "john"; // Customer Username
//   const amount = 25000; // Price amount
//   const currency = "BDT"; // Currency code
//   const orderid = order_id; // Merchant order ID
//   const redirect_url = "https://www.google.com"; // Optional redirect URL
//   const bank_code = "800"; // Optional: for ONLINE BANKING service
//   const customer_bank_holder_name = "John Doe"; // Optional: for ONLINE BANKING service

//   // Prepare multipart form data
//   const form = new FormData();
//   form.append("username", username);
//   form.append("auth", auth);
//   form.append("amount", amount);
//   form.append("currency", currency);
//   form.append("orderid", orderid);
//   form.append("redirect_url", redirect_url);
//   form.append("bank_code", bank_code);
//   form.append("customer_bank_holder_name", customer_bank_holder_name);

//   // Send request
//   axios
//     .post(apiUrl + "generate_orders", form, {
//       headers: {
//         ...form.getHeaders(),
//       },
//       timeout: 400000, // 400 seconds (matches PHP timeout)
//     })
//     .then((response) => {
//       console.log("✅ Response:");
//       console.log(response.data);
//     })
//     .catch((error) => {
//       if (error.response) {
//         console.error("❌ Error response from server:", error.response.data);
//       } else {
//         console.error("❌ Error:", error.message);
//       }
//     });
// };
// withdraw()
// // deposit()

import { db } from "./src/lib/db.js";
const seedRewards = async () => {
  await db.invitationRewareds.createMany({
    data: [
      {
        prize: 30,
        rewardImg:
          "https://res.cloudinary.com/dxs9u7pqc/image/upload/v1746607129/mbuzz88/kdi4ajsyggxdjl8xvyy5.png",
        targetReferral: 3,
      },
      {
        prize: 40,
        rewardImg:
          "https://res.cloudinary.com/dxs9u7pqc/image/upload/v1746607134/mbuzz88/ittgozvoezof3cqbprik.png",
        targetReferral: 7,
      },
      {
        prize: 50,
        rewardImg:
          "https://res.cloudinary.com/dxs9u7pqc/image/upload/v1746607130/mbuzz88/dx7stvyko3gvwvrwgxwx.png",
        targetReferral: 12,
      },
      {
        prize: 100,
        rewardImg:
          "https://res.cloudinary.com/dxs9u7pqc/image/upload/v1746607131/mbuzz88/mqo9muoc3pevb6kff8jb.png",
        targetReferral: 20,
      },
      {
        prize: 300,
        rewardImg:
          "https://res.cloudinary.com/dxs9u7pqc/image/upload/v1746607130/mbuzz88/xrqqj8zdn7dtdwcsn4wd.png",
        targetReferral: 50,
      },
      {
        prize: 500,
        rewardImg:
          "https://res.cloudinary.com/dxs9u7pqc/image/upload/v1746607130/mbuzz88/tf8sa8jbruzzckjljcjg.png",
        targetReferral: 100,
      },
      {
        prize: 1000,
        rewardImg:
          "https://res.cloudinary.com/dxs9u7pqc/image/upload/v1746607129/mbuzz88/t8asb1uve3yfhqbuozqt.png",
        targetReferral: 200,
      },
      {
        prize: 3000,
        rewardImg:
          "https://res.cloudinary.com/dxs9u7pqc/image/upload/v1750249497/level-08.a59c1688_vvzuhh.png",
        targetReferral: 500,
      },
    ],
  });
  console.log("Created");
};

// seedRewards();

const seedSigninReward = async () => {
  await db.signinBonusRewards.createMany({
    data: [
      {
        day: "1",
        deposit: 100,
        cash: 5,
      },
      {
        day: "2",
        betting: 1000,
        cash: 10,
      },
      {
        day: "3",
        deposit: 200,
        cash: 15,
      },
      {
        day: "4",
        betting: 1500,
        cash: 20,
      },
      {
        day: "5",
        deposit: 300,
        cash: 25,
      },
      {
        day: "6",
        betting: 2000,
        cash: 30,
      },
      {
        day: "7",
        deposit: 500,
        cash: 40,
      },
      {
        day: "8",
        betting: 3000,
        cash: 45,
      },
      {
        day: "9",
        deposit: 1000,
        cash: 80,
      },
      {
        day: "10",
        betting: 5000,
        cash: 120,
      },
      {
        day: "11",
        deposit: 1500,
        cash: 150,
      },
      {
        day: "12",
        betting: 7000,
        cash: 200,
      },
      {
        day: "13",
        deposit: 2000,
        cash: 2020,
      },
      {
        day: "14",
        deposit: 1000,
        betting: 8000,
        cash: 220,
        beg: true,
      },
      {
        day: "15",
        deposit: 3000,
        betting: 8000,
        cash: 300,
        eggHunt: true,
      },
    ],
  });
  console.log("Created sigin reward");
};

// seedSigninReward();

const seedAidropEvent = async () => {
  await db.airDropEvent.create({
    data: {
      prize: 555,
      name: "FIRST_JOIN",
    },
  });
};

// seedAidropEvent();

const seedDepositTickets = async () => {
  await db.depositTicket.createMany({
    data: [
      {
        price: 10000,
        expire: new Date(Date.now() + 24 * 60 * 60 * 1000),
        userId: "cmn62gox50000mp5hm04le0e9",
      },
      {
        price: 100,
        expire: new Date(Date.now() + 24 * 60 * 60 * 1000),
        userId: "cmn62gox50000mp5hm04le0e9",
      },
      {
        price: 100,
        expire: new Date(Date.now() + 24 * 60 * 60 * 1000),
        userId: "cmn62gox50000mp5hm04le0e9",
      },
      {
        price: 100,
        expire: new Date(Date.now() + 24 * 60 * 60 * 1000),
        userId: "cmn62gox50000mp5hm04le0e9",
      },
      {
        price: 250,
        expire: new Date(Date.now() + 24 * 60 * 60 * 1000),
        userId: "cmn62gox50000mp5hm04le0e9",
      },
    ],
  });
};
// seedDepositTickets();

const seedRewardEventExpiry = async () => {
  // await db.rewardEventExpiry.create({
  //   data: {
  //     spin: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
  //   },
  // });

  await db.rewardEventExpiry.update({
    where: {
      id: "cmnyh2zna0000mpmdykgwozxw",
    },
    data: {
      eggHunt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      envelop: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    },
  });
};
// seedRewardEventExpiry();

const seedRewardEvent = async () => {
  await db.rewardEvent.createMany({
    data: [
      {
        account: 100,
        ticketType: "DEPOSIT",
        name: "EGGHUNT",
        usersData: [],
      },
      {
        account: 500,
        ticketType: "BET",
        name: "EGGHUNT",
        usersData: [],
      },
      {
        account: 1000,
        ticketType: "BET",
        name: "EGGHUNT",
        usersData: [],
      },
      {
        account: 1500,
        ticketType: "BET",
        name: "EGGHUNT",
        usersData: [],
      },
      {
        account: 2000,
        ticketType: "BET",
        name: "EGGHUNT",
        usersData: [],
      },
      {
        account: 3000,
        ticketType: "BET",
        name: "EGGHUNT",
        usersData: [],
      },
      {
        account: 5000,
        ticketType: "BET",
        name: "EGGHUNT",
        usersData: [],
      },
      {
        account: 7000,
        ticketType: "BET",
        name: "EGGHUNT",
        usersData: [],
      },
      {
        account: 10000,
        ticketType: "BET",
        name: "EGGHUNT",
        usersData: [],
      },
      {
        account: 15000,
        ticketType: "BET",
        name: "EGGHUNT",
        usersData: [],
      },
      {
        account: 25000,
        ticketType: "BET",
        name: "EGGHUNT",
        usersData: [],
      },
      {
        account: 1,
        ticketType: "INVITE",
        name: "EGGHUNT",
        usersData: [],
      },
    ],
  });
};
// seedRewardEvent();
const seedVipRequirements = async () => {
  // const exiting = await db.vIPLevelRequirements.findFirst({ where: {} });
  await db.vIPLevelRequirements.create({
    data: {
      levels: [
        {
          level: 1,
          totalDeposit: 0,
          totalDepositCount: 0,
          totalBet: 2000,
        },
        {
          level: 2,
          totalDeposit: 0,
          totalDepositCount: 0,
          totalBet: 10000,
        },
        {
          level: 3,
          totalDeposit: 0,
          totalDepositCount: 0,
          totalBet: 30000,
        },
        {
          level: 4,
          totalDeposit: 4000,
          totalDepositCount: 0,
          totalBet: 60000,
        },
        { level: 5, totalDeposit: 4500, totalDepositCount: 0, totalBet: 70000 },
        { level: 6, totalDeposit: 5000, totalDepositCount: 0, totalBet: 80000 },
        { level: 7, totalDeposit: 5500, totalDepositCount: 0, totalBet: 90000 },
        {
          level: 8,
          totalDeposit: 6000,
          totalDepositCount: 0,
          totalBet: 100000,
        },
        {
          level: 9,
          totalDeposit: 6500,
          totalDepositCount: 0,
          totalBet: 110000,
        },
        {
          level: 10,
          totalDeposit: 7000,
          totalDepositCount: 0,
          totalBet: 120000,
        },

        {
          level: 11,
          totalDeposit: 8000,
          totalDepositCount: 0,
          totalBet: 140000,
        },
      ],
    },
  });

  console.log("VIP SEED");
};
// seedVipRequirements();

const seedVipRewardRequirements = async () => {
  await db.vIPRewardRequirements.createMany({
    data: [
      {
        levelRequire: 1,
        validForDay: 7,
        totalDeposit: 200,
        totalBet: 400,
        reward: 10,
      },
      {
        levelRequire: 2,
        validForDay: 30,
        totalDeposit: 300,
        totalBet: 500,
        reward: 15,
      },
      {
        levelRequire: 3,
        validForDay: 30,
        totalDeposit: 310,
        totalBet: 550,
        reward: 20,
      },
      {
        levelRequire: 4,
        validForDay: 30,
        totalDeposit: 330,
        totalBet: 600,
        reward: 25,
      },
      {
        levelRequire: 5,
        validForDay: 30,
        totalDeposit: 330,
        totalBet: 650,
        reward: 30,
      },
      {
        levelRequire: 6,
        validForDay: 30,
        totalDeposit: 350,
        totalBet: 700,
        reward: 35,
      },
      {
        levelRequire: 7,
        validForDay: 30,
        totalDeposit: 400,
        totalBet: 800,
        reward: 40,
      },
      {
        levelRequire: 8,
        validForDay: 30,
        totalDeposit: 500,
        totalBet: 1000,
        reward: 40,
      },
      {
        levelRequire: 9,
        validForDay: 30,
        totalDeposit: 700,
        totalBet: 1500,
        reward: 50,
      },
      {
        levelRequire: 10,
        validForDay: 30,
        totalDeposit: 1000,
        totalBet: 2000,
        reward: 100,
      },
    ],
  });
};
// seedVipRewardRequirements();

const seedVipReward = async () => {
  await db.vIPRewardUserProgress.create({
    data: {
      user: {
        connect: {
          id: "cmnyenn0b0004mpk9ujht06de",
        },
      },
      requirements: {
        connect: {
          id: "cmnzvdnqp0000mpmiuz5oxrmh",
        },
      },
      expiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  await db.vIPRewardUserProgress.create({
    data: {
      user: {
        connect: {
          id: "cmnitbo0500008otvj6eww80y",
        },
      },
      requirements: {
        connect: {
          id: "cmnretzbq0001mpiq8qpi56l3",
        },
      },
      expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  console.log("SEED");
};
// seedVipReward()

const seedInviationBonusRequirements = async () => {
  await db.inviataionRewardRequirements.create({
    data: {
      requirements: [
        {
          vipLevels: [0],
          reward: {
            money: 100,
            goldenEgg: false,
          },
          requirements: {
            bet: 2000,
            deposit: 100,
          },
        },

        {
          vipLevels: [1, 2],
          reward: {
            money: 200,
            goldenEgg: false,
          },
          requirements: {
            bet: 2000,
            deposit: 100,
          },
        },
        {
          vipLevels: [3, 4],
          reward: {
            money: 300,
            goldenEgg: false,
          },
          requirements: {
            bet: 2000,
            deposit: 100,
          },
        },
        {
          vipLevels: [5, 6],
          reward: {
            money: 500,
            goldenEgg: false,
          },
          requirements: {
            bet: 4000,
            deposit: 200,
          },
        },
        {
          vipLevels: [7, 8],
          reward: {
            money: 700,
            goldenEgg: true,
          },
          requirements: {
            bet: 6000,
            deposit: 400,
          },
        },
        {
          vipLevels: [9, 10],
          reward: {
            money: 1000,
            goldenEgg: true,
          },
          requirements: {
            bet: 10000,
            deposit: 500,
          },
        },
      ],
    },
  });

  console.log("SEED");
};
// seedInviationBonusRequirements();

const depositsSeed = async () => {
  await db.deposit.create({
    data: {
      user: { connect: { id: "cmq68hjqh0001mpwr0nd3dagr" } },
      amount: 500,
      senderNumber: "",
      status: "APPROVED",
      createdAt: new Date(),
      statusUpdateAt: new Date(),
      wallet: "BKASH",
    },
  });
  await db.deposit.create({
    data: {
      user: { connect: { id: "cmq68hjqh0001mpwr0nd3dagr" } },
      amount: 500,
      senderNumber: "",
      status: "APPROVED",
      createdAt: new Date(),
      statusUpdateAt: new Date(),
      wallet: "BKASH",
    },
  });

  console.log("DEPOSIT CREATED");
};
depositsSeed();

const autoUpdateIntervalset = async () => {
  await db.autoUpdatesInterval.create({
    data: {
      deposit: 1000 * 60 * 60,
      betting: 1000 * 60 * 60,
    },
  });
};
// autoUpdateIntervalset()

const seedRewardsTouser = async () => {
  // await db.customRewardEvent.create({
  //   data: {
  //     user: {
  //       connect: { id: "cmnyenn0b0004mpk9ujht06de" },
  //     },
  //     size: 100,
  //     name: "ENVELOP",
  //     title: "weekly reward",
  //     rewardFor: "SIGNIN",
  //     expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  //   },
  // });

  await db.customRewardEvent.create({
    data: {
      user: {
        connect: { id: "cmnyenn0b0004mpk9ujht06de" },
      },
      size: 1,
      name: "SPIN",
      title: "Weekly rewards",
      rewardFor: "WEEKLY",
      expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  // await db.rewardEvent.createMany({
  //   data: [
  //     {
  //       name: "EGGHUNT",
  //       ticketType: "INVITE",
  //       isActive: true,
  //       account: 1,
  //       title: "For A1 users",
  //     },
  //   ],
  // });
  // await db.rewardEvent.update({
  //   where: {
  //     id: "cmo8mgg870000mpufihxevcpd",
  //   },
  //   data: {
  //     usersData: {
  //       push: {
  //         claimable: false,
  //         userId: "cmnyenn0b0004mpk9ujht06de",
  //         createdAt: new Date(),
  //       },
  //     },
  //   },
  // });
  // await db.fixedAmountReward.create({
  //   data: {
  //     prize: 5,
  //     user: {
  //       connect: {
  //         id: "cmnyenn0b0004mpk9ujht06de",
  //       },
  //     },
  //     title: "Member Day Cernival",
  //     expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  //   },
  // });
  // console.log("SEED");
};
// seedRewardsTouser();

const seedBets = async () => {
  await db.bettingRecord.createMany({
    data: [
      {
        betAmount: 400,
        loss: 400,
        status: "SETTLED",
        category: "SLOT",
        userId: "cmq68hjqh0001mpwr0nd3dagr",
        name: "Aviator",
        orderNo: "32981934576",
      },
      {
        betAmount: 100,
        loss: 10000,
        status: "SETTLED",
        category: "FISH",
        userId: "cmq68hjqh0001mpwr0nd3dagr",
        name: "Super Ace",
        orderNo: "32981934536",
      },
    ],
  });
};
seedBets();

const updateInvitationReq = async () => {
  await db.inviataionRewardRequirements.update({
    where: {
      id: "cmnyh3whp0000mpr4ocn936q9",
    },
    data: {
      requirements: [
        {
          reward: {
            money: 100,
            goldenEgg: false,
            envelop: false,
            spinWheel: false,
          },
          vipLevels: [0],
          requirements: {
            bet: 2000,
            deposit: 100,
          },
        },
        {
          reward: {
            money: 200,
            goldenEgg: false,
            envelop: false,
            spinWheel: false,
          },
          vipLevels: [1, 2],
          requirements: {
            bet: 2000,
            deposit: 100,
          },
        },
        {
          reward: {
            money: 300,
            goldenEgg: false,
            envelop: false,
            spinWheel: false,
          },
          vipLevels: [3, 4],
          requirements: {
            bet: 2000,
            deposit: 100,
          },
        },
        {
          reward: {
            money: 500,
            goldenEgg: false,
            envelop: false,
            spinWheel: false,
          },
          vipLevels: [5, 6],
          requirements: {
            bet: 4000,
            deposit: 200,
          },
        },
        {
          reward: {
            money: 700,
            goldenEgg: true,
            envelop: false,
            spinWheel: false,
          },
          vipLevels: [7, 8],
          requirements: {
            bet: 6000,
            deposit: 400,
          },
        },
        {
          reward: {
            money: 1000,
            goldenEgg: true,
            envelop: true,
            spinWheel: true,
          },
          vipLevels: [9, 10],
          requirements: {
            bet: 10000,
            deposit: 500,
          },
        },
      ],
    },
  });
};

// updateInvitationReq();
