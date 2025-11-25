import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        // Simulate API call
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Basic validation simulation
            if (!email.includes("@")) {
                throw new Error("Por favor ingresa un email válido");
            }

            setIsSubmitted(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ocurrió un error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex flex-col">
            <Header />

            <div className="flex-1 flex items-center justify-center p-4">
                <Card className="w-full max-w-md bg-slate-800/50 border-slate-700">
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center">
                                <Mail className="w-8 h-8 text-purple-400" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold text-white">Recuperar Contraseña</CardTitle>
                        {!isSubmitted && (
                            <p className="text-slate-400 mt-2">
                                Ingresa tu correo electrónico y te enviaremos las instrucciones para restablecer tu contraseña.
                            </p>
                        )}
                    </CardHeader>
                    <CardContent>
                        {isSubmitted ? (
                            <div className="text-center space-y-6">
                                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex flex-col items-center gap-2">
                                    <CheckCircle className="w-12 h-12 text-green-400" />
                                    <h3 className="text-white font-semibold text-lg">¡Correo enviado!</h3>
                                    <p className="text-slate-300 text-sm">
                                        Hemos enviado las instrucciones a <span className="font-medium text-white">{email}</span>
                                    </p>
                                </div>

                                <p className="text-slate-400 text-sm">
                                    Si no recibes el correo en unos minutos, revisa tu carpeta de spam.
                                </p>

                                <Button
                                    onClick={() => navigate("/usuario/login")}
                                    className="w-full bg-slate-700 hover:bg-slate-600 text-white"
                                >
                                    Volver al Login
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-slate-300">Correo electrónico</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="tu@email.com"
                                            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 pl-10"
                                            required
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                                        <AlertCircle className="h-4 w-4 text-red-400" />
                                        <p className="text-red-400 text-sm">{error}</p>
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Enviando...
                                        </div>
                                    ) : (
                                        "Enviar Instrucciones"
                                    )}
                                </Button>

                                <div className="text-center pt-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => navigate("/usuario/login")}
                                        className="text-slate-400 hover:text-white"
                                    >
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Volver al Login
                                    </Button>
                                </div>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Footer />
        </div>
    );
};

export default ForgotPassword;
