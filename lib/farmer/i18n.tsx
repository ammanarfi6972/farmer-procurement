"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi';

interface I18nContextType {
  lang: Language;
  toggleLang: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    "app.title": "FasalTrack",
    "nav.signout": "Sign Out",
    "nav.languageToggle": "हिंदी",
    "dashboard.welcome": "Welcome back",
    "dashboard.bookSlot": "Book New Slot",
    "dashboard.myBookings": "My Active Bookings",
    "dashboard.noBookings": "You have no active bookings.",
    "booking.title": "Schedule Procurement",
    "booking.step1": "Select Centre & Commodity",
    "booking.step2": "Quantity & Date",
    "booking.submit": "Confirm Booking",
    "booking.success": "Booking Confirmed!",
    "booking.token": "Your Token Number",
    "booking.showAtCentre": "Please show this token at the centre."
  },
  hi: {
    "app.title": "किसानमित्र",
    "nav.signout": "लॉग आउट",
    "nav.languageToggle": "English",
    "dashboard.welcome": "वापसी पर स्वागत है",
    "dashboard.bookSlot": "नया स्लॉट बुक करें",
    "dashboard.myBookings": "मेरी सक्रिय बुकिंग",
    "dashboard.noBookings": "आपकी कोई सक्रिय बुकिंग नहीं है।",
    "booking.title": "खरीद अनुसूची",
    "booking.step1": "केंद्र और फसल चुनें",
    "booking.step2": "मात्रा और तारीख",
    "booking.submit": "बुकिंग पक्की करें",
    "booking.success": "बुकिंग पक्की हो गई!",
    "booking.token": "आपका टोकन नंबर",
    "booking.showAtCentre": "कृपया केंद्र पर यह टोकन दिखाएं।"
  }
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('en');

  const toggleLang = () => {
    setLang((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  const t = (key: string) => {
    return translations[lang]?.[key] || key;
  };

  return (
    <I18nContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used within I18nProvider");
  return context;
}
