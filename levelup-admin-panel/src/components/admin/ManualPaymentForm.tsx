import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ManualPaymentFormProps {
    onPaymentDataChange: (data: PaymentData | null) => void;
}

export interface PaymentData {
    numeroTarjeta: string;  // Últimos 4 dígitos
    titular: string;
    tipoTarjeta: string;
    isValid: boolean;
}

const ManualPaymentForm = ({ onPaymentDataChange }: ManualPaymentFormProps) => {
    const [cardNumber, setCardNumber] = useState("");
    const [cardHolder, setCardHolder] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvv, setCvv] = useState("");
    const [cardType, setCardType] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Algoritmo de Luhn para validar número de tarjeta
    const validateCardNumber = (number: string): boolean => {
        const digits = number.replace(/\s/g, "");
        if (!/^\d{13,19}$/.test(digits)) return false;

        let sum = 0;
        let isEven = false;

        for (let i = digits.length - 1; i >= 0; i--) {
            let digit = parseInt(digits[i]);

            if (isEven) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }

            sum += digit;
            isEven = !isEven;
        }

        return sum % 10 === 0;
    };

    // Detectar tipo de tarjeta por número
    const detectCardType = (number: string): string => {
        const digits = number.replace(/\s/g, "");

        if (/^4/.test(digits)) return "Visa";
        if (/^5[1-5]/.test(digits)) return "Mastercard";
        if (/^3[47]/.test(digits)) return "American Express";
        if (/^6(?:011|5)/.test(digits)) return "Discover";

        return "";
    };

    // Formatear número de tarjeta con espacios
    const formatCardNumber = (value: string): string => {
        const digits = value.replace(/\D/g, "");
        const groups = digits.match(/.{1,4}/g);
        return groups ? groups.join(" ") : digits;
    };

    // Formatear fecha de vencimiento MM/YY
    const formatExpiryDate = (value: string): string => {
        const digits = value.replace(/\D/g, "");
        if (digits.length >= 2) {
            return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
        }
        return digits;
    };

    // Validar fecha de vencimiento
    const validateExpiryDate = (date: string): boolean => {
        const [month, year] = date.split("/");
        if (!month || !year) return false;

        const monthNum = parseInt(month);
        const yearNum = parseInt(`20${year}`);

        if (monthNum < 1 || monthNum > 12) return false;

        const now = new Date();
        const expiry = new Date(yearNum, monthNum - 1);

        return expiry > now;
    };

    const handleCardNumberChange = (value: string) => {
        const formatted = formatCardNumber(value);
        if (formatted.replace(/\s/g, "").length <= 19) {
            setCardNumber(formatted);

            const type = detectCardType(formatted);
            if (type) setCardType(type);

            // Validar y actualizar
            const isValid = validateCardNumber(formatted);
            if (!isValid && formatted.replace(/\s/g, "").length >= 13) {
                setErrors(prev => ({ ...prev, cardNumber: "Número de tarjeta inválido" }));
            } else {
                setErrors(prev => ({ ...prev, cardNumber: "" }));
            }

            updatePaymentData(formatted, cardHolder, type, isValid);
        }
    };

    const handleExpiryDateChange = (value: string) => {
        const formatted = formatExpiryDate(value);
        if (formatted.length <= 5) {
            setExpiryDate(formatted);

            if (formatted.length === 5) {
                const isValid = validateExpiryDate(formatted);
                if (!isValid) {
                    setErrors(prev => ({ ...prev, expiryDate: "Fecha de vencimiento inválida" }));
                } else {
                    setErrors(prev => ({ ...prev, expiryDate: "" }));
                }
            }
        }
    };

    const handleCvvChange = (value: string) => {
        const digits = value.replace(/\D/g, "");
        const maxLength = cardType === "American Express" ? 4 : 3;

        if (digits.length <= maxLength) {
            setCvv(digits);

            if (digits.length === maxLength) {
                setErrors(prev => ({ ...prev, cvv: "" }));
            }
        }
    };

    const handleCardHolderChange = (value: string) => {
        setCardHolder(value);
        if (value.trim()) {
            setErrors(prev => ({ ...prev, cardHolder: "" }));
        }

        const isCardValid = validateCardNumber(cardNumber);
        updatePaymentData(cardNumber, value, cardType, isCardValid);
    };

    const updatePaymentData = (number: string, holder: string, type: string, isValid: boolean) => {
        const digits = number.replace(/\s/g, "");

        if (isValid && holder.trim() && type) {
            const last4 = digits.slice(-4);
            onPaymentDataChange({
                numeroTarjeta: last4,
                titular: holder.trim(),
                tipoTarjeta: type,
                isValid: true
            });
        } else {
            onPaymentDataChange(null);
        }
    };

    return (
        <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Datos de Pago del Cliente
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Alert className="bg-blue-500/10 border-blue-500/20">
                    <AlertCircle className="w-4 h-4 text-blue-400" />
                    <AlertDescription className="text-blue-300 text-sm">
                        Ingresa los datos de la tarjeta del cliente. Solo se guardarán los últimos 4 dígitos.
                    </AlertDescription>
                </Alert>

                <div className="space-y-2">
                    <Label htmlFor="cardNumber" className="text-slate-300">
                        Número de Tarjeta *
                    </Label>
                    <Input
                        id="cardNumber"
                        value={cardNumber}
                        onChange={(e) => handleCardNumberChange(e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        className="bg-slate-700 border-slate-600 text-white font-mono"
                        maxLength={23}
                    />
                    {errors.cardNumber && (
                        <p className="text-red-400 text-sm">{errors.cardNumber}</p>
                    )}
                    {cardType && (
                        <p className="text-green-400 text-sm">Tipo: {cardType}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="cardHolder" className="text-slate-300">
                        Titular de la Tarjeta *
                    </Label>
                    <Input
                        id="cardHolder"
                        value={cardHolder}
                        onChange={(e) => handleCardHolderChange(e.target.value.toUpperCase())}
                        placeholder="NOMBRE COMO APARECE EN LA TARJETA"
                        className="bg-slate-700 border-slate-600 text-white uppercase"
                    />
                    {errors.cardHolder && (
                        <p className="text-red-400 text-sm">{errors.cardHolder}</p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="expiryDate" className="text-slate-300">
                            Vencimiento *
                        </Label>
                        <Input
                            id="expiryDate"
                            value={expiryDate}
                            onChange={(e) => handleExpiryDateChange(e.target.value)}
                            placeholder="MM/YY"
                            className="bg-slate-700 border-slate-600 text-white font-mono"
                            maxLength={5}
                        />
                        {errors.expiryDate && (
                            <p className="text-red-400 text-sm">{errors.expiryDate}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="cvv" className="text-slate-300">
                            CVV *
                        </Label>
                        <Input
                            id="cvv"
                            type="password"
                            value={cvv}
                            onChange={(e) => handleCvvChange(e.target.value)}
                            placeholder={cardType === "American Express" ? "1234" : "123"}
                            className="bg-slate-700 border-slate-600 text-white font-mono"
                            maxLength={4}
                        />
                        {errors.cvv && (
                            <p className="text-red-400 text-sm">{errors.cvv}</p>
                        )}
                        <p className="text-slate-400 text-xs">
                            {cardType === "American Express" ? "4 dígitos" : "3 dígitos"} (no se guarda)
                        </p>
                    </div>
                </div>

                <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-3">
                    <p className="text-slate-300 text-sm">
                        <strong>Seguridad:</strong> Solo se guardarán los últimos 4 dígitos de la tarjeta.
                        El CVV no se almacena en ningún momento.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default ManualPaymentForm;
