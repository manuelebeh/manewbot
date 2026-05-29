'use strict';

const { genererCommandeCanvacord } = require('./_shared');

const effetsCanvacord = [
  "shit",
  "wasted",
  "wanted",
  "trigger",
  "trash",
  "rip",
  "sepia",
  "rainbow",
  "hitler",
  "invert1",
  "jail",
  "affect",
  "beautiful",
  "blur",
  "circle1",
  "facepalm",
  "greyscale",
  "jokeoverhead",
  "delete_image",
  "darkness",
  "colorfy",
  "threshold",
  "pixelate"
];

effetsCanvacord.forEach((effect) => genererCommandeCanvacord(effect));
