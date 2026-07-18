export type MeasurementType = {
  id: "yesno" | "number" | "slider" | "time" | "duration" | "text";
  label: string;
  description: string;
};

export const MEASUREMENT_TYPES: MeasurementType[] = [
  { id: "yesno", label: "Yes / No", description: "Simple did-you-or-didn't-you" },
  { id: "number", label: "Number", description: "Log any count, with an optional daily goal" },
  { id: "slider", label: "Slider", description: "Drag to a value out of a max you set" },
  { id: "time", label: "Time", description: "Pick a time, goal is by/before a set time" },
  { id: "duration", label: "Duration", description: "Log minutes spent, see a weekly total" },
  { id: "text", label: "Text", description: "A short daily note — counts as done once written" },
];

export const HABIT_COLOR_OPTIONS: { label: string; hex: string }[] = [
  { label: "Blush", hex: "#F6DFE1" },
  { label: "Lavender", hex: "#E7E0F5" },
  { label: "Sage", hex: "#DFE9DF" },
  { label: "Baby blue", hex: "#DCEBF5" },
  { label: "Peach", hex: "#F5D9C6" },
  { label: "Butter", hex: "#F6E7B2" },
];

export const HABIT_EMOJI_SUGGESTIONS = [
  "📚", "🧘", "💪", "🎯", "📝", "🚴", "🧹", "💤", "🍎", "🎸",
  "🖌️", "🧠", "🌞", "🧴", "🪥", "🐾", "🎧", "🧩", "🗣️", "💰",
];
