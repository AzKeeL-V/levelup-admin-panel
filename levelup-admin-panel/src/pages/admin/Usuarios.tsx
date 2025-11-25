import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, Eye, Plus, UserPlus, Edit } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUsers } from "@/context/UserContext";
import { User } from "@/types/User";
import UserDetailModal from "@/components/admin/UserDetailModal";
import UserCreateForm from "@/components/admin/UserCreateForm";

const Usuarios = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [levelFilter, setLevelFilter] = useState<string>("todos");
  const [mobilePage, setMobilePage] = useState(1);
  const MOBILE_ITEMS_PER_PAGE = 10;
  const { users, loading, error, refreshUsers } = useUsers();

  useEffect(() => {
    // Check if user is admin (you can implement proper auth check here)
    // For now, we'll assume admin access
    setIsAdmin(true);
  }, []);

  console.log("Usuarios component render:", { users, loading, error, usersLength: users?.length });

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setIsEditMode(false);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditMode(true);
    setIsCreateMode(false);
  };

  const handleCreateUser = () => {
    setIsCreateMode(true);
  };

  const handleModalClose = () => {
    setSelectedUser(null);
    setIsEditMode(false);
  };

  const resetMobilePage = () => {
    setMobilePage(1);
  };

  const handleCreateFormClose = () => {
    setIsCreateMode(false);
  };

  const handleUserCreated = () => {
    // Refrescar la lista de usuarios después de crear uno nuevo
    refreshUsers();
  };

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
    (user) => {
      // Exclude admin users from the list
      if (user.rol === "admin") {
        return false;
      }

      const matchesSearch =
        user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.rut.includes(searchTerm);

      const matchesLevel = levelFilter === "todos" || user.nivel === levelFilter;

      return matchesSearch && matchesLevel;
    }
  );

  const renderUserTable = (filterType?: "duoc" | "normal") => {
    const displayUsers = filterType
      ? filteredUsers.filter((u) => u.tipo === filterType)
      : filteredUsers;

    // Pagination for mobile view
    const totalMobilePages = Math.ceil(displayUsers.length / MOBILE_ITEMS_PER_PAGE);
    const paginatedMobileUsers = displayUsers.slice(
      (mobilePage - 1) * MOBILE_ITEMS_PER_PAGE,
      mobilePage * MOBILE_ITEMS_PER_PAGE
    );

    return (
      <div className="w-full">
        {/* Mobile Card View */}
        <div className="block md:hidden">
          {displayUsers.length > 0 ? (
            <>
              <div className="space-y-3">
                {paginatedMobileUsers.map((user) => (
                  <Card key={user.id} className="p-4 transition-all hover:shadow-md">
                    <div className="space-y-3">
                      {/* Header with name and actions */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm leading-tight">{user.nombre}</h3>
                          <p className="mt-1 text-xs text-muted-foreground">{user.correo}</p>
                          <p className="text-xs font-mono text-muted-foreground">{user.rut}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUserClick(user)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {isAdmin && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditUser(user)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Badges and points */}
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            variant={user.tipo === "duoc" ? "default" : "secondary"}
                            className={`text-xs ${user.tipo === "duoc" ? "bg-primary text-primary-foreground" : ""}`}
                          >
                            {user.tipo === "duoc" ? "DUOC UC" : "Normal"}
                          </Badge>
                          <Badge className={`text-xs ${getLevelColor(user.nivel)}`}>
                            {user.nivel.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-primary">
                            {user.puntos.toLocaleString("es-CL")}
                          </p>
                          <p className="text-xs text-muted-foreground">puntos</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Mobile Pagination */}
              {totalMobilePages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Página {mobilePage} de {totalMobilePages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setMobilePage(prev => Math.max(1, prev - 1))}
                      disabled={mobilePage === 1}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setMobilePage(prev => Math.min(totalMobilePages, prev + 1))}
                      disabled={mobilePage === totalMobilePages}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                <p className="text-sm">No se encontraron usuarios</p>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block">
          <div className="w-full overflow-x-auto">
            <Table className="w-full min-w-[800px]">
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="h-12 px-3 text-xs font-medium w-[180px]">Nombre</TableHead>
                  <TableHead className="h-12 px-3 text-xs font-medium w-[220px]">Correo</TableHead>
                  <TableHead className="h-12 px-3 text-xs font-medium w-[120px]">RUT</TableHead>
                  <TableHead className="h-12 px-3 text-xs font-medium w-[100px]">Tipo</TableHead>
                  <TableHead className="h-12 px-3 text-xs font-medium w-[120px]">Puntos</TableHead>
                  <TableHead className="h-12 px-3 text-xs font-medium w-[100px]">Nivel</TableHead>
                  <TableHead className="h-12 px-3 text-xs font-medium w-[140px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayUsers.length > 0 ? (
                  displayUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted/50">
                      <TableCell className="px-3 py-3 font-medium text-sm truncate" title={user.nombre}>
                        {user.nombre}
                      </TableCell>
                      <TableCell className="px-3 py-3 text-muted-foreground text-sm truncate" title={user.correo}>
                        {user.correo}
                      </TableCell>
                      <TableCell className="px-3 py-3 font-mono text-xs">{user.rut}</TableCell>
                      <TableCell className="px-3 py-3">
                        <Badge
                          variant={user.tipo === "duoc" ? "default" : "secondary"}
                          className={`text-xs ${user.tipo === "duoc" ? "bg-primary text-primary-foreground" : ""}`}
                        >
                          {user.tipo === "duoc" ? "DUOC" : "Normal"}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-3 py-3 font-semibold text-primary text-sm">
                        {user.puntos.toLocaleString("es-CL")}
                      </TableCell>
                      <TableCell className="px-3 py-3">
                        <Badge className={`text-xs ${getLevelColor(user.nivel)}`}>
                          {user.nivel.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-3 py-3">
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUserClick(user)}
                            className="h-7 px-2 text-xs"
                          >
                            <Eye className="mr-1 h-3 w-3" />
                            Ver
                          </Button>
                          {isAdmin && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditUser(user)}
                              className="h-7 px-2 text-xs"
                            >
                              Editar
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      No se encontraron usuarios
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Cargando usuarios...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-background">
      {/* Header Section */}
      <div className="px-4 py-6 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Usuarios</h1>
            <p className="mt-2 text-sm text-muted-foreground md:text-base">
              Gestiona los usuarios y su sistema de niveles
            </p>
          </div>

          {/* Stats Cards */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:mt-8 md:grid-cols-4">
            <Card className="p-3 transition-all hover:shadow-md md:p-4">
              <div className="flex flex-col items-center text-center md:items-start md:text-left">
                <p className="text-xs font-medium text-muted-foreground md:text-sm">Diamante</p>
                <p className="mt-1 text-xl font-bold text-accent md:text-2xl">
                  {users.filter((u) => u.nivel === "diamante").length}
                </p>
              </div>
            </Card>
            <Card className="p-3 transition-all hover:shadow-md md:p-4">
              <div className="flex flex-col items-center text-center md:items-start md:text-left">
                <p className="text-xs font-medium text-muted-foreground md:text-sm">Oro</p>
                <p className="mt-1 text-xl font-bold text-yellow-400 md:text-2xl">
                  {users.filter((u) => u.nivel === "oro").length}
                </p>
              </div>
            </Card>
            <Card className="p-3 transition-all hover:shadow-md md:p-4">
              <div className="flex flex-col items-center text-center md:items-start md:text-left">
                <p className="text-xs font-medium text-muted-foreground md:text-sm">Plata</p>
                <p className="mt-1 text-xl font-bold text-gray-300 md:text-2xl">
                  {users.filter((u) => u.nivel === "plata").length}
                </p>
              </div>
            </Card>
            <Card className="p-3 transition-all hover:shadow-md md:p-4">
              <div className="flex flex-col items-center text-center md:items-start md:text-left">
                <p className="text-xs font-medium text-muted-foreground md:text-sm">Bronce</p>
                <p className="mt-1 text-xl font-bold text-orange-400 md:text-2xl">
                  {users.filter((u) => u.nivel === "bronce").length}
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 pb-6 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Card className="shadow-sm">
            <div className="p-4 md:p-6">
              {/* Search and Filters */}
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar usuarios por nombre, correo o RUT..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      resetMobilePage();
                    }}
                    className="h-10 pl-10 pr-4 md:h-11"
                  />
                </div>

                {/* Controls Row */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Select value={levelFilter} onValueChange={(value) => {
                      setLevelFilter(value);
                      resetMobilePage();
                    }}>
                      <SelectTrigger className="h-10 w-full sm:w-[160px] md:h-11">
                        <SelectValue placeholder="Filtrar por nivel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos los niveles</SelectItem>
                        <SelectItem value="diamante">Diamante</SelectItem>
                        <SelectItem value="oro">Oro</SelectItem>
                        <SelectItem value="plata">Plata</SelectItem>
                        <SelectItem value="bronce">Bronce</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {isAdmin && (
                    <Button
                      onClick={handleCreateUser}
                      className="h-10 w-full gap-2 sm:w-auto md:h-11"
                      size="default"
                    >
                      <UserPlus className="h-4 w-4" />
                      <span className="hidden sm:inline">Agregar Usuario</span>
                      <span className="sm:hidden">Agregar</span>
                    </Button>
                  )}
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="todos" className="mt-6">
                <TabsList className="grid h-10 w-full grid-cols-3 md:h-11">
                  <TabsTrigger value="todos" className="text-xs md:text-sm">
                    Todos
                  </TabsTrigger>
                  <TabsTrigger value="duoc" className="text-xs md:text-sm">
                    DUOC UC
                  </TabsTrigger>
                  <TabsTrigger value="normal" className="text-xs md:text-sm">
                    Normales
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="todos" className="mt-4">
                  {renderUserTable()}
                </TabsContent>
                <TabsContent value="duoc" className="mt-4">
                  {renderUserTable("duoc")}
                </TabsContent>
                <TabsContent value="normal" className="mt-4">
                  {renderUserTable("normal")}
                </TabsContent>
              </Tabs>

              {/* Results Count */}
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Mostrando {filteredUsers.length} de {users.filter(u => u.rol !== "admin").length} usuarios
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <UserDetailModal
        key={selectedUser?.id || 'view-edit'}
        user={selectedUser}
        open={!!selectedUser}
        onOpenChange={handleModalClose}
        isEditMode={isEditMode}
      />

      <UserCreateForm
        open={isCreateMode}
        onOpenChange={handleCreateFormClose}
        onUserCreated={handleUserCreated}
      />
    </div>
  );
};

export default Usuarios;
