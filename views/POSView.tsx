
import React, { useState, useRef } from 'react';
import { Search, ShoppingCart, Trash2, Plus, Minus, CreditCard, Banknote, QrCode, Receipt, DollarSign, X, Package } from 'lucide-react';
import { Product, SaleItem, Sale } from '../types';

interface POSViewProps {
  products: Product[];
  onCompleteSale: (sale: Sale) => void;
}

const POSView: React.FC<POSViewProps> = ({ products, onCompleteSale }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('Cartão');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.code.includes(searchTerm)
  );

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.product.id === product.id);
    if (existing) {
      if (existing.quantity >= product.stock) {
        alert("Quantidade máxima em estoque atingida!");
        return;
      }
      setCart(cart.map(item => 
        item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1, discount: 0 }]);
    }
    setSearchTerm('');
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.product.id === productId) {
        const productData = products.find(p => p.id === productId);
        const newQty = Math.max(1, item.quantity + delta);
        if (productData && newQty > productData.stock) return item;
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.product.salePrice * item.quantity), 0);
  const total = subtotal - discount;

  const handleFinishSale = () => {
    const newSale: Sale = {
      id: `sale-${Date.now()}`,
      date: new Date().toISOString(),
      items: [...cart],
      total: total,
      paymentMethod: [paymentMethod],
      status: 'COMPLETA'
    };
    
    onCompleteSale(newSale);
    setCart([]);
    setDiscount(0);
    setShowCheckout(false);
    alert('Venda realizada com sucesso!');
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 animate-fadeIn">
      <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder="Nome ou código de barras..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition-all shadow-sm text-lg"
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map(product => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                disabled={product.stock <= 0}
                className={`p-4 rounded-2xl border transition-all text-left flex flex-col justify-between hover:shadow-md h-44 group ${
                  product.stock <= 0 ? 'bg-slate-50 opacity-60 cursor-not-allowed border-slate-100' : 'bg-white border-slate-200 hover:border-[#1E3A8A]'
                }`}
              >
                <div>
                  <span className="text-[10px] font-bold text-[#6D28D9] uppercase tracking-widest block mb-1">{product.category}</span>
                  <h4 className="font-bold text-slate-800 line-clamp-2 leading-tight group-hover:text-[#1E3A8A]">{product.name}</h4>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">Ref: {product.code}</p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xl font-black text-slate-900">R$ {product.salePrice.toLocaleString('pt-br')}</span>
                  <div className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${product.stock < 5 ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    {product.stock} un.
                  </div>
                </div>
              </button>
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12">
              <Package className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg font-medium">Nenhum produto em estoque</p>
            </div>
          )}
        </div>
      </div>

      <div className="w-full md:w-[450px] flex flex-col bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <ShoppingCart className="text-[#1E3A8A]" />
            <h3 className="text-lg font-bold text-slate-800">Carrinho</h3>
          </div>
          <span className="bg-[#1E3A8A] text-white px-3 py-1 rounded-full text-xs font-bold">{cart.length}</span>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 text-xs line-clamp-1">{item.product.name}</h4>
                <p className="text-[10px] text-slate-500">R$ {item.product.salePrice.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(item.product.id, -1)} className="w-7 h-7 bg-white rounded border border-slate-200 hover:text-red-500"><Minus size={12} /></button>
                <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.product.id, 1)} className="w-7 h-7 bg-white rounded border border-slate-200 hover:text-[#1E3A8A]"><Plus size={12} /></button>
              </div>
              <div className="text-right min-w-[70px]">
                <p className="font-black text-slate-900 text-sm">R$ {(item.product.salePrice * item.quantity).toFixed(2)}</p>
                <button onClick={() => removeFromCart(item.product.id)} className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={12} /></button>
              </div>
            </div>
          ))}
          {cart.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-slate-300">
              <ShoppingCart size={40} className="mb-2 opacity-10" />
              <p className="text-xs uppercase font-bold tracking-widest">Carrinho Vazio</p>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-4">
          <div className="flex items-center justify-between text-slate-500 text-xs uppercase font-bold">
            <span>Subtotal</span>
            <span>R$ {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-xs uppercase font-bold">
            <span className="text-slate-500">Desconto</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setDiscount(Math.max(0, discount - 5))} className="text-slate-400 hover:text-red-500"><Minus size={12}/></button>
              <span className="text-red-500">- R$ {discount.toFixed(2)}</span>
              <button onClick={() => setDiscount(discount + 5)} className="text-slate-400 hover:text-emerald-500"><Plus size={12}/></button>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <h2 className="text-xl font-black text-[#1E3A8A]">TOTAL</h2>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">R$ {total.toFixed(2)}</h2>
          </div>
          
          <button 
            disabled={cart.length === 0}
            onClick={() => setShowCheckout(true)}
            className={`w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all shadow-xl ${
              cart.length === 0 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-[#1E3A8A] to-[#6D28D9] text-white hover:opacity-90 active:scale-95 shadow-blue-100'
            }`}
          >
            FECHAR PEDIDO
            <Receipt size={24} />
          </button>
        </div>
      </div>

      {showCheckout && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 w-full max-w-xl shadow-2xl relative animate-scaleIn">
            <button onClick={() => setShowCheckout(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors">
              <X size={24} />
            </button>
            <div className="mb-8">
              <h2 className="text-3xl font-black text-slate-800">Pagamento</h2>
              <p className="text-slate-500 font-medium">Selecione o método e finalize</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { name: 'Cartão', icon: CreditCard },
                { name: 'Dinheiro', icon: Banknote },
                { name: 'Pix', icon: QrCode },
                { name: 'Outros', icon: DollarSign },
              ].map(m => (
                <button 
                  key={m.name}
                  onClick={() => setPaymentMethod(m.name)}
                  className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${
                    paymentMethod === m.name ? 'border-[#1E3A8A] bg-blue-50 text-[#1E3A8A]' : 'border-slate-100 hover:border-slate-200 text-slate-600'
                  }`}
                >
                  <m.icon size={24} />
                  <span className="font-black text-sm uppercase">{m.name}</span>
                </button>
              ))}
            </div>

            <div className="bg-[#1E3A8A] rounded-2xl p-6 text-white mb-8 shadow-inner">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs font-bold uppercase opacity-60">Total a pagar</p>
                  <h2 className="text-4xl font-black tracking-tighter">R$ {total.toFixed(2)}</h2>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold uppercase opacity-60">Itens</p>
                  <p className="text-xl font-black">{cart.length}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setShowCheckout(false)} className="flex-1 py-4 rounded-xl border-2 border-slate-200 font-bold text-slate-500 hover:bg-slate-50">Voltar</button>
              <button onClick={handleFinishSale} className="flex-[2] py-4 rounded-xl bg-[#6D28D9] text-white font-black text-lg hover:opacity-90 shadow-xl shadow-purple-100">FINALIZAR AGORA</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POSView;
