import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext(null);

export const CURRENCIES = {
  BDT: { code: 'BDT', symbol: '৳', rate: 120.0, label: 'BDT (৳ Taka)' },
  USD: { code: 'USD', symbol: '$', rate: 1.0, label: 'USD ($)' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92, label: 'EUR (€)' },
  GBP: { code: 'GBP', symbol: '£', rate: 0.79, label: 'GBP (£)' },
  AED: { code: 'AED', symbol: 'AED ', rate: 3.67, label: 'AED (د.إ)' },
  SAR: { code: 'SAR', symbol: 'SAR ', rate: 3.75, label: 'SAR (﷼)' }
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrencyState] = useState(() => {
    try {
      const saved = localStorage.getItem('nashwa_currency');
      return saved && CURRENCIES[saved] ? saved : 'BDT';
    } catch {
      return 'BDT';
    }
  });

  const setCurrency = (code) => {
    if (CURRENCIES[code]) {
      setCurrencyState(code);
      localStorage.setItem('nashwa_currency', code);
    }
  };

  const currentConfig = CURRENCIES[currency] || CURRENCIES.BDT;

  const formatPrice = (usdAmount) => {
    if (usdAmount === undefined || usdAmount === null || isNaN(usdAmount)) {
      return `${currentConfig.symbol}0`;
    }
    const converted = Number(usdAmount) * currentConfig.rate;
    if (currentConfig.code === 'BDT') {
      return `${currentConfig.symbol}${Math.round(converted).toLocaleString('en-IN')}`;
    }
    return `${currentConfig.symbol}${converted.toFixed(2)}`;
  };

  const convertAmount = (usdAmount) => {
    if (usdAmount === undefined || usdAmount === null || isNaN(usdAmount)) return 0;
    const converted = Number(usdAmount) * currentConfig.rate;
    return currentConfig.code === 'BDT' ? Math.round(converted) : Number(converted.toFixed(2));
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        currentConfig,
        setCurrency,
        formatPrice,
        convertAmount,
        availableCurrencies: Object.values(CURRENCIES)
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
