const STORAGE_KEY = "perinade_cart_v1";

export type CartItem = {
  id: string;
  name: string;
  unitAmount: number;
  qty: number;
  image?: string;
  weightGrams?: number;
};

export type CartState = {
  items: CartItem[];
  updatedAt: number;
};

const emptyCart = (): CartState => ({
  items: [],
  updatedAt: Date.now(),
});

const isBrowser = (): boolean => typeof window !== "undefined" && typeof localStorage !== "undefined";

const normalizeQty = (value: unknown): number => Math.max(0, Math.floor(Number(value) || 0));

const touch = (state: Omit<CartState, "updatedAt"> | CartState): CartState => ({
  ...state,
  updatedAt: Date.now(),
});

const normalizeState = (value: unknown): CartState => {
  if (!value || typeof value !== "object") return emptyCart();

  const raw = value as { items?: unknown; updatedAt?: unknown };
  const rawItems = Array.isArray(raw.items) ? raw.items : [];
  const mergedById = new Map<string, CartItem>();

  for (const rawItem of rawItems) {
    if (!rawItem || typeof rawItem !== "object") continue;

    const candidate = rawItem as Partial<CartItem>;
    const id = typeof candidate.id === "string" ? candidate.id : "";
    const name = typeof candidate.name === "string" ? candidate.name : "";
    const unitAmount = Number(candidate.unitAmount);
    const qty = normalizeQty(candidate.qty);

    if (!id || !name || !Number.isFinite(unitAmount) || qty <= 0) continue;

    const existing = mergedById.get(id);
    const nextQty = (existing?.qty ?? 0) + qty;

    const nextItem: CartItem = {
      id,
      name,
      unitAmount,
      qty: nextQty,
      image: typeof candidate.image === "string" ? candidate.image : existing?.image,
      weightGrams: Number.isFinite(Number(candidate.weightGrams))
        ? Number(candidate.weightGrams)
        : existing?.weightGrams,
    };

    mergedById.set(id, nextItem);
  }

  const updatedAt = Number(raw.updatedAt);

  return {
    items: Array.from(mergedById.values()),
    updatedAt: Number.isFinite(updatedAt) ? updatedAt : Date.now(),
  };
};

const readCartFromStorage = (): CartState => {
  if (!isBrowser()) return emptyCart();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyCart();
    return normalizeState(JSON.parse(raw));
  } catch {
    return emptyCart();
  }
};

const writeCartToStorage = (state: CartState): void => {
  if (!isBrowser()) return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage failures (private mode/quota errors).
  }
};

const emitCartChanged = (): void => {
  if (!isBrowser()) return;
  window.dispatchEvent(new CustomEvent("cart:changed"));
};

export function getCart(): CartState {
  return readCartFromStorage();
}

export function addToCart(item: Omit<CartItem, "qty"> & { qty?: number }): CartState {
  const current = readCartFromStorage();
  const addQty = normalizeQty(item.qty ?? 1);

  const items = [...current.items];
  const index = items.findIndex((it) => it.id === item.id);

  if (index >= 0) {
    const nextQty = normalizeQty(items[index].qty + addQty);
    if (nextQty <= 0) {
      items.splice(index, 1);
    } else {
      items[index] = {
        ...items[index],
        name: item.name,
        unitAmount: item.unitAmount,
        image: item.image,
        weightGrams: item.weightGrams,
        qty: nextQty,
      };
    }
  } else if (addQty > 0) {
    items.push({
      id: item.id,
      name: item.name,
      unitAmount: item.unitAmount,
      qty: addQty,
      image: item.image,
      weightGrams: item.weightGrams,
    });
  }

  const next = touch({ items });
  writeCartToStorage(next);
  emitCartChanged();
  return next;
}

export function removeFromCart(id: string): CartState {
  const current = readCartFromStorage();
  const next = touch({
    items: current.items.filter((item) => item.id !== id),
  });

  writeCartToStorage(next);
  emitCartChanged();
  return next;
}

export function setQty(id: string, qty: number): CartState {
  const current = readCartFromStorage();
  const nextQty = normalizeQty(qty);
  const items = [...current.items];
  const index = items.findIndex((item) => item.id === id);

  if (index >= 0) {
    if (nextQty <= 0) {
      items.splice(index, 1);
    } else {
      items[index] = { ...items[index], qty: nextQty };
    }
  }

  const next = touch({ items });
  writeCartToStorage(next);
  emitCartChanged();
  return next;
}

export function clearCart(): CartState {
  const next = emptyCart();
  writeCartToStorage(next);
  emitCartChanged();
  return next;
}

export function cartTotalCents(): number {
  return getCart().items.reduce((sum, item) => sum + item.unitAmount * item.qty, 0);
}

export function cartCount(): number {
  return getCart().items.reduce((sum, item) => sum + item.qty, 0);
}
