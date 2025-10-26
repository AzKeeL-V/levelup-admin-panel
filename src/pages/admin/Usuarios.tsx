import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Shield } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface User {
  id: string;
  nombre: string;
  correo: string;
  rut: string;
  tipo: "duoc" | "normal";
  puntos: number;
  nivel: "bronce" | "plata" | "oro" | "diamante";
}

const Usuarios = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const users: User[] = [
    {
      id: "1",
      nombre: "Juan Pérez",
      correo: "juan.perez@duocuc.cl",
      rut: "12.345.678-9",
      tipo: "duoc",
      puntos: 1250,
      nivel: "diamante",
    },
    {
      id: "2",
      nombre: "María González",
      correo: "maria.gonzalez@gmail.com",
      rut: "23.456.789-0",
      tipo: "normal",
      puntos: 650,
      nivel: "oro",
    },
    {
      id: "3",
      nombre: "Carlos Silva",
      correo: "carlos.silva@duocuc.cl",
      rut: "34.567.890-1",
      tipo: "duoc",
      puntos: 320,
      nivel: "plata",
    },
    {
      id: "4",
      nombre: "Ana Morales",
      correo: "ana.morales@outlook.com",
      rut: "45.678.901-2",
      tipo: "normal",
      puntos: 85,
      nivel: "bronce",
    },
    {
      id: "5",
      nombre: "Luis Campos",
      correo: "luis.campos@duocuc.cl",
      rut: "56.789.012-3",
      tipo: "duoc",
      puntos: 2100,
      nivel: "diamante",
    },
  ];

  const getLevelColor = (nivel: string) => {
    switch (nivel) {
      case "diamante":
        return "bg-accent text-accent-foreground";
      case "oro":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "plata":
        return "bg-gray-500/20 text-gray-300 border-gray-500/50";
      case "bronce":
        return "bg-orange-500/20 text-orange-400 border-orange-500/50";
      default:
        return "bg-secondary";
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.rut.includes(searchTerm)
  );

  const renderUserTable = (filterType?: "duoc" | "normal") => {
    const displayUsers = filterType
      ? filteredUsers.filter((u) => u.tipo === filterType)
      : filteredUsers;

    return (
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50 hover:bg-secondary/50">
              <TableHead>Nombre</TableHead>
              <TableHead>Correo</TableHead>
              <TableHead>RUT</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Puntos Level Up</TableHead>
              <TableHead>Nivel</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayUsers.length > 0 ? (
              displayUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-secondary/30">
                  <TableCell className="font-medium">{user.nombre}</TableCell>
                  <TableCell className="text-muted-foreground">{user.correo}</TableCell>
                  <TableCell className="font-mono">{user.rut}</TableCell>
                  <TableCell>
                    <Badge
                      variant={user.tipo === "duoc" ? "default" : "secondary"}
                      className={user.tipo === "duoc" ? "bg-primary text-primary-foreground" : ""}
                    >
                      {user.tipo === "duoc" && <Shield className="w-3 h-3 mr-1" />}
                      {user.tipo === "duoc" ? "DUOC UC" : "Normal"}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-primary">
                    {user.puntos.toLocaleString("es-CL")}
                  </TableCell>
                  <TableCell>
                    <Badge className={getLevelColor(user.nivel)}>
                      {user.nivel.toUpperCase()}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No se encontraron usuarios
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Usuarios</h1>
        <p className="text-muted-foreground">Gestiona los usuarios y su sistema de niveles</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-accent/20 to-card border-accent/50">
          <p className="text-sm text-muted-foreground mb-1">Diamante</p>
          <p className="text-2xl font-bold text-accent">
            {users.filter((u) => u.nivel === "diamante").length}
          </p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-yellow-500/20 to-card border-yellow-500/50">
          <p className="text-sm text-muted-foreground mb-1">Oro</p>
          <p className="text-2xl font-bold text-yellow-400">
            {users.filter((u) => u.nivel === "oro").length}
          </p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-gray-500/20 to-card border-gray-500/50">
          <p className="text-sm text-muted-foreground mb-1">Plata</p>
          <p className="text-2xl font-bold text-gray-300">
            {users.filter((u) => u.nivel === "plata").length}
          </p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-orange-500/20 to-card border-orange-500/50">
          <p className="text-sm text-muted-foreground mb-1">Bronce</p>
          <p className="text-2xl font-bold text-orange-400">
            {users.filter((u) => u.nivel === "bronce").length}
          </p>
        </Card>
      </div>

      <Card className="p-6 bg-card border-border">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar usuarios por nombre, correo o RUT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-secondary border-border"
          />
        </div>

        <Tabs defaultValue="todos" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="duoc">DUOC UC</TabsTrigger>
            <TabsTrigger value="normal">Normales</TabsTrigger>
          </TabsList>
          <TabsContent value="todos">{renderUserTable()}</TabsContent>
          <TabsContent value="duoc">{renderUserTable("duoc")}</TabsContent>
          <TabsContent value="normal">{renderUserTable("normal")}</TabsContent>
        </Tabs>

        <div className="mt-4 text-sm text-muted-foreground">
          Mostrando {filteredUsers.length} de {users.length} usuarios
        </div>
      </Card>
    </div>
  );
};

export default Usuarios;
