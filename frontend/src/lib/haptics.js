// Native Web Vibration Haptic Feedback for Mobile Touch Interactions (iOS / Android)
export const triggerHaptic = (type = 'light') => {
  if (typeof window === 'undefined' || !window.navigator || typeof window.navigator.vibrate !== 'function') {
    return;
  }
  try {
    switch (type) {
      case 'light':
        window.navigator.vibrate(8);
        break;
      case 'medium':
        window.navigator.vibrate(15);
        break;
      case 'heavy':
        window.navigator.vibrate(28);
        break;
      case 'success':
        window.navigator.vibrate([10, 35, 15]);
        break;
      case 'error':
        window.navigator.vibrate([30, 40, 30]);
        break;
      case 'selection':
        window.navigator.vibrate(5);
        break;
      default:
        window.navigator.vibrate(10);
    }
  } catch {
    // Non-fatal if browser blocks or doesn't allow vibration
  }
};
