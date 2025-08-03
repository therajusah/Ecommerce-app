import React, { createContext, useContext, useReducer } from 'react';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface DeliveryAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  pincode: string;
}

interface TrackingStep {
  message: string;
  timestamp?: string;
  completed: boolean;
}

interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  deliveryAddress: DeliveryAddress;
  paymentMethod: string;
  status: 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  estimatedDelivery: string;
  trackingSteps: TrackingStep[];
  userId?: string;
  userEmail?: string;
}

interface OrderState {
  orders: Order[];
}

type OrderAction = 
  | { type: 'PLACE_ORDER'; payload: Omit<Order, 'id' | 'orderDate' | 'estimatedDelivery' | 'trackingSteps'> }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { id: string; status: Order['status'] } }
  | { type: 'CANCEL_ORDER'; payload: string }
  | { type: 'UPDATE_TRACKING'; payload: { id: string; trackingSteps: TrackingStep[] } };

const OrderContext = createContext<{
  orders: Order[];
  placeOrder: (orderData: Omit<Order, 'id' | 'orderDate' | 'estimatedDelivery' | 'trackingSteps'>) => string;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  cancelOrder: (orderId: string) => void;
  getRecentOrders: () => Order[];
  updateOrderTracking: (orderId: string, trackingSteps: TrackingStep[]) => void;
} | undefined>(undefined);

const orderReducer = (state: OrderState, action: OrderAction): OrderState => {
  switch (action.type) {
    case 'PLACE_ORDER':
      const orderId = `ORD${Date.now()}`;
      const orderDate = new Date().toISOString();
      const estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString();
      
      const newOrder: Order = {
        ...action.payload,
        id: orderId,
        orderDate,
        estimatedDelivery,
        status: 'confirmed',
        trackingSteps: [
          {
            message: 'Order Confirmed',
            timestamp: orderDate,
            completed: true
          },
          {
            message: 'Preparing for Dispatch',
            completed: false
          },
          {
            message: 'Out for Delivery',
            completed: false
          },
          {
            message: 'Delivered',
            completed: false
          }
        ]
      };

      return {
        ...state,
        orders: [newOrder, ...state.orders]
      };

    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(order => {
          if (order.id === action.payload.id) {
            const updatedTrackingSteps = [...order.trackingSteps];
            const now = new Date().toISOString();
            
            switch (action.payload.status) {
              case 'processing':
                updatedTrackingSteps[1] = { ...updatedTrackingSteps[1], completed: true, timestamp: now };
                break;
              case 'shipped':
                updatedTrackingSteps[1] = { ...updatedTrackingSteps[1], completed: true, timestamp: now };
                updatedTrackingSteps[2] = { ...updatedTrackingSteps[2], completed: true, timestamp: now };
                break;
              case 'delivered':
                updatedTrackingSteps.forEach((step, index) => {
                  if (index < 4) {
                    updatedTrackingSteps[index] = { ...step, completed: true, timestamp: step.timestamp || now };
                  }
                });
                break;
            }

            return {
              ...order,
              status: action.payload.status,
              trackingSteps: updatedTrackingSteps
            };
          }
          return order;
        })
      };

    case 'CANCEL_ORDER':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload
            ? { ...order, status: 'cancelled' as const }
            : order
        )
      };

    case 'UPDATE_TRACKING':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.id
            ? { ...order, trackingSteps: action.payload.trackingSteps }
            : order
        )
      };

    default:
      return state;
  }
};

const initialState: OrderState = {
  orders: []
};

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  const placeOrder = (orderData: Omit<Order, 'id' | 'orderDate' | 'estimatedDelivery' | 'trackingSteps'>): string => {
    dispatch({ type: 'PLACE_ORDER', payload: orderData });
    return `ORD${Date.now()}`;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { id: orderId, status } });
  };

  const cancelOrder = (orderId: string) => {
    dispatch({ type: 'CANCEL_ORDER', payload: orderId });
  };

  const getRecentOrders = (): Order[] => {
    return state.orders.slice(0, 10);
  };

  const updateOrderTracking = (orderId: string, trackingSteps: TrackingStep[]) => {
    dispatch({ type: 'UPDATE_TRACKING', payload: { id: orderId, trackingSteps } });
  };

  return (
    <OrderContext.Provider value={{
      orders: state.orders,
      placeOrder,
      updateOrderStatus,
      cancelOrder,
      getRecentOrders,
      updateOrderTracking
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

export type { Order, OrderItem, DeliveryAddress, TrackingStep }; 