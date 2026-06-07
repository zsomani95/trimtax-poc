export interface ValidationError {
  [field: string]: string
}

export function validateEmail(email: string): string | null {
  if (!email.trim()) return 'Email is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email address'
  return null
}

export function validatePassword(password: string, minLength = 8): string | null {
  if (!password) return 'Password is required'
  if (password.length < minLength) return `Password must be at least ${minLength} characters`
  return null
}

export function validatePhone(phone: string, required = false): string | null {
  if (!phone.trim() && !required) return null
  if (phone.trim() && !/^[\d\-\s\(\)]+$/.test(phone)) return 'Invalid phone number'
  return null
}

export function validateName(name: string): string | null {
  if (!name.trim()) return 'Name is required'
  if (name.trim().length < 2) return 'Name must be at least 2 characters'
  if (!/^[a-zA-Z\s\-']+$/.test(name)) return 'Name can only contain letters, spaces, hyphens, and apostrophes'
  return null
}

export function validateAddress(address: string): string | null {
  if (!address.trim()) return 'Address is required'
  if (address.trim().length < 5) return 'Address must be at least 5 characters'
  return null
}

export function validateConfirmPassword(password: string, confirm: string): string | null {
  if (password !== confirm) return 'Passwords do not match'
  return null
}

export function validateRegistration(data: {
  fullName: string
  email: string
  password: string
  confirmPassword: string
}): ValidationError {
  const errors: ValidationError = {}

  const nameErr = validateName(data.fullName)
  if (nameErr) errors.fullName = nameErr

  const emailErr = validateEmail(data.email)
  if (emailErr) errors.email = emailErr

  const passwordErr = validatePassword(data.password)
  if (passwordErr) errors.password = passwordErr

  const confirmErr = validateConfirmPassword(data.password, data.confirmPassword)
  if (confirmErr) errors.confirmPassword = confirmErr

  return errors
}

export function validateIntakeStep2(data: {
  ownerName: string
  ownerEmail: string
  ownerPhone: string
}): ValidationError {
  const errors: ValidationError = {}

  const nameErr = validateName(data.ownerName)
  if (nameErr) errors.ownerName = nameErr

  const emailErr = validateEmail(data.ownerEmail)
  if (emailErr) errors.ownerEmail = emailErr

  const phoneErr = validatePhone(data.ownerPhone, false)
  if (phoneErr) errors.ownerPhone = phoneErr

  return errors
}
