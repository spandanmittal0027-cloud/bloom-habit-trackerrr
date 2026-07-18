export type StickerDef = { emoji: string; label: string };
export type StickerCategory = { id: string; label: string; stickers: StickerDef[] };

export const STICKER_CATEGORIES: StickerCategory[] = [
  {
    id: "flowers",
    label: "Flowers & plants",
    stickers: [
      { emoji: "🌸", label: "Blossom" },
      { emoji: "🌷", label: "Tulip" },
      { emoji: "🌼", label: "Daisy" },
      { emoji: "🪴", label: "Plant" },
      { emoji: "🍀", label: "Clover" },
      { emoji: "🌿", label: "Leaf" },
    ],
  },
  {
    id: "cozy",
    label: "Cozy things",
    stickers: [
      { emoji: "🍵", label: "Matcha" },
      { emoji: "☕", label: "Coffee" },
      { emoji: "📖", label: "Book" },
      { emoji: "🕯️", label: "Candle" },
      { emoji: "🧸", label: "Bear" },
      { emoji: "🐇", label: "Bunny" },
    ],
  },
  {
    id: "sky",
    label: "Sky & sparkle",
    stickers: [
      { emoji: "☁️", label: "Cloud" },
      { emoji: "⭐", label: "Star" },
      { emoji: "✨", label: "Sparkles" },
      { emoji: "🦋", label: "Butterfly" },
      { emoji: "🌙", label: "Moon" },
      { emoji: "💫", label: "Dizzy star" },
    ],
  },
  {
    id: "sweet",
    label: "Little things",
    stickers: [
      { emoji: "🎀", label: "Bow" },
      { emoji: "💌", label: "Letter" },
      { emoji: "💖", label: "Heart" },
      { emoji: "🍓", label: "Strawberry" },
      { emoji: "🍯", label: "Honey" },
      { emoji: "🧵", label: "Thread" },
    ],
  },
  {
    id: "washi",
    label: "Washi tape",
    stickers: [
      { emoji: "🎗️", label: "Ribbon strip" },
      { emoji: "➖", label: "Tape strip" },
      { emoji: "〰️", label: "Wavy tape" },
    ],
  },
  {
    id: "seasonal",
    label: "Seasonal",
    stickers: [
      { emoji: "🍂", label: "Autumn leaf" },
      { emoji: "❄️", label: "Snowflake" },
      { emoji: "🌻", label: "Sunflower" },
      { emoji: "🎄", label: "Tree" },
    ],
  },
];

export const BACKGROUND_PRESETS: {
  id: string;
  label: string;
  swatch: string;
  style: string;
}[] = [
  {
    id: "cream-paper",
    label: "Cream paper",
    swatch: "#FBF6EE",
    style: "linear-gradient(180deg, #FFFDF9 0%, #FBF6EE 100%)",
  },
  {
    id: "blush-gingham",
    label: "Blush gingham",
    swatch: "#F6DFE1",
    style:
      "repeating-linear-gradient(0deg, rgba(238,195,200,0.35) 0 12px, transparent 12px 24px), repeating-linear-gradient(90deg, rgba(238,195,200,0.35) 0 12px, transparent 12px 24px), #FFFDF9",
  },
  {
    id: "lavender-dream",
    label: "Lavender dream",
    swatch: "#E7E0F5",
    style: "linear-gradient(160deg, #F1ECFA 0%, #E7E0F5 100%)",
  },
  {
    id: "sage-garden",
    label: "Sage garden",
    swatch: "#DFE9DF",
    style: "linear-gradient(160deg, #EFF5EF 0%, #DFE9DF 100%)",
  },
  {
    id: "baby-blue-sky",
    label: "Baby blue sky",
    swatch: "#DCEBF5",
    style: "linear-gradient(180deg, #EFF7FB 0%, #DCEBF5 100%)",
  },
];

export const MOODS: { id: string; label: string; emoji: string }[] = [
  { id: "happy", label: "Happy", emoji: "😊" },
  { id: "excited", label: "Excited", emoji: "🤩" },
  { id: "calm", label: "Calm", emoji: "😌" },
  { id: "tired", label: "Tired", emoji: "😴" },
  { id: "anxious", label: "Anxious", emoji: "😟" },
  { id: "productive", label: "Productive", emoji: "💪" },
  { id: "low-energy", label: "Low energy", emoji: "🪫" },
  { id: "stressed", label: "Stressed", emoji: "😣" },
  { id: "motivated", label: "Motivated", emoji: "🔥" },
];

export const JOURNAL_PROMPTS = [
  "What made you happy today?",
  "How was your energy?",
  "What challenged you?",
  "One thing you're grateful for.",
  "Today's win.",
  "Tomorrow's goal.",
];

