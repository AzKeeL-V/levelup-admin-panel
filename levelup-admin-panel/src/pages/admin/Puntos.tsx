import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Coins, Users, TrendingUp, Award, Settings, UserCheck } from "lucide-react";
import { useUsers } from "@/context/UserContext";
import { useState } from "react";
import { User } from "@/types/User";

interface ReferralSettings {
  pointsPerReferral: number;
  pointsForReferrer: number;
  minReferralLevel: "bronce" | "plata" | "oro" | "diamante";
}

const Puntos = () => {
  const { users, loading, updateUser } = useUsers();
  const [editingPoints, setEditingPoints] = useState<{ [userId: string]: number }>({});
  const [referralSettings, setReferralSettings] = useState<ReferralSettings>({
    pointsPerReferral: 100,
    pointsForReferrer: 50,
    minReferralLevel: "bronce"
  });
  const [showSettings, setShowSettings] = useState(false);

  // Excluir administradores del listado y de estadísticas
  const nonAdminUsers = users.filter(u => u.rol !== 'admin');

  // Estadísticas de puntos (sin administradores)
  const totalPoints = nonAdminUsers.reduce((sum, user) => sum + user.puntos, 0);
  const averagePoints = nonAdminUsers.length > 0 ? Math.round(totalPoints / nonAdminUsers.length) : 0;
  const topUser = nonAdminUsers.reduce((prev, current) => (prev && prev.puntos > current.puntos) ? prev : current, nonAdminUsers[0] || null);

  // Calcular estadísticas de referidos
  // Calcular estadísticas de referidos (sin incluir admins como referidos)
  const referralStats = nonAdminUsers.reduce((acc, user) => {
    const referredUsers = nonAdminUsers.filter(u => u.referidoPor === user.codigoReferido); // Usuarios referidos por este usuario
    return {
      totalReferrals: acc.totalReferrals + referredUsers.length,
      activeReferrers: acc.activeReferrers + (referredUsers.length > 0 ? 1 : 0)
    };
  }, { totalReferrals: 0, activeReferrers: 0 });

  // Función para guardar puntos editados
  const savePoints = async (userId: string, newPoints: number) => {
    try {
      const clampedPoints = Math.max(0, newPoints);
      const newLevel = getLevelFromPoints(clampedPoints);

      // Actualizar puntos y nivel si es necesario
      await updateUser(userId, {
        puntos: clampedPoints,
        nivel: newLevel
      });

      setEditingPoints(prev => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
    } catch (error) {
      console.error("Error updating points:", error);
    }
  };

  // Función para iniciar edición de puntos
  const startEditing = (userId: string, currentPoints: number) => {
    setEditingPoints(prev => ({
      ...prev,
      [userId]: currentPoints
    }));
  };

  // Función para cancelar edición
  const cancelEditing = (userId: string) => {
    setEditingPoints(prev => {
      const updated = { ...prev };
      delete updated[userId];
      return updated;
    });
  };



  // Función para determinar nivel basado en puntos
  const getLevelFromPoints = (points: number): "bronce" | "plata" | "oro" | "diamante" => {
    if (points >= 2000) return "diamante";
    if (points >= 1000) return "oro";
    if (points >= 500) return "plata";
    return "bronce";
  };



  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span>Cargando sistema de puntos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Sistema de Puntos</h1>
        <p className="text-muted-foreground">Gestión de puntos por referidos y niveles de usuario</p>
      </div>

      {/* Configuración de Referidos */}
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">Configuración de Referidos</h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            {showSettings ? "Ocultar" : "Mostrar"} Configuración
          </Button>
        </div>

        {showSettings && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <Label htmlFor="pointsPerReferral">Puntos por Referido</Label>
              <Input
                id="pointsPerReferral"
                type="number"
                value={referralSettings.pointsPerReferral}
                onChange={(e) => setReferralSettings(prev => ({
                  ...prev,
                  pointsPerReferral: parseInt(e.target.value) || 0
                }))}
                placeholder="Ej: 100"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Puntos que gana el referido al registrarse
              </p>
            </div>

            <div>
              <Label htmlFor="pointsForReferrer">Puntos para Referidor</Label>
              <Input
                id="pointsForReferrer"
                type="number"
                value={referralSettings.pointsForReferrer}
                onChange={(e) => setReferralSettings(prev => ({
                  ...prev,
                  pointsForReferrer: parseInt(e.target.value) || 0
                }))}
                placeholder="Ej: 50"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Puntos que gana quien refiere
              </p>
            </div>

            <div>
              <Label htmlFor="minReferralLevel">Nivel Mínimo para Referir</Label>
              <select
                id="minReferralLevel"
                value={referralSettings.minReferralLevel}
                onChange={(e) => setReferralSettings(prev => ({
                  ...prev,
                  minReferralLevel: e.target.value as "bronce" | "plata" | "oro" | "diamante"
                }))}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="bronce">Bronce</option>
                <option value="plata">Plata</option>
                <option value="oro">Oro</option>
                <option value="diamante">Diamante</option>
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                Nivel mínimo requerido para poder referir
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-secondary/30 rounded-lg">
            <UserCheck className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-500">{referralStats.activeReferrers}</p>
            <p className="text-sm text-muted-foreground">Referidores Activos</p>
          </div>
          <div className="text-center p-4 bg-secondary/30 rounded-lg">
            <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-500">{referralStats.totalReferrals}</p>
            <p className="text-sm text-muted-foreground">Total Referidos</p>
          </div>
          <div className="text-center p-4 bg-secondary/30 rounded-lg">
            <Coins className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-500">
              {(referralStats.totalReferrals * referralSettings.pointsPerReferral).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Puntos por Referidos</p>
          </div>
        </div>
      </Card>

      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-yellow-500/20 to-card border-yellow-500/50">
          <div className="flex items-center gap-2 mb-2">
            <Coins className="w-5 h-5 text-yellow-400" />
            <p className="text-sm text-muted-foreground">Puntos Totales</p>
          </div>
          <p className="text-3xl font-bold text-yellow-400">{totalPoints.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground mt-1">En todo el sistema</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-500/20 to-card border-blue-500/50">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-blue-400" />
            <p className="text-sm text-muted-foreground">Usuarios Registrados</p>
          </div>
          <p className="text-3xl font-bold text-blue-400">{users.length}</p>
          <p className="text-sm text-muted-foreground mt-1">Total de usuarios</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-500/20 to-card border-green-500/50">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <p className="text-sm text-muted-foreground">Promedio de Puntos</p>
          </div>
          <p className="text-3xl font-bold text-green-400">{averagePoints}</p>
          <p className="text-sm text-muted-foreground mt-1">Por usuario</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-500/20 to-card border-purple-500/50">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-purple-400" />
            <p className="text-sm text-muted-foreground">Usuario Top</p>
          </div>
          <p className="text-lg font-bold text-purple-400">{topUser?.nombre || "N/A"}</p>
          <p className="text-sm text-muted-foreground mt-1">{topUser?.puntos || 0} puntos</p>
        </Card>
      </div>

      {/* Gestión de Puntos por Usuario */}
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center gap-2 mb-6">
          <Coins className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold">Gestión de Puntos por Usuario</h2>
        </div>

        <div className="space-y-4">
          {nonAdminUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg border border-border hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{user.nombre}</p>
                  <p className="text-sm text-muted-foreground">
                    {user.correo} • Código: {user.codigoReferido}
                    {user.referidoPor && (
                      <span className="ml-2 text-xs text-blue-400">
                        (Referido por: {user.referidoPor})
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-center">
                  <Badge variant={
                    user.nivel === "diamante" ? "default" :
                    user.nivel === "oro" ? "secondary" :
                    user.nivel === "plata" ? "outline" :
                    "destructive"
                  }>
                    {user.nivel.toUpperCase()}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">Nivel</p>
                </div>

                <div className="text-center">
                  {editingPoints[user.id] !== undefined ? (
                    <div className="flex flex-col items-center gap-2">
                      <Input
                        type="number"
                        value={editingPoints[user.id]}
                        onChange={(e) => setEditingPoints(prev => ({
                          ...prev,
                          [user.id]: parseInt(e.target.value) || 0
                        }))}
                        className="w-20 text-center"
                        min="0"
                      />
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => savePoints(user.id, editingPoints[user.id])}
                          className="px-2"
                        >
                          ✓
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => cancelEditing(user.id)}
                          className="px-2"
                        >
                          ✕
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <p className="text-2xl font-bold text-primary">{user.puntos}</p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEditing(user.id, user.puntos)}
                        className="px-2 text-xs"
                      >
                        Editar
                      </Button>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground">Puntos</p>
                </div>


              </div>
            </div>
          ))}
        </div>
      </Card>



      {/* Información sobre niveles */}
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-bold mb-4">Sistema de Niveles</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-secondary/30 rounded-lg">
            <Badge variant="destructive" className="mb-2">BRONCE</Badge>
            <p className="text-sm">0 - 499 puntos</p>
          </div>
          <div className="text-center p-4 bg-secondary/30 rounded-lg">
            <Badge variant="outline" className="mb-2">PLATA</Badge>
            <p className="text-sm">500 - 999 puntos</p>
          </div>
          <div className="text-center p-4 bg-secondary/30 rounded-lg">
            <Badge variant="secondary" className="mb-2">ORO</Badge>
            <p className="text-sm">1000 - 1999 puntos</p>
          </div>
          <div className="text-center p-4 bg-secondary/30 rounded-lg">
            <Badge variant="default" className="mb-2">DIAMANTE</Badge>
            <p className="text-sm">2000+ puntos</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Puntos;
