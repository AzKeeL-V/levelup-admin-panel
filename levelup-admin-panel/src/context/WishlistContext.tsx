import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@/types/Product";
import { useUsers } from "./UserContext";

interface WishlistContextType {
    wishlist: Product[];
    addToWishlist: (product: Product) => void;
    removeFromWishlist: (productId: string) => void;
    isInWishlist: (productId: string) => boolean;
    clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
    const [wishlist, setWishlist] = useState<Product[]>([]);
    const { currentUser } = useUsers();

    // Load wishlist from localStorage on mount or user change
    useEffect(() => {
        if (currentUser) {
            const savedWishlist = localStorage.getItem(`wishlist_${currentUser.id}`);
            if (savedWishlist) {
                try {
                    setWishlist(JSON.parse(savedWishlist));
                } catch (e) {
                    console.error("Error parsing wishlist:", e);
                    setWishlist([]);
                }
            } else {
                setWishlist([]);
            }
        } else {
            setWishlist([]);
        }
    }, [currentUser]);

    // Save wishlist to localStorage whenever it changes
    useEffect(() => {
        if (currentUser) {
            localStorage.setItem(`wishlist_${currentUser.id}`, JSON.stringify(wishlist));
        }
    }, [wishlist, currentUser]);

    const addToWishlist = (product: Product) => {
        if (!isInWishlist(product.codigo)) {
            setWishlist((prev) => [...prev, product]);
        }
    };

    const removeFromWishlist = (productId: string) => {
        setWishlist((prev) => prev.filter((item) => item.codigo !== productId));
    };

    const isInWishlist = (productId: string) => {
        return wishlist.some((item) => item.codigo === productId);
    };

    const clearWishlist = () => {
        setWishlist([]);
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, clearWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
};
