// useKeys.ts
import { useEffect } from 'react';

interface KeyMap {
  fn: (pressed: boolean) => void;
  pressed: boolean;
  up?: boolean;
}

export interface KeyConfig {
  keys: string[];
  fn: (pressed: boolean) => void;
  up?: boolean;
}

export function useKeys(keyConfig: KeyConfig[]) {
  useEffect(() => {
    const keyMap = keyConfig.reduce<{ [key: string]: KeyMap }>((out, { keys, fn, up = true }) => {
      keys && keys.forEach((key) => (out[key] = { fn, pressed: false, up }));
      return out;
    }, {});

    const downHandler = ({ key, target }: KeyboardEvent) => {
      if (!keyMap[key] || (target as HTMLElement).nodeName === 'INPUT') return;
      const { fn, pressed, up } = keyMap[key];
      keyMap[key].pressed = true;
      if (up || !pressed) fn(true);
    };

    const upHandler = ({ key, target }: KeyboardEvent) => {
      if (!keyMap[key] || (target as HTMLElement).nodeName === 'INPUT') return;
      const { fn, up } = keyMap[key];
      keyMap[key].pressed = false;
      if (up) fn(false);
    };

    window.addEventListener('keydown', downHandler, { passive: true });
    window.addEventListener('keyup', upHandler, { passive: true });

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [keyConfig]);
}
