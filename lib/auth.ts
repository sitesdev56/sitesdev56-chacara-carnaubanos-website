import bcrypt from "bcryptjs"

export interface User {
  id: string
  name: string
  email: string
  phone: string
  password: string
  createdAt: string
}

export interface UserSession {
  id: string
  name: string
  email: string
  phone: string
}

// Hash de senha
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

// Verificar senha
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Obter todos os usuários
export function getUsers(): User[] {
  if (typeof window === "undefined") return []
  const users = localStorage.getItem("carnaubanos_users")
  return users ? JSON.parse(users) : []
}

// Salvar usuários
export function saveUsers(users: User[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem("carnaubanos_users", JSON.stringify(users))
}

// Registrar novo usuário
export async function registerUser(
  name: string,
  email: string,
  phone: string,
  password: string,
): Promise<{ success: boolean; message: string; user?: UserSession }> {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, phone, password }),
  })
  const data = await res.json()
  return data
}

// Login de usuário
export async function loginUser(
  email: string,
  password: string,
): Promise<{ success: boolean; message: string; user?: UserSession }> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  return data
}

// Obter usuário atual
export async function getCurrentUser(): Promise<UserSession | null> {
  const res = await fetch('/api/auth/me')
  const data = await res.json()
  return data.success ? data.user : null
}

// Salvar sessão local opcional (mantém compatibilidade com UI)
export function saveUserSession(user: UserSession): void {
  if (typeof window === "undefined") return
  localStorage.setItem('carnaubanos_user', JSON.stringify(user))
}

// Logout
export function logout(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("carnaubanos_user")
}
