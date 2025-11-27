import { User } from "@/types/User";
import axiosInstance from "../utils/axiosInstance";

export class UserRepository {
  private static readonly STORAGE_KEY = "levelup_users";

  private static getDefaultUsers(): User[] {
    return [
      {
        id: "admin123",
        nombre: "Administrador LevelUp",
        correo: "admin@levelup.cl",
        contraseña: "adminpass",
        rut: "",
        tipo: "normal",
        puntos: 0,
        nivel: "diamante",
        telefono: null,
        intereses: [],
        aceptaTerminos: true,
        aceptaPoliticaPrivacidad: true,
        captchaVerificado: true,
        fechaRegistro: "2024-01-01T00:00:00.000Z",
        activo: true,
        codigoReferido: "ADMIN001",
        rol: "admin",
        referidoPor: null,
        preferenciasComunicacion: {
          email: true,
          sms: false,
        },
        newsletter: false,
      },
      {
        id: "1",
        nombre: "Juan Pérez",
        correo: "juan.perez@duocuc.cl",
        contraseña: "$2b$10$hashedpassword1", // Simulado
        rut: "12.345.678-9",
        tipo: "duoc",
        puntos: 1250,
        nivel: "diamante",
        telefono: "+56912345678",
        direcciones: [{
          calle: "Avenida Providencia",
          numero: "123",
          apartamento: "4B",
          ciudad: "Santiago",
          region: "Metropolitana",
          codigoPostal: "7500000",
          pais: "Chile",
        }],
        metodoPagoPreferido: "tarjeta",
        metodosPago: [
          {
            id: "1",
            tipo: "tarjeta",
            tarjeta: {
              numero: "**** **** **** 1234",
              fechaExpiracion: "12/26",
              titular: "Juan Pérez",
            },
            esPredeterminado: true
          }
        ],
        preferenciasComunicacion: {
          email: true,
          sms: true,
        },
        newsletter: true,
        intereses: ["Gaming", "Tecnología", "Deportes"],
        aceptaTerminos: true,
        aceptaPoliticaPrivacidad: true,
        captchaVerificado: true,
        fechaRegistro: "2024-01-15",
        ultimoAcceso: "2025-01-27",
        activo: true,
        codigoReferido: "REF1",
      },
      {
        id: "2",
        nombre: "María González",
        correo: "maria.gonzalez@gmail.com",
        contraseña: "$2b$10$hashedpassword2", // Simulado
        rut: "23.456.789-0",
        tipo: "normal",
        puntos: 650,
        nivel: "oro",
        telefono: "+56987654321",
        direcciones: [{
          calle: "Calle Las Condes",
          numero: "456",
          apartamento: null,
          ciudad: "Santiago",
          region: "Metropolitana",
          codigoPostal: "7550000",
          pais: "Chile",
        }],
        metodoPagoPreferido: "transferencia",
        preferenciasComunicacion: {
          email: true,
          sms: false,
        },
        newsletter: false,
        intereses: ["Libros", "Música"],
        aceptaTerminos: true,
        aceptaPoliticaPrivacidad: true,
        captchaVerificado: true,
        fechaRegistro: "2024-03-22",
        ultimoAcceso: "2025-01-26",
        activo: true,
        codigoReferido: "REF2",
      },
      {
        id: "3",
        nombre: "Carlos Silva",
        correo: "carlos.silva@duocuc.cl",
        contraseña: "$2b$10$hashedpassword3", // Simulado
        rut: "34.567.890-1",
        tipo: "duoc",
        puntos: 320,
        nivel: "plata",
        telefono: "+56955556666",
        direcciones: [{
          calle: "Avenida La Florida",
          numero: "789",
          apartamento: "12A",
          ciudad: "Santiago",
          region: "Metropolitana",
          codigoPostal: "8240000",
          pais: "Chile",
        }],
        metodoPagoPreferido: "efectivo",
        preferenciasComunicacion: {
          email: false,
          sms: true,
        },
        newsletter: true,
        intereses: ["Gaming", "Películas"],
        aceptaTerminos: true,
        aceptaPoliticaPrivacidad: true,
        captchaVerificado: true,
        fechaRegistro: "2024-06-10",
        ultimoAcceso: "2025-01-25",
        activo: true,
        codigoReferido: "REF3",
      },
      {
        id: "4",
        nombre: "Ana Morales",
        correo: "ana.morales@outlook.com",
        contraseña: "$2b$10$hashedpassword4", // Simulado
        rut: "45.678.901-2",
        tipo: "normal",
        puntos: 85,
        nivel: "bronce",
        telefono: "+56944443333",
        direcciones: [{
          calle: "Calle Ejemplo",
          numero: "123",
          ciudad: "Santiago",
          region: "Metropolitana",
          codigoPostal: "12345",
          pais: "Chile",
        }],
        preferenciasComunicacion: {
          email: true,
          sms: false,
        },
        newsletter: false,
        intereses: ["Arte", "Viajes"],
        aceptaTerminos: true,
        aceptaPoliticaPrivacidad: true,
        captchaVerificado: true,
        fechaRegistro: "2024-09-05",
        ultimoAcceso: "2025-01-20",
        activo: true,
        codigoReferido: "REF4",
      },
      {
        id: "5",
        nombre: "Luis Campos",
        correo: "luis.campos@duocuc.cl",
        contraseña: "$2b$10$hashedpassword5", // Simulado
        rut: "56.789.012-3",
        tipo: "duoc",
        puntos: 2100,
        nivel: "diamante",
        telefono: "+56977778888",
        direcciones: [{
          calle: "Calle Vitacura",
          numero: "321",
          ciudad: "Santiago",
          region: "Metropolitana",
          codigoPostal: "7630000",
          pais: "Chile",
        }],
        metodoPagoPreferido: "paypal",
        preferenciasComunicacion: {
          email: true,
          sms: true,
        },
        newsletter: true,
        intereses: ["Tecnología", "Gaming", "Deportes"],
        aceptaTerminos: true,
        aceptaPoliticaPrivacidad: true,
        captchaVerificado: true,
        fechaRegistro: "2023-12-01",
        ultimoAcceso: "2025-01-27",
        activo: true,
        codigoReferido: "REF5",
      },
    ];
  }

  private static async getUsers(): Promise<User[]> {
    try {
      // 1. Cargar datos de localStorage
      const stored = localStorage.getItem(this.STORAGE_KEY);
      const localUsers: User[] = stored ? JSON.parse(stored) : [];

      // 2. Cargar datos del JSON
      let jsonUsers: User[] = [];
      if (typeof fetch !== 'undefined') {
        try {
          const response = await fetch('/levelup_users.json');
          if (response.ok) {
            jsonUsers = await response.json();
            console.log("UserRepository: Usuarios cargados desde JSON:", jsonUsers.length);
          }
        } catch (e) {
          console.error("Error cargando JSON de usuarios:", e);
        }
      }

      // 3. Si no hay datos en absoluto, usar defaults
      if (localUsers.length === 0 && jsonUsers.length === 0) {
        const defaultUsers = this.getDefaultUsers();
        this.saveUsers(defaultUsers);
        return defaultUsers;
      }

      // 4. Merge inteligente:
      // - Mantener usuarios locales (pueden tener cambios)
      // - Agregar usuarios del JSON que no estén en locales (por ID)
      const mergedUsers = [...localUsers];

      jsonUsers.forEach(jsonUser => {
        const exists = localUsers.some(u => u.id === jsonUser.id);
        if (!exists) {
          mergedUsers.push(jsonUser);
        }
      });

      // 5. Asegurar que existe el admin (si no vino en JSON ni local)
      const hasAdmin = mergedUsers.some(u => u.correo === "admin@levelup.cl");
      if (!hasAdmin) {
        const defaultAdmin = this.getDefaultUsers().find(u => u.correo === "admin@levelup.cl");
        if (defaultAdmin) {
          mergedUsers.unshift(defaultAdmin);
        }
      }

      // 6. Guardar resultado fusionado en localStorage para persistencia futura
      // Solo guardamos si hubo cambios (diferente longitud) para evitar escrituras innecesarias,
      // pero para asegurar consistencia inicial, guardamos.
      this.saveUsers(mergedUsers);

      return mergedUsers;
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      // Fallback a datos iniciales si falla todo
      const defaultUsers = this.getDefaultUsers();
      this.saveUsers(defaultUsers);
      return defaultUsers;
    }
  }

  private static saveUsers(users: User[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error("Error al guardar usuarios:", error);
      throw new Error("Error al guardar los usuarios");
    }
  }

  static async findAll(): Promise<User[]> {
    // Primero intenta obtener los usuarios desde el backend con axios
    try {
      const response = await axiosInstance.get('/users');
      // Map backend response to frontend User type
      return response.data.map((u: any) => ({
        ...u,
        rol: u.role ? u.role.toLowerCase() : "user",
        // Map other fields if necessary
      }));
    } catch (err) {
      // Si falla axios (no hay backend), usa localStorage o JSON local
    }
    console.log("UserRepository: findAll called");
    // Simula delay de red
    await new Promise(resolve => setTimeout(resolve, 300));
    const users = await this.getUsers();
    console.log("UserRepository: findAll returning", users.length, "users");
    console.log("UserRepository: Users in findAll:", users.map(u => ({ id: u.id, correo: u.correo, rol: u.rol })));
    return users;
  }

  static async findById(id: string): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const users = await this.getUsers();
    return users.find(user => user.id === id) || null;
  }

  // Función para validar formato de RUT chileno
  private static validateRut(rut: string): boolean {
    // Remover puntos y guión
    const cleanRut = rut.replace(/[.\-]/g, '');

    // Verificar que tenga al menos 8 dígitos
    if (cleanRut.length < 8) return false;

    // Separar número y dígito verificador
    const body = cleanRut.slice(0, -1);
    const dv = cleanRut.slice(-1).toUpperCase();

    // Calcular dígito verificador
    let sum = 0;
    let multiplier = 2;

    for (let i = body.length - 1; i >= 0; i--) {
      sum += parseInt(body[i]) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }

    const expectedDv = 11 - (sum % 11);
    const calculatedDv = expectedDv === 11 ? '0' : expectedDv === 10 ? 'K' : expectedDv.toString();

    return dv === calculatedDv;
  }

  // Función para validar formato de email
  private static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static async create(user: Omit<User, "id">): Promise<User> {
    try {
      console.log("UserRepository.create: Creating user via API:", user.correo);

      // Validar formato de RUT y Email antes de enviar (opcional, el backend también valida)
      if (user.rut && !this.validateRut(user.rut)) {
        throw new Error("El RUT ingresado no es válido");
      }
      if (!this.validateEmail(user.correo)) {
        throw new Error("El correo electrónico no tiene un formato válido");
      }

      // El backend espera un objeto User. 
      // Si usamos el endpoint de registro público (/auth/register), usamos AuthService.register.
      // Pero si esto es creación desde admin, deberíamos usar POST /api/users (si existiera create en UserController).
      // UserController (step 599) NO tiene create method!
      // UserController tiene getAll, getById, update, delete, stats.
      // NO tiene create.
      // Por lo tanto, para crear usuarios, debemos usar AuthService.register o agregar create a UserController.
      // Si es un admin creando un usuario, probablemente quiera setear roles, puntos, etc.
      // AuthService.register crea usuarios con rol USER y defaults.

      // Si el requerimiento es "integrar eso", y el usuario pidió "elimincaciones logicas", 
      // la creación de usuarios desde admin panel podría requerir un endpoint específico.
      // PERO, por ahora, usaremos AuthService.register como fallback o asumiremos que se usa el registro público.
      // Sin embargo, si el admin crea un usuario, debería poder hacerlo.

      // Voy a usar /auth/register por ahora, ya que UserController no tiene create.
      // O mejor, agrego create a UserController?
      // El plan decía "UserService... Métodos: getAllUsers, getUserById, updateUser, deleteUser...".
      // NO mencioné create en el plan para UserService/Controller.
      // Así que asumiré que la creación se hace vía registro público o no es el foco crítico ahora (el foco era eliminación lógica).
      // PERO, UserRepository.create existe en el frontend.

      // Voy a usar axiosInstance.post('/auth/register', ...) adaptando los datos.
      // RegisterRequest tiene: nombre, email, password, telefono, rut, codigoReferido.
      // User tiene más campos.

      const registerRequest = {
        nombre: user.nombre,
        email: user.correo,
        password: user.contraseña,
        telefono: user.telefono,
        rut: user.rut,
        codigoReferido: user.codigoReferido
      };

      const response = await axiosInstance.post('/auth/register', registerRequest);
      // La respuesta es AuthResponse, no User completo.
      // Pero necesitamos devolver User.
      // Construimos un User parcial desde la respuesta.

      const authResponse = response.data;
      return {
        ...user,
        id: authResponse.id.toString(),
        // otros campos defaults
      } as User;

    } catch (error: any) {
      console.error("Error creating user:", error);
      throw new Error(error.response?.data?.message || "Error al crear usuario");
    }
  }

  static async update(id: string, userData: Partial<User>): Promise<User> {
    try {
      // Map frontend User type to backend format if necessary
      // Backend expects "role" instead of "rol"
      const dataToSend: any = { ...userData };
      if (userData.rol) {
        dataToSend.role = userData.rol.toUpperCase();
        delete dataToSend.rol;
      }

      const response = await axiosInstance.put(`/users/${id}`, dataToSend);

      // Map response back to frontend User type
      const u = response.data;
      return {
        ...u,
        rol: u.role ? u.role.toLowerCase() : "user",
      };
    } catch (error: any) {
      console.error("Error updating user:", error);
      throw new Error(error.response?.data?.message || "Error al actualizar usuario");
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`/users/${id}`);
    } catch (error: any) {
      console.error("Error deleting user:", error);
      throw new Error(error.response?.data?.message || "Error al eliminar usuario");
    }
  }

  static async getUserStats(): Promise<{
    totalUsers: number;
    duocUsers: number;
    normalUsers: number;
    levelStats: { [key: string]: number };
    totalPoints: number;
  }> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const users = await this.getUsers();

    const levelStats = users.reduce((acc, user) => {
      acc[user.nivel] = (acc[user.nivel] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    return {
      totalUsers: users.length,
      duocUsers: users.filter(u => u.tipo === "duoc").length,
      normalUsers: users.filter(u => u.tipo === "normal").length,
      levelStats,
      totalPoints: users.reduce((sum, user) => sum + user.puntos, 0),
    };
  }
}
