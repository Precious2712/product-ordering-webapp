import { useAppContext } from "@/useContext/context";
import { X, Minus, Plus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { CartItem } from "@/data/carts";

interface ModalProps {
    closeButton: () => void;
    items: CartItem[];
    grandTotal: number;
}

export const Modal = ({ closeButton, items, grandTotal }: ModalProps) => {
    const { increaseQty, decreaseQty, handleDeleteItem } = useAppContext();
    const navigate = useRouter();

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="bg-white w-[95%] max-w-lg rounded-2xl shadow-xl flex flex-col">

                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h2 className="text-lg font-semibold">Your Cart</h2>
                    <X onClick={closeButton} className="cursor-pointer" />
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                    {items.map((item) => (
                        <div key={item._id} className="flex gap-4 border-b pb-4">
                            <img
                                src={item.image}
                                alt={item.itemName}
                                className="w-16 h-16 rounded-lg object-cover"
                            />
                            

                            <div className="flex-1">
                                <h3 className="font-medium">{item.itemName}</h3>
                                <p className="text-sm text-gray-500">
                                    ${item.itemPrice.toFixed(2)}
                                </p>

                                <div className="flex items-center gap-2 mt-2">
                                    <button
                                        onClick={() => decreaseQty(item._id, item.quantity)}
                                        className="p-1 border rounded hover:bg-gray-100"
                                    >
                                        <Minus size={14} />
                                    </button>

                                    <span className="font-semibold">
                                        {item.quantity}
                                    </span>

                                    <button
                                        onClick={() =>
                                            increaseQty(item._id, item.quantity)
                                        }
                                        className="p-1 border rounded hover:bg-gray-100"
                                    >
                                        <Plus size={14} />
                                    </button>
                                    <Trash className="w-5 h-5 cursor-pointer" onClick={() => handleDeleteItem(item._id)} />
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="font-semibold">
                                    ${item.total.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-t px-6 py-4">
                    <div className="flex justify-between mb-4">
                        <span>Grand Total</span>
                        <span className="font-semibold">
                            ${grandTotal.toFixed(2)}
                        </span>
                    </div>

                    <button
                        onClick={() =>
                            navigate.push("/check-out")
                        }
                        className="w-full bg-black text-white py-3 rounded-xl"
                    >
                        Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};
