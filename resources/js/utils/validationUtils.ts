// resources/js/utils/validationUtils.tsx
export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  export const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\d{10,11}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  };