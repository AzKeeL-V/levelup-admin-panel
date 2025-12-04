import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import Index from '../../pages/Index';
import { MemoryRouter } from 'react-router-dom';

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    };
});

// Mock ProductContext
vi.mock('@/context/ProductContext', () => ({
    useProducts: () => ({
        products: [
            {
                id: '1',
                name: 'Product 1',
                price: 100,
                image: '/images/products/product1.jpg',
                category: 'Gaming',
                stock: 10,
                description: 'Test product 1',
                estado: 'activo'
            },
            {
                id: '2',
                name: 'Product 2',
                price: 200,
                image: '/images/products/product2.jpg',
                category: 'Tech',
                stock: 5,
                description: 'Test product 2',
                estado: 'activo'
            },
        ],
        loading: false,
    }),
}));

// Mock CartContext
vi.mock('@/context/CartContext', () => ({
    useCart: () => ({
        addToCart: vi.fn(),
        getItemCount: () => 0,
        items: [],
    }),
}));

// Mock BlogContext
vi.mock('@/context/BlogContext', () => ({
    useBlog: () => ({
        blogItems: [
            {
                id: '1',
                titulo: 'Event 1',
                tipo: 'evento',
                fecha: '2026-01-01',
                imagen: '/images/blog/event1.jpg',
                descripcion: 'Test event 1',
                estado: 'activo'
            },
            {
                id: '2',
                titulo: 'Event 2',
                tipo: 'evento',
                fecha: '2026-01-02',
                imagen: '/images/blog/event2.jpg',
                descripcion: 'Test event 2',
                estado: 'activo'
            },
            {
                id: '3',
                titulo: 'Event 3',
                tipo: 'evento',
                fecha: '2026-01-03',
                imagen: '/images/blog/event3.jpg',
                descripcion: 'Test event 3',
                estado: 'activo'
            },
        ],
        loading: false,
    }),
}));

// Mock OrderContext
vi.mock('@/context/OrderContext', () => ({
    useOrders: () => ({
        orders: [],
        loading: false,
        addOrder: vi.fn(),
    }),
}));

// Mock UserContext
vi.mock('@/context/UserContext', () => ({
    useUsers: () => ({
        currentUser: null,
        login: vi.fn(),
        logout: vi.fn(),
    }),
}));

// Mock Header and Footer to avoid infinite loops/rendering issues
vi.mock('@/components/Header', () => ({
    default: () => <div data-testid="mock-header">Header</div>
}));

vi.mock('@/components/Footer', () => ({
    default: () => <div data-testid="mock-footer">Footer</div>
}));

describe('Index Page', () => {
    it('matches snapshot', () => {
        const { asFragment } = render(
            <MemoryRouter>
                <Index />
            </MemoryRouter>
        );
        expect(asFragment()).toMatchSnapshot();
    });
});
