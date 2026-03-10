import objectPath from "object-path";
import type React from "react";
import { createContext, useState } from "react";
import type { Settings } from "@/types/settings";
import { SettingsSchema } from "@/validators/settings";

interface Props {
  children: React.ReactNode;
}

export interface ContextValue {
  settings: Settings;
  update: (key: string, value: unknown) => Settings;
  active: boolean;
  toggle: (state?: boolean) => boolean;
}

/**
 * Validate that the given object is a plain object and can be used as settings.
 *
 * @param object the object to validate
 * @returns the validated settings object
 */
const validate = (object: unknown = null): Settings => {
  return SettingsSchema.parse(object);
};

/**
 * Initial state with default settings and no-op functions for update and toggle.
 */
const initialState: ContextValue = {
  settings: validate(),
  update: () => validate(),
  active: false,
  toggle: () => false,
};

/**
 * SettingsContext provides a global state for application settings, with persistence to localStorage.
 */
export const SettingsContext = createContext<ContextValue>(initialState);

/**
 * SettingsProvider initializes settings from localStorage.
 */
export const SettingsProvider: React.FC<Props> = ({ children }) => {
  /**
   * Initialize settings state from the pre‑hydration value if available (client‑side only), otherwise start with an empty object.
   */
  const [settings, setSettings] = useState<Settings>((): Settings => {
    // Check for the pre‑hydration value injected by the server
    const hasWindow = typeof window !== "undefined";

    // On the client, attempt to load from the pre‑hydration value or localStorage
    const updated: Settings =
      hasWindow && window.__INITIAL_SETTINGS__
        ? validate(window.__INITIAL_SETTINGS__)
        : validate();

    // persist to localStorage
    if (hasWindow) {
      localStorage.setItem(
        import.meta.env.VITE_SETTINGS_STORAGE_KEY,
        JSON.stringify(updated),
      );
    }
    // return the validated settings to update state
    return updated;
  });

  /**
   * Active state to control whether the settings menu is open, can be used by components to toggle the menu without needing to manage their own state.
   */
  const [active, setActive] = useState(false);

  /**
   * Update a nested setting by key path and persist to localStorage
   *
   * @param key the key path
   * @param value the value to set
   * @returns the updated settings object
   */
  const update = (key: string, value: unknown): Settings => {
    setSettings((prev) => {
      // deep clone to avoid mutating state directly, then update the nested key
      const plain = JSON.parse(JSON.stringify(prev));

      // set the value at the nested key
      objectPath.set(plain, key, value);

      // validate the updated object before saving
      const updated = validate(plain);

      // persist to localStorage
      localStorage.setItem(
        import.meta.env.VITE_SETTINGS_STORAGE_KEY,
        JSON.stringify(updated),
      );

      // return the validated settings to update state
      return updated;
    });

    // Return the current settings immediately (the state update will happen asynchronously)
    return settings;
  };

  /**
   * Toggle the active state of the settings menu. If a boolean state is provided, it will set to that state; otherwise, it will toggle the current state.
   *
   * @param state the optional state to set (true for open, false for closed). If not provided, it will toggle the current state.
   * @returns the new active state after the toggle
   */
  const toggle = (state?: boolean): boolean => {
    // If state is explicitly provided (not undefined), use it; otherwise, toggle the current state
    setActive((prev) => {
      return state !== undefined && state !== null ? state : !prev;
    });

    // Return the new active state immediately
    return active;
  };

  return (
    <SettingsContext.Provider value={{ settings, update, active, toggle }}>
      {children}
    </SettingsContext.Provider>
  );
};
