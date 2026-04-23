export const SNAP = { type: "spring", stiffness: 520, damping: 32, mass: 1 } as const;
export const GLIDE = { type: "spring", stiffness: 260, damping: 28, mass: 1 } as const;
export const DROP = { type: "spring", stiffness: 380, damping: 22, mass: 1.1 } as const;
export const FLOAT = { type: "spring", stiffness: 140, damping: 18, mass: 1 } as const;
export const COUNTER = { type: "spring", stiffness: 90, damping: 22, mass: 1 } as const;
export const STAMP = { type: "spring", stiffness: 700, damping: 18, mass: 1.4 } as const;

export const MAGNETIC_SPRING = { stiffness: 180, damping: 20, mass: 1 } as const;
