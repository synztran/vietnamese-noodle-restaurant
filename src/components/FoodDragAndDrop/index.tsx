import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  pointerWithin,
  PointerSensor,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { motion, AnimatePresence } from "motion/react";
import {
  BIG_FOOD_BASE,
  PORK_MEAT_OPTION,
  CHICKEN_MEAT_OPTION,
  SEAFOOD_OPTION,
  VEGETABLE_OPTION,
  QUICK_PRICE_OPTION,
} from "@/constants";
import { ChevronUp, Plus, X } from "lucide-react";

type FoodOption = {
  id: number;
  label: string;
  description: string;
  value: string;
  price: number;
  count?: number;
  image?: string;
};

type FoodBase = {
  id: number;
  label: string;
  description: string;
  value: string;
  price: number;
  selectedOption: FoodOption[];
  image?: string;
};

type OrderItem = {
  id: string;
  base: FoodBase;
  options: FoodOption[];
  totalPrice: number;
  timestamp: number;
  expanded?: boolean;
};

const formatPrice = (price: number) => {
  return price.toLocaleString("vi-VN");
};

export default function FoodDragAndDrop() {
  const [selectedBase, setSelectedBase] = useState<FoodBase | null>(null);
  const [droppedOptions, setDroppedOptions] = useState<FoodOption[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [expandedSections, setExpandedSections] = useState({
    base: true,
    pork: true,
    chicken: true,
    seafood: true,
    vegetable: true,
  });
  const [showClearModal, setShowClearModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    // Cancel drag if not dropped on any droppable
    if (!over) {
      return;
    }

    const overId = over.id.toString();
    const activeId = active.id.toString();

    // Check if the active item is a draggable food item (not a drop zone)
    const allFoodItems = [
      ...BIG_FOOD_BASE.map((b) => b.value),
      ...PORK_MEAT_OPTION.map((o) => o.value),
      ...CHICKEN_MEAT_OPTION.map((o) => o.value),
      ...SEAFOOD_OPTION.map((o) => o.value),
      ...VEGETABLE_OPTION.map((o) => o.value),
    ];

    // If dropped on itself or another draggable item, cancel
    if (allFoodItems.includes(overId)) {
      return;
    }

    // Handle base drop
    if (overId === "base-drop-zone") {
      const baseItem = BIG_FOOD_BASE.find((b) => b.value === activeId);
      if (baseItem) {
        setSelectedBase({ ...baseItem, selectedOption: [] });
        setDroppedOptions([]);
      }
      return;
    }

    // Handle option drop to any option zone
    if (overId.startsWith("option-zone-")) {
      if (!selectedBase) {
        return;
      }

      const allOptions = [
        ...PORK_MEAT_OPTION,
        ...CHICKEN_MEAT_OPTION,
        ...SEAFOOD_OPTION,
        ...VEGETABLE_OPTION,
      ];
      const option = allOptions.find((o) => o.value === activeId);

      if (option) {
        const existingOption = droppedOptions.find(
          (o) => o.value === option.value
        );
        if (existingOption) {
          setDroppedOptions(
            droppedOptions.map((o) =>
              o.value === option.value ? { ...o, count: (o.count || 1) + 1 } : o
            )
          );
        } else {
          setDroppedOptions([...droppedOptions, { ...option, count: 1 }]);
        }
      }
      return;
    }
  };

  const updateBasePrice = (value: string) => {
    if (selectedBase) {
      // Allow empty string or valid numbers
      const newPrice = value === "" ? 0 : Number(value);
      setSelectedBase({ ...selectedBase, price: newPrice });
    }
  };

  const adjustPrice = (currentPrice: number, amount: number) => {
    return Math.max(0, currentPrice + amount);
  };

  const calculateCurrentTotal = () => {
    const basePrice = selectedBase?.price || 0;
    return basePrice;
  };

  const addToOrder = () => {
    if (!selectedBase) return;

    const newOrder: OrderItem = {
      id: Date.now().toString(),
      base: selectedBase,
      options: droppedOptions,
      totalPrice: calculateCurrentTotal(),
      timestamp: Date.now(),
      expanded: true,
    };

    setOrders([...orders, newOrder]);
    setSelectedBase(null);
    setDroppedOptions([]);
  };

  const toggleOrderExpanded = (orderId: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, expanded: !order.expanded } : order
      )
    );
  };

  const removeOrder = (orderId: string) => {
    setOrders(orders.filter((o) => o.id !== orderId));
  };

  const clearAllOrders = () => {
    setOrders([]);
    setShowClearModal(false);
  };

  const clearCurrentFood = () => {
    setSelectedBase(null);
    setDroppedOptions([]);
  };

  const handleSaveOrders = () => {
    setShowSaveModal(false);
    // Here you can add API call later
  };

  const getTotalOrderPrice = () => {
    return orders.reduce((sum, order) => sum + order.totalPrice, 0);
  };

  const removeDroppedOption = (value: string) => {
    setDroppedOptions(droppedOptions.filter((o) => o.value !== value));
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        className="flex gap-4 p-4 min-h-screen overflow-x-hidden"
        style={{
          WebkitOverflowScrolling: "touch",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        {/* Left Side - Food Options */}
        <div className="w-1/4 space-y-3">
          {/* Base Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100">
            <button
              onClick={() => toggleSection("base")}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold flex justify-between items-center text-base hover:from-blue-600 hover:to-blue-700 transition-all"
            >
              <span className="text-2xl text-white font-bold capitalize">
                🍜 Chọn món chính
              </span>
              <span
                className="text-xl transition-transform duration-200"
                style={{
                  transform: expandedSections.base ? "scaleY(-1)" : "scaleY(1)",
                }}
              >
                <ChevronUp size={32} className="stroke-white" />
              </span>
            </button>
            {expandedSections.base && (
              <div className="p-2 grid grid-cols-2 gap-2">
                {BIG_FOOD_BASE.map((base) => (
                  <DraggableItem key={base.value} id={base.value} item={base} />
                ))}
              </div>
            )}
          </div>

          {/* Pork Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-red-100">
            <button
              onClick={() => toggleSection("pork")}
              className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold flex justify-between items-center text-base hover:from-red-600 hover:to-red-700 transition-all"
            >
              <span className="text-white font-bold text-2xl">🥓 Thịt Heo</span>
              <span
                className="text-xl transition-transform duration-200"
                style={{
                  transform: expandedSections.base ? "scaleY(-1)" : "scaleY(1)",
                }}
              >
                <ChevronUp size={32} className="stroke-white" />
              </span>
            </button>
            {expandedSections.pork && (
              <div className="p-3 grid grid-cols-2 gap-2">
                {PORK_MEAT_OPTION.map((option) => (
                  <DraggableItem
                    key={option.value}
                    id={option.value}
                    item={option}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Chicken Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-yellow-100">
            <button
              onClick={() => toggleSection("chicken")}
              className="w-full px-4 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold flex justify-between items-center text-base hover:from-yellow-600 hover:to-yellow-700 transition-all"
            >
              <span className="text-2xl text-white font-bold">🍗 Thịt Gà</span>
              <span
                className="text-xl transition-transform duration-200"
                style={{
                  transform: expandedSections.base ? "scaleY(-1)" : "scaleY(1)",
                }}
              >
                <ChevronUp size={32} className="stroke-white" />
              </span>
            </button>
            {expandedSections.chicken && (
              <div className="p-3 grid grid-cols-2 gap-2">
                {CHICKEN_MEAT_OPTION.map((option) => (
                  <DraggableItem
                    key={option.value}
                    id={option.value}
                    item={option}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Seafood Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-cyan-100">
            <button
              onClick={() => toggleSection("seafood")}
              className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold flex justify-between items-center text-base hover:from-cyan-600 hover:to-cyan-700 transition-all"
            >
              <span className="text-2xl text-white font-bold">🦐 Hải Sản</span>
              <span
                className="text-xl transition-transform duration-200"
                style={{
                  transform: expandedSections.base ? "scaleY(-1)" : "scaleY(1)",
                }}
              >
                <ChevronUp size={32} className="stroke-white" />
              </span>
            </button>
            {expandedSections.seafood && (
              <div className="p-3 grid grid-cols-2 gap-2">
                {SEAFOOD_OPTION.map((option) => (
                  <DraggableItem
                    key={option.value}
                    id={option.value}
                    item={option}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Vegetable Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-green-100">
            <button
              onClick={() => toggleSection("vegetable")}
              className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold flex justify-between items-center text-base hover:from-green-600 hover:to-green-700 transition-all"
            >
              <span className="text-2xl text-white font-bold">🥬 Rau</span>
              <span
                className="text-xl transition-transform duration-200"
                style={{
                  transform: expandedSections.base ? "scaleY(-1)" : "scaleY(1)",
                }}
              >
                <ChevronUp size={32} className="stroke-white" />
              </span>
            </button>
            {expandedSections.vegetable && (
              <div className="p-3 grid grid-cols-2 gap-2">
                {VEGETABLE_OPTION.map((option) => (
                  <DraggableItem
                    key={option.value}
                    id={option.value}
                    item={option}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Build Area */}
        <div className="w-3/4 space-y-4">
          {/* Upper Block - Build Food */}
          <div className="bg-white rounded-2xl shadow-2xl p-5 border-2 border-orange-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-4xl font-bold text-gray-800 flex items-center gap-2">
                <span className="text-4xl">🍽️</span> Nấu Món Ăn
              </h2>
              {/* {selectedBase && (
                <button
                  onClick={clearCurrentFood}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg text-base font-semibold transition-all shadow-md flex items-center gap-2"
                >
                  <X size={20} className="stroke-white" />
                  Xóa món đang xây
                </button>
              )} */}
            </div>

            <div className="flex gap-8">
              <div className="flex flex-col gap-4 w-3/5">
                <div className="flex flex-col gap-4 h-full">
                  <div className="flex justify-between items-center">
                    <div className="text-3xl font-semibold text-gray-700">
                      Món chính
                    </div>
                    {selectedBase && (
                      <button
                        onClick={clearCurrentFood}
                        className="p-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg text-base font-semibold transition-all shadow-md flex items-center gap-2"
                      >
                        🗑️ Xóa món đang xây
                      </button>
                    )}
                  </div>
                  <DropZone id="base-drop-zone" label="Kéo món chính vào đây">
                    {selectedBase && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-400 rounded-xl p-4 shadow-md"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-8xl">{selectedBase.image}</span>
                          <div className="flex-1">
                            <h3 className="font-bold text-xl">
                              {selectedBase.label}
                            </h3>
                            <p className="text-lg text-gray-600">
                              {selectedBase.description}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-xl">
                            Nhập Giá:
                          </span>
                          <input
                            type="number"
                            value={
                              selectedBase.price === 0 ? "" : selectedBase.price
                            }
                            onChange={(e) => updateBasePrice(e.target.value)}
                            placeholder="0"
                            className="w-32 px-3 py-2 border-2 border-blue-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            step="500"
                          />
                          <span className="text-xl">VND</span>
                          <button
                            onClick={() =>
                              updateBasePrice(
                                adjustPrice(
                                  selectedBase.price,
                                  -1000
                                ).toString()
                              )
                            }
                            className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-colors shadow-md font-bold"
                          >
                            -1.000
                          </button>
                          <button
                            onClick={() =>
                              updateBasePrice(
                                adjustPrice(selectedBase.price, 1000).toString()
                              )
                            }
                            className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-bold transition-colors shadow-md"
                          >
                            +1.000
                          </button>
                        </div>
                        <div className="flex gap-4 items-center flex-wrap mt-4">
                          <label className="text-lg">Chọn nhanh giá:</label>
                          {QUICK_PRICE_OPTION.map((opt) => (
                            <button
                              className="bg-gray-300 text-gray-700 px-2 py-1 text-lg rounded-lg font-bold"
                              key={opt.value}
                              onClick={() =>
                                updateBasePrice(opt.value.toString())
                              }
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                        <div className="mt-2 text-xl font-bold text-blue-600">
                          {formatPrice(selectedBase.price)} VND
                        </div>
                      </motion.div>
                    )}
                  </DropZone>
                </div>
                <div className="mt-4 grid grid-cols2 gap-4">
                  {/* Topping Drop Zones - 2 columns */}
                  <div className="col-span-2">
                    <h3 className="text-3xl font-semibold mb-2 text-gray-700">
                      Topping Thêm
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      {[0, 1, 2, 3, 4, 5].map((index) => {
                        const option = droppedOptions[index];
                        return (
                          <DropZone
                            key={`option-zone-${index}`}
                            id={`option-zone-${index}`}
                            label={`${index + 1}`}
                          >
                            {option && (
                              <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-400 rounded-lg p-2 relative h-full flex flex-col items-center justify-center"
                              >
                                <button
                                  onClick={() =>
                                    removeDroppedOption(option.value)
                                  }
                                  className="absolute top-0.5 right-0.5 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs font-bold transition-colors flex justify-center items-center"
                                >
                                  <X className="stroke-white" size={24} />
                                </button>
                                <span className="text-8xl mb-1">
                                  {option.image}
                                </span>
                                <h4 className="font-semibold text-xl text-center">
                                  {option.label}
                                  {option.count && option.count > 1
                                    ? ` x${option.count}`
                                    : ""}
                                </h4>
                              </motion.div>
                            )}
                          </DropZone>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-2/5 relative flex flex-col gap-4">
                <h3 className="text-3xl font-semibold text-gray-700">
                  Tóm Tắt
                </h3>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border-2 border-gray-300 shadow-md">
                  <div className="flex-1 space-y-2">
                    <div className="text-sm">
                      <span className="font-semibold text-xl">Món chính:</span>{" "}
                      {selectedBase?.label ? (
                        <span className="text-xl bg-gray-200 rounded-lg p-2 text-gray-600 font-bold">
                          {selectedBase?.label}
                        </span>
                      ) : null}
                    </div>
                    {droppedOptions.length > 0 && (
                      <div className="text-sm">
                        <span className="font-semibold text-xl">Topping:</span>
                        <div className="flex gap-2 flex-wrap">
                          {droppedOptions.map((o) => (
                            <div
                              key={o.value}
                              className="text-lg bg-gray-200 rounded-lg px-2 py-1 font-bold text-gray-600"
                            >
                              {o.label}{" "}
                              {o.count && o.count > 1 ? `x${o.count}` : ""}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 pt-3 border-t-2 border-gray-300">
                    <div className="text-xl font-bold text-green-600 mb-3">
                      {formatPrice(calculateCurrentTotal())} VND
                    </div>
                    <button
                      onClick={addToOrder}
                      className="w-full py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all shadow-lg text-xl flex items-center justify-center gap-1"
                    >
                      <Plus className="stroke-white stroke-[5px]" size={24} />
                      Thêm Vào Đơn
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lower Block - Order List */}
          <div className="bg-white rounded-2xl shadow-2xl p-5 border-2 border-orange-200">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span>📋</span> Đơn Hàng ({orders.length})
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowClearModal(true)}
                  disabled={orders.length === 0}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg text-xl font-semibold transition-all shadow-md capitalize"
                >
                  🗑️ Xóa đơn hàng
                </button>
                <button
                  onClick={() => setShowSaveModal(true)}
                  disabled={orders.length === 0}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg text-xl font-semibold transition-all shadow-md"
                >
                  💾 Lưu Đơn
                </button>
              </div>
            </div>

            <div className="space-y-2 max-h-[60vh] min-h-56 overflow-y-auto">
              <AnimatePresence>
                {orders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 20, opacity: 0 }}
                    className="border-2 border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 flex justify-between items-center">
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-8xl">{order.base.image}</span>
                        <div>
                          <div className="font-bold text-xl">
                            {order.base.label}
                          </div>
                          <div className="text-lg text-gray-600">
                            {new Date(order.timestamp).toLocaleString("vi-VN")}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <div className="text-2xl font-bold text-green-600">
                          {formatPrice(order.totalPrice)} ₫
                        </div>
                        <div className="flex flex-col gap-4 items-end">
                          {/* {order.options.length > 0 && (
                            <button
                              onClick={() => toggleOrderExpanded(order.id)}
                              className="max-w-max px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-lg font-bold transition-colors flex items-center justify-center"
                            >
                              Chi tiết món ăn&nbsp;
                              <span
                                className="transition-transform duration-200"
                                style={{
                                  transform: order.expanded
                                    ? "rotate(180deg)"
                                    : "rotate(0deg)",
                                }}
                              >
                                <ChevronUp
                                  size={24}
                                  className="stroke-white stroke-[3px]"
                                />
                              </span>
                            </button>
                          )} */}
                          <button
                            onClick={() => removeOrder(order.id)}
                            className="max-w-max px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-lg font-bold transition-colors"
                          >
                            Xóa món ăn
                          </button>
                        </div>
                      </div>
                    </div>

                    {order.expanded && order.options.length > 0 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="p-3 bg-white flex gap-2 flex-wrap"
                      >
                        {order.options.map((opt) => (
                          <div
                            key={opt.value}
                            className="flex items-center gap-1 bg-green-50 border border-green-300 rounded-lg px-2 py-1"
                          >
                            <span className="text-4xl">{opt.image}</span>
                            <span className="text-xl font-medium">
                              {opt.label}{" "}
                              {opt.count && opt.count > 1
                                ? `x${opt.count}`
                                : ""}
                            </span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {orders.length > 0 && (
              <div className="border-t-2 border-gray-300 pt-3 mt-3">
                <div className="text-2xl font-bold text-right bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Tổng: {formatPrice(getTotalOrderPrice())} VND
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeId ? (
          <div className="bg-white border-2 border-blue-500 rounded-lg p-3 shadow-2xl opacity-90">
            <div className="font-semibold text-sm">Đang kéo...</div>
          </div>
        ) : null}
      </DragOverlay>

      {/* Clear Orders Modal */}
      {showClearModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Xác nhận xóa đơn hàng
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa tất cả {orders.length} món trong đơn
              hàng không? Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowClearModal(false)}
                className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg text-lg font-semibold transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={clearAllOrders}
                className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg text-lg font-semibold transition-all shadow-md"
              >
                Xóa đơn hàng
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Save Orders Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Xác nhận lưu đơn hàng
            </h3>
            <div className="text-lg text-gray-600 mb-6 space-y-2">
              <p>Bạn có chắc chắn muốn lưu đơn hàng này không?</p>
              <div className="bg-gray-100 rounded-lg p-4 mt-3">
                <div className="font-semibold">
                  Tổng số món: {orders.length}
                </div>
                <div className="font-bold text-green-600 text-xl mt-2">
                  Tổng tiền: {formatPrice(getTotalOrderPrice())} VND
                </div>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg text-lg font-semibold transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveOrders}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg text-lg font-semibold transition-all shadow-md"
              >
                Lưu đơn
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </DndContext>
  );
}

// Draggable Item Component
function DraggableItem({ id, item }: { id: string; item: any }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: id,
    });

  const style: React.CSSProperties = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    touchAction: "none",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-lg p-2 hover:border-blue-400 hover:shadow-lg transition-all ${
        isDragging ? "opacity-50 scale-95" : ""
      }`}
    >
      <div
        {...listeners}
        {...attributes}
        className="cursor-grab active:cursor-grabbing select-none text-center touch-none"
        style={{ WebkitUserSelect: "none", WebkitTouchCallout: "none" }}
      >
        <div className="text-7xl mb-1 pointer-events-none">{item.image}</div>
        <div className="font-semibold text-xl leading-tight pointer-events-none">
          {item.label}
        </div>
      </div>
    </div>
  );
}

// Drop Zone Component
function DropZone({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children?: React.ReactNode;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ touchAction: "none" }}
      className={`relative border-3 border-dashed rounded-xl p-2 transition-all duration-200 h-auto ${
        isOver
          ? "border-blue-500 bg-blue-50 scale-105 shadow-lg"
          : "border-gray-600 bg-gray-200 border-2 border-dashed"
      }`}
    >
      {children || (
        <div className="place-content-center min-h-[100px] h-full flex items-center justify-center text-gray-400 font-semibold text-4xl">
          {label}
        </div>
      )}
    </div>
  );
}
