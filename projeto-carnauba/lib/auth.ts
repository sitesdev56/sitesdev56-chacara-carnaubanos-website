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
  const users = getUsers()

  // Verificar se email já existe
  if (users.some((u) => u.email === email)) {
    return { success: false, message: "Email já cadastrado" }
  }

  // Criar novo usuário
  const hashedPassword = await hashPassword(password)
  const newUser: User = {
    id: Date.now().toString(),
    name,
    email,
    phone,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  saveUsers(users)

  // Retornar sessão do usuário
  const userSession: UserSession = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    phone: newUser.phone,
  }

  return { success: true, message: "Cadastro realizado com sucesso", user: userSession }
}

// Login de usuário
export async function loginUser(
  email: string,
  password: string,
): Promise<{ success: boolean; message: string; user?: UserSession }> {
  const users = getUsers()
  const user = users.find((u) => u.email === email)

  if (!user) {
    return { success: false, message: "Email ou senha incorretos" }
  }

  const isPasswordValid = await verifyPassword(password, user.password)

  if (!isPasswordValid) {
    return { success: false, message: "Email ou senha incorretos" }
  }

  // Retornar sessão do usuário
  const userSession: UserSession = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
  }

  return { success: true, message: "Login realizado com sucesso", user: userSession }
}

// Obter usuário atual
export function getCurrentUser(): UserSession | null {
  if (typeof window === "undefined") return null
  const user = localStorage.getItem("carnaubanos_user")
  return user ? JSON.parse(user) : null
}

// Salvar sessão do usuário
export function saveUserSession(user: UserSession): void {
  if (typeof window === "undefined") return
  localStorage.setItem("carnaubanos_user", JSON.stringify(user))
}

// Logout
export function logout(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("carnaubanos_user")
}
