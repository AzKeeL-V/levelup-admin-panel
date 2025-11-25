import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Agrupamos las pruebas de componentes de UI
describe('Pruebas de Componentes: UI', () => {

    // 1. Prueba del componente Button
    // Verificamos que se renderice correctamente y responda a eventos
    describe('Button Component', () => {
        it('debería renderizar el texto del botón correctamente', () => {
            render(<Button>Click me</Button>);
            // Buscamos el botón por su texto
            const buttonElement = screen.getByText(/click me/i);
            expect(buttonElement).toBeInTheDocument();
        });

        it('debería ejecutar la función onClick al hacer click', () => {
            const handleClick = vi.fn(); // Creamos una función espía (mock)
            render(<Button onClick={handleClick}>Click me</Button>);

            const buttonElement = screen.getByText(/click me/i);
            fireEvent.click(buttonElement); // Simulamos el click

            // Verificamos que la función espía haya sido llamada 1 vez
            expect(handleClick).toHaveBeenCalledTimes(1);
        });
    });

    // 2. Prueba del componente Badge
    // Verificamos que se muestre con el contenido correcto
    describe('Badge Component', () => {
        it('debería renderizar el contenido del badge', () => {
            render(<Badge>New</Badge>);
            const badgeElement = screen.getByText(/new/i);
            expect(badgeElement).toBeInTheDocument();
        });

        it('debería aplicar la clase de variante por defecto', () => {
            const { container } = render(<Badge>Default</Badge>);
            // Verificamos que el elemento tenga clases de tailwind (ejemplo simplificado)
            // Nota: Esto depende de la implementación exacta, pero verificamos que renderice
            expect(container.firstChild).toHaveClass('inline-flex');
        });
    });

    // 3. Prueba del componente Input
    // Verificamos que se pueda escribir en el input
    describe('Input Component', () => {
        it('debería renderizar y permitir escribir texto', () => {
            render(<Input placeholder="Escribe aquí" />);
            const inputElement = screen.getByPlaceholderText(/escribe aquí/i) as HTMLInputElement;

            expect(inputElement).toBeInTheDocument();

            // Simulamos escribir en el input
            fireEvent.change(inputElement, { target: { value: 'Hola Mundo' } });
            expect(inputElement.value).toBe('Hola Mundo');
        });
    });

    // 4. Prueba del componente Label
    // Verificamos que renderice el texto de la etiqueta
    describe('Label Component', () => {
        it('debería renderizar el texto de la etiqueta', () => {
            render(<Label htmlFor="email">Correo Electrónico</Label>);
            const labelElement = screen.getByText(/correo electrónico/i);
            expect(labelElement).toBeInTheDocument();
            expect(labelElement).toHaveAttribute('for', 'email');
        });
    });

    // 5. Prueba del componente Card
    // Verificamos que renderice su estructura y contenido anidado
    describe('Card Component', () => {
        it('debería renderizar título y contenido dentro de la tarjeta', () => {
            render(
                <Card>
                    <CardHeader>
                        <CardTitle>Título de Tarjeta</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Contenido de la tarjeta</p>
                    </CardContent>
                </Card>
            );

            // Verificamos que el título esté presente
            expect(screen.getByText(/título de tarjeta/i)).toBeInTheDocument();
            // Verificamos que el contenido esté presente
            expect(screen.getByText(/contenido de la tarjeta/i)).toBeInTheDocument();
        });
    });

});
